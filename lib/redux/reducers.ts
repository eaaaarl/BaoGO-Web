import { authApi } from "@/features/auth/api/authApi";
import { combineReducers } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
  authApi: authApi.reducer,
});

export const apis = [authApi];
export const apisReducerPath = apis.map((api) => api.reducerPath);

export default rootReducer;
