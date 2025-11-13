import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { List, ListsState } from "@/types/list/list";
import type { ListShare } from "@/types/list/shareList";

const initialState: ListsState = {
  lists: [],
  selectedListId: null,
  isLoading: false,
  error: null,
};

const listsSlice = createSlice({
  name: "lists",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setLists: (state, action: PayloadAction<List[]>) => {
      state.lists = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addList: (state, action: PayloadAction<List>) => {
      state.lists.unshift(action.payload);
      state.error = null;
    },
    updateList: (
      state,
      action: PayloadAction<Partial<List> & { id: string }>,
    ) => {
      const index = state.lists.findIndex((l) => l.id === action.payload.id);
      if (index !== -1) {
        state.lists[index] = { ...state.lists[index], ...action.payload };
      }
      state.error = null;
    },
    deleteList: (state, action: PayloadAction<string>) => {
      state.lists = state.lists.filter((list) => list.id !== action.payload);
      if (state.selectedListId === action.payload) {
        state.selectedListId = null;
      }
      state.error = null;
    },
    setSelectedList: (state, action: PayloadAction<string | null>) => {
      state.selectedListId = action.payload;
    },
    addListShare: (
      state,
      action: PayloadAction<{ listId: string; share: ListShare }>,
    ) => {
      const list = state.lists.find((l) => l.id === action.payload.listId);
      if (list) {
        list.shares.push(action.payload.share);
      }
    },
    updateListShare: (
      state,
      action: PayloadAction<{ listId: string; share: ListShare }>,
    ) => {
      const list = state.lists.find((l) => l.id === action.payload.listId);
      if (list) {
        const shareIndex = list.shares.findIndex(
          (s) => s.id === action.payload.share.id,
        );
        if (shareIndex !== -1) {
          list.shares[shareIndex] = action.payload.share;
        }
      }
    },
    removeListShare: (
      state,
      action: PayloadAction<{ listId: string; shareId: string }>,
    ) => {
      const list = state.lists.find((l) => l.id === action.payload.listId);
      if (list) {
        list.shares = list.shares.filter(
          (s) => s.id !== action.payload.shareId,
        );
      }
    },
    resetListsState: () => initialState,
  },
});

export const {
  setLoading,
  setError,
  setLists,
  addList,
  updateList,
  deleteList,
  setSelectedList,
  addListShare,
  updateListShare,
  removeListShare,
  resetListsState,
} = listsSlice.actions;

export default listsSlice.reducer;

export const selectLists = (state: { lists: ListsState }) => state.lists.lists;
export const selectListsLoading = (state: { lists: ListsState }) =>
  state.lists.isLoading;
export const selectListsError = (state: { lists: ListsState }) =>
  state.lists.error;
export const selectSelectedListId = (state: { lists: ListsState }) =>
  state.lists.selectedListId;
export const selectSelectedList = (state: { lists: ListsState }) => {
  const { lists, selectedListId } = state.lists;
  return lists.find((list) => list.id === selectedListId) || null;
};
export const selectListById =
  (listId: string) => (state: { lists: ListsState }) =>
    state.lists.lists.find((list) => list.id === listId) || null;
export const selectOwnedLists =
  (userId: string) => (state: { lists: ListsState }) =>
    state.lists.lists.filter((list) => list.ownerId === userId);
export const selectSharedLists =
  (userId: string) => (state: { lists: ListsState }) =>
    state.lists.lists.filter((list) =>
      list.shares.some((share) => share.userId === userId),
    );
