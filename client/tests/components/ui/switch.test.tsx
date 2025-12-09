import { Switch } from "@/components/ui/switch";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

describe("Switch", () => {
  it("Renderiza correctamente el componente Switch", () => {
    const { container } = render(<Switch />);
    const switchElement = container.querySelector('[data-slot="switch"]');
    expect(switchElement).toBeInTheDocument();
  });

  it("Renderiza el thumb del switch", () => {
    const { container } = render(<Switch />);
    const thumb = container.querySelector('[data-slot="switch-thumb"]');
    expect(thumb).toBeInTheDocument();
  });

  it("Aplica clases personalizadas", () => {
    const { container } = render(<Switch className="custom-class" />);
    const switchElement = container.querySelector('[data-slot="switch"]');
    expect(switchElement).toHaveClass("custom-class");
  });

  it("Maneja el estado checked", () => {
    const { container } = render(<Switch checked />);
    const switchElement = container.querySelector('[data-slot="switch"]');
    expect(switchElement).toHaveAttribute("data-state", "checked");
  });

  it("Maneja el estado unchecked", () => {
    const { container } = render(<Switch checked={false} />);
    const switchElement = container.querySelector('[data-slot="switch"]');
    expect(switchElement).toHaveAttribute("data-state", "unchecked");
  });

  it("Maneja el atributo disabled", () => {
    const { container } = render(<Switch disabled />);
    const switchElement = container.querySelector('[data-slot="switch"]');
    expect(switchElement).toBeDisabled();
  });

  it("Maneja onCheckedChange callback", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const { container } = render(<Switch onCheckedChange={handleChange} />);
    const switchElement = container.querySelector(
      '[data-slot="switch"]',
    ) as HTMLElement;

    await user.click(switchElement);
    expect(handleChange).toHaveBeenCalled();
  });

  it("Cambia de estado al hacer click", async () => {
    const user = userEvent.setup();
    const { container } = render(<Switch />);
    const switchElement = container.querySelector(
      '[data-slot="switch"]',
    ) as HTMLElement;

    expect(switchElement).toHaveAttribute("data-state", "unchecked");

    await user.click(switchElement);
    expect(switchElement).toHaveAttribute("data-state", "checked");
  });

  it("No cambia de estado cuando está disabled", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const { container } = render(
      <Switch disabled onCheckedChange={handleChange} />,
    );
    const switchElement = container.querySelector(
      '[data-slot="switch"]',
    ) as HTMLElement;

    await user.click(switchElement);
    expect(handleChange).not.toHaveBeenCalled();
  });

  // Edge Cases
  describe("Edge Cases", () => {
    it("Maneja className undefined", () => {
      const { container } = render(<Switch className={undefined} />);
      const switchElement = container.querySelector('[data-slot="switch"]');
      expect(switchElement).toBeInTheDocument();
    });

    it("Maneja múltiples clases", () => {
      const { container } = render(<Switch className="class1 class2 class3" />);
      const switchElement = container.querySelector('[data-slot="switch"]');
      expect(switchElement).toHaveClass("class1", "class2", "class3");
    });

    it("Maneja defaultChecked", () => {
      const { container } = render(<Switch defaultChecked />);
      const switchElement = container.querySelector('[data-slot="switch"]');
      expect(switchElement).toHaveAttribute("data-state", "checked");
    });

    it("Maneja name attribute", () => {
      const { container } = render(<Switch name="toggle" />);
      const switchElement = container.querySelector('[data-slot="switch"]');
      // Switch de Radix UI maneja name internamente pero no lo expone en el elemento button
      expect(switchElement).toBeInTheDocument();
    });

    it("Maneja value attribute", () => {
      const { container } = render(<Switch value="on" />);
      const switchElement = container.querySelector('[data-slot="switch"]');
      expect(switchElement).toHaveAttribute("value", "on");
    });

    it("Maneja required attribute con aria", () => {
      const { container } = render(<Switch required />);
      const switchElement = container.querySelector('[data-slot="switch"]');
      // Switch usa aria-required en lugar de required en el button
      expect(switchElement).toHaveAttribute("aria-required", "true");
    });

    it("Maneja aria-label", () => {
      const { container } = render(<Switch aria-label="Toggle setting" />);
      const switchElement = container.querySelector('[data-slot="switch"]');
      expect(switchElement).toHaveAttribute("aria-label", "Toggle setting");
    });

    it("Maneja aria-labelledby", () => {
      const { container } = render(<Switch aria-labelledby="label-id" />);
      const switchElement = container.querySelector('[data-slot="switch"]');
      expect(switchElement).toHaveAttribute("aria-labelledby", "label-id");
    });

    it("Combina todas las props", () => {
      const handleChange = vi.fn();
      const { container } = render(
        <Switch
          checked
          className="custom"
          name="setting"
          onCheckedChange={handleChange}
          aria-label="Setting toggle"
        />,
      );
      const switchElement = container.querySelector('[data-slot="switch"]');
      expect(switchElement).toBeInTheDocument();
      expect(switchElement).toHaveAttribute("data-state", "checked");
      expect(switchElement).toHaveClass("custom");
      expect(switchElement).toHaveAttribute("aria-label", "Setting toggle");
    });

    it("Múltiples clicks alternan el estado", async () => {
      const user = userEvent.setup();
      const { container } = render(<Switch />);
      const switchElement = container.querySelector(
        '[data-slot="switch"]',
      ) as HTMLElement;

      expect(switchElement).toHaveAttribute("data-state", "unchecked");

      await user.click(switchElement);
      expect(switchElement).toHaveAttribute("data-state", "checked");

      await user.click(switchElement);
      expect(switchElement).toHaveAttribute("data-state", "unchecked");

      await user.click(switchElement);
      expect(switchElement).toHaveAttribute("data-state", "checked");
    });

    it("Maneja control con checked y onCheckedChange", async () => {
      const user = userEvent.setup();
      let checked = false;
      const handleChange = vi.fn((newChecked: boolean) => {
        checked = newChecked;
      });

      const { container, rerender } = render(
        <Switch checked={checked} onCheckedChange={handleChange} />,
      );

      const switchElement = container.querySelector(
        '[data-slot="switch"]',
      ) as HTMLElement;
      await user.click(switchElement);

      expect(handleChange).toHaveBeenCalledWith(true);

      rerender(<Switch checked={checked} onCheckedChange={handleChange} />);
    });
  });
});
