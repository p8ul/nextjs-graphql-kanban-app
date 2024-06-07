import { gql } from 'apollo-server-micro';

export const typeDefs = gql`
  type Column {
    id: ID!
    title: String!
    tasks: [Task!]!
  }

  type Task {
    id: ID!
    content: String!
  }

  type Query {
    columns: [Column!]!
  }

  type Mutation {
    addColumn(title: String!): Column!
    renameColumn(id: ID!, title: String!): Column!
    deleteColumn(id: ID!): Boolean!
    addTask(columnId: ID!, content: String!): Task!
    editTask(id: ID!, content: String!): Task!
    deleteTask(id: ID!): Boolean!
    moveTask(taskId: ID!, sourceColumnId: ID!, destinationColumnId: ID!): Boolean!
  }
`;
