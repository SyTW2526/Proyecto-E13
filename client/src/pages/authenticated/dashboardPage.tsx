import { useAuth } from "@/hooks/useAuth";
import { dashboardCards } from "@/config/dashboardCards";
import FeatureCard from "@/components/ui/featureCard";
import { IconUser } from "@tabler/icons-react";
import Icon from "@/components/ui/icon";

export default function DashboardPage() {
  const { user } = useAuth();
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            ¡Bienvenido, {user?.name || "Usuario"}!{" "}
            <Icon as={IconUser} size={26} className="inline-block" />
          </h1>
          <p className="text-muted-foreground">
            Aquí está el resumen de tus tareas
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-3 gap-6">
        {dashboardCards.map((card, index) => (
          <FeatureCard
            key={index}
            icon={card.icon}
            title={card.title}
            description={card.description}
            bigDetails={card.bigDetails}
            details={card.details}
            className={`hover:shadow-lg transition-shadow ${card.span}`}
          />
        ))}
      </div>
    </div>
  );
}
