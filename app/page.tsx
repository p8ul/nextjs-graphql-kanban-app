"use client";

import React from "react";
import { ApolloProvider } from "@apollo/client";
import client from "./lib/apolloClient";
import Board from "./kanban/containers/Board";
import { Box, Breadcrumbs, Link, Typography } from "@mui/material";

const Page: React.FC = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#F4F5F7",
        padding: 5,
      }}
    >
      <Box padding={1}>
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
      </Box>

      <Board />
    </Box>
  );
};

const App: React.FC = () => (
  <ApolloProvider client={client}>
    <Page />
  </ApolloProvider>
);

export default App;
