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
  return fetch("/users/register", option);
};
