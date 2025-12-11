import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../../src/components/ui/collapsible";

describe("Collapsible", () => {
  it("should render collapsible root", () => {
    const { container } = render(<Collapsible>Content</Collapsible>);
    expect(
      container.querySelector('[data-slot="collapsible"]'),
    ).toBeInTheDocument();
  });

  it("should render trigger", () => {
    const { container } = render(
      <Collapsible>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
      </Collapsible>,
    );
    expect(
      container.querySelector('[data-slot="collapsible-trigger"]'),
    ).toBeInTheDocument();
  });

  it("should render content", () => {
    const { container } = render(
      <Collapsible>
        <CollapsibleContent>Hidden content</CollapsibleContent>
      </Collapsible>,
    );
    expect(
      container.querySelector('[data-slot="collapsible-content"]'),
    ).toBeInTheDocument();
  });

  it("should toggle content visibility when trigger is clicked", () => {
    render(
      <Collapsible>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Hidden content</CollapsibleContent>
      </Collapsible>,
    );

    const trigger = screen.getByText("Toggle");
    fireEvent.click(trigger);

    expect(screen.getByText("Hidden content")).toBeInTheDocument();
  });

  it("should accept custom props", () => {
    render(
      <Collapsible className="custom-class" data-testid="collapsible">
        Content
      </Collapsible>,
    );
    expect(screen.getByTestId("collapsible")).toHaveClass("custom-class");
  });
});
