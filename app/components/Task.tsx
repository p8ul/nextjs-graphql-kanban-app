import React from 'react';
import { Task as TaskType } from '../types';

interface TaskProps {
  task: TaskType;
  columnId: string;
}

const Task: React.FC<TaskProps> = ({ task, columnId }) => {
  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData('taskId', task.id);
    event.dataTransfer.setData('sourceColumnId', columnId);
  };

  return (
    <div draggable onDragStart={handleDragStart}>
      {task.title}
    </div>
  );
};

export default Task;
