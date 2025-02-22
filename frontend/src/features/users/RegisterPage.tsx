import React, { useState } from "react";
import { RegisterMutation } from "../../typed";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useAppDispatch, useAppSelector } from "../../app/hooks.ts";
import { NavLink, useNavigate } from "react-router-dom";
import { selectRegisterError, selectRegisterLoading } from "./userSlice.ts";
import { register } from "./userThunk.ts";
import FileInput from "../../components/UI/FileInput/FileInput.tsx";
import { toast } from "react-toastify";

const regEmail = /^(\w+[-.]?\w+)@(\w+)([.-]?\w+)?(\.[a-zA-Z]{2,3})$/;

const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const registerError = useAppSelector(selectRegisterError);
  const registerLoading = useAppSelector(selectRegisterLoading);
  const [form, setForm] = useState<RegisterMutation>({
    email: "",
    password: "",
    confirmPassword: "",
    displayName: "",
    avatar: null,
  });

  const [filename, setFilename] = useState("");
  const [errors, setErrors] = useState<{ email?: string }>({});

  const fileInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files) {
      setForm((prevState) => ({
        ...prevState,
        [name]: files[0],
      }));
      setFilename(files[0].name);
    }
  };

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevState) => ({ ...prevState, [name]: value }));

    if (name === "email") {
      if (regEmail.test(value)) {
        setErrors((prevState) => ({ ...prevState, email: "" }));
      } else {
        setErrors((prevState) => ({
          ...prevState,
          email: "Invalid email format",
        }));
      }
    }
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(register(form)).unwrap();
      toast.success("You have successfully registered.");
      navigate("/");
    } catch (e) {
      console.log(e);
    }
  };

  const getFieldError = (fieldName: string) => {
    try {
      return registerError?.errors[fieldName].message;
    } catch {
      return undefined;
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <PersonAddIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={submitHandler}
          sx={{ mt: 3 }}
        >
          <Grid container direction={"column"} size={12} spacing={2}>
            <Grid size={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                value={form.email}
                onChange={inputChangeHandler}
                error={Boolean(getFieldError("email")) || Boolean(errors.email)}
                helperText={getFieldError("email") || errors.email}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={form.password}
                onChange={inputChangeHandler}
                error={Boolean(getFieldError("password"))}
                helperText={getFieldError("password")}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Confirm password"
                type="password"
                id="confirmPassword"
                value={form.confirmPassword}
                onChange={inputChangeHandler}
                error={Boolean(getFieldError("password"))}
                helperText={getFieldError("password")}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                required
                fullWidth
                name="displayName"
                label="Display name"
                id="displayName"
                value={form.displayName}
                onChange={inputChangeHandler}
                error={Boolean(getFieldError("displayName"))}
                helperText={getFieldError("displayName")}
              />
            </Grid>
            <Grid size={12}>
              <FileInput
                label="Avatar"
                name="avatar"
                filename={filename}
                onChange={fileInputChangeHandler}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {registerLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Sign Up"
            )}
          </Button>
          <Grid container justifyContent="center">
            <Grid>
              <Link variant="body2" component={NavLink} to="/login">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterPage;
