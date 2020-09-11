const initialState = {
  status: "active",
};

export default function Reducer(state = initialState, action) {
  switch (action.type) {
    case "INIT":
      return initialState;
    case "CANCEL":
      return { status: "cancel" };
    default:
      return state;
  }
}
