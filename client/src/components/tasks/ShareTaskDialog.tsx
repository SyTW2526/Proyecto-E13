import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Icon from "@/components/ui/icon";
import { useTasks } from "@/hooks/useTasks";
import type { Task } from "@/types/tasks-system/task";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ShareTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task;
}

export default function ShareTaskDialog({
  open,
  onOpenChange,
  task,
}: ShareTaskDialogProps) {
  const { shareTask, removeShare, updateShare, isLoading } = useTasks();
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState<string>("VIEW");
  const [error, setError] = useState<string | null>(null);
  const [collaboratorToRemove, setCollaboratorToRemove] = useState<
    string | null
  >(null);

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      setError(null);
      await shareTask(task.id, email, permission);
      setEmail("");
    } catch (err) {
      setError("Error al compartir la tarea. Verifica el email.");
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartir Tarea</DialogTitle>
          <DialogDescription>
            Invita a otros usuarios a colaborar en esta tarea via email.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted/30 p-4 rounded-lg border border-border/50 mt-4">
          <h4 className="text-sm font-medium mb-3">Invitar colaborador</h4>
          <form
            onSubmit={handleShare}
            className="flex flex-col sm:flex-row items-end gap-3"
          >
            <div className="grid gap-1.5 flex-1 w-full">
              <Input
                id="email"
                placeholder="ejemplo@correo.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background"
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Select value={permission} onValueChange={setPermission}>
                <SelectTrigger className="w-[110px] bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VIEW">Ver</SelectItem>
                  <SelectItem value="EDIT">Editar</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 sm:w-auto shrink-0"
              >
                {isLoading ? (
                  <Icon as="IconLoader2" className="animate-spin" />
                ) : (
                  "Invitar"
                )}
              </Button>
            </div>
          </form>
        </div>

        {error && <p className="text-sm text-destructive mt-2">{error}</p>}

        <div className="mt-6 space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground">
            Personas con acceso
          </h4>
          <div className="space-y-3">
            {task.shares?.length === 0 && (
              <p className="text-sm text-muted-foreground italic">
                Esta tarea no se ha compartido con nadie aún.
              </p>
            )}
            {task.shares?.map((share) => (
              <div
                key={share.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 border border-border/50">
                    <AvatarImage src={share.user?.image || ""} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {share.user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium leading-none">
                      {share.user?.name}
                    </span>
                    <span className="text-xs text-muted-foreground mt-1">
                      {share.user?.email}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end pl-12 sm:pl-0">
                  <Select
                    value={share.permission}
                    onValueChange={(value) =>
                      updateShare(task.id, share.userId, value)
                    }
                  >
                    <SelectTrigger className="h-8 w-[100px] text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VIEW">Ver</SelectItem>
                      <SelectItem value="EDIT">Editar</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setCollaboratorToRemove(share.userId)}
                  >
                    <Icon as="IconTrash" className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>

      <AlertDialog
        open={!!collaboratorToRemove}
        onOpenChange={(open) => !open && setCollaboratorToRemove(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará al colaborador de la tarea.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (collaboratorToRemove) {
                  removeShare(task.id, collaboratorToRemove);
                  setCollaboratorToRemove(null);
                }
              }}
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
