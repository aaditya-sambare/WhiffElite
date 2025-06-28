// utils/redirectUtils.js
export const getRedirectPathByRole = (role) => {
  switch (role) {
    case "captain":
      return "/captain-home"; // Redirect captains to '/captain-home'
    case "user":
    default:
      return "/"; // Redirect users to '/'
  }
};
