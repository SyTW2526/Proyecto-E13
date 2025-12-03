import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { render } from "@testing-library/react";
import { Bar, BarChart, Cell, Pie, PieChart } from "recharts";
import { describe, expect, it } from "vitest";

describe("Chart", () => {
  const mockConfig = {
    alta: { label: "Alta", color: "#ef4444" },
    media: { label: "Media", color: "#f59e0b" },
    baja: { label: "Baja", color: "#10b981" },
  };

  const mockData = [
    { name: "Alta", value: 10, fill: "#ef4444" },
    { name: "Media", value: 20, fill: "#f59e0b" },
    { name: "Baja", value: 15, fill: "#10b981" },
  ];

  describe("ChartContainer", () => {
    it("Renderiza el contenedor de gráfico", () => {
      const { container } = render(
        <ChartContainer config={mockConfig}>
          <BarChart data={mockData}>
            <Bar dataKey="value" />
          </BarChart>
        </ChartContainer>,
      );

      const chartElement = container.querySelector('[data-slot="chart"]');
      expect(chartElement).toBeInTheDocument();
    });

    it("Aplica el ID personalizado al gráfico", () => {
      const { container } = render(
        <ChartContainer config={mockConfig} id="test-chart">
          <PieChart>
            <Pie data={mockData} dataKey="value" />
          </PieChart>
        </ChartContainer>,
      );

      const chartElement = container.querySelector(
        '[data-chart="chart-test-chart"]',
      );
      expect(chartElement).toBeInTheDocument();
    });

    it("Aplica clases personalizadas", () => {
      const { container } = render(
        <ChartContainer config={mockConfig} className="custom-class">
          <BarChart data={mockData}>
            <Bar dataKey="value" />
          </BarChart>
        </ChartContainer>,
      );

      const chartElement = container.querySelector(".custom-class");
      expect(chartElement).toBeInTheDocument();
    });

    it("Renderiza gráfico de barras completo", () => {
      const { container } = render(
        <ChartContainer config={mockConfig}>
          <BarChart data={mockData}>
            <Bar dataKey="value" />
          </BarChart>
        </ChartContainer>,
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it("Renderiza gráfico circular con celdas", () => {
      const { container } = render(
        <ChartContainer config={mockConfig}>
          <PieChart>
            <Pie data={mockData} dataKey="value">
              {mockData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>,
      );

      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe("ChartStyle", () => {
    it("Genera estilos CSS para la configuración del gráfico", () => {
      const { container } = render(
        <ChartStyle id="test-chart" config={mockConfig} />,
      );

      const styleElement = container.querySelector("style");
      expect(styleElement).toBeInTheDocument();
      expect(styleElement?.innerHTML).toContain("--color-alta");
      expect(styleElement?.innerHTML).toContain("--color-media");
      expect(styleElement?.innerHTML).toContain("--color-baja");
    });

    it("No renderiza nada cuando no hay colores en la configuración", () => {
      const emptyConfig = {
        test: { label: "Test" },
      };

      const { container } = render(
        <ChartStyle id="test-chart" config={emptyConfig} />,
      );

      expect(container.firstChild).toBeNull();
    });

    it("Genera estilos para temas claro y oscuro", () => {
      const themedConfig = {
        primary: {
          label: "Primario",
          theme: {
            light: "#3b82f6",
            dark: "#60a5fa",
          },
        },
      };

      const { container } = render(
        <ChartStyle id="themed-chart" config={themedConfig} />,
      );

      const styleElement = container.querySelector("style");
      expect(styleElement?.innerHTML).toContain("--color-primary");
      expect(styleElement?.innerHTML).toContain("#3b82f6");
      expect(styleElement?.innerHTML).toContain("#60a5fa");
      expect(styleElement?.innerHTML).toContain(".dark");
    });

    it("Maneja configuración con solo color (sin theme)", () => {
      const colorOnlyConfig = {
        success: { label: "Éxito", color: "#10b981" },
      };

      const { container } = render(
        <ChartStyle id="color-chart" config={colorOnlyConfig} />,
      );

      const styleElement = container.querySelector("style");
      expect(styleElement?.innerHTML).toContain("--color-success");
      expect(styleElement?.innerHTML).toContain("#10b981");
    });

    it("Filtra entradas sin color ni theme", () => {
      const mixedConfig = {
        withColor: { label: "Con Color", color: "#ef4444" },
        withoutColor: { label: "Sin Color" },
      };

      const { container } = render(
        <ChartStyle id="mixed-chart" config={mixedConfig} />,
      );

      const styleElement = container.querySelector("style");
      expect(styleElement?.innerHTML).toContain("--color-withColor");
      expect(styleElement?.innerHTML).not.toContain("--color-withoutColor");
    });
  });

  describe("ChartTooltipContent", () => {
    it("Renderiza el tooltip con datos activos", () => {
      const payload = [
        {
          dataKey: "value",
          name: "Valor",
          value: 100,
          color: "#3b82f6",
          payload: {},
        },
      ];

      const { container } = render(
        <ChartContainer config={mockConfig}>
          <BarChart data={mockData}>
            <Bar dataKey="value" />
            <ChartTooltip
              content={<ChartTooltipContent active={true} payload={payload} />}
            />
          </BarChart>
        </ChartContainer>,
      );

      expect(container).toBeInTheDocument();
    });

    it("No renderiza cuando no está activo", () => {
      const { container } = render(
        <ChartContainer config={mockConfig}>
          <BarChart data={mockData}>
            <Bar dataKey="value" />
            <ChartTooltip
              content={<ChartTooltipContent active={false} payload={[]} />}
            />
          </BarChart>
        </ChartContainer>,
      );

      expect(container).toBeInTheDocument();
    });

    it("Renderiza con indicador tipo línea", () => {
      const payload = [
        {
          dataKey: "value",
          name: "Valor",
          value: 50,
          color: "#10b981",
          payload: {},
        },
      ];

      const { container } = render(
        <ChartContainer config={mockConfig}>
          <BarChart data={mockData}>
            <Bar dataKey="value" />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  active={true}
                  payload={payload}
                  indicator="line"
                />
              }
            />
          </BarChart>
        </ChartContainer>,
      );

      expect(container).toBeInTheDocument();
    });

    it("Renderiza con indicador tipo dashed", () => {
      const payload = [
        {
          dataKey: "value",
          name: "Valor",
          value: 75,
          color: "#f59e0b",
          payload: {},
        },
      ];

      const { container } = render(
        <ChartContainer config={mockConfig}>
          <BarChart data={mockData}>
            <Bar dataKey="value" />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  active={true}
                  payload={payload}
                  indicator="dashed"
                />
              }
            />
          </BarChart>
        </ChartContainer>,
      );

      expect(container).toBeInTheDocument();
    });

    it("Oculta el indicador cuando hideIndicator es true", () => {
      const payload = [
        {
          dataKey: "value",
          name: "Valor",
          value: 30,
          color: "#ef4444",
          payload: {},
        },
      ];

      const { container } = render(
        <ChartContainer config={mockConfig}>
          <BarChart data={mockData}>
            <Bar dataKey="value" />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  active={true}
                  payload={payload}
                  hideIndicator={true}
                />
              }
            />
          </BarChart>
        </ChartContainer>,
      );

      expect(container).toBeInTheDocument();
    });

    it("Renderiza con etiqueta personalizada usando labelFormatter", () => {
      const payload = [
        {
          dataKey: "value",
          name: "Valor",
          value: 90,
          color: "#3b82f6",
          payload: {},
        },
      ];

      const { container } = render(
        <ChartContainer config={mockConfig}>
          <BarChart data={mockData}>
            <Bar dataKey="value" />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  active={true}
                  payload={payload}
                  label="Custom Label"
                  labelFormatter={(value) => `Personalizado: ${value}`}
                />
              }
            />
          </BarChart>
        </ChartContainer>,
      );

      expect(container).toBeInTheDocument();
    });

    it("Renderiza con múltiples elementos en payload", () => {
      const payload = [
        {
          dataKey: "pending",
          name: "Pendiente",
          value: 10,
          color: "#6b7280",
          payload: { fill: "#6b7280" },
        },
        {
          dataKey: "completed",
          name: "Completado",
          value: 20,
          color: "#15803d",
          payload: { fill: "#15803d" },
        },
      ];

      const { container } = render(
        <ChartContainer config={mockConfig}>
          <BarChart data={mockData}>
            <Bar dataKey="value" />
            <ChartTooltip
              content={<ChartTooltipContent active={true} payload={payload} />}
            />
          </BarChart>
        </ChartContainer>,
      );

      expect(container).toBeInTheDocument();
    });

    it("Usa formatter personalizado cuando está definido", () => {
      const payload = [
        {
          dataKey: "value",
          name: "Valor",
          value: 100,
          color: "#3b82f6",
          payload: {},
        },
      ];

      const { container } = render(
        <ChartContainer config={mockConfig}>
          <BarChart data={mockData}>
            <Bar dataKey="value" />
            <ChartTooltip
              content={<ChartTooltipContent active={true} payload={payload} />}
            />
          </BarChart>
        </ChartContainer>,
      );

      expect(container).toBeInTheDocument();
    });

    it("Filtra elementos con type 'none'", () => {
      const payload = [
        {
          dataKey: "value2",
          name: "Valor 2",
          value: 20,
          color: "#10b981",
          payload: {},
        },
      ];

      const { container } = render(
        <ChartContainer config={mockConfig}>
          <BarChart data={mockData}>
            <Bar dataKey="value" />
            <ChartTooltip
              content={<ChartTooltipContent active={true} payload={payload} />}
            />
          </BarChart>
        </ChartContainer>,
      );

      expect(container).toBeInTheDocument();
    });
  });

  describe("ChartLegendContent", () => {
    it("Renderiza la leyenda con datos de payload", () => {
      const legendPayload = [
        {
          value: "Alta",
          color: "#ef4444",
          dataKey: "alta",
        },
        {
          value: "Media",
          color: "#f59e0b",
          dataKey: "media",
        },
      ];

      const { container } = render(
        <ChartContainer config={mockConfig}>
          <BarChart data={mockData}>
            <Bar dataKey="value" />
            <ChartLegend
              content={<ChartLegendContent payload={legendPayload} />}
            />
          </BarChart>
        </ChartContainer>,
      );

      expect(container).toBeInTheDocument();
    });

    it("No renderiza cuando payload está vacío", () => {
      const { container } = render(
        <ChartContainer config={mockConfig}>
          <BarChart data={mockData}>
            <Bar dataKey="value" />
            <ChartLegend content={<ChartLegendContent payload={[]} />} />
          </BarChart>
        </ChartContainer>,
      );

      expect(container).toBeInTheDocument();
    });

    it("Renderiza con verticalAlign='top'", () => {
      const legendPayload = [
        {
          value: "Alta",
          color: "#ef4444",
          dataKey: "alta",
        },
      ];

      const { container } = render(
        <ChartContainer config={mockConfig}>
          <BarChart data={mockData}>
            <Bar dataKey="value" />
            <ChartLegend
              content={
                <ChartLegendContent
                  payload={legendPayload}
                  verticalAlign="top"
                />
              }
            />
          </BarChart>
        </ChartContainer>,
      );

      expect(container).toBeInTheDocument();
    });

    it("Oculta iconos cuando hideIcon es true", () => {
      const legendPayload = [
        {
          value: "Baja",
          color: "#10b981",
          dataKey: "baja",
        },
      ];

      const { container } = render(
        <ChartContainer config={mockConfig}>
          <BarChart data={mockData}>
            <Bar dataKey="value" />
            <ChartLegend
              content={
                <ChartLegendContent payload={legendPayload} hideIcon={true} />
              }
            />
          </BarChart>
        </ChartContainer>,
      );

      expect(container).toBeInTheDocument();
    });

    it("Usa nameKey personalizado", () => {
      const legendPayload = [
        {
          value: "Test",
          color: "#3b82f6",
          customKey: "custom",
        },
      ];

      const { container } = render(
        <ChartContainer config={mockConfig}>
          <BarChart data={mockData}>
            <Bar dataKey="value" />
            <ChartLegend
              content={
                <ChartLegendContent
                  payload={legendPayload}
                  nameKey="customKey"
                />
              }
            />
          </BarChart>
        </ChartContainer>,
      );

      expect(container).toBeInTheDocument();
    });
  });
});
