import { QueryResult } from "pg";
import pool from "../db";
import { ContactRequest } from "../models/request";
import { ContactResponse } from "../models/response";
import mapToContactResponse from "../utility/mapper";
import { createGetQuery, createNewInsertQuery } from "../utility/query";
import { DBResponse } from "../models/dbresponse";

const getResponse = async (
  request: ContactRequest
): Promise<void | ContactResponse> => {
  let response;
  try {
    const res = await pool.query(createGetQuery(request));
    if (res.rowCount === 0) {
      response = createNewRecord(request);
    } else if (res.rowCount === 1) {
      response = handleOneExistingRecord(request, res);
    }
  } catch (error) {
    console.error("Error communicating with db", error);
  }
  return response;
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
  request: ContactRequest, res: QueryResult<any>
): Promise<ContactResponse> => {
  const dbResponse: DBResponse = res.rows.at(0);
  const linkedId = dbResponse.linkedId == null ? dbResponse.id : dbResponse.linkedId;
  
};

export default getResponse;
