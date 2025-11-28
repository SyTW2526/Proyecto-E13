import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { dashboardConfig, dashboardCards } from "@/config/dashboardConfig";
import FeatureCard from "@/components/ui/featureCard";
import Icon from "@/components/ui/icon";
import { useTasks } from "@/hooks/useTasks";
import { useLists } from "@/hooks/useLists";
import { useDashboardCharts } from "@/hooks/useDashboardCharts";
import {
  PriorityChart,
  WeeklyTasksChart,
} from "@/components/dashboard/DashboardCharts";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const { user } = useAuth();
  const { accessibleTasks, fetchAllTasks } = useTasks();
  const { accessibleLists, fetchAllLists } = useLists();

  useEffect(() => {
    fetchAllTasks();
    fetchAllLists();
  }, []);

  const {
    priorityChartData,
    priorityChartConfig,
    progressChartData,
    progressChartConfig,
    weeklyTasksData,
    weeklyTasksConfig,
    weekStats,
  } = useDashboardCharts({
    accessibleTasks,
    accessibleLists,
  });

  const cardDataMap: Record<
    string,
    {
      details?: string | number;
      chartData?: unknown;
      chartConfig?: unknown;
      chartComponent?: React.ReactNode;
    }
  > = {
    "Tareas Pendientes": { details: weekStats.pendingTasks },
    "Tareas Completadas": { details: weekStats.completedTasks },
    "Próximas Tareas": { details: weekStats.upcomingTasks },
    "Tareas Por Lista": {
      chartComponent: (
        <div className="flex flex-wrap gap-2">
          {weekStats.tasksPerList.length > 0 ? (
            weekStats.tasksPerList.map((item, index) => (
              <Badge key={index} variant="outline" className="text-sm">{item.listName}: {item.count} tareas</Badge>
            ))
          ) : (
            <span className="text-gray-500 dark:text-gray-400">Sin tareas</span>
          )}
        </div>
      ),
    },
    "Tareas Por Prioridad": {
      chartComponent: (
        <PriorityChart data={priorityChartData} config={priorityChartConfig} />
      ),
    },
    "Tareas Por Estado": {
      chartComponent: (
        <PriorityChart data={progressChartData} config={progressChartConfig} />
      ),
    },
    "Semana Actual": {
      chartComponent: (
        <WeeklyTasksChart data={weeklyTasksData} config={weeklyTasksConfig} />
      ),
    },
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            {dashboardConfig.welcome}
            {user?.name || "Usuario"}!{" "}
            <Icon as="IconUser" size={26} className="inline-block" />
          </h1>
          <p className="text-muted-foreground">
            {dashboardConfig.description} - {weekStats.weekNumber}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-3 gap-6">
        {dashboardCards.map((card, index) => {
          const cardData = cardDataMap[card.title] || {};
          const details = String(cardData.details ?? card.details ?? "");

          return (
            <FeatureCard
              key={index}
              icon={card.icon}
              title={card.title}
              description={card.description}
              bigDetails={card.bigDetails}
              chart={card.chart}
              details={details}
              className={`hover:shadow-lg transition-shadow ${card.span}`}
            >
              {cardData.chartComponent}
            </FeatureCard>
          );
        })}
      </div>
    </div>
  );
}
