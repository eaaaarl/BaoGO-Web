import { supabase } from "@/lib/supabase";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { Ride } from "./interface";

export const rideApi = createApi({
  reducerPath: "rideApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getAllRides: builder.query<Ride[], void>({
      queryFn: async () => {
        try {
          const { data, error } = await supabase.from("rides").select("*");

          if (error) {
            return {
              error: {
                message: error.message,
              },
            };
          }

          return {
            data,
            meta: {
              success: true,
              message: "Rides fetched",
            },
          };
        } catch (error) {
          console.error("Error at getAllRides", error);
          return {
            error: {
              message: "Error at getAllRides",
            },
          };
        }
      },
    }),
  }),
});

export const { useGetAllRidesQuery } = rideApi;
