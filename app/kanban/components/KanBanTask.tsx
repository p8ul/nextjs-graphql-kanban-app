import React, { useState } from "react";
import { Box, IconButton, Menu, MenuItem } from "@mui/material";
import InputForm from "@/app/components/Form/InputForm";
import MoreVertIcon from "@mui/icons-material/MoreVert";
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
  const [isEditing, setIsEditing] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
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
          <Box sx={{ alignItems: "center", position: "relative" }}>
            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  position: "absolute",
                  right: 1,
                  top: 1,
                }}
              >
                <IconButton
                  aria-label="settings"
                  id="basic-button"
                  aria-controls={open ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                  sx={{
                    padding: 0,
                  }}
                >
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      setIsEditing(true);
                    }}
                  >
                    Edit
                  </MenuItem>

                  <MenuItem
                    onClick={() => {
                      handleClose();
                      onDelete(columnId, item.id);
                    }}
                  >
                    Delete
                  </MenuItem>
                </Menu>
              </Box>
              <div onClick={() => setShowActions(!showActions)}>
                {item.title}
              </div>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default KanBanTask;
