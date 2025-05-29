import { ContactRequest } from "../models/request";

export function createGetQuery(request: ContactRequest): string {
  const email = request.email;
  const phoneNumber = request.phoneNumber;

  if (email === undefined || email.length == 0)
    return `SELECT * FROM contact WHERE phone_number = '${phoneNumber}'`;
  if (phoneNumber === undefined || phoneNumber.length == 0)
    return `SELECT * FROM contact WHERE email = '${email}'`;
  return `SELECT * FROM contact WHERE phone_number = '${phoneNumber}' OR email = '${email}'`;
}

export function createNewInsertQuery(request: ContactRequest): string {
  const email = request.email;
  const phoneNumber = request.phoneNumber;

  if (email === undefined || email.length == 0)
    return `INSERT INTO contact (phone_number, link_precedence) 
            VALUES ('${phoneNumber}','primary');`;
  if (phoneNumber === undefined || phoneNumber.length == 0)
    return `INSERT INTO contact (email, link_precedence) 
            VALUES ('${email}','primary');`;
  return `INSERT INTO contact (email, phone_number, link_precedence) 
            VALUES ('${email}', '${phoneNumber}','primary');`;
}
