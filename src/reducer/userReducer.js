const initialState = {
  seats: 1,
  earlyDate: null,
  earlyTime: null,
  lateDate: null,
  lateTime: null,
  beDriver: false,
  status: "idle",
  matchedTrips: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case "SELECT-ROLE":
      return { ...state, beDriver: action.beDriver };
    case "ADD-SEATS":
      return { ...state, seats: action.seats };
    case "ADD-EARLY-DATE":
      return { ...state, earlyDate: action.earlyDate };
    case "ADD-EARLY-TIME":
      return { ...state, earlyTime: action.earlyTime };
    case "ADD-LATE-DATE":
      return { ...state, lateDate: action.lateDate };
    case "ADD-LATE-TIME":
      return { ...state, lateTime: action.lateTime };
    case "SUBMIT-TRIP":
      return { ...state, status: "pending" };
    case "POST-TRIP":
      return { ...state, status: "posted" };
    case "QUIT-POST":
      return { ...state, status: "idle" };
    case "LOGOUT":
      return { ...initialState };
    case "SUBTRACT-SEATS":
      return { ...state, seats: state.seats - action.seatsTaken };
    default:
      return state;
  }
}
