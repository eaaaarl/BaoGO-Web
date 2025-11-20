export interface Profile {
  id: string;
  email: string;
  userRole: "Driver" | string;
  full_name: string;
  avatar_url: string | null;
  created_at: string;
  phone_number: string | null;
  status: "active" | "inactive" | "suspended" | "deleted";
}
