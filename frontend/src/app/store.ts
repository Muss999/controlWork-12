import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { usersReducer } from "../features/users/usersSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist/es/constants";
import { recipesReducer } from "../features/recipes/recipesSlice";
import { commentsReducer } from "../features/comments/commentsSlice";

const userPersistConfig = {
  key: "music:users",
  storage,
  whiteList: ["user"],
};

const rootReducer = combineReducers({
  users: persistReducer(userPersistConfig, usersReducer),
  recipes: recipesReducer,
  comments: commentsReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    });
  },
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
