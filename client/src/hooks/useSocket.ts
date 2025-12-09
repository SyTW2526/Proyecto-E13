import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../socket";
import { AppDispatch, RootState } from "../store/store";
import {
  taskAdded,
  taskUpdated,
  taskDeleted,
} from "../store/slices/tasksSlice";
import {
  listUpdated,
  listCreated,
  listDeleted,
} from "../store/slices/listsSlice";
import { notificationAdded } from "../store/slices/notificationsSlice";
import { Task } from "@/types/tasks-system/task";
import { List } from "@/types/tasks-system/list";
import { Notification } from "@/types/notification";

export const useSocket = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { lists } = useSelector((state: RootState) => state.lists);

  useEffect(() => {
    if (user) {
      socket.connect();
      socket.emit("join_user", user.id);

      socket.on("task:created", (task: Task) => {
        dispatch(taskAdded(task));
      });

      socket.on("task:updated", (task: Task) => {
        dispatch(taskUpdated(task));
      });

      socket.on("task:deleted", (taskId: string) => {
        dispatch(taskDeleted(taskId));
      });

      socket.on("list:updated", (list: List) => {
        dispatch(listUpdated(list));
      });

      socket.on("list:created", (list: List) => {
        dispatch(listCreated(list));
      });

      socket.on("list:deleted", (listId: string) => {
        dispatch(listDeleted(listId));
      });

      socket.on("list:shared", (list: List) => {
        dispatch(listCreated(list));
      });

      socket.on("list:unshared", (listId: string) => {
        dispatch(listDeleted(listId));
      });

      socket.on("notification:created", (notification: Notification) => {
        dispatch(notificationAdded(notification));
      });
    }

    return () => {
      socket.disconnect();
      socket.off("task:created");
      socket.off("task:updated");
      socket.off("task:deleted");
      socket.off("list:updated");
      socket.off("list:created");
      socket.off("list:deleted");
      socket.off("list:shared");
      socket.off("list:unshared");
      socket.off("notification:created");
    };
  }, [user, dispatch]);

  useEffect(() => {
    if (lists.length > 0) {
      lists.forEach((list) => {
        socket.emit("join_list", list.id);
      });
    }

    return () => {
      if (lists.length > 0) {
        lists.forEach((list) => {
          socket.emit("leave_list", list.id);
        });
      }
    };
  }, [lists]);
};
