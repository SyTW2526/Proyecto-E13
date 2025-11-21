import { describe, expect, it } from "vitest";
import reducer, {
  addCategory,
  addCategoryShare,
  deleteCategory,
  removeCategoryShare,
  resetCategoriesState,
  selectCategories,
  selectCategoriesByListId,
  selectSelectedCategory,
  setCategories,
  setError,
  setLoading,
  setSelectedCategory,
  updateCategory,
  updateCategoryShare,
} from "@/store/slices/categoriesSlice";
import type { CategoriesState, Category } from "@/types/category/categories";
import type { CategoryShare } from "@/types/category/shareCategory";

const baseCategory: Category = {
  id: "c1",
  name: "Work",
  description: "desc",
  createdAt: "2024-01-01",
  listId: "l1",
  tasks: [],
  shares: [],
};

const shared: CategoryShare = {
  id: "s1",
  userId: "u1",
  permission: "VIEW",
  categoryId: "c1",
};

const initialState: CategoriesState = {
  categories: [],
  selectedCategoryId: null,
  isLoading: false,
  error: null,
};

describe("categoriesSlice reducer", () => {
  it("maneja setLoading y setError", () => {
    let state = reducer(initialState, setLoading(true));
    expect(state.isLoading).toBe(true);

    state = reducer(state, setError("fail"));
    expect(state.error).toBe("fail");
    expect(state.isLoading).toBe(false);
  });

  it("setCategories establece la lista y limpia errores/loading", () => {
    const state = reducer(
      { ...initialState, isLoading: true, error: "err" },
      setCategories([baseCategory]),
    );
    expect(state.categories).toEqual([baseCategory]);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it("addCategory agrega al inicio", () => {
    const another = { ...baseCategory, id: "c2", name: "Home" };
    const state = reducer(
      { ...initialState, categories: [another] },
      addCategory(baseCategory),
    );
    expect(state.categories[0]).toEqual(baseCategory);
    expect(state.categories[1]).toEqual(another);
    expect(state.error).toBeNull();
  });

  it("updateCategory actualiza la categoria existente", () => {
    const state = reducer(
      { ...initialState, categories: [baseCategory] },
      updateCategory({ id: "c1", name: "Updated" }),
    );
    expect(state.categories[0].name).toBe("Updated");
  });

  it("deleteCategory elimina y limpia selectedCategoryId", () => {
    const populated: CategoriesState = {
      ...initialState,
      categories: [baseCategory],
      selectedCategoryId: "c1",
    };
    const state = reducer(populated, deleteCategory("c1"));
    expect(state.categories).toHaveLength(0);
    expect(state.selectedCategoryId).toBeNull();
  });

  it("setSelectedCategory selecciona id", () => {
    const state = reducer(initialState, setSelectedCategory("c1"));
    expect(state.selectedCategoryId).toBe("c1");
  });

  it("gestiona shares: add, update, remove", () => {
    let state = reducer(
      { ...initialState, categories: [{ ...baseCategory, shares: [] }] },
      addCategoryShare({ categoryId: "c1", share: shared }),
    );
    expect(state.categories[0].shares).toEqual([shared]);

    const updatedShare = { ...shared, permission: "EDIT" };
    state = reducer(
      state,
      updateCategoryShare({ categoryId: "c1", share: updatedShare }),
    );
    expect(state.categories[0].shares[0]).toEqual(updatedShare);

    state = reducer(
      state,
      removeCategoryShare({ categoryId: "c1", shareId: "s1" }),
    );
    expect(state.categories[0].shares).toHaveLength(0);
  });

  it("resetCategoriesState devuelve al estado inicial", () => {
    const mutated: CategoriesState = {
      categories: [baseCategory],
      selectedCategoryId: "c1",
      isLoading: true,
      error: "x",
    };
    const state = reducer(mutated, resetCategoriesState());
    expect(state).toEqual(initialState);
  });
});

describe("categoriesSlice selectors", () => {
  const withState = (categoriesState: CategoriesState) => ({
    categories: categoriesState,
  });

  it("selectCategories y selectSelectedCategory", () => {
    const state = withState({
      ...initialState,
      categories: [baseCategory],
      selectedCategoryId: "c1",
    });
    expect(selectCategories(state)).toEqual([baseCategory]);
    expect(selectSelectedCategory(state)).toEqual(baseCategory);
  });

  it("selectCategoriesByListId filtra por listId", () => {
    const state = withState({
      ...initialState,
      categories: [baseCategory, { ...baseCategory, id: "c2", listId: "l2" }],
    });
    expect(selectCategoriesByListId("l1")(state)).toHaveLength(1);
    expect(selectCategoriesByListId("l2")(state)).toHaveLength(1);
  });
});
