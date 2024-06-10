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
import { Box } from "@mui/material";
import KanBanTask from "../components/KanBanTask";
import ColumnCreator from "../components/ColumnCreator";
import { useUpdateColumnName } from "../hooks/useUpdateColumnName";
import { useClearColumnTasks } from "../hooks/useClearColumnTasks";
import { useUpdateTask } from "../hooks/useUpdateTask";

const Board = () => {
  const { data, loading, error, refetch } = useGetColumns();
  const [createColumn] = useCreateColumn({
    onComplete: () => refetch && refetch(),
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

  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destinationColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destinationItems = [...destinationColumn.items];
      const [movedItem] = sourceItems.splice(source.index, 1);
      destinationItems.splice(destination.index, 0, movedItem);
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
      updateColumns({
        variables: { updatedColumns: transformInput(updatedColumns) },
      });
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [movedItem] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, movedItem);
      const updatedColumns = {
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      };
      setColumns(updatedColumns);
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
        justifyContent: "center",
        height: "100%",
        overflow: "scroll",
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
                                        updateTask={(columnId, taskId, task) => {
                                          updateTask({
                                            variables: {
                                              columnId,
                                              taskId,
                                              task
                                            }
                                          })
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
          onCreateColumn={(title: string) => {
            createColumn({
              variables: {
                title: title,
              },
            });
          }}
        />
      </Box>
    </Box>
  );
};

export default Board;
