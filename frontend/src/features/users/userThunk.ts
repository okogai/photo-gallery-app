import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosAPI from "../../utils/axiosAPI.ts";
import {
  GlobalError,
  LoginMutation,
  RegisterMutation,
  RegisterResponse,
  User,
  ValidationError,
} from "../../typed";
import { isAxiosError } from "axios";
import { RootState } from "../../app/store.ts";

export const googleLogin = createAsyncThunk<
  User,
  string,
  { rejectValue: GlobalError }
>("users/googleLogin", async (credential, { rejectWithValue }) => {
  try {
    const response = await axiosAPI.post<RegisterResponse>("/users/google", {
      credential,
    });
    return response.data.user;
  } catch (e) {
    if (isAxiosError(e) && e.response && e.response.status === 400) {
      return rejectWithValue(e.response.data);
    }
    throw e;
  }
});

export const facebookLogin = createAsyncThunk<
  User,
  { accessToken: string; userID: string },
  { rejectValue: GlobalError }
>("users/facebookLogin", async (data, { rejectWithValue }) => {
  try {
    const response = await axiosAPI.post<RegisterResponse>(
      "/users/facebook",
      data,
    );
    return response.data.user;
  } catch (e) {
    if (isAxiosError(e) && e.response && e.response.status === 400) {
      return rejectWithValue(e.response.data);
    }
    throw e;
  }
});

export const register = createAsyncThunk<
  RegisterResponse,
  RegisterMutation,
  { rejectValue: ValidationError }
>("users/register", async (data: RegisterMutation, { rejectWithValue }) => {
  const formData = new FormData();
  formData.append("email", data.email);
  formData.append("password", data.password);
  formData.append("confirmPassword", data.confirmPassword);
  formData.append("displayName", data.displayName);
  if (data.avatar) {
    formData.append("avatar", data.avatar);
  }
  try {
    const response = await axiosAPI.post<RegisterResponse>(
      "/users/register",
      formData,
    );
    return response.data;
  } catch (e) {
    if (isAxiosError(e) && e.response && e.response.status === 400) {
      return rejectWithValue(e.response.data);
    }
    throw e;
  }
});

export const logout = createAsyncThunk<void, void, { state: RootState }>(
  "users/logout",
  async (_, { getState }) => {
    const token = getState().users.user?.token;
    await axiosAPI.delete(`users/sessions`, {
      headers: { Authorization: token },
    });
  },
);

export const login = createAsyncThunk<
  User,
  LoginMutation,
  { rejectValue: GlobalError }
>("users/login", async (loginMutation, { rejectWithValue }) => {
  try {
    const response = await axiosAPI.post<RegisterResponse>(
      "/users/sessions",
      loginMutation,
    );
    return response.data.user;
  } catch (e) {
    if (isAxiosError(e) && e.response && e.response.status === 400) {
      return rejectWithValue(e.response.data as GlobalError);
    }
    throw e;
  }
});
