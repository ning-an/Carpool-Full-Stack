const initialState = {
  status: "idle",
  msg: "",
  driver: false,
  name: null,
  userId: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case "REGISTER-SUCCESS":
      return { ...state, status: "signed-up", msg: action.msg };
    case "LOGIN-FAILURE":
      return { ...state, status: "login-error", msg: action.msg };
    case "LOGIN-SUCCESS":
      return {
        ...state,
        status: "logged-in",
        msg: "",
        name: action.user.name,
        driver: action.user.driver,
        userId: action.user._id,
      };
    case "LOGOUT":
      return {
        ...initialState,
        status: "logged-out",
        msg: "You are logged out",
      };
    default:
      return state;
  }
}
