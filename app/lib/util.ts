/**
 * Converts server response data to a format usable by the React Kanban plugin.
 * This function takes the original data structure from the server and transforms it
 * into a format compatible with the React Kanban component.
 * @param {Object} original - The original data structure from the server.
 * @returns {Object} - The converted data structure compatible with the React Kanban plugin.
 */
export const convertData = (original) => {
  const result = {};

  // Iterate over each column in the original data
  original?.columns?.forEach((column) => {
    // For each column, extract column id and title
    // Map tasks in the column to a new format containing only id and title
    result[column.id] = {
      title: column.title,
      items: column.tasks.map((task) => ({ id: task.id, title: task.title })),
    };
  });

  return result;
};
