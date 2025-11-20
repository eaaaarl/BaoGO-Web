import { supabase } from "@/lib/supabase";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { Profile } from "./interface";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["getAllUser"],
  endpoints: (builder) => ({
    getAllUsers: builder.query<Profile[], { currentUserId: string }>({
      queryFn: async ({ currentUserId }) => {
        try {
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .neq("id", currentUserId);

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
      providesTags: ["getAllUser"],
    }),

    editUserProfile: builder.mutation<
      {
        meta: {
          success: boolean;
          message: string;
        };
      },
      { full_name: string; phone_number: string; user_id: string }
    >({
      queryFn: async ({ full_name, phone_number, user_id }) => {
        const { error } = await supabase
          .from("profiles")
          .update({
            full_name: full_name,
            phone_number: phone_number,
          })
          .eq("id", user_id);

        if (error) {
          return {
            error: {
              message: error.message,
            },
          };
        }

        return {
          data: {
            meta: {
              success: true,
              message: "Profiles updated",
            },
          },
        };
      },
      invalidatesTags: ["getAllUser"],
    }),

    suspendUserProfile: builder.mutation<
      {
        meta: { success: boolean; message: string };
      },
      { userId: string }
    >({
      queryFn: async ({ userId }) => {
        const { error } = await supabase
          .from("profiles")
          .update({
            status: "suspended",
          })
          .eq("id", userId);

        if (error) {
          return {
            error: {
              message: error.message,
            },
          };
        }

        return {
          data: {
            meta: {
              success: true,
              message: "Profile suspended",
            },
          },
        };
      },
      invalidatesTags: ["getAllUser"],
    }),

    activateUserProfile: builder.mutation<
      {
        meta: { success: boolean; message: string };
      },
      { userId: string }
    >({
      queryFn: async ({ userId }) => {
        const { error } = await supabase
          .from("profiles")
          .update({
            status: "active",
          })
          .eq("id", userId);

        if (error) {
          return {
            error: {
              message: error.message,
            },
          };
        }

        return {
          data: {
            meta: {
              success: true,
              message: "Profile activated",
            },
          },
        };
      },
      invalidatesTags: ["getAllUser"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useEditUserProfileMutation,
  useSuspendUserProfileMutation,
  useActivateUserProfileMutation,
} = userApi;
