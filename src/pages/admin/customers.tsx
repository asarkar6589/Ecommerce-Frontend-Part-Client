import { ReactElement, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useAllUserQuery, useDeleteUserMutation } from "../../redux/api/userAPI";
import { CustomeError } from "../../types/api-types";
import toast from "react-hot-toast";
import { Skeleton } from "../../components/Loader";
import { responseToast } from "../../utils/features";

interface DataType {
  avatar: ReactElement;
  name: string;
  email: string;
  gender: string;
  role: string;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Avatar",
    accessor: "avatar",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Gender",
    accessor: "gender",
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "Role",
    accessor: "role",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Customers = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const { data, isLoading, isError, error } = useAllUserQuery(user?._id!);
  const [rows, setRows] = useState<DataType[]>([]);

  const [deleteUser] = useDeleteUserMutation();

  if (isError) {
    const err = error as CustomeError
    toast.error(err.data.message)
  }

  const deleteHandeler = async (userId: string) => {
    try {
      const res = await deleteUser({ userId, adminUserId: user?._id! });
      responseToast(res, null, "");
    } catch (error) {

    }
  }

  useEffect(() => {
    if (data) {
      setRows(data.users.map(i => ({
        avatar: <img src={i.photo} alt={i.name} style={{
          borderRadius: "50%"
        }} />,
        name: i.name,
        email: i.email,
        gender: i.gender,
        role: i.role,
        action: <button onClick={() => deleteHandeler(i._id)}><FaTrash /></button>
      })))
    }
  }, [data]);

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Customers",
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

export default Customers;
