const appFontFamily = (type) => {
  switch (type) {
    case "bold":
      return "Rubik-Bold";
    case "semi-bold":
      return "Rubik-SemiBold";
    case "light":
      return "Rubik-Light";
    default:
      return "Rubik";
      break;
  }
};

export default appFontFamily;
