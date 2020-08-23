export const signup = (userData) => {
  const option = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  };
  return fetch("/users/register", option);
};
