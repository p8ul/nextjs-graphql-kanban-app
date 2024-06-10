import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Box, Button, Divider, Menu, MenuItem, Paper } from "@mui/material";
import InputForm from "@/app/components/Form/InputForm";
interface KanbanColumnProps {
  title: string;
  children: React.ReactNode;
  onDelete: () => void;
  addTask: (columnId: string, title: string) => void;
  columnId: string;
  updateColumnName: (newTitle: string) => void;
  clearColumnTasks: (columnId: string) => void;
}
const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  children,
  onDelete,
  addTask,
  columnId,
  updateColumnName,
  clearColumnTasks,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [addTaskOpen, setAddTaskOpen] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  return (
    <Box sx={{ padding: 1 }}>
      <Paper elevation={1}>
        <Card sx={{ maxWidth: 305 }}>
          <Divider />
          {isEditing ? (
            <Box padding={2}>
              <InputForm
                onAdd={(_, title) => {
                  updateColumnName(title);
                  setIsEditing(false);
                }}
                value={title}
                onCancel={() => setIsEditing(false)}
              />
            </Box>
          ) : (
            <CardHeader
              action={
                <IconButton
                  aria-label="settings"
                  id="basic-button"
                  aria-controls={open ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                >
                  <MoreVertIcon />
                </IconButton>
              }
              title={title}
            />
          )}
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
              Rename
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClose();
                clearColumnTasks(columnId);
              }}
            >
              Clear
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClose();
                onDelete();
              }}
            >
              Delete
            </MenuItem>
          </Menu>
          <Divider />
          <CardContent>{children}</CardContent>
          <Divider />
          <CardActions disableSpacing>
            <Box
              sx={{
                justifyContent: "center",
                width: "100%",
                flex: 1,
              }}
            >
              {addTaskOpen ? (
                <InputForm
                  onAdd={addTask}
                  onCancel={() => {
                    setAddTaskOpen(false);
                  }}
                  columnId={columnId}
                />
              ) : (
                <Button
                  sx={{ width: "100%" }}
                  onClick={() => setAddTaskOpen(true)}
                >
                  Add Card
                </Button>
              )}
            </Box>
          </CardActions>
          <Divider />
        </Card>
      </Paper>
    </Box>
  );
};

export default KanbanColumn;
