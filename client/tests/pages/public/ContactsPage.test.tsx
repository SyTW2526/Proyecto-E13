import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ContactsPage from "@/pages/public/contactsPage";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, params?: any) => {
      if (params?.name) return `${key} ${params.name}`;
      return key;
    },
  }),
}));

vi.mock("@/components/shared/Typewriter", () => ({
  Typewriter: ({ text }: { text: string }) => <h1>{text}</h1>,
}));

vi.mock("@/config/team", () => ({
  team: [
    {
      name: "Team Member 1",
      email: "member1@example.com",
      url: "https://example.com/member1",
      avatarUrl: "https://example.com/avatar1.jpg",
      ringClass: "ring-blue-500",
    },
    {
      name: "Team Member 2",
      email: "member2@example.com",
      url: "https://example.com/member2",
      avatarUrl: "https://example.com/avatar2.jpg",
      ringClass: "ring-green-500",
    },
  ],
}));

describe("ContactsPage", () => {
  it("renders contacts page title", () => {
    render(<ContactsPage />);
    expect(screen.getByText("contacts.title")).toBeInTheDocument();
  });

  it("renders contacts page subtitle", () => {
    render(<ContactsPage />);
    expect(screen.getByText("contacts.subtitle")).toBeInTheDocument();
  });

  it("renders team member cards", () => {
    render(<ContactsPage />);
    expect(screen.getByText("Team Member 1")).toBeInTheDocument();
    expect(screen.getByText("Team Member 2")).toBeInTheDocument();
  });

  it("renders team member emails", () => {
    render(<ContactsPage />);
    expect(screen.getByText("member1@example.com")).toBeInTheDocument();
    expect(screen.getByText("member2@example.com")).toBeInTheDocument();
  });

  it("renders role labels", () => {
    render(<ContactsPage />);
    const roles = screen.getAllByText("contacts.role");
    expect(roles.length).toBe(2);
  });

  it("renders ULL profile links", () => {
    render(<ContactsPage />);
    const profileLinks = screen.getAllByText("contacts.ullProfile");
    expect(profileLinks.length).toBe(2);
  });

  it("renders team member avatars", () => {
    render(<ContactsPage />);
    const avatars = screen.getAllByRole("img");
    expect(avatars.length).toBe(2);
  });

  it("renders email links with mailto", () => {
    render(<ContactsPage />);
    const emailLinks = screen.getAllByRole("link");
    const mailtoLink = emailLinks.find(
      (link) => link.getAttribute("href") === "mailto:member1@example.com",
    );
    expect(mailtoLink).toBeDefined();
  });
});
