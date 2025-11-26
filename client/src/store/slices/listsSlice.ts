import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { List, ListsState, ListShare } from "@/types/tasks-system/list";
import { api, apiErrorMessage } from "@/lib/api";

const initialState: ListsState = {
  lists: [],
  selectedListId: null,
  isLoading: false,
  error: null,
};

// Async Thunks
export const fetchLists = createAsyncThunk(
  "lists/fetchLists",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get<List[]>("/lists");
      return data;
    } catch (err) {
      return rejectWithValue(apiErrorMessage(err));
    }
  },
);

export const createList = createAsyncThunk(
  "lists/createList",
  async (listData: Partial<List>, { rejectWithValue }) => {
    try {
      const { data } = await api.post<List>("/lists", listData);
      return data;
    } catch (err) {
      return rejectWithValue(apiErrorMessage(err));
    }
  },
);

export const updateList = createAsyncThunk(
  "lists/updateList",
  async (
    { id, ...updates }: Partial<List> & { id: string },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await api.patch<List>(`/lists/${id}`, updates);
      return data;
    } catch (err) {
      return rejectWithValue(apiErrorMessage(err));
    }
  },
);

export const deleteList = createAsyncThunk(
  "lists/deleteList",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/lists/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(apiErrorMessage(err));
    }
  },
);

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
  extraReducers: (builder) => {
    // Fetch Lists
    builder
      .addCase(fetchLists.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLists.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lists = action.payload;
        state.error = null;
      })
      .addCase(fetchLists.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create List
    builder
      .addCase(createList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lists.unshift(action.payload);
        state.error = null;
      })
      .addCase(createList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update List
    builder
      .addCase(updateList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateList.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.lists.findIndex((l) => l.id === action.payload.id);
        if (index !== -1) {
          state.lists[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete List
    builder
      .addCase(deleteList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lists = state.lists.filter((list) => list.id !== action.payload);
        if (state.selectedListId === action.payload) {
          state.selectedListId = null;
        }
        state.error = null;
      })
      .addCase(deleteList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setLoading,
  setError,
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
      list.shares?.some((share) => share.userId === userId),
    );
