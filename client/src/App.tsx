// client/src/App.tsx
import ThemeToggle from "@/components/ThemeToggle";
import { LoginForm } from "@/components/login-form";
import "./styles/App.css";

export default function App() {
  return (
    <>
      <ThemeToggle />
      <LoginForm />
    </>
  );
}
