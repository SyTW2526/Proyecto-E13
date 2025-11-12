import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  IconClipboard,
  IconBell,
  IconFolder,
  IconPalette,
  IconRocket,
} from "@tabler/icons-react";
import FeatureCard from "@/components/ui/featureCard";

const cards = [
  {
    icon: IconClipboard,
    title: "Gestión de Tareas",
    description:
      "Organiza tus tareas de forma intuitiva con nuestro sistema de grids",
    details:
      "Crea, edita y completa tareas fácilmente. Mantén el control de todo lo que necesitas hacer con una interfaz limpia y moderna.",
    span: "md:col-span-2",
  },
  {
    icon: IconBell,
    title: "Notificaciones",
    description: "Mantente al día con recordatorios",
    details:
      "Recibe notificaciones oportunas para no olvidar tus tareas importantes.",
  },
  {
    icon: IconFolder,
    title: "Categorías",
    description: "Organiza por proyectos",
    details:
      "Agrupa tus tareas en categorías personalizadas para mejor organización.",
  },
  {
    icon: IconPalette,
    title: "Personalización",
    description: "Modo claro y oscuro",
    details:
      "Elige el tema que más te guste. Trabaja cómodamente tanto de día como de noche con nuestro sistema de temas adaptable.",
  },
  {
    icon: IconRocket,
    title: "Comienza Ahora",
    description: "Es gratis y solo toma un minuto",
    details:
      "Regístrate y comienza a usar TaskGrid en cuestión de minutos. No se requiere tarjeta de crédito.",
  },
];

export default function LandingPage() {
  return (
    <div className="max-h-screen">
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
          {cards.map((card, index) => (
            <FeatureCard
              key={index}
              icon={card.icon}
              title={card.title}
              description={card.description}
              className={`hover:shadow-lg transition-shadow ${card.span}`}
            >
              <p className="text-sm text-muted-foreground">{card.details}</p>
            </FeatureCard>
          ))}
        </div>
      </div>
    </div>
  );
}
