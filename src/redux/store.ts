import authReducer from "./slices/authSlice";
import { configureStore, combineReducers } from "@reduxjs/toolkit";

try { window.localStorage.removeItem("persist:root"); } catch { /* Storage may be disabled. */ }

const rootReducer = combineReducers({ auth: authReducer });
export const store = configureStore({ reducer: rootReducer, devTools: import.meta.env.DEV });
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
