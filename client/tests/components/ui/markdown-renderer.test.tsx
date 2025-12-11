import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MarkdownRenderer } from "../../../src/components/ui/markdown-renderer";

describe("MarkdownRenderer", () => {
  it("debe renderizar texto plano", () => {
    render(<MarkdownRenderer>Hello World</MarkdownRenderer>);
    expect(screen.getByText("Hello World")).toBeDefined();
  });

  it("debe renderizar encabezados markdown", () => {
    render(<MarkdownRenderer># Título</MarkdownRenderer>);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading.textContent).toBe("Título");
  });

  it("debe renderizar listas", () => {
    const markdown = `
- Item 1
- Item 2
- Item 3
    `;
    render(<MarkdownRenderer>{markdown}</MarkdownRenderer>);
    expect(screen.getByText("Item 1")).toBeDefined();
    expect(screen.getByText("Item 2")).toBeDefined();
    expect(screen.getByText("Item 3")).toBeDefined();
  });

  it("debe renderizar enlaces", () => {
    render(<MarkdownRenderer>[Link](https://example.com)</MarkdownRenderer>);
    const link = screen.getByRole("link");
    expect(link).toBeDefined();
    expect(link.getAttribute("href")).toBe("https://example.com");
  });

  it("debe renderizar texto en negrita", () => {
    render(<MarkdownRenderer>**bold text**</MarkdownRenderer>);
    expect(screen.getByText("bold text")).toBeDefined();
  });

  it("debe renderizar texto en cursiva", () => {
    render(<MarkdownRenderer>*italic text*</MarkdownRenderer>);
    expect(screen.getByText("italic text")).toBeDefined();
  });

  it("debe renderizar código inline", () => {
    render(<MarkdownRenderer>`code`</MarkdownRenderer>);
    expect(screen.getByText("code")).toBeDefined();
  });

  it("debe renderizar bloques de código", () => {
    const markdown = "```javascript\nconst x = 1;\n```";
    render(<MarkdownRenderer>{markdown}</MarkdownRenderer>);
    expect(screen.getByText(/const x = 1/)).toBeDefined();
  });

  it("debe renderizar párrafos múltiples", () => {
    const markdown = `
Párrafo 1

Párrafo 2
    `;
    render(<MarkdownRenderer>{markdown}</MarkdownRenderer>);
    expect(screen.getByText("Párrafo 1")).toBeDefined();
    expect(screen.getByText("Párrafo 2")).toBeDefined();
  });

  it("debe manejar markdown vacío", () => {
    const { container } = render(<MarkdownRenderer>{""}</MarkdownRenderer>);
    expect(container).toBeDefined();
  });

  it("debe renderizar tablas con remarkGfm", () => {
    const markdown = `
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
    `;
    render(<MarkdownRenderer>{markdown}</MarkdownRenderer>);
    expect(screen.getByText("Header 1")).toBeDefined();
    expect(screen.getByText("Cell 1")).toBeDefined();
  });

  it("debe renderizar citas", () => {
    render(<MarkdownRenderer>{"> This is a quote"}</MarkdownRenderer>);
    expect(screen.getByText(/This is a quote/)).toBeDefined();
  });
});
