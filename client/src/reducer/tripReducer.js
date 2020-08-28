const initialState = {
  origin: null,
  destination: null,
  distanceTxt: null,
  distanceNum: null,
};

export default function Reducer(state = initialState, action) {
  switch (action.type) {
    case "PREPARE-TRIP":
      return { ...state, ...action.data };
    case "CANCEL-TRIP":
      return { ...initialState };
    default:
      return state;
  }
}
