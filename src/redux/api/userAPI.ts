import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import axios from "axios";
import { AllUserResponse, DeleteUserRequest, MessageResponse, UserResponse } from "../../types/api-types";
import { User } from "../../types/types";

export const userAPI = createApi({
    reducerPath: "userAPI", // we can give any name.
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/user/`
    }),
    tagTypes: ["users"],
    endpoints: (builder) => (
        {
            // this function returns a object
            login: builder.mutation<MessageResponse, User>({
                // first one is the return type of the the function and the second one that is User is the type of the "user" in the query
                query: (user) => ({
                    url: "new", // this will be attached at the end of the baseUrl
                    method: "POST",
                    body: user
                }),
                invalidatesTags: ["users"]
            }),
            deleteUser: builder.mutation<MessageResponse, DeleteUserRequest>({
                query: ({userId, adminUserId}) => ({
                    url: `${userId}?id=${adminUserId}`, 
                    method: "DELETE",
                }),
                invalidatesTags: ["users"]
            }),
            allUser: builder.query<AllUserResponse, string>({
                query: (id) => `all?id=${id}`,
                providesTags: ["users"]
            })
        }
    )
});

export const getUser = async(id: string) => {
    try {
        const {data} : {data: UserResponse} = await axios.get(`${import.meta.env.VITE_SERVER}/api/v1/user/${id}`);

        return data;
    } catch (error) {
        throw error;
    }
}

export const {useLoginMutation, useDeleteUserMutation, useAllUserQuery} = userAPI; // now we cant use it like this, we have to add it in our store.
