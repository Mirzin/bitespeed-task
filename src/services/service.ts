import { QueryResult } from "pg";
import pool from "../db";
import { ContactRequest } from "../models/request";
import { ContactResponse } from "../models/response";
import mapToContactResponse from "../utility/mapper";
import {
  createGetQuery,
  createNewInsertQuery,
  createNewSecondaryQuery,
  createUpdateNewerRecordQuery,
  createUpdateQuery,
} from "../utility/query";
import { DBResponse } from "../models/dbresponse";

const getResponse = async (
  request: ContactRequest
): Promise<void | ContactResponse> => {
  try {
    const res = await pool.query(createGetQuery(request));
    if (res.rowCount === 0) {
      return await createNewRecord(request);
    } else if (res.rowCount === 1) {
      return await handleOneExistingRecord(request, res);
    } else {
      return await handleMultipleExistingRecords(request, res);
    }
  } catch (error) {
    console.error("Error communicating with db", error);
  }
  return;
};

const createNewRecord = async (
  request: ContactRequest
): Promise<ContactResponse> => {
  console.log("Creating new primary record");
  await pool.query(createNewInsertQuery(request));
  const res = await pool.query(createGetQuery(request));
  return mapToContactResponse(res.rows);
};

const handleOneExistingRecord = async (
  request: ContactRequest,
  res: QueryResult<any>
): Promise<ContactResponse> => {
  const dbResponse: DBResponse = res.rows.at(0);
  if (isEqual(request, dbResponse)) {
    return handleDuplicateRecord(dbResponse);
  } else {
    return await createNewSecondaryRecord(dbResponse, request);
  }
};

const handleMultipleExistingRecords = async (
  request: ContactRequest,
  res: QueryResult
): Promise<ContactResponse> => {
  console.log("Muliple Records Exists");

  const dbResponse: DBResponse[] = res.rows;
  for (const row of dbResponse) {
    if (isEqual(request, row)) {
      return await handleDuplicateRecord(row, dbResponse);
    }
  }

  if (contactExistsAsSeparateRecords(dbResponse, request)) {
    return await handleExistingContactAsMultipleRecords(dbResponse, request);
  }

  return await createNewSecondaryRecord(dbResponse[0], request);
};

const isEqual = (request: ContactRequest, response: DBResponse): boolean => {
  return (
    (request.email === undefined || request.email === response.email) &&
    (request.phoneNumber === undefined ||
      request.phoneNumber === response.phone_number)
  );
};

const handleDuplicateRecord = async (
  row: DBResponse,
  rows: DBResponse[] = [row]
): Promise<ContactResponse> => {
  console.log(row);
  console.log("Record already exists");
  await pool.query(createUpdateQuery(row));
  return mapToContactResponse(rows);
};

const contactExistsAsSeparateRecords = (
  dbResponse: DBResponse[],
  request: ContactRequest
): boolean => {
  const email = request.email;
  const phoneNumber = request.phoneNumber;
  let emailExists = false;
  let phoneNumberExists = false;
  for (const row of dbResponse) {
    if (email === undefined || row.email === email) emailExists = true;
    if (phoneNumber === undefined || row.phone_number === phoneNumber)
      phoneNumberExists = true;
  }
  if (emailExists && phoneNumberExists) return true;
  return false;
};

const createNewSecondaryRecord = async (
  row: DBResponse,
  request: ContactRequest
): Promise<ContactResponse> => {
  const linkedId = row.linked_id ? row.linked_id : row.id;
  await pool.query(createNewSecondaryQuery(linkedId, request));
  const res = await pool.query(createGetQuery(request));
  return mapToContactResponse(res.rows);
};

const handleExistingContactAsMultipleRecords = async (
  dbResponse: DBResponse[],
  request: ContactRequest
): Promise<ContactResponse> => {
  const email = request.email === undefined ? null : request.email;
  const phoneNumber =
    request.phoneNumber === undefined ? null : request.phoneNumber;
  const emailRecord = dbResponse.filter((value) => value.email === email).at(0);
  const phoneNumberRecord = dbResponse
    .filter((value) => value.phone_number === phoneNumber)
    .at(0);
  let newerRecord: DBResponse;
  let olderRecord: DBResponse;
  let linkedId: number;
  if (emailRecord !== undefined && phoneNumberRecord !== undefined) {
    if (
      emailRecord.created_at.getTime() < phoneNumberRecord?.created_at.getTime()
    ) {
      newerRecord = phoneNumberRecord;
      olderRecord = emailRecord;
    } else {
      newerRecord = emailRecord;
      olderRecord = phoneNumberRecord;
    }
    linkedId = olderRecord.linked_id ? olderRecord.linked_id : olderRecord.id;
    await pool.query(createUpdateNewerRecordQuery(newerRecord, linkedId));
    dbResponse = (await pool.query(createGetQuery(request))).rows;
  }
  return mapToContactResponse(dbResponse);
};

export default getResponse;
