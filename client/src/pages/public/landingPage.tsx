import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { landingCards } from "@/config/landingCards";
import FeatureCard from "@/components/ui/featureCard";

export default function LandingPage() {
  return (
    // <div className="min-h-screen">
    <div className="container mx-auto p-6 text-center">
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
        {landingCards.map((card, index) => (
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
    // </div>
  );
}
