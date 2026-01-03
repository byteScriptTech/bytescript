import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TimerState {
  settings: Record<string, boolean>;
}

const initialState: TimerState = {
  settings: {},
};

const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    updateSettings: (state, action: PayloadAction<Record<string, boolean>>) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    clearSettings: (state) => {
      state.settings = {};
    },
  },
});

export const { updateSettings, clearSettings } = timerSlice.actions;
export default timerSlice.reducer;
