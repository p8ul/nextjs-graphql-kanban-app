import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";

interface Item {
  title: string;
  id: string;
}

interface MyComponentProps {
  columnId: string;
  item: Item;
  onUpdateItem: (columnId: string, item: Item) => void;
  onDelete: (columnId: string, taskId: string) => void;
}

const KanBanTask: React.FC<MyComponentProps> = ({
  columnId,
  item,
  onUpdateItem,
  onDelete,
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
          <TextField
            id="outlined-basic"
            label="Title"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ width: "100%" }}
          />
          <Box
            sx={{
              width: "100%",
              justifyContent: "space-between",
              display: "flex",
              marginTop: 2,
            }}
          >
            <Button onClick={handleCancel}>Cancel</Button>
            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>
          </Box>
        </>
      ) : (
        <>
          <Box sx={{ alignItems: "center" }}>
            <Box>
              <div onClick={() => setShowActions(!showActions)}>{item.title}</div>
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
