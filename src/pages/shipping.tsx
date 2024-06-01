import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { cartReducerInitialState } from "../types/reducer-types";
import axios from "axios";
import { server } from "../redux/store";
import toast from "react-hot-toast";
import { saveShpiingInfo } from "../redux/reducer/cartReducer";

const Shipping = () => {
    const { cartItems, total } = useSelector((state: { cartReducer: cartReducerInitialState }) => state.cartReducer);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [shippingInfo, setShippingInfo] = useState({
        address: "",
        city: "",
        state: "",
        country: "",
        pinCode: "",
    });

    const changeHandeler = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setShippingInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    useEffect(() => {
        if (cartItems.length <= 0) {
            return navigate("/cart");
        }
    }, [cartItems]);

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        dispatch(saveShpiingInfo(shippingInfo))

        try {
            const { data } = await axios.post(`${server}/api/v1/payment/create`, {
                amount: total
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            navigate("/pay", {
                state: data.clientSecret
            })
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong")
        }
    }

    return (
        <div className="shipping">
            <button className="back-btn" onClick={() => navigate("/cart")}><BiArrowBack /></button>

            <form onSubmit={submitHandler}>
                <h1>Shipping Address</h1>

                <input required type="text" placeholder="Enter Your Address" name="address" value={shippingInfo.address} onChange={changeHandeler} />

                <input required type="text" placeholder="Enter Your City" name="city" value={shippingInfo.city} onChange={changeHandeler} />

                <select name="country" value={shippingInfo.country} onChange={changeHandeler}>
                    <option value="choose">Choose Country</option>
                    <option value="in">India</option>
                    <option value="us">USA</option>
                    <option value="uk">UK</option>
                    <option value="eu">Europe</option>
                </select>

                <input required type="number" placeholder="Enter Your Pin Code" name="pinCode" value={shippingInfo.pinCode} onChange={changeHandeler} />

                <button type="submit">Pay Now</button>
            </form>
        </div>
    )
}

export default Shipping;
