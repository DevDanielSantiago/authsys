export const buildFilter = (
  query: Record<string, any>,
  searchableFields: string[]
): Record<string, RegExp> => {
  let filter: Record<string, RegExp> = {};

  searchableFields.forEach(field => {
    if (query[field]) filter[field] = new RegExp(query[field].toString(), 'i');
  });

  return filter;
};
