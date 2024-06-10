export const convertData = (original) => {
  const result = {};

  original?.columns?.forEach((column) => {
    result[column.id] = {
      title: column.title,
      items: column.tasks.map((task) => ({ id: task.id, title: task.title })),
    };
  });
  return result;
};
