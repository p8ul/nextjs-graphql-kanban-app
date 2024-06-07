import { v4 as uuidv4 } from "uuid";

let columns = [];

export const resolvers = {
  Query: {
    columns: () => columns,
  },
  Mutation: {
    addColumn: (_parent, { title }) => {
      const newColumn = { id: uuidv4(), title, tasks: [] };
      columns.push(newColumn);
      return newColumn;
    },
    renameColumn: (_parent, { id, title }) => {
      const column = columns.find((col) => col.id === id);
      if (column) {
        column.title = title;
        return column;
      }
      throw new Error("Column not found");
    },
    deleteColumn: (_parent, { id }) => {
      columns = columns.filter((col) => col.id !== id);
      return true;
    },
    addTask: (_parent, { columnId, content }) => {
      const column = columns.find((col) => col.id === columnId);
      if (column) {
        const newTask = { id: uuidv4(), content };
        column.tasks.push(newTask);
        return newTask;
      }
      throw new Error("Column not found");
    },
    editTask: (_parent, { id, content }) => {
      for (let column of columns) {
        const task = column.tasks.find((t) => t.id === id);
        if (task) {
          task.content = content;
          return task;
        }
      }
      throw new Error("Task not found");
    },
    deleteTask: (_parent, { id }) => {
      for (let column of columns) {
        column.tasks = column.tasks.filter((t) => t.id !== id);
      }
      return true;
    },
    moveTask: (_parent, { taskId, sourceColumnId, destinationColumnId }) => {
      const sourceColumn = columns.find((col) => col.id === sourceColumnId);
      const destinationColumn = columns.find(
        (col) => col.id === destinationColumnId
      );

      if (!sourceColumn || !destinationColumn) {
        throw new Error("Column not found");
      }

      const task = sourceColumn.tasks.find((t) => t.id === taskId);
      if (!task) {
        throw new Error("Task not found");
      }

      sourceColumn.tasks = sourceColumn.tasks.filter((t) => t.id !== taskId);
      destinationColumn.tasks.push(task);

      return true;
    },
  },
};
