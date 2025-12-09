import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./useRedux";
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  selectNotifications,
  selectNotificationsLoading,
  selectNotificationsError,
  selectUnreadCount,
} from "@/store/slices/notificationsSlice";
import type { NotificationType } from "@/types/notification";

export function useNotifications() {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(selectNotifications);
  const loading = useAppSelector(selectNotificationsLoading);
  const error = useAppSelector(selectNotificationsError);
  const unreadCount = useAppSelector(selectUnreadCount);

  /**
   * Cargar notificaciones desde la API
   */
  const loadNotifications = useCallback(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  /**
   * Cargar notificaciones al montar el componente
   */
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  /**
   * Marcar una notificación como leída
   */
  const markAsRead = useCallback(
    async (notificationId: string) => {
      await dispatch(markNotificationAsRead(notificationId)).unwrap();
    },
    [dispatch],
  );

  /**
   * Marcar todas las notificaciones como leídas
   */
  const markAllAsRead = useCallback(async () => {
    await dispatch(markAllNotificationsAsRead()).unwrap();
  }, [dispatch]);

  /**
   * Filtrar notificaciones por tipo
   */
  const getNotificationsByType = useCallback(
    (type: NotificationType) => {
      return notifications.filter((n) => n.type === type);
    },
    [notifications],
  );

  return {
    notifications,
    loading,
    error,
    unreadCount,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    getNotificationsByType,
  };
}
