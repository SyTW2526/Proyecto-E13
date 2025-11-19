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
import { team } from "@/config/team";
import { ExternalLink, Mail } from "lucide-react";

export default function ContactsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          Nuestro equipo
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Contacto directo del equipo de TaskGrid.
        </p>
      </header>

      <section className="grid justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {team.map((member) => (
          <Card key={member.email} className="w-[320px] text-center">
            <CardHeader className="items-center gap-3">
              <div
                className={`mx-auto h-24 w-24 overflow-hidden rounded-full ring-4 ${member.ringClass} shadow`}
              >
                <img
                  src={member.avatarUrl}
                  alt={`Avatar de ${member.name}`}
                  width={96}
                  height={96}
                  loading="lazy"
                  className="block h-full w-full object-cover object-center"
                />
              </div>
              <a
                href={member.url}
                target="_blank"
                rel="noreferrer"
                className="mt-2 underline-offset-4 hover:underline"
                aria-label={`Perfil ULL de ${member.name}`}
              >
                <CardTitle className="text-base">{member.name}</CardTitle>
              </a>

              <CardDescription>
                Estudiante de Ingeniería Informática
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col items-center gap-2">
              <a
                href={`mailto:${member.email}`}
                className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm underline-offset-4 hover:underline"
                aria-label={`Enviar correo a ${member.name}`}
              >
                <Mail className="h-4 w-4" aria-hidden />
                {member.email}
              </a>

              <a
                href={member.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm underline-offset-4 hover:underline"
                aria-label={`Abrir perfil ULL de ${member.name}`}
              >
                <ExternalLink className="h-4 w-4" aria-hidden />
                Perfil ULL
              </a>
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="pb-16" />
    </div>
  );
}
