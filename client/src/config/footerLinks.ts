/**
 * Footer links configuration.
 * Icons are strings that will be resolved by the `Icon` component.
 */

export const getFooterLinks = () => {
  const isAuthed =
    typeof localStorage !== "undefined" && !!localStorage.getItem("token");

  return [
    {
      to: isAuthed ? "/dashboard" : "/",
      label: "Inicio",
      icon: "IconMap",
      ariaLabel: "Inicio",
    },
    {
      to: "/contacts",
      label: "Contacto",
      icon: "IconUser",
      ariaLabel: "Contacto",
    },
    {
      to: "/settings",
      label: "Ajustes",
      icon: "IconSettings",
      ariaLabel: "Ajustes",
    },
  ];
};
