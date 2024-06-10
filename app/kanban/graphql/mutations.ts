import { gql } from "@apollo/client";

export const CREATE_TASK = gql`
  mutation createColumn($columnId: ID!, $title: String!) {
    createTask(columnId: $columnId, title: $title) {
      id
      title
    }
  }
`;
export const CREATE_COLUMN = gql`
  mutation createColumn($title: String!) {
    createColumn(title: $title) {
      id
      title
      tasks {
        id
        title
      }
    }
  }
`;

export const UPDATE_COLUMNS = gql`
  mutation UpdateColumns($updatedColumns: [ColumnInput!]!) {
    updateColumns(updatedColumns: $updatedColumns)
  }
`;

export const DELETE_COLUMN = gql`
  mutation deleteColumn($id: ID!) {
    deleteColumn(id: $id)
  }
`;

export const DELETE_TASK = gql`
  mutation deleteColumn($columnId: ID!, $taskId: ID!) {
    deleteTask(columnId: $columnId, taskId: $taskId)
  }
`;

export const UPDATE_COLUMN_NAME = gql`
  mutation updateColumnName($columnId: ID!, $newTitle: String!) {
    updateColumnName(columnId: $columnId, newTitle: $newTitle)
  }
`;

export const CLEAR_COLUMN_TASKS = gql`
  mutation clearColumnTasks($columnId: ID!) {
    clearColumnTasks(columnId: $columnId)
  }
`;
