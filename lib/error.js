import { useAlert } from "../hooks";

const ErrorLibrary = {
  extract: (error, showAlert = false) => {
    const msg =
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong. Please try again";

    //show toast alert for error message
    if (showAlert) useAlert(msg).error();

    //then return error mesasge incase it is needed afterwards
    return msg;
  },
};

export default ErrorLibrary;
