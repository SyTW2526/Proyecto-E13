// import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
// import { logout, selectUser } from "@/store/slices/authSlice";
// import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/useRedux";
import { selectUser } from "@/store/slices/authSlice";
import { dashboardCards } from "@/config/dashboardCards";
import FeatureCard from "@/components/ui/featureCard";
// import { Button } from "@/components/ui/button";
import { IconUser } from "@tabler/icons-react";
import Icon from "@/components/ui/icon";

export default function DashboardPage() {
  const user = useAppSelector(selectUser);
  // const dispatch = useAppDispatch();
  // const navigate = useNavigate();
  // const handleLogout = () => {
  //   dispatch(logout());
  //   navigate("/", { replace: true });
  // };
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
        {/* <Button variant="outline" onClick={handleLogout} className="gap-2">
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
        </Button> */}
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
