import React from 'react';
import { Column as ColumnType, Task as TaskType } from '../types';
import Task from './Task';

interface ColumnProps {
  column: ColumnType;
  onTaskDrop: (taskId: string, sourceColumnId: string, targetColumnId: string) => void;
}

const Column: React.FC<ColumnProps> = ({ column, onTaskDrop }) => {
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const taskId = event.dataTransfer.getData('taskId');
    const sourceColumnId = event.dataTransfer.getData('sourceColumnId');
    onTaskDrop(taskId, sourceColumnId, column.id);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div onDrop={handleDrop} onDragOver={handleDragOver}>
      <h3>{column.title}</h3>
      {column.tasks.map((task: TaskType) => (
        <Task key={task.id} task={task} columnId={column.id} />
      ))}
    </div>
  );
};

export default Column;
