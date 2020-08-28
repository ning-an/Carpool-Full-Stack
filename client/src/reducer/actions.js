// Register and Login actions
export const RegisterSuccess = (msg) => ({
  type: "REGISTER-SUCCESS",
  msg,
});

export const LoginFailure = (msg) => {
  return {
    type: "LOGIN-FAILURE",
    msg,
  };
};

export const LoginSuccess = (user) => ({
  type: "LOGIN-SUCCESS",
  user,
});

export const Logout = () => ({ type: "LOGOUT" });

// Map related trip actions
export const PrepareTrip = ({ start, end, distanceTxt, distanceNum }) => {
  return {
    type: "PREPARE-TRIP",
    data: { origin: start, destination: end, distanceNum, distanceTxt },
  };
};

// User related trip actions
export const AddSeats = (seats) => ({ type: "ADD-SEATS", seats });

export const AddEarlyDate = (earlyDate) => ({
  type: "ADD-EARLY-DATE",
  earlyDate,
});

export const AddEarlyTime = (earlyTime) => ({
  type: "ADD-EARLY-TIME",
  earlyTime,
});

export const AddLateDate = (lateDate) => ({
  type: "ADD-LATE-DATE",
  lateDate,
});

export const AddLateTime = (lateTime) => ({
  type: "ADD-LATE-TIME",
  lateTime,
});

export const SelectRole = (role) => ({ type: "SELECT-ROLE", role });

export const SubmitTrip = () => ({ type: "SUBMIT-TRIP" });

export const PostTrip = () => ({ type: "POST-TRIP" });

export const QuitPost = () => ({ type: "QUIT-POST" });
