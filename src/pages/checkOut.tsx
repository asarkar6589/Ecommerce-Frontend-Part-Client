import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import toast from "react-hot-toast";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { newOrderRequest } from "../types/api-types";
import { useDispatch, useSelector } from "react-redux";
import { useNewOrderMutation } from "../redux/api/orderAPI";
import { resetCart } from "../redux/reducer/cartReducer";
import { responseToast } from "../utils/features";
import { RootState } from "../redux/store";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

const CheckOutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector((state: RootState) => state.userReducer);
    // const { user } = useSelector((state: { userReducer: userReducerInitialState }) => state.userReducer);

    const {
        shippingInfo,
        cartItems,
        subTotal,
        tax,
        discount,
        shippingCharges,
        total
    } = useSelector((state: RootState) => state.cartReducer);

    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const [newOrder] = useNewOrderMutation();

    const submitHandeler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!stripe || !elements) {
            return;
        }
        setIsProcessing(true);

        const orderData: newOrderRequest = {
            shippingInfo,
            orderItems: cartItems,
            subTotal,
            tax,
            discount,
            shippingCharges,
            total,
            user: user?._id!
        }

        // actual payement
        const { paymentIntent, error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: window.location.origin
            },
            redirect: "if_required"
        });

        if (error) {
            setIsProcessing(false);
            return toast.error(error.message || "Something went wrong");
        }

        if (paymentIntent.status === "succeeded") {
            const res = await newOrder(orderData);
            dispatch(resetCart());
            responseToast(res, navigate, "/orders");
        }

        setIsProcessing(false);
    }
    return (
        <div className="checkout-container">
            <form onSubmit={submitHandeler}>
                <PaymentElement />
                <button type="submit" disabled={isProcessing}>
                    {
                        isProcessing ? "Processing..." : "Pay"
                    }
                </button>
            </form>
        </div>
    )
}

const CheckOut = () => {
    // here we need 2 things after comming from shipping.tsx

    const location = useLocation();
    const clientSecret: string | undefined = location.state;

    if (!clientSecret) {
        return <Navigate to="/shipping" />
    }
    return (
        <Elements options={{
            clientSecret
        }} stripe={stripePromise}>
            <CheckOutForm />
        </Elements>
    )
}

export default CheckOut;
