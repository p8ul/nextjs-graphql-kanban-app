// src/ColumnCreator.tsx
import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Paper,
  Card,
  Divider,
  CardContent,
} from "@mui/material";
import InputForm from "@/app/components/Form/InputForm";

interface ColumnCreatorProps {
  onCreateColumn: (title: string) => void;
  totalColumns: number;
}

const ColumnCreator: React.FC<ColumnCreatorProps> = ({
  onCreateColumn,
  totalColumns,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Box>
      <Box sx={{ paddingTop: 1 }}>
        <Paper elevation={1}>
          <Divider />
          {!isEditing ? (
            <Card sx={{ maxWidth: 345, minWidth: 300, padding: 0 }}>
              <CardContent sx={{ display: "flex", justifyContent: "center" }}>
                <Button
                  sx={{ width: 200, padding: 0 }}
                  onClick={() => setIsEditing(true)}
                  disabled={totalColumns > 5}
                >
                  Add Column
                </Button>
              </CardContent>
            </Card>
          ) : null}
          {isEditing ? (
            <Card sx={{ maxWidth: 345, padding: 2, minWidth: 345 }}>
              <InputForm
                onAdd={(columnId, title) => {
                  onCreateColumn(title);
                }}
                columnId="_"
                onCancel={() => setIsEditing(false)}
              />
            </Card>
          ) : null}
        </Paper>
      </Box>
    </Box>
  );
};

export default ColumnCreator;
