import { authApi } from "@/features/auth/api/authApi";
import { combineReducers } from "@reduxjs/toolkit";
import { authReducer } from "./state/authSlice";
import { rideApi } from "@/features/ride/api/rideApi";

const rootReducer = combineReducers({
  // SLICE

  auth: authReducer,

  // RTK QUERY
  [authApi.reducerPath]: authApi.reducer,
  [rideApi.reducerPath]: rideApi.reducer,
});

export const apis = [authApi, rideApi];
export const apisReducerPath = apis.map((api) => api.reducerPath);

export default rootReducer;
