export const RegisterSuccess = (msg) => {
  return {
    type: "REGISTER-SUCCESS",
    msg,
  };
};

export const LoginFailure = (msg) => {
  return {
    type: "LOGIN-FAILURE",
    msg,
  };
};

export const LoginSuccess = () => {
  return {
    type: "LOGIN-SUCCESS",
  };
};

export const Logout = () => {
  return { type: "LOGOUT" };
};
