import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { cartReducerInitialState } from "../../types/reducer-types";
import { CartItem, ShippingInfo } from "../../types/types";

const initialState: cartReducerInitialState = {
    loading: false,
    cartItems: [],
    subTotal: 0,
    tax: 0,
    shippingCharges: 0,
    discount: 0,
    total: 0,
    shippingInfo: {
        address: "",
        city: "",
        state: "",
        country: "",
        pinCode: ""
    }
}

export const cartReducer = createSlice({
    name: 'cartReducer',
    initialState,
    reducers: {
        addToCart: (state, action:PayloadAction<CartItem>) => {
            state.loading = true;

            /*
            
                So there was a problem with this code, when we are adding the same item to the cart, it was appearing 2 times, but that should not happen, rather it's quantity should be increased. So we are doing this thing to handel it.
            
            */
            const index = state.cartItems.findIndex((i) => i.productId === action.payload.productId);

            if (index !== -1) {
                state.cartItems[index] = action.payload;
            }
            else {
                state.cartItems.push(action.payload);
            }

            state.loading = false;
        },
        removeCartItem: (state, action:PayloadAction<string>) => {
            // we just want the product id which we want to delete.
            state.loading = true;
            state.cartItems = state.cartItems.filter((i) => i.productId != action.payload);
            state.loading = false;
        },
        calculatePrice: (state) => {
            let subtotal = 0;

            // instead of this we could have use reduce()
            for (let index = 0; index < state.cartItems.length; index++) {
                const item = state.cartItems[index];
                subtotal += item.price * item.quantity;
            }

            state.subTotal = subtotal;
            state.shippingCharges = state.subTotal > 1000 ? 0 : 200;
            state.tax = Math.round(state.subTotal * 0.18); // 18% tax
            state.total = state.subTotal + state.shippingCharges + state.tax - state.discount;
        },
        discountApplied: (state, action: PayloadAction<number>) => {
            state.discount = action.payload;
        },
        // mainly for payement purpose
        saveShpiingInfo: (state, action:PayloadAction<ShippingInfo>) => {
            state.shippingInfo = action.payload;
        },
        resetCart: () => initialState
    }
});

export const {addToCart, removeCartItem, calculatePrice, discountApplied, saveShpiingInfo, resetCart} = cartReducer.actions;
