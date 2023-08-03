import React, { useEffect, useState } from "react";
import UserNav from "../../components/nav/UserNav";
import { getUserOrders } from "../../functions/users";
import { useSelector, useDispatch } from "react-redux";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import ShowPaymentInfo from "../../components/cards/ShowPaymentInfo";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  PDFViewer,
} from "@react-pdf/renderer";
import Invoice from "../../components/order/Invoice";

const History = () => {
  const { user } = useSelector((state) => state.User);
  const [orders, setOrders] = useState([]);

  const showOrderInTable = (order) => {
    return (
      <table className="table table-bordered">
        <thead className="thead-light">
          <tr>
            <th scope="col">Title</th>
            <th scope="col">Price</th>
            <th scope="col">Brand</th>
            <th scope="col">Color</th>
            <th scope="col">Count</th>
            <th scope="col">Shipping</th>
          </tr>
        </thead>

        <tbody>
          {order.products.map((p, i) => {
            return (
              <tr key={i}>
                <td>
                  <b>{p.product.title}</b>
                </td>
                <td>
                  <b>{p.product.price}</b>
                </td>
                <td>
                  <b>{p.product.brand}</b>
                </td>
                <td>
                  <b>{p.product.color}</b>
                </td>
                <td>
                  <b>{p.count}</b>
                </td>
                <td>
                  <b>
                    {p.product.shipping === "Yes" ? (
                      <CheckCircleOutlined
                        style={{
                          color: "green",
                        }}
                      />
                    ) : (
                      <CloseCircleOutlined
                        style={{
                          color: "red",
                        }}
                      />
                    )}
                  </b>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  const showDownloadLink = (order) => (
    <PDFDownloadLink
      document={<Invoice order={order} />}
      fileName="invoice.pdf"
      className="btn btn-sm btn-block btn-outline-primary"
    >
      Download PDF
    </PDFDownloadLink>
  );

  const showEachOrders = () =>
    orders.map((order, i) => (
      <div key={i} className="m-5 p-3 card">
        <ShowPaymentInfo order={order} />
        {showOrderInTable(order)}
        <div className="row">
          <div className="col">{showDownloadLink(order)}</div>
        </div>
      </div>
    ));

  useEffect(() => {
    loadOrders();
  }, []);
  const loadOrders = async () => {
    getUserOrders(user.token).then((res) => {
      setOrders(res.data);
    });
  };
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="colmd-2">
          <UserNav />
        </div>
        <div className="col text-center">
          <h4>
            {orders.length > 0 ? "User purchase orders" : "No purchase orders"}
          </h4>

          {showEachOrders()}
        </div>
      </div>
    </div>
  );
};

export default History;
