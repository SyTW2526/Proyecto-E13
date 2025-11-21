import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import themeReducer from "./slices/themeSlice";
import listsReducer from "./slices/listsSlice";
import tasksReducer from "./slices/tasksSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    lists: listsReducer,
    tasks: tasksReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
