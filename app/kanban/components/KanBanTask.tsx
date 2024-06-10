import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import InputForm from "@/app/components/Form/InputForm";

interface Item {
  title: string;
  id: string;
}

interface MyComponentProps {
  columnId: string;
  item: Item;
  onUpdateItem: (columnId: string, item: Item) => void;
  onDelete: (columnId: string, taskId: string) => void;
  updateTask: (columnId: string, taskId: string, task: Item) => void;
}

const KanBanTask: React.FC<MyComponentProps> = ({
  columnId,
  item,
  onUpdateItem,
  onDelete,
  updateTask,
}) => {
  const [title, setTitle] = useState(item.title);
  const [isEditing, setIsEditing] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const handleSave = () => {
    onUpdateItem(columnId, { ...item, title });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTitle(item.title);
    setIsEditing(false);
  };

  return (
    <Box sx={{ width: "100%" }}>
      {isEditing ? (
        <>
          <InputForm
            onAdd={(columnId, title) => {
              updateTask(columnId, item.id, { ...item, title });
            }}
            onCancel={() => setIsEditing(false)}
            columnId={columnId}
            value={item.title}
          />
        </>
      ) : (
        <>
          <Box sx={{ alignItems: "center" }}>
            <Box>
              <div onClick={() => setShowActions(!showActions)}>
                {item.title}
              </div>
            </Box>
            {showActions ? (
              <Box>
                <Button onClick={() => setIsEditing(true)}>Edit</Button>
                <Button
                  onClick={() => {
                    onDelete(columnId, item.id);
                  }}
                >
                  Delete
                </Button>
              </Box>
            ) : null}
          </Box>
        </>
      )}
    </Box>
  );
};

export default KanBanTask;
