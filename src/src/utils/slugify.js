export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '');         // Trim - from end of text
};

export const generateUniqueSlug = async (model, baseSlug, id = null) => {
  let slug = slugify(baseSlug);
  let counter = 1;
  let isUnique = false;

  while (!isUnique) {
    const existing = id 
      ? await model.findBySlugExcludingId(slug, id)
      : await model.findBySlug(slug);
    
    if (!existing) {
      isUnique = true;
    } else {
      slug = `${slugify(baseSlug)}-${counter}`;
      counter++;
    }
  }

  return slug;
};
