// components/Board.tsx
import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { convertData } from "@/app/lib/util";
import { useGetColumns } from "../hooks/useGetColumns";
import { useCreateColumn } from "../hooks/useCreateColumn";
import { useCreateTask } from "../hooks/useCreateTask";
import { useDeleteColumn } from "../hooks/useDeleteColumn";
import { useDeleteTask } from "../hooks/useDeleteTask";

const Board = () => {
  const { data, loading, error, refetch } = useGetColumns();
  const [createColumn] = useCreateColumn({ onComplete: () => refetch && refetch() })
  const [createTask] = useCreateTask({ onComplete: () => refetch && refetch() })
  const [deleteColumn] = useDeleteColumn({ onComplete: () => refetch && refetch() })
  const [deleteTask] = useDeleteTask({ onComplete: () => refetch && refetch() })

  const [columns, setColumns] = useState([]);

  useEffect(() => {
    if (!loading) {
      setColumns(convertData(data) || []);
    }
  }, [data, loading])

  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (Object.keys(columns).length === 0) return <p>No data</p>
  if (error) return <p>Error :(</p>;

  return (
    <div style={{ display: "flex", justifyContent: "center", height: "100%", overflow: 'scroll' }}>
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
              <h2>{column.name}</h2>
              <button onClick={() => deleteColumn({ variables: { id: columnId } })}>Delete</button>
              <div style={{ margin: 8 }}>
                <Droppable droppableId={columnId} key={columnId}>
                  {(provided, snapshot) => {
                    return (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                          background: snapshot.isDraggingOver
                            ? "lightblue"
                            : "lightgrey",
                          padding: 4,
                          width: 250,
                          minHeight: 500,
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
                                      userSelect: "none",
                                      padding: 16,
                                      margin: "0 0 8px 0",
                                      minHeight: "50px",
                                      backgroundColor: snapshot.isDragging
                                        ? "#263B4A"
                                        : "#456C86",
                                      color: "white",
                                      ...provided.draggableProps.style,
                                    }}
                                  >
                                    {item.content}
                                    <button onClick={() => deleteTask({
                                      variables: {
                                        columnId,
                                        taskId: item.id
                                      }
                                    })}>Delete</button>
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                        <button onClick={() => createTask({
                          variables: {
                            columnId,
                            title: "new task"
                          }
                        })}>Create Task</button>
                      </div>
                    );
                  }}
                </Droppable>

              </div>
            </div>
          );
        })}
      </DragDropContext>
      <div>
        <button onClick={() => {
          createColumn({
            variables: {
              title: "new column"
            }
          })
        }}>Create column</button>
      </div>
    </div>
  );
};

export default Board;
