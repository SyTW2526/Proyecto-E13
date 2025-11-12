import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { logout, selectUser } from "@/store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logout());
    navigate("/", { replace: true });
  };
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            ¡Bienvenido, {user?.name || "Usuario"}! 👋
          </h1>
          <p className="text-muted-foreground">
            Aquí está el resumen de tus tareas
          </p>
        </div>
        <Button variant="outline" onClick={handleLogout} className="gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Cerrar Sesión
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tareas Pendientes</CardTitle>
            <CardDescription>Por completar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">5</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Completadas</CardTitle>
            <CardDescription>Esta semana</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-600">12</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Categorías</CardTitle>
            <CardDescription>Proyectos activos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-blue-600">3</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Tareas Recientes</CardTitle>
          <CardDescription>Últimas actualizaciones</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Aquí aparecerán tus tareas más recientes...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
