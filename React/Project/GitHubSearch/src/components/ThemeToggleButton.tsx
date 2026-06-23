import { useTheme } from "../context/ThemeContext";

export default function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button className="theme-button" type="button" onClick={toggleTheme}>
      {theme === "light" ? "切换暗色" : "切换亮色"}
    </button>
  );
}
