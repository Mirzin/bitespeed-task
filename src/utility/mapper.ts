import { ContactResponse } from "../models/response";
import { DBResponse } from "../models/dbresponse";

export default function mapToContactResponse(
  dbResponse: DBResponse[]
): ContactResponse {
  const firstRow = dbResponse.at(0);
  return {
    primaryContatctId: firstRow ? firstRow.id : 0,
    emails: firstRow?.email ? [firstRow.email] : [],
    phoneNumbers: firstRow?.phoneNumber ? [firstRow.phoneNumber] : [],
    secondaryContactIds: [],
  };
}
