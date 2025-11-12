import React from "react";
import * as TablerIcons from "@tabler/icons-react";
import type { IconType as CompIconType } from "@/types/components";

type IconComponent = CompIconType;

interface IconProps {
  // 'as' can be a component or the name of an icon exported by @tabler/icons-react
  as: IconComponent | string;
  size?: number;
  stroke?: number;
  className?: string;
  ariaLabel?: string;
}

export default function Icon({
  as,
  size = 24,
  stroke = 1.5,
  className = "",
  ariaLabel,
}: IconProps) {
  const ariaProps = ariaLabel
    ? { role: "img", "aria-label": ariaLabel }
    : { "aria-hidden": true };

  // resolve icon if a string is provided
  const icons = TablerIcons as unknown as Record<string, IconComponent>;
  const As: IconComponent =
    typeof as === "string"
      ? (icons[as] ?? icons.IconClipboard)
      : (as as IconComponent);

  return (
    <span className={className} {...ariaProps}>
      <As size={size} stroke={stroke} />
    </span>
  );
}
