import { ContactRequest } from "../models/request";

interface validateResponse {
  isValid: boolean;
  message?: string;
  request: ContactRequest;
}

const validate = (request: ContactRequest): validateResponse => {
  const email = request.email?.toString().trim();
  const phoneNumber = request.phoneNumber?.toString().trim();

  if (
    (email === undefined || email.length == 0) &&
    (phoneNumber === undefined || phoneNumber.length == 0)
  ) {
    return {
      isValid: false,
      message: "Either email or phone number is mandatory",
      request,
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email !== undefined && email.length != 0 && !emailRegex.test(email)) {
    return { isValid: false, message: "Invalid Email", request };
  }

  const numberRegex = /^[0-9]+$/;
  if (phoneNumber !== undefined && phoneNumber.length != 0 && !numberRegex.test(phoneNumber)) {
    return { isValid: false, message: "Invalid PhoneNumber", request };
  }

  return { isValid: true, request: { email, phoneNumber } };
};

export default validate;
