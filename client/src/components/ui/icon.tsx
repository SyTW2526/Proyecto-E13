import React from "react";

type IconComponent = React.ComponentType<{
  size?: number;
  stroke?: number;
  className?: string;
}>;

interface IconProps {
  as: IconComponent;
  size?: number;
  stroke?: number;
  className?: string;
  ariaLabel?: string;
}

export default function Icon({
  as: As,
  size = 24,
  stroke = 1.5,
  className = "",
  ariaLabel,
}: IconProps) {
  const ariaProps = ariaLabel
    ? { role: "img", "aria-label": ariaLabel }
    : { "aria-hidden": true };

  return (
    <span className={className} {...ariaProps}>
      <As size={size} stroke={stroke} />
    </span>
  );
}
