import { createSlice, configureStore, PayloadAction } from "@reduxjs/toolkit";
import { EmojiData } from "../types";

interface EmojiState {
  emojis: EmojiData[];
}

const initialState: EmojiState = {
  emojis: [],
};

const emojisSlice = createSlice({
  name: "emojis",
  initialState,
  reducers: {
    setEmojisData: (state, action: PayloadAction<EmojiData[]>) => {
      state.emojis = action.payload;
    },
  },
});

export const { setEmojisData } = emojisSlice.actions;

const store = configureStore({
  reducer: emojisSlice.reducer,
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
