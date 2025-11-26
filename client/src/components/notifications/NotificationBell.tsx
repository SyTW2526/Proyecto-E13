import { useMemo, useState } from "react";
import { Bell, Circle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

type NotificationTab = "general" | "mentions" | "inbox" | "files";

export interface Notification {
  id: string;
  tab: NotificationTab;
  actor: string;
  title: string;
  description: string;
  createdAt: string; // texto tipo "Hace 2 horas"
  read: boolean;
}

/**
 * Datos de ejemplo.
 * Se deben sustituir por datos reales desde la API.
 */
const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    tab: "general",
    actor: "alu0101xxxxx1",
    title: "Compartió archivos",
    description: "alu0101xxxxx1 compartió 2 archivos en TaskGrid",
    createdAt: "Hace 2 horas",
    read: false,
  },
  {
    id: "2",
    tab: "mentions",
    actor: "alu0101xxxxx2",
    title: "Nueva mención",
    description: "alu0101xxxxx2 comentó y te mencionó en una tarea",
    createdAt: "Hace 3 horas",
    read: false,
  },
  {
    id: "3",
    tab: "inbox",
    actor: "alu0101xxxxx3",
    title: "Solicitud de acceso",
    description: "alu0101xxxxx3 pidió acceso a una lista en TaskGrid",
    createdAt: "Hace 6 horas",
    read: true,
  },
  {
    id: "4",
    tab: "files",
    actor: "alu0101xxxxx2",
    title: "Actualización de archivo",
    description: "alu0101xxxxx2 actualizó un archivo asociado a tu tarea",
    createdAt: "Hace 10 horas",
    read: true,
  },
];

const TAB_LABELS: Record<NotificationTab, string> = {
  general: "General",
  mentions: "Menciones",
  inbox: "Buzón",
  files: "Archivos",
};

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<NotificationTab>("general");
  const [notifications, setNotifications] = useState<Notification[]>(
    INITIAL_NOTIFICATIONS,
  );

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  const hasUnread = unreadCount > 0;

  const filteredNotifications = useMemo(
    () => notifications.filter((n) => n.tab === activeTab),
    [notifications, activeTab],
  );

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full"
          aria-label="Abrir notificaciones"
        >
          <Bell className="h-5 w-5" />
          {hasUnread && (
            <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3 items-center justify-center">
              <span className="h-2.5 w-2.5 rounded-full border border-background bg-red-500" />
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[380px] p-0 shadow-lg" align="end">
        <Card className="border-0">
          {/* Cabecera */}
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Notificaciones</span>
              <span className="text-xs text-muted-foreground">
                {unreadCount > 0
                  ? `${unreadCount} sin leer`
                  : "Todo al día por ahora"}
              </span>
            </div>
            {hasUnread && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={handleMarkAllRead}
              >
                Marcar todo como leído
              </Button>
            )}
          </div>

          {/* Pestañas */}
          <div className="flex gap-1 border-b px-2 py-2 text-xs font-medium">
            {(Object.keys(TAB_LABELS) as NotificationTab[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={[
                  "flex flex-1 items-center justify-center rounded-full px-2 py-1 transition-colors",
                  activeTab === tab
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80",
                ].join(" ")}
              >
                <span>{TAB_LABELS[tab]}</span>
                {tab === "general" && hasUnread && (
                  <Circle className="ml-1 h-2 w-2 fill-primary-foreground text-primary-foreground" />
                )}
              </button>
            ))}
          </div>

          {/* Lista de notificaciones */}
          <div className="max-h-80 space-y-1 overflow-y-auto px-2 py-2">
            {filteredNotifications.length === 0 ? (
              <div className="px-3 py-6 text-center text-xs text-muted-foreground">
                No hay notificaciones en esta pestaña.
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => handleMarkAsRead(notification.id)}
                  className={[
                    "flex w-full items-start gap-3 rounded-xl px-3 py-2 text-left transition-colors",
                    notification.read
                      ? "bg-background hover:bg-muted/60"
                      : "bg-violet-50 hover:bg-violet-100 dark:bg-violet-950/30 dark:hover:bg-violet-900/50",
                  ].join(" ")}
                >
                  <Avatar className="mt-0.5 h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {notification.actor.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex flex-1 flex-col gap-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold">
                        {notification.actor}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {notification.createdAt}
                      </span>
                    </div>

                    <p className="text-xs font-medium">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {notification.description}
                    </p>

                    <div className="mt-1 flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="h-5 rounded-full px-2 text-[10px] uppercase tracking-wide"
                      >
                        {TAB_LABELS[notification.tab]}
                      </Badge>
                      {!notification.read && (
                        <span className="flex h-1.5 w-1.5 rounded-full bg-primary" />
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          <Separator className="mt-1" />

          {/* Pie del popup */}
          <div className="flex items-center justify-between px-4 py-2.5">
            <span className="text-[11px] text-muted-foreground">
              Centro de actividad de TaskGrid
            </span>
            <Button variant="ghost" size="sm" className="text-xs">
              Ver todas
            </Button>
          </div>
        </Card>
      </PopoverContent>
    </Popover>
  );
}

export default NotificationBell;
