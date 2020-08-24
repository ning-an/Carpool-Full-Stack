const initialState = {
  status: "idle",
  msg: "",
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case "LOGIN-SUCCESS":
      return { status: "success", msg: action.msg };
    default:
      return state;
  }
}
