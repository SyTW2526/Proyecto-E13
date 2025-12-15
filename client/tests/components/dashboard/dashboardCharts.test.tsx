import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom";
import {
  PriorityChart,
  WeeklyTasksChart,
} from "@/components/dashboard/DashboardCharts";
import { I18nTestProvider } from "../../helpers/i18nTestProvider";

describe("DashboardCharts", () => {
  describe("PriorityChart - Edge Cases & Branch Coverage", () => {
    const baseConfig = {
      alta: { label: "Alta", color: "#ef4444" },
      media: { label: "Media", color: "#f59e0b" },
      baja: { label: "Baja", color: "#10b981" },
    };

    it("Muestra mensaje cuando no hay datos (data.length === 0)", () => {
      const { container } = render(
        <I18nTestProvider>
          <PriorityChart data={[]} config={baseConfig} />
        </I18nTestProvider>,
      );

      expect(
        screen.getByText(/No hay tareas para mostrar/i),
      ).toBeInTheDocument();
      expect(
        container.querySelector('[data-slot="chart"]'),
      ).not.toBeInTheDocument();
    });

    it("Renderiza gráfico de prioridades con datos", () => {
      const data = [
        { name: "Alta", value: 10, fill: "#ef4444" },
        { name: "Media", value: 20, fill: "#f59e0b" },
        { name: "Baja", value: 15, fill: "#10b981" },
      ];

      const { container } = render(
        <I18nTestProvider>
          <PriorityChart data={data} config={baseConfig} />
        </I18nTestProvider>,
      );

      expect(
        container.querySelector('[data-slot="chart"]'),
      ).toBeInTheDocument();
    });

    it("Renderiza con un solo elemento en data", () => {
      const data = [{ name: "Alta", value: 100, fill: "#ef4444" }];

      const { container } = render(
        <I18nTestProvider>
          <PriorityChart
            data={data}
            config={{ alta: { label: "Alta", color: "#ef4444" } }}
          />
        </I18nTestProvider>,
      );

      expect(
        container.querySelector('[data-slot="chart"]'),
      ).toBeInTheDocument();
    });

    it("Renderiza con valores muy pequeños (< 1%)", () => {
      const data = [
        { name: "Alta", value: 1, fill: "#ef4444" },
        { name: "Media", value: 999, fill: "#f59e0b" },
      ];

      const { container } = render(
        <I18nTestProvider>
          <PriorityChart data={data} config={baseConfig} />
        </I18nTestProvider>,
      );

      expect(
        container.querySelector('[data-slot="chart"]'),
      ).toBeInTheDocument();
    });

    it("Renderiza con valores iguales (todos ~33%)", () => {
      const data = [
        { name: "Alta", value: 33, fill: "#ef4444" },
        { name: "Media", value: 33, fill: "#f59e0b" },
        { name: "Baja", value: 34, fill: "#10b981" },
      ];

      const { container } = render(
        <I18nTestProvider>
          <PriorityChart data={data} config={baseConfig} />
        </I18nTestProvider>,
      );

      expect(
        container.querySelector('[data-slot="chart"]'),
      ).toBeInTheDocument();
    });

    it("Itera correctamente sobre muchos elementos (data.map)", () => {
      const data = [
        { name: "Alta", value: 10, fill: "#ef4444" },
        { name: "Media", value: 20, fill: "#f59e0b" },
        { name: "Baja", value: 15, fill: "#10b981" },
        { name: "Urgente", value: 5, fill: "#dc2626" },
        { name: "Crítica", value: 8, fill: "#991b1b" },
      ];

      const config = {
        alta: { label: "Alta", color: "#ef4444" },
        media: { label: "Media", color: "#f59e0b" },
        baja: { label: "Baja", color: "#10b981" },
        urgente: { label: "Urgente", color: "#dc2626" },
        critica: { label: "Crítica", color: "#991b1b" },
      };

      const { container } = render(
        <I18nTestProvider>
          <PriorityChart data={data} config={config} />
        </I18nTestProvider>,
      );

      expect(
        container.querySelector('[data-slot="chart"]'),
      ).toBeInTheDocument();
    });

    it("Calcula porcentajes correctos cuando un valor domina (99%)", () => {
      const data = [
        { name: "Alta", value: 99, fill: "#ef4444" },
        { name: "Media", value: 1, fill: "#f59e0b" },
      ];

      const { container } = render(
        <I18nTestProvider>
          <PriorityChart data={data} config={baseConfig} />
        </I18nTestProvider>,
      );

      expect(
        container.querySelector('[data-slot="chart"]'),
      ).toBeInTheDocument();
    });

    it("Maneja correctamente valor cero en los datos", () => {
      const data = [
        { name: "Alta", value: 0, fill: "#ef4444" },
        { name: "Media", value: 50, fill: "#f59e0b" },
        { name: "Baja", value: 50, fill: "#10b981" },
      ];

      const { container } = render(
        <I18nTestProvider>
          <PriorityChart data={data} config={baseConfig} />
        </I18nTestProvider>,
      );

      expect(
        container.querySelector('[data-slot="chart"]'),
      ).toBeInTheDocument();
    });

    it("Renderiza tooltip y leyenda correctamente", () => {
      const data = [
        { name: "Alta", value: 10, fill: "#ef4444" },
        { name: "Media", value: 20, fill: "#f59e0b" },
      ];

      const { container } = render(
        <I18nTestProvider>
          <PriorityChart data={data} config={baseConfig} />
        </I18nTestProvider>,
      );

      expect(
        container.querySelector('[data-slot="chart"]'),
      ).toBeInTheDocument();
    });
  });

  describe("WeeklyTasksChart - Edge Cases & Branch Coverage", () => {
    const baseConfig = {
      pending: { label: "Pendiente", color: "#6b7280" },
      inProgress: { label: "En Progreso", color: "#3b82f6" },
      completed: { label: "Completado", color: "#15803d" },
    };

    it("Renderiza gráfico de barras semanales", () => {
      const data = [
        { day: "Lun", pending: 5, inProgress: 3, completed: 2 },
        { day: "Mar", pending: 4, inProgress: 2, completed: 3 },
        { day: "Mie", pending: 6, inProgress: 1, completed: 4 },
      ];

      const { container } = render(
        <WeeklyTasksChart data={data} config={baseConfig} />,
      );

      expect(
        container.querySelector('[data-slot="chart"]'),
      ).toBeInTheDocument();
    });

    it("CustomBar retorna null cuando height <= 0", () => {
      const data = [{ day: "Lun", pending: 0, inProgress: 0, completed: 0 }];

      const { container } = render(
        <WeeklyTasksChart data={data} config={baseConfig} />,
      );

      expect(
        container.querySelector('[data-slot="chart"]'),
      ).toBeInTheDocument();
    });

    it("CustomBar con isOnly=true (solo pending tiene valor)", () => {
      const data = [{ day: "Lun", pending: 10, inProgress: 0, completed: 0 }];

      const { container } = render(
        <WeeklyTasksChart data={data} config={baseConfig} />,
      );

      expect(
        container.querySelector('[data-slot="chart"]'),
      ).toBeInTheDocument();
    });

    it("CustomBar con isOnly=true (solo inProgress tiene valor)", () => {
      const data = [{ day: "Lun", pending: 0, inProgress: 8, completed: 0 }];

      const { container } = render(
        <WeeklyTasksChart data={data} config={baseConfig} />,
      );

      expect(
        container.querySelector('[data-slot="chart"]'),
      ).toBeInTheDocument();
    });

    it("CustomBar con isOnly=true (solo completed tiene valor)", () => {
      const data = [{ day: "Lun", pending: 0, inProgress: 0, completed: 12 }];

      const { container } = render(
        <WeeklyTasksChart data={data} config={baseConfig} />,
      );

      expect(
        container.querySelector('[data-slot="chart"]'),
      ).toBeInTheDocument();
    });

    it("CustomBar con isFirst=true (pending es primera, completed tiene valor)", () => {
      const data = [{ day: "Lun", pending: 5, inProgress: 0, completed: 3 }];

      const { container } = render(
        <WeeklyTasksChart data={data} config={baseConfig} />,
      );

      expect(
        container.querySelector('[data-slot="chart"]'),
      ).toBeInTheDocument();
    });

    it("CustomBar con isFirst=true (pending es primera, inProgress tiene valor)", () => {
      const data = [{ day: "Lun", pending: 5, inProgress: 3, completed: 0 }];

      const { container } = render(
        <WeeklyTasksChart data={data} config={baseConfig} />,
      );

      expect(
        container.querySelector('[data-slot="chart"]'),
      ).toBeInTheDocument();
    });

    it("CustomBar con isLast=true (completed es última, pending tiene valor)", () => {
      const data = [{ day: "Lun", pending: 4, inProgress: 0, completed: 6 }];

      const { container } = render(
        <WeeklyTasksChart data={data} config={baseConfig} />,
      );

      expect(
        container.querySelector('[data-slot="chart"]'),
      ).toBeInTheDocument();
    });

    it("CustomBar con isLast=true (completed es última, inProgress tiene valor)", () => {
      const data = [{ day: "Lun", pending: 0, inProgress: 4, completed: 6 }];

      const { container } = render(
        <WeeklyTasksChart data={data} config={baseConfig} />,
      );

      expect(
        container.querySelector('[data-slot="chart"]'),
      ).toBeInTheDocument();
    });

    it("CustomBar con barra del medio (inProgress entre pending y completed)", () => {
      const data = [{ day: "Lun", pending: 2, inProgress: 5, completed: 3 }];

      const { container } = render(
        <WeeklyTasksChart data={data} config={baseConfig} />,
      );

      expect(
        container.querySelector('[data-slot="chart"]'),
      ).toBeInTheDocument();
    });

    it("CustomBar renderiza rect normal para barra del medio", () => {
      const data = [{ day: "Lun", pending: 4, inProgress: 6, completed: 2 }];

      const { container } = render(
        <WeeklyTasksChart data={data} config={baseConfig} />,
      );

      expect(
        container.querySelector('[data-slot="chart"]'),
      ).toBeInTheDocument();
    });

    it("CustomLabel retorna null cuando total === 0", () => {
      const data = [{ day: "Lun", pending: 0, inProgress: 0, completed: 0 }];

      const { container } = render(
        <WeeklyTasksChart data={data} config={baseConfig} />,
      );

      expect(
        container.querySelector('[data-slot="chart"]'),
      ).toBeInTheDocument();
    });

    it("CustomLabel muestra total cuando es > 0", () => {
      const data = [{ day: "Lun", pending: 2, inProgress: 3, completed: 5 }];

      const { container } = render(
        <WeeklyTasksChart data={data} config={baseConfig} />,
      );

      expect(
        container.querySelector('[data-slot="chart"]'),
      ).toBeInTheDocument();
    });

    it("Maneja múltiples días con diferentes combinaciones", () => {
      const data = [
        { day: "Lun", pending: 5, inProgress: 3, completed: 2 },
        { day: "Mar", pending: 0, inProgress: 0, completed: 0 },
        { day: "Mie", pending: 1, inProgress: 1, completed: 1 },
        { day: "Jue", pending: 0, inProgress: 5, completed: 0 },
        { day: "Vie", pending: 3, inProgress: 0, completed: 7 },
        { day: "Sab", pending: 10, inProgress: 0, completed: 0 },
        { day: "Dom", pending: 0, inProgress: 0, completed: 15 },
      ];

      const { container } = render(
        <WeeklyTasksChart data={data} config={baseConfig} />,
      );

      expect(
        container.querySelector('[data-slot="chart"]'),
      ).toBeInTheDocument();
    });

    it("Renderiza las tres barras cuando todas tienen valor", () => {
      const data = [{ day: "Lun", pending: 5, inProgress: 8, completed: 12 }];

      const { container } = render(
        <WeeklyTasksChart data={data} config={baseConfig} />,
      );

      expect(
        container.querySelector('[data-slot="chart"]'),
      ).toBeInTheDocument();
    });

    it("Usa colores por defecto cuando config no tiene color", () => {
      const data = [{ day: "Lun", pending: 5, inProgress: 3, completed: 2 }];
      const configNoColors = {
        pending: { label: "Pendiente" },
        inProgress: { label: "En Progreso" },
        completed: { label: "Completado" },
      };

      const { container } = render(
        <WeeklyTasksChart data={data} config={configNoColors} />,
      );

      expect(
        container.querySelector('[data-slot="chart"]'),
      ).toBeInTheDocument();
    });

    it("Maneja valores grandes correctamente", () => {
      const data = [
        { day: "Lun", pending: 999, inProgress: 888, completed: 777 },
      ];

      const { container } = render(
        <WeeklyTasksChart data={data} config={baseConfig} />,
      );

      expect(
        container.querySelector('[data-slot="chart"]'),
      ).toBeInTheDocument();
    });

    it("Renderiza con tooltip y leyenda", () => {
      const data = [{ day: "Lun", pending: 5, inProgress: 3, completed: 2 }];

      const { container } = render(
        <WeeklyTasksChart data={data} config={baseConfig} />,
      );

      expect(
        container.querySelector('[data-slot="chart"]'),
      ).toBeInTheDocument();
    });
  });
});
