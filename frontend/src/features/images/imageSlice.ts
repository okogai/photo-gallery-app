import { createSlice } from "@reduxjs/toolkit";
import { Image } from "../../typed";
import {
  addImage,
  deleteImage,
  fetchImages,
  fetchImagesByUser,
} from "./imageThunk.ts";
import { RootState } from "../../app/store.ts";

interface ImagesState {
  images: Image[] | null;
  fetchImagesLoading: boolean;
  deleteImageLoading: boolean;
  addImageLoading: boolean;
}

const initialState: ImagesState = {
  images: null,
  fetchImagesLoading: false,
  deleteImageLoading: false,
  addImageLoading: false,
};

export const selectImages = (state: RootState) => state.images.images;
export const selectImagesLoading = (state: RootState) =>
  state.images.fetchImagesLoading;
export const selectDeleteImageLoading = (state: RootState) =>
  state.images.deleteImageLoading;
export const selectAddImageLoading = (state: RootState) =>
  state.images.addImageLoading;

export const imagesSlice = createSlice({
  name: "images",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchImages.pending, (state) => {
      state.fetchImagesLoading = true;
    });
    builder.addCase(fetchImages.fulfilled, (state, action) => {
      state.fetchImagesLoading = false;
      state.images = action.payload;
    });
    builder.addCase(fetchImages.rejected, (state) => {
      state.fetchImagesLoading = false;
    });
    builder.addCase(deleteImage.pending, (state) => {
      state.deleteImageLoading = true;
    });
    builder.addCase(deleteImage.fulfilled, (state) => {
      state.deleteImageLoading = false;
    });
    builder.addCase(deleteImage.rejected, (state) => {
      state.deleteImageLoading = false;
    });
    builder.addCase(fetchImagesByUser.pending, (state) => {
      state.deleteImageLoading = true;
    });
    builder.addCase(fetchImagesByUser.fulfilled, (state, action) => {
      state.deleteImageLoading = false;
      state.images = action.payload;
    });
    builder.addCase(fetchImagesByUser.rejected, (state) => {
      state.deleteImageLoading = false;
    });
    builder.addCase(addImage.pending, (state) => {
      state.addImageLoading = true;
    });
    builder.addCase(addImage.fulfilled, (state) => {
      state.addImageLoading = false;
    });
    builder.addCase(addImage.rejected, (state) => {
      state.addImageLoading = false;
    });
  },
});

export const imagesReducer = imagesSlice.reducer;
