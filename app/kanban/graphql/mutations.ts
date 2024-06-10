import { gql } from '@apollo/client';

export const CREATE_TASK = gql`
  mutation createColumn($columnId: ID!, $title: String!) {
    createTask(columnId: $columnId, title: $title) {
      id
      content
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
        content
      }
    }
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
