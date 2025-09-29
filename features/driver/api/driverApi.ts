import { supabase } from "@/lib/supabase";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { Driver } from "./interface";

export const driverApi = createApi({
  reducerPath: "driverApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getAllDriver: builder.query<Driver[], void>({
      queryFn: async () => {
        try {
          const { data, error } = await supabase
            .from("driver_profiles")
            .select(`*,profiles(*),rides(*)`);

          if (error) {
            return {
              error: {
                message: error.message,
              },
            };
          }

          console.log("Drivers", JSON.stringify(data, null, 2));

          return {
            data,
          };
        } catch (error) {
          console.error("Error at getAllDriver", error);
          return {
            error: {
              message: "Error at getAllDriver",
            },
          };
        }
      },
    }),
  }),
});

export const { useGetAllDriverQuery } = driverApi;
