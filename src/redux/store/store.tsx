// Redux Imports
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";

// Reducers
import { tonReducer } from "../reducers/ton_payment_reducer/payment_reducer";



const store = configureStore({
  reducer: {
    ton: tonReducer,
  },
  middleware: getDefaultMiddleware({
    serializableCheck: false,
    immutableCheck: false,
  }),
});

// TYPES
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
