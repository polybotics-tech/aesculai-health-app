import { useSelector } from "react-redux";

const useColor = () => {
  const theme = useSelector((state) => state.app.theme);
  const color = useSelector((state) => state.app.color);

  return { ...color[theme] };
};

export default useColor;
// This custom hook retrieves the current theme and color from the Redux store
// and returns the color properties for the current theme.
// It allows components to access the color values without directly interacting with the Redux store.
// This is useful for maintaining a consistent color scheme across the application
// and for making it easier to switch themes dynamically.
