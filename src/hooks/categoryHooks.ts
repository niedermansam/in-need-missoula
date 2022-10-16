export const categoryChipStyles = (provides: string, opacity?: number) => {
  let myOpacity;
  if (!opacity) myOpacity = 1;
  switch (provides) {
    case "Housing":
      return { color: `rgba(10, 132, 165, ${myOpacity})`, emoji: "🏠" };
    case "Food":
      return { color: `rgba(156, 216, 102, ${myOpacity})`, emoji: "🥪" };
    case "Legal":
      return { color: `rgba(128, 128, 128, ${myOpacity})`, emoji: "⚖️" };
    case "Academics":
      return { color: `rgba(112, 0, 46, ${myOpacity})`, emoji: "📖" };
    case "Healthcare":
      return { color: `rgba(255, 160, 87, ${myOpacity})`, emoji: "💊" };
    default:
      return { color: "blue", emoji: "" };
  }
};

export const getCategoryOptions = () =>
  Array.from(["Academics", "Food", "Healthcare", "Housing", "Legal", "Misc"]);
