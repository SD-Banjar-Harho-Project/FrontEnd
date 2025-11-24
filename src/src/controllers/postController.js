import Post from "../models/Post.js";
import {
  successResponse,
  errorResponse,
  paginatedResponse,
} from "../utils/responseHelper.js";
import { getPaginationParams } from "../utils/pagination.js";
import { generateUniqueSlug } from "../utils/slugify.js";

export const getAllPosts = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPaginationParams(req);
    const filters = {
      status: req.query.status,
      post_type: req.query.post_type,
      category_id: req.query.category_id,
      is_featured: req.query.is_featured,
    };

    const posts = await Post.findAll(limit, offset, filters);
    const total = await Post.count(filters);

    return paginatedResponse(
      res,
      posts,
      page,
      limit,
      total,
      "Posts retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.getWithTags(id);

    if (!post) {
      return errorResponse(res, "Post not found", 404);
    }

    return successResponse(res, post, "Post retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const getPostBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const post = await Post.findBySlug(slug);

    if (!post) {
      return errorResponse(res, "Post not found", 404);
    }

    await Post.incrementViews(post.id);

    const postWithTags = await Post.getWithTags(post.id);

    return successResponse(res, postWithTags, "Post retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const createPost = async (req, res, next) => {
  try {
    const {
      title,
      excerpt,
      content,
      featured_image,
      post_type,
      category_id,
      status,
      meta_title,
      meta_description,
      meta_keywords,
      is_featured,
      allow_comments,
      published_at,
      tag_ids,
    } = req.body;

    const slug = await generateUniqueSlug(Post, title);

    const postData = {
      title,
      slug,
      excerpt,
      content,
      featured_image,
      post_type: post_type || "article",
      category_id: category_id || null,
      author_id: req.user.id,
      status: status || "draft",
      meta_title,
      meta_description,
      meta_keywords,
      is_featured: is_featured || 0,
      allow_comments: allow_comments !== undefined ? allow_comments : 1,
      published_at: status === "published" ? published_at || new Date() : null,
    };

    const post = await Post.create(postData);

    if (tag_ids && tag_ids.length > 0) {
      await Post.attachTags(post.id, tag_ids);
    }

    const postWithTags = await Post.getWithTags(post.id);

    return successResponse(res, postWithTags, "Post created successfully", 201);
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      excerpt,
      content,
      featured_image,
      post_type,
      category_id,
      status,
      meta_title,
      meta_description,
      meta_keywords,
      is_featured,
      allow_comments,
      tag_ids,
    } = req.body;

    const existingPost = await Post.findById(id);
    if (!existingPost) {
      return errorResponse(res, "Post not found", 404);
    }

    const slug =
      title !== existingPost.title
        ? await generateUniqueSlug(Post, title, id)
        : existingPost.slug;

    const postData = {
      title,
      slug,
      excerpt,
      content,
      featured_image,
      post_type,
      category_id,
      status,
      meta_title,
      meta_description,
      meta_keywords,
      is_featured,
      allow_comments,
    };

    const post = await Post.update(id, postData);

    if (tag_ids !== undefined) {
      await Post.attachTags(id, tag_ids);
    }

    const postWithTags = await Post.getWithTags(id);

    return successResponse(res, postWithTags, "Post updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return errorResponse(res, "Post not found", 404);
    }

    await Post.delete(id);

    return successResponse(res, null, "Post deleted successfully");
  } catch (error) {
    next(error);
  }
};

// Get deleted posts (recycle bin)
export const getDeletedPosts = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPaginationParams(req);

    const posts = await Post.findDeleted(limit, offset);
    const total = await Post.countDeleted();

    return paginatedResponse(
      res,
      posts,
      page,
      limit,
      total,
      "Deleted posts retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

// Restore deleted post
export const restorePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Post.restore(id);

    if (!post) {
      return errorResponse(res, "Post not found or already active", 404);
    }

    return successResponse(res, post, "Post restored successfully");
  } catch (error) {
    next(error);
  }
};
