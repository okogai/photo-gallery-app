import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPI from '../../utils/axiosAPI.ts';
import { Image } from '../../typed';

export const fetchImages = createAsyncThunk<Image[]>(
  "images/fetchImages",
  async () => {
    const response = await axiosAPI.get(`/images`);
    return response.data;
  },
);