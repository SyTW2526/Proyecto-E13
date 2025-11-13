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
  bigDetails = false,
  details,
  className = "",
  iconSize = 40,
  iconLabel,
  children,
}: FeatureCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        {icon ? (
          <div className="text-4xl mb-2">
            <Icon
              as={icon}
              size={iconSize}
              ariaLabel={iconLabel}
              className="inline-block"
            />
          </div>
        ) : null}
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      {bigDetails && details ? (
        <CardContent>
          <span className="text-4xl leading-none font-bold text-foreground">
            {details}
          </span>
        </CardContent>
      ) : (
        details && (
          <CardContent>
            <p className="text-sm text-muted-foreground">{details}</p>
          </CardContent>
        )
      )}
      {children ? <CardContent>{children}</CardContent> : null}
    </Card>
  );
}
