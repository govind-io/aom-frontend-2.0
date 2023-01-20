//local url

export var Tokens = {
  refresh: "",
  access: "",
};

export const updateTokens = (tokens) => {
  localStorage.setItem("tokens", JSON.stringify(tokens));
  console.log("token updated to ", tokens);
  return (Tokens = tokens);
};
