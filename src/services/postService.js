import api from "./api";

export const getPosts = async (page = 1, limit = 10, filters = {}) => {
  const params = new URLSearchParams({ page, limit, ...filters });
  return await api.get(`/posts?${params}`);
};

export const getPostBySlug = async (slug) => {
  return await api.get(`/posts/slug/${slug}`);
};

export const createPost = async (postData) => {
  return await api.post("/posts", postData);
};

export const updatePost = async (id, postData) => {
  return await api.put(`/posts/${id}`, postData);
};

export const deletePost = async (id) => {
  return await api.delete(`/posts/${id}`);
};