import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPI from '../../utils/axiosAPI.ts';
import { GlobalError, Image, ImageMutation } from '../../typed';
import { isAxiosError } from 'axios';

export const fetchImages = createAsyncThunk<Image[]>(
  "images/fetchImages",
  async () => {
    const response = await axiosAPI.get(`/images`);
    return response.data;
  },
);

export const fetchImagesByUser = createAsyncThunk<Image[], string>(
  "images/fetchImagesByUser",
  async (id: string) => {
    const response = await axiosAPI.get(`/images/?user=${id}`);
    return response.data;
  },
);

export const addImage = createAsyncThunk<void, ImageMutation, { rejectValue: GlobalError }>(
  'images/addImage',
  async (data: ImageMutation, { rejectWithValue }) => {
    const formData = new FormData();
    formData.append("title", data.title);
    if (data.image) {
      formData.append("image", data.image);
    }

    try {
      const response = await axiosAPI.post("/images", formData);

      return response.data;
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 400) {
        return rejectWithValue(e.response.data as GlobalError);
      }
      throw e;
    }
  });

export const deleteImage = createAsyncThunk<void, string, { rejectValue: GlobalError }>(
  "images/deleteImage", async (id: string, { rejectWithValue }) => {
    try {
      await axiosAPI.delete(`images/${id}`);
    } catch (e) {
      if (isAxiosError(e) && e.response) {
        return rejectWithValue(e.response.data as GlobalError);
      }
      throw e;
    }
  });