const NumberLibrary = {
  format_input_number: (number) => {
    let res = number.toString().replace(/[^0-9]/g, "");
    return res;
  },
};

export default NumberLibrary;
