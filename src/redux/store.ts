import authReducer from "./slices/authSlice";
import { configureStore, combineReducers } from "@reduxjs/toolkit";

// Discard the previous persisted session, including any browser-readable access token.
// Authentication now lives only in memory; the HttpOnly cookie restores a session.
try { window.localStorage.removeItem("persist:root"); } catch { /* Storage may be disabled. */ }

const rootReducer = combineReducers({ auth: authReducer });
export const store = configureStore({ reducer: rootReducer, devTools: import.meta.env.DEV });
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
