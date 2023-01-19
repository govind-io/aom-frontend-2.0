//local url
export const API_BASE_URL = "http://localhost:3002";

export var Tokens = {
  refresh: "",
  access: "",
};

export const updateTokens = (tokens) => {
  localStorage.setItem("tokens", JSON.stringify(tokens));
  console.log("token updated to ", tokens);
  return (Tokens = tokens);
};
