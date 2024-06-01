import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { VscError } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CartItems from "../components/CartItems";
import { addToCart, calculatePrice, discountApplied, removeCartItem } from "../redux/reducer/cartReducer";
import { server } from "../redux/store";
import { cartReducerInitialState } from "../types/reducer-types";
import { CartItem } from "../types/types";

const Cart = () => {
    const { cartItems, subTotal, tax, shippingCharges, discount, total } = useSelector((state: { cartReducer: cartReducerInitialState }) => state.cartReducer);

    const dispatch = useDispatch();

    const [couponCode, setCouponCode] = useState<string>("");
    const [isValidcouponCode, setIsValidCouponCode] = useState<boolean>(false);

    const incrementHandeler = (cartItem: CartItem) => {
        // we are just increasing the quantity in the state, so we are doing it like this.
        if (cartItem.quantity >= cartItem.stock) {
            toast.error("Product is Out of Stock");
            return;
        }
        dispatch(addToCart({
            ...cartItem,
            quantity: cartItem.quantity + 1
        }));
    }
    const decrementHandeler = (cartItem: CartItem) => {
        // we are just increasing the quantity in the state, so we are doing it like this.
        if (cartItem.quantity <= 1) {
            return;
        }

        dispatch(addToCart({
            ...cartItem,
            quantity: cartItem.quantity - 1
        }));
    }
    const removeHandeler = (id: string) => {
        // we are just increasing the quantity in the state, so we are doing it like this.
        dispatch(removeCartItem(id));
    }

    useEffect(() => {
        /*
        
            Now we have to improve the performance of the code. The problem is that if we slow the net speed and only focus on fetch/xhr request, then multiple requests are pending at the same time. So we dont want that.
        
        */

        const { token, cancel } = axios.CancelToken.source();
        const timeOutId = setTimeout(() => {
            axios.get(`${server}/api/v1/payment/discount?coupon=${couponCode}`, {
                cancelToken: token,
            })
                .then((res) => {
                    // here we will get the amount of discount and then we will make another reducer in the cart state.
                    dispatch(discountApplied(res.data.discount));
                    setIsValidCouponCode(true);
                    dispatch(calculatePrice());
                })
                .catch(() => {
                    // if error comes then we will set the discount to 0, it is an important step.
                    dispatch(discountApplied(0));
                    setIsValidCouponCode(false);
                    dispatch(calculatePrice());
                });
        }, 1000);

        return () => {
            clearTimeout(timeOutId);

            cancel();
            /*
            
                now this is a function, it works like abort controller. It will cancel the fetch requests. Now if the net speed is slow and the user keeps on pressing the button, the prev request will be cancelled.
            
            */

            setIsValidCouponCode(false);
        }
    }, [couponCode]);

    // the moment cartItems will be changed, this will be called.
    useEffect(() => {
        dispatch(calculatePrice());
    }, [cartItems]);

    return (
        <div className="cart">
            <main>
                {
                    cartItems.length > 0 ? cartItems.map((i, idx) => (
                        <CartItems
                            incrementHandeler={incrementHandeler}
                            decrementHandeler={decrementHandeler}
                            removeHandeler={removeHandeler}
                            key={idx}
                            cartItem={i}
                        />
                    )) : (
                        <h1>No Items Added.</h1>
                    )
                }
            </main>
            <aside>
                <p>Subtotal : ₹{subTotal}</p>
                <p>Shipping Charges : ₹{shippingCharges}</p>
                <p>Tax : ₹{tax}</p>
                <p>
                    Discount : <em className="red"> - ₹{discount}</em>
                </p>
                <p>
                    <b>Total : ₹{total}</b>
                </p>

                <input type="text" placeholder="Coupon Code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />

                {
                    couponCode && (
                        isValidcouponCode ?
                            (
                                <span className="green">
                                    ₹{discount} off using the <code>{couponCode}</code>
                                </span>
                            ) :
                            (
                                <span className="red">Invalid Coupon Code <VscError /></span>
                            )
                    )
                }

                {
                    cartItems.length > 0 && <Link to={"/shipping"}>Checkout</Link>
                }
            </aside>
        </div>
    )
}

export default Cart;
