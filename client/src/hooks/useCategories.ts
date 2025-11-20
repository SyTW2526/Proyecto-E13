import { useAppDispatch, useAppSelector } from "./useRedux";
import {
  selectCategories,
  selectCategoriesLoading,
  selectCategoriesError,
  selectSelectedCategoryId,
  selectSelectedCategory,
  selectCategoriesByListId,
  selectSharedCategories,
  setCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  setSelectedCategory,
  addCategoryShare,
  updateCategoryShare,
  removeCategoryShare,
  setLoading,
  setError,
} from "@/store/slices/categoriesSlice";
import { selectUser } from "@/store/slices/authSlice";
import {
  selectAccessibleCategories,
  selectAccessibleCategoriesByList,
  getCategoryPermission,
  canAccessCategory,
} from "@/store/slices/permissionsSelectors";
import type { Category } from "@/types/category/categories";
import type { CategoryShare } from "@/types/category/shareCategory";
import type { SharePermission } from "@/types/permissions";

export function useCategories(listId?: string) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const categories = useAppSelector(selectCategories);
  const isLoading = useAppSelector(selectCategoriesLoading);
  const error = useAppSelector(selectCategoriesError);
  const selectedCategoryId = useAppSelector(selectSelectedCategoryId);
  const selectedCategory = useAppSelector(selectSelectedCategory);

  const accessibleCategories = useAppSelector(selectAccessibleCategories);
  const categoriesByList = listId
    ? useAppSelector(selectCategoriesByListId(listId))
    : [];
  const accessibleCategoriesByList = listId
    ? useAppSelector(selectAccessibleCategoriesByList(listId))
    : [];
  const sharedCategories = useAppSelector(
    selectSharedCategories(user?.id || ""),
  );

  const loadCategories = (categoriesData: Category[]) =>
    dispatch(setCategories(categoriesData));
  const createCategory = (category: Category) =>
    dispatch(addCategory(category));
  const editCategory = (data: Partial<Category> & { id: string }) =>
    dispatch(updateCategory(data));
  const removeCategory = (id: string) => dispatch(deleteCategory(id));
  const selectCategory = (id: string | null) =>
    dispatch(setSelectedCategory(id));

  const shareCategory = (categoryId: string, share: CategoryShare) =>
    dispatch(addCategoryShare({ categoryId, share }));
  const updateShare = (categoryId: string, share: CategoryShare) =>
    dispatch(updateCategoryShare({ categoryId, share }));
  const removeShare = (categoryId: string, shareId: string) =>
    dispatch(removeCategoryShare({ categoryId, shareId }));

  const setLoadingState = (loading: boolean) => dispatch(setLoading(loading));
  const setErrorState = (error: string | null) => dispatch(setError(error));

  const state = useAppSelector((state) => state);

  const getPermission = (categoryId: string): SharePermission | null =>
    getCategoryPermission(categoryId)(state);
  const canAccess = (
    categoryId: string,
    permission: SharePermission = "VIEW",
  ): boolean => canAccessCategory(categoryId, permission)(state);

  return {
    categories,
    accessibleCategories,
    categoriesByList,
    accessibleCategoriesByList,
    sharedCategories,
    isLoading,
    error,
    selectedCategoryId,
    selectedCategory,
    loadCategories,
    createCategory,
    editCategory,
    removeCategory,
    selectCategory,
    shareCategory,
    updateShare,
    removeShare,
    setLoadingState,
    setErrorState,
    getPermission,
    canAccess,
  };
}
