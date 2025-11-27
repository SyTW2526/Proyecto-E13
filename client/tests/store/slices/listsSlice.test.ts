import { describe, expect, it } from "vitest";
import reducer, {
  createList,
  addListShare,
  deleteList,
  fetchLists,
  removeListShare,
  resetListsState,
  selectLists,
  selectListById,
  selectOwnedLists,
  selectSelectedList,
  selectSharedLists,
  setError,
  setLoading,
  setSelectedList,
  updateList,
  updateListShare,
} from "@/store/slices/listsSlice";
import type { ListsState, List, ListShare } from "@/types/tasks-system/list";

const baseList: List = {
  id: "l1",
  name: "Inbox",
  description: "default",
  createdAt: "2024-01-01",
  tasks: [],
  ownerId: "owner-1",
  shares: [],
};

const share: ListShare = {
  id: "share-1",
  permission: "VIEW",
  listId: "l1",
  userId: "user-1",
};

const initialState: ListsState = {
  lists: [],
  selectedListId: null,
  isLoading: false,
  error: null,
};

describe("listsSlice reducer", () => {
  it("setLoading y setError actualizan flags", () => {
    let state = reducer(initialState, setLoading(true));
    expect(state.isLoading).toBe(true);

    state = reducer(state, setError("oops"));
    expect(state.error).toBe("oops");
    expect(state.isLoading).toBe(false);
  });

  it("fetchLists.fulfilled reemplaza y limpia estado", () => {
    const action = {
      type: fetchLists.fulfilled.type,
      payload: [baseList],
    };
    const state = reducer(
      { ...initialState, error: "err", isLoading: true },
      action,
    );
    expect(state.lists).toEqual([baseList]);
    expect(state.error).toBeNull();
    expect(state.isLoading).toBe(false);
  });

  it("createList.fulfilled inserta al inicio y limpia error", () => {
    const another = { ...baseList, id: "l2", name: "Work" };
    const action = {
      type: createList.fulfilled.type,
      payload: baseList,
    };
    const state = reducer(
      { ...initialState, lists: [another], error: "x" },
      action,
    );
    expect(state.lists.map((l) => l.id)).toEqual(["l1", "l2"]);
    expect(state.error).toBeNull();
  });

  it("updateList.fulfilled modifica la lista encontrada", () => {
    const action = {
      type: updateList.fulfilled.type,
      payload: { ...baseList, name: "Updated" },
    };
    const state = reducer({ ...initialState, lists: [baseList] }, action);
    expect(state.lists[0].name).toBe("Updated");
  });

  it("deleteList.fulfilled elimina y limpia selectedListId", () => {
    const populated: ListsState = {
      ...initialState,
      lists: [baseList],
      selectedListId: "l1",
    };
    const action = {
      type: deleteList.fulfilled.type,
      payload: "l1",
    };
    const state = reducer(populated, action);
    expect(state.lists).toHaveLength(0);
    expect(state.selectedListId).toBeNull();
  });

  it("setSelectedList guarda el id", () => {
    const state = reducer(initialState, setSelectedList("l1"));
    expect(state.selectedListId).toBe("l1");
  });

  it("gestiona compartidos: add/update/remove", () => {
    let state = reducer(
      { ...initialState, lists: [{ ...baseList, shares: [] }] },
      addListShare({ listId: "l1", share }),
    );
    expect(state.lists[0].shares).toEqual([share]);

    const updatedShare = { ...share, permission: "EDIT" as const };
    state = reducer(
      state,
      updateListShare({ listId: "l1", share: updatedShare }),
    );
    expect(state.lists[0].shares[0]).toEqual(updatedShare);

    state = reducer(
      state,
      removeListShare({ listId: "l1", shareId: "share-1" }),
    );
    expect(state.lists[0].shares).toHaveLength(0);
  });

  it("resetListsState vuelve al estado inicial", () => {
    const dirty: ListsState = {
      lists: [baseList],
      selectedListId: "l1",
      isLoading: true,
      error: "x",
    };
    const state = reducer(dirty, resetListsState());
    expect(state).toEqual(initialState);
  });
});

describe("listsSlice selectors", () => {
  const wrap = (lists: ListsState) => ({ lists });

  it("selectLists y selectSelectedList", () => {
    const state = wrap({
      ...initialState,
      lists: [baseList],
      selectedListId: "l1",
    });
    expect(selectLists(state)).toEqual([baseList]);
    expect(selectSelectedList(state)).toEqual(baseList);
  });

  it("selectListById retorna coincidencia", () => {
    const state = wrap({
      ...initialState,
      lists: [baseList, { ...baseList, id: "l2" }],
    });
    expect(selectListById("l2")(state)?.id).toBe("l2");
  });

  it("selectOwnedLists filtra por ownerId", () => {
    const state = wrap({
      ...initialState,
      lists: [baseList, { ...baseList, id: "l2", ownerId: "owner-2" }],
    });
    expect(selectOwnedLists("owner-1")(state)).toHaveLength(1);
    expect(selectOwnedLists("owner-2")(state)).toHaveLength(1);
  });

  it("selectSharedLists devuelve listas con share del usuario", () => {
    const sharedList: List = {
      ...baseList,
      id: "l3",
      shares: [share],
    };
    const state = wrap({
      ...initialState,
      lists: [baseList, sharedList],
    });
    expect(selectSharedLists("user-1")(state)).toEqual([sharedList]);
    expect(selectSharedLists("other")(state)).toEqual([]);
  });
});
