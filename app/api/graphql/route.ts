import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { readFileSync, writeFileSync } from "fs";
import { v4 as uuid } from "uuid";

const typeDefs = `#graphql
  type Column {
    id: ID!
    title: String!
    tasks: [Task]
  }

  type Task {
    id: ID!
    title: String!
  }

  input ColumnInput {
    id: ID!
    title: String!
    tasks: [TaskInput]
  }

  input TaskInput {
    id: ID!
    title: String!
  }

  type Query {
    columns: [Column!]!
  }

  type Mutation {
    createColumn(title: String!): Column
    deleteColumn(id: ID!): Boolean
    createTask(columnId: ID!, title: String!): Task
    deleteTask(columnId: ID!, taskId: ID!): Boolean
    updateColumns(updatedColumns: [ColumnInput!]!): Boolean
    updateColumnName(columnId: ID!, newTitle: String!): Boolean
    clearColumnTasks(columnId: ID!): Boolean
    updateTask(columnId: ID!, taskId: ID!, updatedTask: TaskInput!): Boolean
  }
`;

let columns = [];

const resolvers = {
  Query: {
    columns: () => columns,
  },
  Mutation: {
    createColumn: (_, { title }) => {
      const column = { id: uuid(), title, tasks: [] };
      columns.push(column);
      saveData();
      return column;
    },
    deleteColumn: (_, { id }) => {
      columns = columns.filter((column) => column.id !== id);
      saveData();
      return true;
    },
    createTask: (_, { columnId, title }) => {
      const task = { id: uuid(), title };
      const column = columns.find((column) => column.id === columnId);
      column.tasks.push(task);
      saveData();
      return task;
    },
    updateColumns: (_, { updatedColumns }) => {
      columns = updatedColumns;
      saveData();
      return true;
    },
    deleteTask: (_, { columnId, taskId }) => {
      const column = columns.find((column) => column.id === columnId);
      column.tasks = column.tasks.filter((task) => task.id !== taskId);
      saveData();
      return true;
    },
    updateColumnName: (_, { columnId, newTitle }) => {
      const column = columns.find((column) => column.id === columnId);
      if (column) {
        column.title = newTitle;
        saveData();
        return true;
      }
      return false; // Column not found
    },
    clearColumnTasks: (_, { columnId }) => {
      const column = columns.find((column) => column.id === columnId);
      if (column) {
        column.tasks = [];
        saveData();
        return true;
      }
      return false; // Column not found
    },
    updateTask: (_, { columnId, taskId, updatedTask }) => {
      const column = columns.find((column) => column.id === columnId);
      if (column) {
        const task = column.tasks.find((task) => task.id === taskId);
        if (task) {
          task.title = updatedTask.title;
          task.id = updatedTask.id;
          saveData();
          return true;
        }
      }
      return false; // Column or task not found
    },
  },
};

const saveData = () => {
  writeFileSync("data.json", JSON.stringify(columns));
};

const loadData = () => {
  try {
    columns = JSON.parse(readFileSync("data.json", "utf-8"));
  } catch (e) {
    columns = [];
  }
};

loadData();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler(server);

export const POST = handler;
