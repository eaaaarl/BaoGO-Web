import { Driver, DriverProfile } from "@/features/driver/api/interface";
import { RideRequest } from "@/features/request/api/interface";
import { Ride } from "@/features/ride/api/interface";
import { Profile } from "@/features/user/api/interface";
import { supabase } from "@/lib/supabase";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getRides: builder.query<Ride[], void>({
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
          };
        } catch (error) {
          console.error("Error at getRides", error);
          return {
            error: {
              message: "Error at getRides",
            },
          };
        }
      },
    }),

    getUsers: builder.query<Profile[], void>({
      queryFn: async () => {
        try {
          const { data, error } = await supabase.from("profiles").select("*");

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
          console.error("Error at getUsers", error);
          return {
            error: {
              message: "Error at getUsers",
            },
          };
        }
      },
    }),

    getDrivers: builder.query<Driver[], void>({
      queryFn: async () => {
        try {
          const { data, error } = await supabase
            .from("driver_profiles")
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
          console.error("Error at getDrivers", error);
          return {
            error: {
              message: "Error at getDrivers",
            },
          };
        }
      },
    }),

    getRequestRide: builder.query<RideRequest[], void>({
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
          console.error("Error at getRequestRide", error);
          return {
            error: {
              message: "Error at getRequestRide",
            },
          };
        }
      },
    }),
  }),
});

export const {
  useGetRidesQuery,
  useGetUsersQuery,
  useGetDriversQuery,
  useGetRequestRideQuery,
} = dashboardApi;
