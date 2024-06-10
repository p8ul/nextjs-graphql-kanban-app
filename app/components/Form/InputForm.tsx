import React from "react";
import { Box, TextField, Button } from "@mui/material";

interface MyComponentProps {
  onAdd: (columnId: string, title: string) => void;
  onCancel: () => void;
  columnId?: string;
  value?: string;
}

const InputForm: React.FC<MyComponentProps> = ({
  onAdd,
  onCancel,
  columnId,
  value
}) => {
  const [name, setName] = React.useState(value || '');
  return (
    <Box sx={{ width: "100%" }}>
      <TextField
        id="outlined-basic"
        label="Title"
        variant="outlined"
        sx={{ width: "100%" }}
        value={name}
        onChange={(value) => setName(value.target.value)}
      />
      <Box
        sx={{
          width: "100%",
          justifyContent: "space-between",
          display: "flex",
          marginTop: 2,
        }}
      >
        <Button onClick={onCancel}>Cancel</Button>
        <Button
          variant="contained"
          onClick={() => {
            onAdd(columnId, name);
            setName("");
            onCancel();
          }}
        >
          Add
        </Button>
      </Box>
    </Box>
  );
};

export default InputForm;
