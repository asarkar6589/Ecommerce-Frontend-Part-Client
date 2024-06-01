import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AllCategoriesResponse, AllProductsResponse, DeleteProductRequest, MessageResponse, NewProductRequest, ProductResponse, SearchProductsRequest, SearchProductsResponse, UpdateProductRequest } from "../../types/api-types";

export const productAPI = createApi({
    reducerPath: "productApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/product/`
    }),
    tagTypes: ["product"],
    endpoints: (builder) => ({
        // in query, it direct returns the url that is to be attached on the last of the product.
        latestProducts: builder.query<AllProductsResponse, string>({
            // we can pass anything in place of string, because there is no arguments going in the query.
            query: () => "latest",
            providesTags: ["product"]
        }),
        getAllProducts: builder.query<AllProductsResponse, string>({
            query: (id) => `admin-products?id=${id}`,
            providesTags: ["product"]
        }),
        categories: builder.query<AllCategoriesResponse, string>({
            query: () => `categories`,
            providesTags: ["product"]
        }),
        searchProducts: builder.query<SearchProductsResponse, SearchProductsRequest>({
            query: ({price, search, sort, category, page}) => {
                let baseQuery = `all?search=${search}&page=${page}`;

                if (price) {
                    baseQuery += `&price=${price}`;
                }

                if (sort) {
                    baseQuery += `&sort=${sort}`;
                }

                if (category) {
                    baseQuery += `&category=${category}`;
                }

                return baseQuery
            },
            providesTags: ["product"]
        }),
        NewProduct: builder.mutation<MessageResponse, NewProductRequest>({
            query: ({formData, id}) => ({
                url: `new?id=${id}`,
                method: 'POST',
                body: formData
            }),
            invalidatesTags: ["product"],
        }),
        productDetails: builder.query<ProductResponse, string>({
            // we can pass anything in place of string, because there is no arguments going in the query.
            query: (id) => id,
            providesTags: ["product"]
        }),
        UpdateProduct: builder.mutation<MessageResponse, UpdateProductRequest>({
            query: ({formData, userId, productId}) => ({
                url: `${productId}?id=${userId}`,
                method: 'PUT',
                body: formData
            }),
            invalidatesTags: ["product"],
        }),
        DeleteProduct: builder.mutation<MessageResponse, DeleteProductRequest>({
            query: ({userId, productId}) => ({
                url: `${productId}?id=${userId}`,
                method: 'DELETE'
            }),
            invalidatesTags: ["product"],
        }),
    })
});

export const {
    useLatestProductsQuery, 
    useGetAllProductsQuery, 
    useCategoriesQuery, 
    useSearchProductsQuery, 
    useNewProductMutation, 
    useProductDetailsQuery,
    useUpdateProductMutation,
    useDeleteProductMutation
} = productAPI;
