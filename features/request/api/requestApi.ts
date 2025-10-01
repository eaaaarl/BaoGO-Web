import { supabase } from "@/lib/supabase";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { QueryPayload, RideRequest } from "./interface";

export const requestApi = createApi({
  reducerPath: "requestApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getAllRequest: builder.query<RideRequest[], QueryPayload | void>({
      queryFn: async (arg) => {
        try {
          let query = supabase
            .from("request_ride")
            .select(
              "*, rider:profiles(*), driver:driver_profiles(*, profiles(*))"
            );

          if (arg?.status) {
            query = query.eq("status", arg.status as string);
          }

          if (arg?.search) {
            const searchTerm = arg.search;
            query = query.or(
              `pickup.ilike.%${searchTerm}%,destination.ilike.%${searchTerm}%`
            );
          }

          const { data, error } = await query;

          console.log(data);
          console.log(error);

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

    getRequestById: builder.query<RideRequest, { id: string }>({
      queryFn: async (arg) => {
        try {
          const { data, error } = await supabase
            .from("request_ride")
            .select(
              "*, rider:profiles(*), driver:driver_profiles(*, profiles(*))"
            )
            .eq("id", arg.id)
            .single();

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
          console.error("Error at getRequestById", error);
          return {
            error: {
              message: "Error at getRequestById",
            },
          };
        }
      },
    }),
  }),
});

export const { useGetAllRequestQuery, useGetRequestByIdQuery } = requestApi;
