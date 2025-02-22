import React, { useState } from "react";
import { LoginMutation } from "../../typed";
import {
  Alert,
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
import FacebookIcon from "@mui/icons-material/Facebook";
import Person2Icon from "@mui/icons-material/Person2";
import { useAppDispatch, useAppSelector } from "../../app/hooks.ts";
import { NavLink, useNavigate } from "react-router-dom";
import { selectLoginError, selectLoginLoading } from "./userSlice.ts";
import { facebookLogin, googleLogin, login } from "./userThunk.ts";
import { GoogleLogin } from "@react-oauth/google";
import FacebookLogin from "@greatsumini/react-facebook-login";
import { ACCESS_ID } from "../../constants.ts";
import { toast } from "react-toastify";

const initialState = {
  email: "",
  password: "",
};

const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const loginError = useAppSelector(selectLoginError);
  const loginLoading = useAppSelector(selectLoginLoading);
  const [form, setForm] = useState<LoginMutation>(initialState);

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevState) => ({ ...prevState, [name]: value }));
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(login(form)).unwrap();
    toast.success("You have successfully logged in");
    navigate("/");
  };

  const googleLoginHandler = async (credential: string) => {
    await dispatch(googleLogin(credential)).unwrap();
    toast.success("You have successfully logged in");
    navigate("/");
  };

  const facebookLoginHandler = async (accessToken: string, userID: string) => {
    await dispatch(facebookLogin({ accessToken, userID })).unwrap();
    toast.success("You have successfully logged in");
    navigate("/");
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
          <Person2Icon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>

        {loginError && (
          <Alert severity={"error"} sx={{ mt: 3, width: "100%" }}>
            {loginError.error}
          </Alert>
        )}

        <Box
          component="form"
          noValidate
          onSubmit={submitHandler}
          sx={{ mt: 3 }}
        >
          <Grid container direction={"column"} size={12} spacing={2}>
            <Grid size={12}>
              <FacebookLogin
                appId={ACCESS_ID}
                onSuccess={(response) =>
                  facebookLoginHandler(response.accessToken, response.userID)
                }
                onFail={() => {
                  alert("Facebook login failed");
                }}
                render={(renderProps) => (
                  <Button
                    onClick={renderProps.onClick}
                    variant="contained"
                    color="primary"
                    startIcon={<FacebookIcon />}
                  >
                    <Typography variant="body2">
                      Sign in with Facebook
                    </Typography>
                  </Button>
                )}
              />
            </Grid>
            <Grid size={12}>
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  if (credentialResponse.credential) {
                    void googleLoginHandler(credentialResponse.credential);
                  }
                }}
                onError={() => {
                  console.log("Login Failed");
                }}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                value={form.email}
                onChange={inputChangeHandler}
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
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {loginLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Sign in"
            )}
          </Button>
          <Grid container justifyContent="center">
            <Grid>
              <Link variant="body2" component={NavLink} to="/register">
                Don't have an account? Sign Up
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterPage;
