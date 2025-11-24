export const getPaginationParams = (req) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  return { page, limit, offset };
};

export const buildPaginationQuery = (baseQuery, limit, offset) => {
  return `${baseQuery} LIMIT ${limit} OFFSET ${offset}`;
};
