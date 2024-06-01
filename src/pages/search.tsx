import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Skeleton } from "../components/Loader";
import ProductCard from "../components/ProductCard";
import { useCategoriesQuery, useSearchProductsQuery } from "../redux/api/productAPI";
import { addToCart } from "../redux/reducer/cartReducer";
import { CustomeError } from "../types/api-types";
import { CartItem } from "../types/types";

const Search = () => {
    const { data: categoriesResponse, isLoading: LoadingCategories, error } = useCategoriesQuery("");

    const dispatch = useDispatch();

    if (error) {
        toast.error((error as CustomeError).data.message)
    }

    const [search, setSearch] = useState<string>("");
    const [sort, setSort] = useState<string>("");
    const [category, setCategory] = useState<string>("");
    const [maxPrice, setMaxPrice] = useState<number>(100000);
    const [page, setPage] = useState<number>(1); // pagination.

    const { isLoading: ProductLoading, data: SearchedData, isError: productIsError, error: productError } = useSearchProductsQuery({
        search,
        sort,
        category,
        price: maxPrice,
        page
    });

    if (productIsError) {
        toast.error((productError as CustomeError).data.message)
    }

    const addToCartHandeler = (cartItem: CartItem) => {
        if (cartItem.stock < 1) {
            toast.error("Out of stock");
        }
        else {
            dispatch(addToCart(cartItem));
            toast.success("Added to cart");
        }
    }

    const isPrevPage = page == 1 ? false : true;
    const isNextPage = page == 4 ? false : true;

    return (
        <div className="product-search-page">
            <aside>
                <h2>Filters</h2>

                <div>
                    <h4>Sort</h4>
                    <select value={sort} onChange={(e) => setSort(e.target.value)}>
                        <option value="">None</option>
                        {/* the value should that is used here should be used in banckend too */}
                        <option value="asc">Price (Low to Hight)</option>
                        <option value="dsc">Price (High to low)</option>
                    </select>
                </div>

                <div>
                    <h4>Max Price : {maxPrice || " "}</h4>
                    <input type="range"
                        min={100}
                        max={100000}
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                    />
                </div>

                <div>
                    <h4>Category</h4>
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="">ALL</option>
                        {
                            !LoadingCategories && categoriesResponse?.categories.map((i, idx) => (
                                <option key={idx} value={i}>
                                    {
                                        i.toUpperCase()
                                    }
                                </option>
                            ))
                        }
                    </select>
                </div>
            </aside>

            <main>
                <h1>Products</h1>
                <input type="text" name="search" id="search" placeholder="Search By Name" value={search} onChange={(e) => setSearch(e.target.value)} />

                {
                    ProductLoading ? <Skeleton length={10} /> : (
                        <div className="search-product-list">
                            {
                                SearchedData?.products.map((i) => (
                                    <ProductCard
                                        productId={i._id}
                                        name={i.name}
                                        price={i.price}
                                        stock={i.stock}
                                        handeler={addToCartHandeler}
                                        photo={i.photo}
                                        key={i._id}
                                    />
                                ))
                            }
                        </div>
                    )
                }

                {
                    SearchedData && SearchedData.totalPage > 1 && (
                        <article>
                            {/* 
                    
                                So, basically we are creating 2 variables isNextPage and isPreviousPage which are both boolean which tells us that wether we have prev page or wether we have next page.
                    
                            */}
                            <button
                                disabled={!isPrevPage}
                                onClick={() => setPage(prev => prev - 1)}
                            >
                                Prev
                            </button>

                            <span>{page} of {SearchedData.totalPage}</span>

                            <button
                                disabled={!isNextPage}
                                onClick={() => setPage(prev => prev + 1)}
                            >
                                Next
                            </button>
                        </article>
                    )
                }
            </main>
        </div>
    )
}

export default Search;
