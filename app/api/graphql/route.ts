import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { readFileSync, writeFileSync } from "fs";

const typeDefs = `#graphql
  type Column {
    id: ID!
    title: String!
    tasks: [Task!]!
  }

  type Task {
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
    moveTask(taskId: ID!, sourceColumnId: ID!, targetColumnId: ID!): Boolean
  }
`;

let columns = [];

const resolvers = {
  Query: {
    columns: () => columns,
  },
  Mutation: {
    createColumn: (_, { title }) => {
      const column = { id: `${Date.now()}`, title, tasks: [] };
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
      const task = { id: `${Date.now()}`, title };
      const column = columns.find((column) => column.id === columnId);
      column.tasks.push(task);
      saveData();
      return task;
    },
    deleteTask: (_, { columnId, taskId }) => {
      const column = columns.find((column) => column.id === columnId);
      column.tasks = column.tasks.filter((task) => task.id !== taskId);
      saveData();
      return true;
    },
    moveTask: (_, { taskId, sourceColumnId, targetColumnId }) => {
      const sourceColumn = columns.find(
        (column) => column.id === sourceColumnId
      );
      const task = sourceColumn.tasks.find((task) => task.id === taskId);
      sourceColumn.tasks = sourceColumn.tasks.filter(
        (task) => task.id !== taskId
      );

      const targetColumn = columns.find(
        (column) => column.id === targetColumnId
      );
      targetColumn.tasks.push(task);
      saveData();
      return true;
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
