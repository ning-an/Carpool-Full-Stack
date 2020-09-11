let userData;

export const validateData = (data) => {
  const {
    name,
    email,
    password,
    cfpassword,
    make,
    model,
    plate,
    seats,
    driver,
  } = data;

  const errors = [];
  // Check required fields
  if (!driver && (!name || !email || !password || !cfpassword)) {
    errors.push({ msg: "Please fill in all fields" });
  }
  if (
    driver &&
    (!name ||
      !email ||
      !password ||
      !cfpassword ||
      !make ||
      !model ||
      !plate ||
      !seats)
  ) {
    errors.push({ msg: "Please fill in all fields" });
  }

  // Check passwords match
  if (password !== cfpassword) {
    errors.push({ msg: "Passwords do not match" });
  }

  // Check password length
  if (password.length < 6) {
    errors.push({ msg: "Password should be at least 6 characters" });
  }

  userData = {
    name,
    email,
    password,
    driver,
  };
  if (driver) {
    userData = {
      ...userData,
      make,
      model,
      plate,
      seats,
    };
  }
  return errors;
};

export const signUp = () => {
  const option = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  };
  return fetch("/api/users/register", option);
};

export const login = (data) => {
  const option = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
  return fetch("/api/users/login", option);
};

export const logout = () => {
  return fetch("/api/users/logout", { method: "DELETE" }).then((res) =>
    res.json()
  );
};

export const postNewTrip = (trip) => {
  const option = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(trip),
  };
  return fetch("/api/trips", option).then((res) => res.json());
};

export const cancelPost = (_id, invite, match) => {
  const option = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ invite, match }),
  };
  return fetch(`/api/trips/cancel/${_id}`, option).then((res) => res.json());
};

export const getCurrentTrip = (_id) => {
  return fetch(`/api/trips/${_id}`).then((res) => res.json());
};

export const getTripsForCurrentUser = (_id) => {
  return fetch(`/api/trips/users/${_id}`).then((res) => res.json());
};

export const getMatchedTrips = (id) => {
  return fetch(`/api/trips/matched/${id}`).then((res) => res.json());
};

export const addInvite = (matchedTrip_id, myTrip_id) => {
  const option = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ matchedTrip_id }),
  };
  return fetch(`/api/trips/addInvite/${myTrip_id}`, option);
};

export const cancelInvite = (matchedTrip_id, myTrip_id) => {
  const option = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ matchedTrip_id }),
  };
  return fetch(`/api/trips/removeInvite/${myTrip_id}`, option);
};

export const addPick = (matchedTrip_id, myTrip_id, seats, status) => {
  const option = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ matchedTrip_id, seats, status }),
  };
  return fetch(`/api/trips/addPick/${myTrip_id}`, option);
};

export const cancelPick = (matchedTrip_id, myTrip_id, seats, status) => {
  const option = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ matchedTrip_id, seats, status }),
  };
  return fetch(`/api/trips/cancelPick/${myTrip_id}`, option);
};
