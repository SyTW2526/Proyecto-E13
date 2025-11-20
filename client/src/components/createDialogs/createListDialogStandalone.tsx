import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useLists } from "@/hooks/useLists";
import { useAuth } from "@/hooks/useAuth";
import { taskFormLabels } from "@/config/taskConfig";
import type { List } from "@/types/list/list";

interface CreateListDialogStandaloneProps {
  children?: React.ReactNode;
}

export default function CreateListDialogStandalone({
  children,
}: CreateListDialogStandaloneProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const { createList } = useLists();
  const { user } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !user?.id) {
      return;
    }

    const newList: List = {
      id: crypto.randomUUID(),
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      ownerId: user.id,
      createdAt: new Date().toISOString(),
      categories: [],
      shares: [],
    };

    createList(newList);

    // Reset form
    setFormData({
      name: "",
      description: "",
    });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || <Button>Crear Lista</Button>}
      </DialogTrigger>
      <DialogContent className="overflow-y-auto max-h-[90vh] sm:max-w-3xl">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl">
            {taskFormLabels.createList.title}
          </DialogTitle>
          <DialogDescription>
            {taskFormLabels.createList.description}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pb-4">
          <div className="space-y-2">
            <Label htmlFor="listName">
              {taskFormLabels.fields.listName.label}{" "}
              {taskFormLabels.fields.listName.required && (
                <span className="text-red-500">*</span>
              )}
            </Label>
            <Input
              id="listName"
              placeholder={taskFormLabels.fields.listName.placeholder}
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="listDescription">
              {taskFormLabels.fields.listDescription.label}
            </Label>
            <Textarea
              id="listDescription"
              placeholder={taskFormLabels.fields.listDescription.placeholder}
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
              rows={2}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1" size="lg">
              {taskFormLabels.createList.submitButton}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              size="lg"
            >
              {taskFormLabels.createList.cancelButton}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
