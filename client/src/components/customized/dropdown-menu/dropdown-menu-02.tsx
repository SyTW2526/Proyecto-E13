import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Icon from "@/components/ui/icon";

type Props = {
  onProfile?: () => void;
  onSettings?: () => void;
  onLogout?: () => void;
  userName?: string;
  userEmail?: string;
  userInitial?: string;
  userImage?: string;
};

export default function DropdownMenuWithIcon({
  onProfile,
  onSettings,
  userName = "Mi cuenta",
  userEmail,
  onLogout,
  userInitial = "A",
  userImage,
}: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded-full">
        <Avatar>
          {userImage && (
            <AvatarImage src={userImage} alt={userName} />
          )}
          <AvatarFallback>{userInitial}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{userName}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {userEmail && (
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            ({userEmail})
          </DropdownMenuLabel>
        )}
        {onProfile && (
          <DropdownMenuItem onClick={onProfile}>
            <Icon as="IconUser" size={16} className="mr-2" /> Perfil
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={onSettings}>
          <Icon as="IconSettings" size={16} className="mr-2" /> Ajustes
        </DropdownMenuItem>
        <DropdownMenuItem className="text-destructive" onClick={onLogout}>
          <Icon as="IconLogout" size={16} className="mr-2" /> Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
