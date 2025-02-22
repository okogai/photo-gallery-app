import { createSlice } from "@reduxjs/toolkit";
import { Image } from '../../typed';
import { fetchImages } from './imageThunk.ts';
import { RootState } from '../../app/store.ts';

interface ImagesState {
  images: Image[] | null;
  fetchImagesLoading: boolean;
}

const initialState: ImagesState = {
  images: null,
  fetchImagesLoading: false,
};

export const selectImages = (state: RootState) => state.images.images;
export const selectImagesLoading = (state: RootState) => state.images.fetchImagesLoading;

export const imagesSlice = createSlice({
  name: "images",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchImages.pending, (state) => {
      state.fetchImagesLoading = true;
    });
    builder.addCase( fetchImages.fulfilled,  (state, action ) => {
        state.fetchImagesLoading = false;
        state.images = action.payload;
      },
    );
    builder.addCase(fetchImages.rejected, (state) => {
      state.fetchImagesLoading = false;
    });
  },
});

export const imagesReducer = imagesSlice.reducer;
