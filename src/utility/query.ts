import { DBResponse } from "../models/dbresponse";
import { ContactRequest } from "../models/request";

export function createGetQuery(request: ContactRequest): string {
  const email = request.email;
  const phoneNumber = request.phoneNumber;
  let initial: string;
  if (email === undefined || email.length == 0)
    initial = `SELECT * FROM contact WHERE phone_number = '${phoneNumber}'`;
  else if (phoneNumber === undefined || phoneNumber.length == 0)
    initial = `SELECT * FROM contact WHERE email = '${email}'`;
  else
    initial = `SELECT * FROM contact WHERE phone_number = '${phoneNumber}' OR email = '${email}'`;
  return (
    `
  WITH matched_contact AS (` +
    initial +
    `LIMIT 1
  ), primary_id AS (
    SELECT 
      CASE 
        WHEN "linked_id" IS NULL THEN id
        ELSE "linked_id"
      END AS pid
    FROM matched_contact
  )
  SELECT *
  FROM contact
  WHERE id = (SELECT pid FROM primary_id)
     OR "linked_id" = (SELECT pid FROM primary_id);
`
  );
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

export function createUpdateQuery(response: DBResponse): string {
  return `UPDATE contact
          SET link_precedence = '${response.link_precedence}'
          WHERE id=${response.id}`;
}

export function createNewSecondaryQuery(
  linkedId: number,
  request: ContactRequest
): string {
  const email = request.email;
  const phoneNumber = request.phoneNumber;
  if (email === undefined || email.length == 0)
    return `INSERT INTO contact (phone_number, link_precedence, linked_id) 
            VALUES ('${phoneNumber}','secondary', ${linkedId});`;
  if (phoneNumber === undefined || phoneNumber.length == 0)
    return `INSERT INTO contact (email, link_precedence, linked_id) 
            VALUES ('${email}','secondary', '${linkedId}');`;
  return `INSERT INTO contact (email, phone_number, link_precedence, linked_id) 
            VALUES ('${email}', '${phoneNumber}','secondary', '${linkedId}');`;
}

export function createUpdateNewerRecordQuery(
  response: DBResponse,
  linkedId: number
): string {
  return `UPDATE contact
          SET link_precedence = 'secondary', linked_id = '${linkedId}'
          WHERE id=${response.id}`;
}
