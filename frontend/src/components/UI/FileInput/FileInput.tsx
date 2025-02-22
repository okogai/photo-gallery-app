import React, { useRef } from "react";
import { Button, TextField } from "@mui/material";
import Grid from "@mui/material/Grid2";

interface Props {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  label: string;
  filename: string;
}

const FileInput: React.FC<Props> = ({ onChange, name, label, filename }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onChange(e);
    }
  };

  const activateInput = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <>
      <input
        style={{ display: "none" }}
        type="file"
        name={name}
        onChange={onFileChange}
        ref={inputRef}
      />
      <Grid
        container
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
      >
        <Grid sx={{ flexGrow: 1 }}>
          <TextField
            disabled
            fullWidth
            size="small"
            label={label}
            value={filename}
          />
        </Grid>
        <Grid>
          <Button variant="contained" onClick={activateInput}>
            Browse
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default FileInput;
