import { configureStore } from "@reduxjs/toolkit";
import { productAPI } from "./api/productAPI";
import { userAPI } from "./api/userAPI";
import { userReducer } from "./reducer/userReducer";
import { cartReducer } from "./reducer/cartReducer";
import { orderAPI } from "./api/orderAPI";
import { dashboardAPI } from "./api/dashboardAPI";

export const server = import.meta.env.VITE_SERVER; // backend server link

export const store = configureStore({
    // all the reducers will be passed here
    reducer: {
        [userAPI.reducerPath]: userAPI.reducer,
        [productAPI.reducerPath]: productAPI.reducer,
        [orderAPI.reducerPath]: orderAPI.reducer,
        [dashboardAPI.reducerPath]: dashboardAPI.reducer,
        [userReducer.name]: userReducer.reducer,
        [cartReducer.name]: cartReducer.reducer,
    },
    // here we have to add the middlewares too but only when we have to add api's
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(userAPI.middleware).concat(productAPI.middleware, orderAPI.middleware, dashboardAPI.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
