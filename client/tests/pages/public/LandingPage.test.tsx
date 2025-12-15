import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import LandingPage from "@/pages/public/landingPage";
import { MemoryRouter } from "react-router-dom";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("@/components/shared/Typewriter", () => ({
  Typewriter: ({ text }: { text: string }) => <h1>{text}</h1>,
}));

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
}));

vi.mock("@/components/shared/FeatureCard", () => ({
  default: ({ title, description }: { title: string; description: string }) => (
    <div data-testid="feature-card">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  ),
}));

vi.mock("@/config/landingCards", () => ({
  landingCards: [
    {
      icon: "IconCheck",
      title: "feature.title",
      description: "feature.description",
      details: "feature.details",
    },
  ],
}));

describe("LandingPage", () => {
  const renderPage = () => {
    return render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>,
    );
  };

  it("renders landing page", () => {
    renderPage();
    expect(screen.getByText(/landing.welcome/)).toBeInTheDocument();
  });

  it("renders subtitle", () => {
    renderPage();
    expect(screen.getByText("landing.subtitle")).toBeInTheDocument();
  });

  it("renders register and login buttons", () => {
    renderPage();
    expect(screen.getByText("auth.register")).toBeInTheDocument();
    expect(screen.getByText("auth.login")).toBeInTheDocument();
  });

  it("renders benefits section", () => {
    renderPage();
    expect(screen.getByText("landing.benefits.free")).toBeInTheDocument();
  });

  it("renders features section", () => {
    renderPage();
    expect(screen.getByText("landing.features.title")).toBeInTheDocument();
  });

  it("renders feature cards", () => {
    renderPage();
    expect(screen.getByTestId("feature-card")).toBeInTheDocument();
  });

  it("renders CTA section", () => {
    renderPage();
    expect(screen.getByText("landing.cta.title")).toBeInTheDocument();
  });

  it("has links to register page", () => {
    renderPage();
    const registerLinks = screen.getAllByRole("link");
    const registerLink = registerLinks.find(
      (link) => link.getAttribute("href") === "/register",
    );
    expect(registerLink).toBeDefined();
  });

  it("has links to login page", () => {
    renderPage();
    const links = screen.getAllByRole("link");
    const loginLink = links.find(
      (link) => link.getAttribute("href") === "/login",
    );
    expect(loginLink).toBeDefined();
  });
});
