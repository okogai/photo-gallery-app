import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPI from '../../utils/axiosAPI.ts';
import { GlobalError, Image } from '../../typed';
import { isAxiosError } from 'axios';

export const fetchImages = createAsyncThunk<Image[]>(
  "images/fetchImages",
  async () => {
    const response = await axiosAPI.get(`/images`);
    return response.data;
  },
);

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