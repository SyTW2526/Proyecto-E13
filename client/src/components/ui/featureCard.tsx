import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { FeatureCardProps } from "@/types/components";

export default function FeatureCard({
  icon,
  title,
  description,
  className = "",
  iconSize = 40,
  iconLabel,
  children,
}: FeatureCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="text-4xl mb-2">
          <Icon
            as={icon}
            size={iconSize}
            ariaLabel={iconLabel}
            className="inline-block"
          />
        </div>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      {children ? <CardContent>{children}</CardContent> : null}
    </Card>
  );
}
