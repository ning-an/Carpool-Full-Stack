const initialState = {
  status: "idle",
  msg: "",
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case "REGISTER-SUCCESS":
      return { status: "signed-up", msg: action.msg };
    case "LOGIN-FAILURE":
      return { status: "login-error", msg: action.msg };
    case "LOGIN-SUCCESS":
      return { status: "logged-in", msg: "" };
    case "LOGOUT":
      return { status: "logged-out", msg: "You are logged out" };
    default:
      return state;
  }
}
