export const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?])(?=\S+$).{8,}$/;
export const phoneRegex = /^\+?[0-9]{10,14}$/;

export const validatePassword = (password: string): string | null => {
  if (password.length < 6 || password.length > 20) {
    return 'Password must be between 6 and 20 characters';
  }
  if (!passwordRegex.test(password)) {
    return 'Password must contain at least one digit, one lowercase, one uppercase, one special character, and no whitespace';
  }
  return null;
};

export const validatePhone = (phone: string): string | null => {
  if (!phoneRegex.test(phone)) {
    return 'Phone number must be 10-14 digits long and may start with a '+' symbol';
  }
  return null;
};