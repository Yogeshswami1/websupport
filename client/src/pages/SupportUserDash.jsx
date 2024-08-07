import React, { useEffect, useState } from "react";
import SupportUserDashboardMenu from "../components/layout/SupportUserDashboardMenu";
import SupportNavbar from "../components/layout/SupportNavbar";
import "./SupportUserDashboard.css";
import Loader from "../components/layout/Loader";
import { useHistory } from "react-router-dom";
import ListIcon from "@mui/icons-material/List";
import axios from "axios";
import { Form, Select, Input } from "antd";
import UserLayout from "../components/layout/UserLayout";

const { Option } = Select;

const SupportUserDash = () => {
  const history = useHistory();
  const [tickets, setTickets] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [ticketIdFilter, setTicketIdFilter] = useState(""); // New state for ticket ID filter

  const getTicket = async () => {
    setLoadingData(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/support/getticket",
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      const sortedTickets = response.data.sort(
        (a, b) => new Date(b.dateCreated) - new Date(a.dateCreated)
      );
      setTickets(sortedTickets);
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
        return { backgroundColor: "RGB(248,222,126)" };
    }
  };

  const handleRowClick = (id) => {
    history.push(`/supportuserticketdetails/${id}`);
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
  };

  const handleTicketIdChange = (e) => {
    setTicketIdFilter(e.target.value);
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesStatus = statusFilter ? ticket.status === statusFilter : true;
    const matchesTicketId = ticketIdFilter
      ? ticket.ticketId.toString().includes(ticketIdFilter)
      : true;
    return matchesStatus && matchesTicketId;
  });

  return (
    <UserLayout>
      <div className="main">
        <div className="menu ">{/* <SupportUserDashboardMenu /> */}</div>
        <div className="filter-bar">
          <Form layout="inline">
            <Form.Item label="Filter by Status">
              <Select
                placeholder="Select status"
                onChange={handleStatusChange}
                allowClear
                style={{ width: 200 }}
              >
                <Option value="closed">Resolved</Option>
                <Option value="open">Unresolved</Option>
                <Option value="Waiting for customer reply">
                  Waiting for Customer Reply
                </Option>
                <Option value="Waiting for manager reply">
                  waiting for manager reply
                </Option>
              </Select>
            </Form.Item>
            <Form.Item label="Filter by Ticket ID">
              <Input
                placeholder="Enter ticket id here..."
                onChange={handleTicketIdChange}
                style={{ width: 200 }}
              />
            </Form.Item>
          </Form>
        </div>
        <div className="content">
          {loadingData ? (
            <Loader />
          ) : filteredTickets?.length > 0 ? (
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
                {filteredTickets.map((ticket) => (
                  <tr
                    key={ticket._id}
                    style={{ fontSize: "12px" }}
                    onClick={() => handleRowClick(ticket._id)}
                  >
                    <td>TCK{ticket.ticketId}</td>
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

export default SupportUserDash;
