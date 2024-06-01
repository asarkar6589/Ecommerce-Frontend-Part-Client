import { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import { Skeleton } from "../../components/Loader";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { useGetAllProductsQuery } from "../../redux/api/productAPI";
import { server } from "../../redux/store";
import { CustomeError } from "../../types/api-types";
import { userReducerInitialState } from "../../types/reducer-types";

interface DataType {
  photo: ReactElement;
  name: string;
  price: number;
  stock: number;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Photo",
    accessor: "photo",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Price",
    accessor: "price",
  },
  {
    Header: "Stock",
    accessor: "stock",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Products = () => {
  const { user } = useSelector((state: { userReducer: userReducerInitialState }) => state.userReducer);

  // we have to pass the user, so we can get it from user
  const { isLoading, error, data } = useGetAllProductsQuery(user?._id!);
  const [rows, setRows] = useState<DataType[]>([]);

  if (error) {
    toast.error((error as CustomeError).data.message)
  }

  // this line causes error i.e infinite re-rendering, so to avoid this, we will write this in useEffect 
  useEffect(() => {
    if (data) {
      setRows(data.products.map((i) => ({
        photo: <img src={`${server}/${i.photo}`} />,
        name: i.name,
        price: i.price,
        stock: i.stock,
        action: <Link to={`/admin/product/${i._id}`}>Manage</Link>,
      })))
    }
  }, [data]);

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Products",
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
      <Link to="/admin/product/new" className="create-product-btn">
        <FaPlus />
      </Link>
    </div>
  );
};

export default Products;
