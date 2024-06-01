import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { server } from "../redux/store";
import { CartItem } from "../types/types";

export type CartItemsProps = {
    cartItem: CartItem,
    incrementHandeler: (cartItem: CartItem) => void
    decrementHandeler: (cartItem: CartItem) => void
    removeHandeler: (id: string) => void
}

const CartItems = ({ cartItem, incrementHandeler, decrementHandeler, removeHandeler }: CartItemsProps) => {
    const { photo, productId, name, price, quantity } = cartItem;

    return (
        <div className="cart-item">
            <img src={`${server}/${photo}`} alt={name} />

            <article>
                <Link to={`/product/${productId}`}>{name}</Link>
                <span>₹{price}</span>
            </article>

            <div>
                <button onClick={() => decrementHandeler(cartItem)}>-</button>
                <p>{quantity}</p>
                <button onClick={() => incrementHandeler(cartItem)}>+</button>
            </div>

            <button onClick={() => removeHandeler(productId)}>
                <FaTrash />
            </button>
        </div>
    )
}

export default CartItems;
