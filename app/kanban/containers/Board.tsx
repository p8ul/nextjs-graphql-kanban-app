// components/Board.tsx
import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { convertData } from "@/app/lib/util";
import { useGetColumns } from "../hooks/useGetColumns";
import { useCreateColumn } from "../hooks/useCreateColumn";
import { useCreateTask } from "../hooks/useCreateTask";
import { useDeleteColumn } from "../hooks/useDeleteColumn";
import { useDeleteTask } from "../hooks/useDeleteTask";
import { useUpdateColumns } from "../hooks/useUpdateColumns";
import KanbanColumn from "../components/KanbanColumn";
import { Box, Snackbar, SnackbarOrigin } from "@mui/material";
import KanBanTask from "../components/KanBanTask";
import ColumnCreator from "../components/ColumnCreator";
import { useUpdateColumnName } from "../hooks/useUpdateColumnName";
import { useClearColumnTasks } from "../hooks/useClearColumnTasks";
import { useUpdateTask } from "../hooks/useUpdateTask";

const Board = () => {
  const { data, loading, error, refetch } = useGetColumns();
  const [openSnackbar, setOpenSnackbar] = React.useState(false);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleOpenSnackbar = () => {
    setOpenSnackbar(true);
  };
  const [showSnackbar, setShowSnackbar] = useState(false); // use to ensure that the snackbar is not shown when you reload page

  const [createColumn] = useCreateColumn({
    onComplete: () => {
      refetch && refetch();
      setShowSnackbar(true);
    },
  });
  const [createTask] = useCreateTask({
    onComplete: () => refetch && refetch(),
  });
  const [deleteColumn] = useDeleteColumn({
    onComplete: () => refetch && refetch(),
  });
  const [deleteTask] = useDeleteTask({
    onComplete: () => refetch && refetch(),
  });
  const [updateColumns] = useUpdateColumns({
    onComplete: () => refetch && refetch(),
  });

  const [updateColumnName] = useUpdateColumnName({
    onComplete: () => refetch && refetch(),
  });

  const [clearColumnTasks] = useClearColumnTasks({
    onComplete: () => refetch && refetch(),
  });

  const [updateTask] = useUpdateTask({
    onComplete: () => refetch && refetch(),
  });

  const [columns, setColumns] = useState([]);
  const [totalColumns, setTotalColumns] = useState(0);

  const handleAddTask = (columnId: string, title: string) => {
    createTask({
      variables: {
        columnId,
        title,
      },
    });
  };

  useEffect(() => {
    if (!loading) {
      setColumns(convertData(data) || []);
      setTotalColumns(data?.columns?.length || 0);
      if (data?.columns?.length > 4 && showSnackbar) {
        handleOpenSnackbar();
        setShowSnackbar(false);
      }
    }
  }, [data, loading]);

  const transformInput = (input) => {
    const result = [];

    for (const key of Object.keys(input)) {
      result.push({
        id: key,
        title: input[key].title,
        tasks: input[key].items,
      });
    }
    return result;
  };

  /**
   * Function to handle drag and drop events within the Kanban board.
   * It updates the state of columns based on the drag and drop result.
   * @param {Object} result - The result of the drag and drop operation.
   * @param {Object} columns - The current state of columns in the Kanban board.
   * @param {Function} setColumns - Function to update the state of columns.
   */
  const onDragEnd = (result, columns, setColumns) => {
    // Check if the drag and drop resulted in a valid destination
    if (!result.destination) return;

    // Destructure source and destination from the drag and drop result
    const { source, destination } = result;

    // Check if the item was moved within the same column or to a different column
    if (source.droppableId !== destination.droppableId) {
      // Moving item to a different column
      // Retrieve source and destination columns and their items
      const sourceColumn = columns[source.droppableId];
      const destinationColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destinationItems = [...destinationColumn.items];
      // Remove item from source column and add it to destination column
      const [movedItem] = sourceItems.splice(source.index, 1);
      destinationItems.splice(destination.index, 0, movedItem);
      // Update columns state with the moved item
      const updatedColumns = {
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destinationColumn,
          items: destinationItems,
        },
      };
      setColumns(updatedColumns);
      // Call updateColumns function to update backend with the new column order
      updateColumns({
        variables: { updatedColumns: transformInput(updatedColumns) },
      });
    } else {
      // Moving item within the same column
      // Retrieve column and its items
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      // Remove item from its original position and insert it at the destination position
      const [movedItem] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, movedItem);
      // Update columns state with the moved item
      const updatedColumns = {
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      };
      setColumns(updatedColumns);
      // Call updateColumns function to update backend with the new column order
      updateColumns({
        variables: { updatedColumns: transformInput(updatedColumns) },
      });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        overflow: "scroll",
        paddingBottom: 5,
      }}
    >
      <DragDropContext
        onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
      >
        {Object.entries(columns).map(([columnId, column], index) => {
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
              key={columnId}
            >
              <KanbanColumn
                title={column.title}
                onDelete={() => deleteColumn({ variables: { id: columnId } })}
                columnId={columnId}
                addTask={handleAddTask}
                clearColumnTasks={(columnId) => {
                  clearColumnTasks({ variables: { columnId } });
                }}
                updateColumnName={(newTitle) =>
                  updateColumnName({
                    variables: {
                      columnId,
                      newTitle,
                    },
                  })
                }
              >
                <Box sx={{ margin: 1 }}>
                  <Droppable droppableId={columnId} key={columnId}>
                    {(provided, snapshot) => {
                      return (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={{
                            background: snapshot.isDraggingOver
                              ? "#E3E4E5"
                              : "white",
                            padding: 4,
                            width: 240,
                            minHeight: 600,
                            borderRadius: 5,
                          }}
                        >
                          {column.items.map((item, index) => {
                            return (
                              <Draggable
                                key={item.id}
                                draggableId={item.id}
                                index={index}
                              >
                                {(provided, snapshot) => {
                                  return (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={{
                                        borderRadius: 5,
                                        borderStyle: "solid",
                                        borderColor: "#E3E4E5",
                                        userSelect: "none",
                                        padding: 15,
                                        margin: "0 0 8px 0",
                                        minHeight: "50px",
                                        backgroundColor: snapshot.isDragging
                                          ? "#6B78D8"
                                          : "#F4F5F7",
                                        color: "black",
                                        ...provided.draggableProps.style,
                                      }}
                                    >
                                      <KanBanTask
                                        item={item}
                                        columnId={columnId}
                                        onUpdateItem={() => {}}
                                        updateTask={(
                                          columnId,
                                          taskId,
                                          task
                                        ) => {
                                          updateTask({
                                            variables: {
                                              columnId,
                                              taskId,
                                              task,
                                            },
                                          });
                                        }}
                                        onDelete={(columnId, taskId) => {
                                          deleteTask({
                                            variables: {
                                              columnId,
                                              taskId: taskId,
                                            },
                                          });
                                        }}
                                      />
                                    </div>
                                  );
                                }}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </div>
                      );
                    }}
                  </Droppable>
                </Box>
              </KanbanColumn>
            </div>
          );
        })}
      </DragDropContext>
      <Box>
        <ColumnCreator
          disableCreateButton={totalColumns >= 5}
          onCreateColumn={(title: string) => {
            createColumn({
              variables: {
                title: title,
              },
            });
          }}
        />
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={openSnackbar}
        onClose={handleCloseSnackbar}
        message="You have now reached maximum number of 5 columns."
        key={"topright"}
      />
    </Box>
  );
};

export default Board;
