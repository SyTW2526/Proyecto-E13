import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">
          Bienvenido a <span className="text-primary">TaskGrid</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Organiza tus tareas de manera eficiente y mejora tu productividad
        </p>

        <div className="flex gap-4 justify-center mb-16">
          <Link to="/login">
            <Button size="lg" className="text-lg px-8">
              Iniciar Sesión
            </Button>
          </Link>
          <Link to="/register">
            <Button size="lg" variant="outline" className="text-lg px-8">
              Registrarse
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="md:col-span-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="text-4xl mb-2">📋</div>
              <CardTitle>Gestión de Tareas</CardTitle>
              <CardDescription>
                Organiza tus tareas de forma intuitiva con nuestro sistema de
                grids
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Crea, edita y completa tareas fácilmente. Mantén el control de
                todo lo que necesitas hacer con una interfaz limpia y moderna.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="text-4xl mb-2">🔔</div>
              <CardTitle>Notificaciones</CardTitle>
              <CardDescription>
                Mantente al día con recordatorios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Recibe notificaciones oportunas para no olvidar tus tareas
                importantes.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="text-4xl mb-2">📁</div>
              <CardTitle>Categorías</CardTitle>
              <CardDescription>Organiza por proyectos</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Agrupa tus tareas en categorías personalizadas para mejor
                organización.
              </p>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="text-4xl mb-2">🎨</div>
              <CardTitle>Personalización</CardTitle>
              <CardDescription>Modo claro y oscuro</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Elige el tema que más te guste. Trabaja cómodamente tanto de día
                como de noche con nuestro sistema de temas adaptable.
              </p>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="text-4xl mb-2">🚀</div>
              <CardTitle>Comienza Ahora</CardTitle>
              <CardDescription>Es gratis y solo toma un minuto</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Únete a miles de usuarios que ya están mejorando su
                productividad con TaskGrid.
              </p>
              <div className="flex gap-4 justify-center">
                <Link to="/register">
                  <Button>Crear Cuenta Gratis</Button>
                </Link>
                <Link to="/login">
                  <Button variant="ghost">¿Ya tienes cuenta?</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
