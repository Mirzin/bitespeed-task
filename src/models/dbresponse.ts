export interface DBResponse {
  id: number,
  phone_number?: string,
  email?: string,
  linked_id?: number,
  link_precedence: "primary" | "secondary",
  created_at: Date,
  updated_at: Date,
  deleted_at?: Date
}