import { ContactResponse } from "../models/response";
import { DBResponse } from "../models/dbresponse";

export default function mapToContactResponse(
  dbResponses: DBResponse[]
): ContactResponse {
  console.log("Mapping Response");
  const primary = dbResponses
    .filter((value) => value.link_precedence === "primary")
    .at(0);
  const secondaries = dbResponses.filter(
    (value) => value.link_precedence === "secondary"
  );
  const emails = primary?.email ? [primary.email] : [];
  const phoneNumbers = primary?.phone_number ? [primary.phone_number] : [];
  const secondaryContactIds = secondaries.map((value) => value.id);
  const secondaryEmails = secondaries
    .map((value) => value.email)
    .filter((email): email is string => typeof email === "string");
  const secondaryPhoneNumbers = secondaries
    .map((value) => value.phone_number)
    .filter(
      (phone_number): phone_number is string => typeof phone_number === "string"
    );
  return {
    primaryContactId: primary?.id,
    emails: [...new Set([...emails, ...secondaryEmails])],
    phoneNumbers: [...new Set([...phoneNumbers, ...secondaryPhoneNumbers])],
    secondaryContactIds: [...new Set(secondaryContactIds)],
  };
}
