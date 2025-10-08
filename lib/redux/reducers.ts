import { authApi } from "@/features/auth/api/authApi";
import { combineReducers } from "@reduxjs/toolkit";
import { authReducer } from "./state/authSlice";
import { rideApi } from "@/features/ride/api/rideApi";
import { driverApi } from "@/features/driver/api/driverApi";
import { userApi } from "@/features/user/api/userApi";
import { requestApi } from "@/features/request/api/requestApi";
import { dashboardApi } from "@/features/dashboard/api/dashboardApi";

const rootReducer = combineReducers({
  // SLICE

  auth: authReducer,

  // RTK QUERY
  [authApi.reducerPath]: authApi.reducer,
  [rideApi.reducerPath]: rideApi.reducer,
  [driverApi.reducerPath]: driverApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [requestApi.reducerPath]: requestApi.reducer,
  [dashboardApi.reducerPath]: dashboardApi.reducer,
});

export const apis = [
  authApi,
  rideApi,
  driverApi,
  userApi,
  requestApi,
  dashboardApi,
];
export const apisReducerPath = apis.map((api) => api.reducerPath);

export default rootReducer;
