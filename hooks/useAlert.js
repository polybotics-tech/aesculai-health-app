import Toast from "react-native-toast-message";

const useAlert = (text) => ({
  success: () => {
    Toast.show({
      type: "customSuccess",
      text1: text || "request successful",
    });
  },
  pending: () => {
    Toast.show({
      type: "customPending",
      text1: text || "request in progress",
    });
  },
  error: () => {
    Toast.show({
      type: "customError",
      text1: text || "request failed",
    });
  },
});

export default useAlert;
// This custom hook provides a simple interface for showing success and error alerts using react-native-toast-message.
// It can be used in any component to display alerts based on the success or failure of an operation.
