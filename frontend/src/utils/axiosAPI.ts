import axios, { AxiosHeaders, InternalAxiosRequestConfig } from "axios";
import { RootState } from "../app/store.ts";
import { Store } from "@reduxjs/toolkit";

const axiosAPI = axios.create({
  baseURL: "http://localhost:8000",
});

export const addInterceptors = (store: Store<RootState>) => {
  axiosAPI.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = store.getState().users.user?.token;
    const headers = config.headers as AxiosHeaders;
    headers.set("Authorization", token);

    return config;
  });
};

export default axiosAPI;
