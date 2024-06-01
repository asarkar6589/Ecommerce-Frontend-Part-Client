import { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import { Skeleton } from "../components/Loader";
import TableHOC from "../components/admin/TableHOC";
import { useMyOrdersQuery } from "../redux/api/orderAPI";
import { CustomeError } from "../types/api-types";
import { userReducerInitialState } from "../types/reducer-types";

type DataType = {
    _id: string,
    amount: number;
    quantity: number;
    discount: number;
    status: ReactElement;
    action: ReactElement;
}

const column: Column<DataType>[] = [
    {
        Header: "ID",
        accessor: "_id"
    },
    {
        Header: "Quantity",
        accessor: "quantity"
    },
    {
        Header: "Discount",
        accessor: "discount"
    },
    {
        Header: "Amount",
        accessor: "amount"
    },
    {
        Header: "Status",
        accessor: "status"
    },
    {
        Header: "Action",
        accessor: "action"
    },
]

const Orders = () => {
    const { user } = useSelector((state: { userReducer: userReducerInitialState }) => state.userReducer);

    const { isLoading, data, isError, error } = useMyOrdersQuery(user?._id!);

    if (isError) {
        toast.error((error as CustomeError).data.message)
    }

    const [rows, setRows] = useState<DataType[]>([]);

    const table = TableHOC<DataType>(column, rows, "dashboard-product-box", "Orders")();

    useEffect(() => {
        if (data) {
            setRows(data.orders.map((i) => ({
                _id: i._id,
                user: i.user.name,
                amount: i.total,
                discount: i.discount,
                quantity: i.orderItems.length,
                status: <span className={i.status === "Processing" ? "red" : i.status === "Shipped" ? "green" : "purple"}>{i.status}</span>,
                action: <Link to={`/admin/transaction/${i._id}`}>Manage</Link>
            })))
        }
    }, [data]);

    return (
        <div className="container">
            <h1>My Orders</h1>
            {
                isLoading ? <Skeleton length={20} /> : table
            } {/* Higher order function */}
        </div>
    )
}

export default Orders;