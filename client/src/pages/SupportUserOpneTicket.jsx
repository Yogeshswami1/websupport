import React, { useEffect, useState } from "react";
import SupportUserDashboardMenu from "../components/layout/SupportUserDashboardMenu";
import SupportNavbar from "../components/layout/SupportNavbar";
import "./SupportUserDashboard.css";
import axios from "axios";
import Loader from "../components/layout/Loader";
import UserLayout from "../components/layout/UserLayout";

const SupportUserOpenTicket = () => {
  const [tickets, setTickets] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  const getTicket = async () => {
    setLoadingData(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/support/openticket",
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setTickets(response.data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
    setLoadingData(false);
  };

  useEffect(() => {
    getTicket();
  }, []);

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-IN", options);
  };

  const getRowStyle = (status) => {
    switch (status) {
      case "pending":
        return { backgroundColor: "RGB(248,222,126)" };
      case "open":
        return { backgroundColor: "rgb(41,171,135)", color: "white" };
      case "closed":
        return { backgroundColor: "#F88379", color: "white" };
      default:
        return {};
    }
  };

  const handleRowClick = (id) => {
    window.location.href = `#${id}`;
  };

  return (
    <UserLayout>
      {/* <SupportNavbar /> */}
      <div className="main">
        <div className="menu">{/* <SupportUserDashboardMenu /> */}</div>
        <div className="content">
          {loadingData ? (
            <Loader />
          ) : tickets?.length > 0 ? (
            <table className="styled-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Status</th>
                  <th>Subject</th>
                  <th>Managers</th>
                  <th>Date Created</th>
                  <th>Date Updated</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    style={{ fontSize: "12px" }}
                    onClick={() => handleRowClick(ticket.id)}
                  >
                    <td>{ticket._id}</td>
                    <td style={getRowStyle(ticket.status)}>{ticket.status}</td>
                    <td>{ticket.description}</td>
                    <td>{ticket.manager}</td>
                    <td>{formatDate(ticket.dateCreated)}</td>
                    <td>{ticket.dateUpdated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "140px",
              }}
            >
              <h1>No data found</h1>
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
};

export default SupportUserOpenTicket;
