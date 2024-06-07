// pages/api/schema.ts
import { gql } from "apollo-server-micro";
import { v4 as uuid } from "uuid";

let columns = [
  {
    id: uuid(),
    name: "Requested",
    items: [{ id: uuid(), content: "First task" }],
  },
  { id: uuid(), name: "To do", items: [] },
  { id: uuid(), name: "In Progress", items: [] },
  { id: uuid(), name: "Done", items: [] },
];

export const typeDefs = gql`
  type Task {
    id: String
    content: String
  }

  type Column {
    id: String
    name: String
    items: [Task]
  }

  type Query {
    columns: [Column]
  }

  type Mutation {
    addColumn(name: String!): Column
    deleteColumn(id: String!): Column
    renameColumn(id: String!, name: String!): Column
    addTask(columnId: String!, content: String!): Task
    deleteTask(columnId: String!, taskId: String!): Task
    moveTask(
      sourceColumnId: String!
      destinationColumnId: String!
      taskId: String!
    ): Task
  }
`;

export const resolvers = {
  Query: {
    columns: () => columns,
  },
  Mutation: {
    addColumn: (_, { name }) => {
      if (columns.length >= 5) throw new Error("Column limit reached");
      const newColumn = { id: uuid(), name, items: [] };
      columns.push(newColumn);
      return newColumn;
    },
    deleteColumn: (_, { id }) => {
      const column = columns.find((col) => col.id === id);
      if (!column) throw new Error("Column not found");
      columns = columns.filter((col) => col.id !== id);
      return column;
    },
    renameColumn: (_, { id, name }) => {
      const column = columns.find((col) => col.id === id);
      if (!column) throw new Error("Column not found");
      column.name = name;
      return column;
    },
    addTask: (_, { columnId, content }) => {
      const column = columns.find((col) => col.id === columnId);
      if (!column) throw new Error("Column not found");
      const newTask = { id: uuid(), content };
      column.items.push(newTask);
      return newTask;
    },
    deleteTask: (_, { columnId, taskId }) => {
      const column = columns.find((col) => col.id === columnId);
      if (!column) throw new Error("Column not found");
      const task = column.items.find((item) => item.id === taskId);
      if (!task) throw new Error("Task not found");
      column.items = column.items.filter((item) => item.id !== taskId);
      return task;
    },
    moveTask: (_, { sourceColumnId, destinationColumnId, taskId }) => {
      const sourceColumn = columns.find((col) => col.id === sourceColumnId);
      const destinationColumn = columns.find(
        (col) => col.id === destinationColumnId
      );
      if (!sourceColumn || !destinationColumn)
        throw new Error("Column not found");
      const task = sourceColumn.items.find((item) => item.id === taskId);
      if (!task) throw new Error("Task not found");
      sourceColumn.items = sourceColumn.items.filter(
        (item) => item.id !== taskId
      );
      destinationColumn.items.push(task);
      return task;
    },
  },
};
