//server url
//export const API_BASE_URL = "http://15.207.59.97";

//local url
export const API_BASE_URL = "http://localhost:3001";

export var Tokens = {
  refresh: "",
  access: "",
};

export const updateTokens = (tokens) => {
  localStorage.setItem("tokens", JSON.stringify(tokens));
  return (Tokens = tokens);
};
