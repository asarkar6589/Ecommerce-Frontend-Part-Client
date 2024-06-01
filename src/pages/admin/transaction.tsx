import { ReactElement, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { userReducerInitialState } from "../../types/reducer-types";
import { useAllOrdersQuery } from "../../redux/api/orderAPI";
import toast from "react-hot-toast";
import { CustomeError } from "../../types/api-types";
import { Skeleton } from "../../components/Loader";

interface DataType {
  user: string;
  amount: number;
  discount: number;
  quantity: number;
  status: ReactElement;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Avatar",
    accessor: "user",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Discount",
    accessor: "discount",
  },
  {
    Header: "Quantity",
    accessor: "quantity",
  },
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Transaction = () => {
  const [rows, setRows] = useState<DataType[]>([]);

  const { user } = useSelector((state: { userReducer: userReducerInitialState }) => state.userReducer);

  const { isLoading, data, isError, error } = useAllOrdersQuery(user?._id!);

  if (isError) {
    toast.error((error as CustomeError).data.message)
  }


  useEffect(() => {
    if (data) {
      setRows(data.orders.map((i) => ({
        user: i.user?.name,
        amount: i.total,
        discount: i.discount,
        quantity: i.orderItems.length,
        status: <span className={i.status === "Processing" ? "red" : i.status === "Shipped" ? "green" : "purple"}>{i.status}</span>,
        action: <Link to={`/admin/transaction/${i._id}`}>Manage</Link>
      })))
    }
  }, [data]);

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Transactions",
    rows.length > 6
  )();
  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>
        {
          isLoading ? <Skeleton length={20} /> : Table
        }
      </main>
    </div>
  );
};

export default Transaction;