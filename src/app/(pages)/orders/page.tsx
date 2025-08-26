import { FC } from "react";
import OrderTable from "@/app/components/table/order-table";

const Orders: FC = () => {
  return (
    <div className="page">
      <h1 className="title">Orders</h1>

      <OrderTable />
    </div>
  )
};

export default Orders;