import React from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  CardActions,
  Grid,
} from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const GET_COLUMNS = gql`
  query GetColumns {
    columns {
      id
      title
      tasks {
        id
        content
      }
    }
  }
`;

const ADD_COLUMN = gql`
  mutation AddColumn($title: String!) {
    addColumn(title: $title) {
      id
      title
      tasks {
        id
        content
      }
    }
  }
`;

const ADD_TASK = gql`
  mutation AddTask($columnId: ID!, $content: String!) {
    addTask(columnId: $columnId, content: $content) {
      id
      content
    }
  }
`;

const KanbanBoard: React.FC = () => {
  const { loading, error, data } = useQuery(GET_COLUMNS);
  const [addColumn] = useMutation(ADD_COLUMN);
  const [addTask] = useMutation(ADD_TASK);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleAddColumn = () => {
    const title = prompt("Enter column title:");
    if (title) {
      addColumn({ variables: { title } });
    }
  };

  const handleAddTask = (columnId: string) => {
    const content = prompt("Enter task content:");
    if (content) {
      addTask({ variables: { columnId, content } });
    }
  };

  return (
    <Box>
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddColumn}
        disabled={data.columns.length >= 5}
      >
        Add Column
      </Button>
      <Grid container spacing={2}>
        {data.columns.map((column: any) => (
          <Grid item key={column.id} xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">{column.title}</Typography>
                <Droppable droppableId={column.id}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      {column.tasks.map((task: any, index: number) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <Card>
                                <CardContent>
                                  <Typography>{task.content}</Typography>
                                </CardContent>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </CardContent>
              <CardActions>
                <Button onClick={() => handleAddTask(column.id)}>
                  Add Task
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default KanbanBoard;
