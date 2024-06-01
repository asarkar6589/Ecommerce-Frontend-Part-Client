import { FaPlus } from "react-icons/fa";
import { server } from "../redux/store";
import { CartItem } from "../types/types";

export type ProductProps = {
    productId: string,
    photo: string,
    name: string,
    price: number,
    stock: number,
    handeler: (cartItem: CartItem) => void,
}

const ProductCard = ({ productId, stock, price, name, photo, handeler }: ProductProps) => {
    return (
        <div className="product-Card">
            <img src={`${server}/${photo}`} alt={name} />
            <p>{name}</p>
            <span>₹{price}</span>

            {/*  */}
            <div>
                <button onClick={() => handeler({
                    price,
                    name,
                    photo,
                    productId,
                    quantity: 1,
                    stock
                })}><FaPlus /></button>
            </div>
        </div>
    )
}

export default ProductCard;