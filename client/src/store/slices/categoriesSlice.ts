import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Category, CategoriesState } from "@/types/category/categories";
import type { CategoryShare } from "@/types/category/shareCategory";

const initialState: CategoriesState = {
  categories: [],
  selectedCategoryId: null,
  isLoading: false,
  error: null,
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addCategory: (state, action: PayloadAction<Category>) => {
      state.categories.unshift(action.payload);
      state.error = null;
    },
    updateCategory: (
      state,
      action: PayloadAction<Partial<Category> & { id: string }>,
    ) => {
      const index = state.categories.findIndex(
        (c) => c.id === action.payload.id,
      );
      if (index !== -1) {
        state.categories[index] = {
          ...state.categories[index],
          ...action.payload,
        };
      }
      state.error = null;
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter(
        (category) => category.id !== action.payload,
      );
      if (state.selectedCategoryId === action.payload) {
        state.selectedCategoryId = null;
      }
      state.error = null;
    },
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategoryId = action.payload;
    },
    addCategoryShare: (
      state,
      action: PayloadAction<{ categoryId: string; share: CategoryShare }>,
    ) => {
      const category = state.categories.find(
        (c) => c.id === action.payload.categoryId,
      );
      if (category) {
        category.shares.push(action.payload.share);
      }
    },
    updateCategoryShare: (
      state,
      action: PayloadAction<{ categoryId: string; share: CategoryShare }>,
    ) => {
      const category = state.categories.find(
        (c) => c.id === action.payload.categoryId,
      );
      if (category) {
        const shareIndex = category.shares.findIndex(
          (s) => s.id === action.payload.share.id,
        );
        if (shareIndex !== -1) {
          category.shares[shareIndex] = action.payload.share;
        }
      }
    },
    removeCategoryShare: (
      state,
      action: PayloadAction<{ categoryId: string; shareId: string }>,
    ) => {
      const category = state.categories.find(
        (c) => c.id === action.payload.categoryId,
      );
      if (category) {
        category.shares = category.shares.filter(
          (s) => s.id !== action.payload.shareId,
        );
      }
    },

    resetCategoriesState: () => initialState,
  },
});

export const {
  setLoading,
  setError,
  setCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  setSelectedCategory,
  addCategoryShare,
  updateCategoryShare,
  removeCategoryShare,
  resetCategoriesState,
} = categoriesSlice.actions;

export default categoriesSlice.reducer;

export const selectCategories = (state: { categories: CategoriesState }) =>
  state.categories.categories;
export const selectCategoriesLoading = (state: {
  categories: CategoriesState;
}) => state.categories.isLoading;
export const selectCategoriesError = (state: { categories: CategoriesState }) =>
  state.categories.error;
export const selectSelectedCategoryId = (state: {
  categories: CategoriesState;
}) => state.categories.selectedCategoryId;

export const selectSelectedCategory = (state: {
  categories: CategoriesState;
}) => {
  const { categories, selectedCategoryId } = state.categories;
  return categories.find((cat) => cat.id === selectedCategoryId) || null;
};

export const selectCategoryById =
  (categoryId: string) => (state: { categories: CategoriesState }) =>
    state.categories.categories.find((cat) => cat.id === categoryId) || null;

export const selectCategoriesByListId =
  (listId: string) => (state: { categories: CategoriesState }) =>
    state.categories.categories.filter((cat) => cat.listId === listId);

export const selectSharedCategories =
  (userId: string) => (state: { categories: CategoriesState }) =>
    state.categories.categories.filter((cat) =>
      cat.shares.some((share) => share.userId === userId),
    );
