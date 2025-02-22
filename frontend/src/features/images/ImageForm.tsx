import React, { ChangeEvent, useState } from "react";
import {
  Box,
  Button, CircularProgress,
  TextField,
  Typography,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from "../../app/hooks.ts";
import { useNavigate } from "react-router-dom";
import FileInput from '../../components/UI/FileInput/FileInput.tsx';
import { addImage } from './imageThunk.ts';
import { selectAddImageLoading } from './imageSlice.ts';
import { GlobalError } from '../../typed';
import { toast } from 'react-toastify';

const initialState = {
  title: "",
  image: null,
};

const ImageForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const loading = useAppSelector(selectAddImageLoading);
  const [filename, setFilename] = useState("");
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState<{ title?: string, image?: string }>({});

  const fileInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files) {
      setForm((prevState) => ({
        ...prevState,
        [name]: files[0],
      }));
      setFilename(files[0].name);
      setErrors((prevErrors) => ({ ...prevErrors, image: "" }));
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formErrors: { title?: string, image?: string } = {};
    if (!form.title) {
      formErrors.title = "Title is required.";
    }
    if (!form.image) {
      formErrors.image = "Image is required.";
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      await dispatch(addImage(form)).unwrap();
      toast.success("Image added successfully.");
      navigate("/");
    } catch (error) {
      const err = error as GlobalError;
      toast.error(err.error || "Something went wrong");
    }
  };

  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        maxWidth: 400,
        mx: "auto",
        mt: 4,
      }}
      onSubmit={handleSubmit}
    >
      <Typography variant="h5" gutterBottom textAlign='center' textTransform='uppercase'>
        Add New Image
      </Typography>
      <TextField
        label="Title"
        name="title"
        value={form.title}
        onChange={handleChange}
        error={!!errors.title}
        helperText={errors.title}
      />
      <FileInput
        label="Image"
        name="image"
        filename={filename}
        onChange={fileInputChangeHandler}
        error={!!errors.image}
        helperText={errors.image}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{alignSelf: 'center'}}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Create'}
      </Button>
    </Box>
  );
};

export default ImageForm;
