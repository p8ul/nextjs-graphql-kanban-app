"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, gql, ApolloProvider } from "@apollo/client";
import { Column as ColumnType } from "./types";
import Column from "./components/Column";
import client from "./lib/apolloClient";
import Board from "./components/Board";
import { Breadcrumbs, Link, Typography } from "@mui/material";

const GET_COLUMNS = gql`
  query GetColumns {
    columns {
      id
      title
      tasks {
        id
        title
      }
    }
  }
`;

const CREATE_COLUMN = gql`
  mutation CreateColumn($title: String!) {
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

const Page: React.FC = () => {
  const { data, loading, error } = useQuery(GET_COLUMNS);
  const [createColumn] = useMutation(CREATE_COLUMN);
  const [columns, setColumns] = useState<ColumnType[]>([]);

  useEffect(() => {
    if (data) {
      setColumns(data.columns);
    }
  }, [data]);

  const handleTaskDrop = (
    taskId: string,
    sourceColumnId: string,
    targetColumnId: string
  ) => {
    // Implement task drop logic
  };

  const handleAddColumn = async () => {
    const title = prompt("Enter column title");
    if (title) {
      const { data } = await createColumn({ variables: { title } });
      setColumns([...columns, data.createColumn]);
    }
  };
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <Typography color="text.primary">Kanban</Typography>
      <Breadcrumbs aria-label="breadcrumb">
        
        <Link underline="hover" color="inherit" href="/">
          Dashboard
        </Link>
        <Link
          underline="hover"
          color="inherit"
          href="/material-ui/getting-started/installation/"
        >
          Kanban
        </Link>
      </Breadcrumbs>
      <Board columns={data?.columns || []} /> 
      {/* {columns.map((column: ColumnType) => (
        <Column key={column.id} column={column} onTaskDrop={handleTaskDrop} />
      ))}
      {columns.length < 5 && (
        <button onClick={handleAddColumn}>Add Column</button>
      )} */}
    </div>
  );
};

const App: React.FC = () => (
  <ApolloProvider client={client}>
    <Page />
  </ApolloProvider>
);

export default App;
