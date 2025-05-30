import { ContactRequest } from "../models/request";

interface validateResponse {
  isValid: boolean;
  message?: string;
  request: ContactRequest;
}

const validate = (request: ContactRequest): validateResponse => {
  let email = request.email?.toString().trim();
  let phoneNumber = request.phoneNumber?.toString().trim();

  if (email !== undefined && email.length === 0) email = undefined;
  if (phoneNumber !== undefined && phoneNumber.length === 0)
    phoneNumber = undefined;

  if (email === undefined && phoneNumber === undefined) {
    return {
      isValid: false,
      message: "Either email or phone number is mandatory",
      request,
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email !== undefined && !emailRegex.test(email)) {
    return { isValid: false, message: "Invalid Email", request };
  }

  const numberRegex = /^[0-9]+$/;
  if (phoneNumber !== undefined && !numberRegex.test(phoneNumber)) {
    return { isValid: false, message: "Invalid PhoneNumber", request };
  }

  return { isValid: true, request: { email, phoneNumber } };
};

export default validate;
