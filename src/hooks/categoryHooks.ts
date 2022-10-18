export const categoryChipStyles = (provides: string, opacity?: number) => {
  let myOpacity;
  if (!opacity) myOpacity = 1;
  switch (provides) {
    case "Housing":
      return {
        class: "text-white bg-cyan-500 hover:bg-cyan-600",
        color: `rgba(10, 132, 165, ${myOpacity})`,
        emoji: "🏠",
      };
    case "Food":
      return {
        class: "text-white bg-amber-500 hover:bg-amber-600",
        color: `rgba(156, 216, 102, ${myOpacity})`,
        emoji: "🥪",
      };
    case "Legal":
      return {
        class: "text-white bg-slate-500 hover:bg-slate-600",
        color: `rgba(128, 128, 128, ${myOpacity})`,
        emoji: "⚖️",
      };
    case "Academics":
      return {
        class: "text-white bg-maroon-500 hover:bg-maroon-600",
        color: `rgba(112, 0, 46, ${myOpacity})`,
        emoji: "📖",
      };
    case "Healthcare":
      return {
        class: "text-white bg-emerald-500 hover:bg-emerald-600",
        color: `rgba(255, 160, 87, ${myOpacity})`,
        emoji: "💊",
      };
    default:
      return {
        class: "text-white bg-blue-500 hover:bg-blue-600",
        color: "blue",
        emoji: "",
      };
  }
};

export const getCategoryOptions = () =>
  Array.from(["Academics", "Food", "Healthcare", "Housing", "Legal", "Misc"]);
