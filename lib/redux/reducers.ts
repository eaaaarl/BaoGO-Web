import { authApi } from "@/features/auth/api/authApi";
import { combineReducers } from "@reduxjs/toolkit";
import { authReducer } from "./state/authSlice";
import { rideApi } from "@/features/ride/api/rideApi";
import { driverApi } from "@/features/driver/api/driverApi";

const rootReducer = combineReducers({
  // SLICE

  auth: authReducer,

  // RTK QUERY
  [authApi.reducerPath]: authApi.reducer,
  [rideApi.reducerPath]: rideApi.reducer,
  [driverApi.reducerPath]: driverApi.reducer,
});

export const apis = [authApi, rideApi, driverApi];
export const apisReducerPath = apis.map((api) => api.reducerPath);

export default rootReducer;
