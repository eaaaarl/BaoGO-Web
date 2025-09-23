import { supabase } from "@/lib/supabase";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    signIn: builder.mutation<any, { email: string; password: string }>({
      queryFn: async ({ email, password }) => {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            return {
              error: {
                message: error.message,
              },
            };
          }

          console.log(data, error);

          return {
            data,
            meta: {
              success: true,
              message: "Sign In successfully.",
            },
          };
        } catch (error) {
          console.error("Error at sign in", error);
          return {
            error: {
              message: "Error at sign in",
            },
          };
        }
      },
    }),

    singOut: builder.mutation<any, void>({
      queryFn: async () => {
        await supabase.auth.signOut();

        return {
          data: {
            success: true,
          },
        };
      },
    }),
  }),
});

export const { useSignInMutation, useSingOutMutation } = authApi;
