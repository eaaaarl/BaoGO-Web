import { supabase } from "@/lib/supabase";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { Profile } from "./interface";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getAllUsers: builder.query<Profile[], void>({
      queryFn: async () => {
        try {
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("userRole", "Rider");

          if (error) {
            return {
              error: {
                message: error.message,
              },
            };
          }

          return {
            data,
          };
        } catch (error) {
          console.error("Error at getAllUsers", error);
          return {
            error: {
              error: {
                message: " Error at getAllUsers",
              },
            },
          };
        }
      },
    }),
  }),
});

export const { useGetAllUsersQuery } = userApi;
