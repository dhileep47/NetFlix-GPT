export const checkFormData = (name, email, password, isSignInForm) => {
  if (isSignInForm) {
    const isNameValid = /^[a-zA-Z\s]{2,50}$/.test(name);
    if (!isNameValid)
      return "Name must be 2-50 characters long and contain only letters and spaces.";
  }
  const isEmailValid = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(
    email
  );
  if (!isEmailValid) return "Please enter a valid email address.";
  const isPasswordValid =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(password);
  if (!isPasswordValid)
    return "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number.";

  return null;
};
