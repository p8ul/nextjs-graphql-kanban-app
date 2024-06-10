export const convertData = (original) => {
  const result = {};

  original?.columns?.forEach((column) => {
    result[column.id] = {
      name: column.title,
      items: column.tasks.map((task) => ({ id: task.id, content: task.title })),
    };
  });
  return result;
};
