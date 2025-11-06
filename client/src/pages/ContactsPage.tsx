// client/src/pages/ContactsPage.tsx
/**
 * @file ContactsPage.tsx
 * @description Página de contactos que muestra información del equipo
 * con tarjetas individuales para cada miembro. Incluye nombre, email
 * y enlace al perfil ULL.
 */
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, ExternalLink } from "lucide-react";
import { team } from "@/config/team";

type Member = {
  name: string;
  email: string;
  avatarUrl: string;
  ringClass: string;
};

const members: Member[] = [
  {
    name: "Laura Álvarez Zamora",
    email: "alu0101349824@ull.edu.es",
    avatarUrl: "https://cdn-icons-png.flaticon.com/512/6997/6997662.png",
    ringClass: "ring-fuchsia-400/40 dark:ring-fuchsia-500/30",
  },
  {
    name: "Tomás Pino Pérez",
    email: "alu0101474311@ull.edu.es",
    avatarUrl: "https://www.svgrepo.com/show/382101/male-avatar-boy-face-man-user.svg",
    ringClass: "ring-sky-400/40 dark:ring-sky-500/30",
  },
  {
    name: "Joel Saavedra Paez",
    email: "alu0101437415@ull.edu.es",
    avatarUrl: "https://mediaworkx.b-cdn.net/wp-content/uploads/2016/01/Avators-3.png",
    ringClass: "ring-red-400/40 dark:ring-red-500/30",
  },
];

// busca URL de perfil ULL por nombre
const profileUrlOf = (name: string) =>
  team.find((t) => t.name.toLowerCase() === name.toLowerCase())?.url ?? null;

export default function ContactsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Nuestro equipo</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Contacto directo del equipo de Proyecto-E13.
        </p>
      </header>

      {/* Grid centrado; tarjetas de ancho fijo para alinear */}
      <section className="grid justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((m) => {
          const profile = profileUrlOf(m.name);
          return (
            <Card key={m.email} className="w-[320px] text-center">
              <CardHeader className="items-center gap-3">
                <div className={`mx-auto h-24 w-24 overflow-hidden rounded-full ring-4 ${m.ringClass} shadow`}>
                  <img
                    src={m.avatarUrl}
                    alt={`Avatar de ${m.name}`}
                    width={96}
                    height={96}
                    loading="lazy"
                    className="block h-full w-full object-cover object-center"
                  />
                </div>

                {/* Si hay perfil ULL, el nombre enlaza al perfil */}
                {profile ? (
                  <a
                    href={profile}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 underline-offset-4 hover:underline"
                    aria-label={`Perfil ULL de ${m.name}`}
                  >
                    <CardTitle className="text-base">{m.name}</CardTitle>
                  </a>
                ) : (
                  <CardTitle className="mt-2 text-base">{m.name}</CardTitle>
                )}

                <CardDescription>Estudiante de Ingeniería Informática</CardDescription>
              </CardHeader>

              <CardContent className="flex flex-col items-center gap-2">
                <a
                  href={`mailto:${m.email}`}
                  className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm underline-offset-4 hover:underline"
                  aria-label={`Enviar correo a ${m.name}`}
                >
                  <Mail className="h-4 w-4" aria-hidden />
                  {m.email}
                </a>

                {profile && (
                  <a
                    href={profile}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm underline-offset-4 hover:underline"
                    aria-label={`Abrir perfil ULL de ${m.name}`}
                  >
                    <ExternalLink className="h-4 w-4" aria-hidden />
                    Perfil ULL
                  </a>
                )}
              </CardContent>
            </Card>
          );
        })}
      </section>

      <div className="pb-16" />
    </div>
  );
}
