import { supabase } from "@/lib/supabase";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { RideRequest } from "./interface";

export const requestApi = createApi({
  reducerPath: "requestApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getAllRequest: builder.query<RideRequest[], void>({
      queryFn: async () => {
        try {
          const { data, error } = await supabase
            .from("request_ride")
            .select("*");

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
          console.error("Error at getAllRequest", error);
          return {
            error: {
              message: "Error at getAllRequest",
            },
          };
        }
      },
    }),
  }),
});

export const { useGetAllRequestQuery } = requestApi;
