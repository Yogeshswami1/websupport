import React, { useEffect, useState } from "react";
import { Table, Input } from "antd";
import "./SupportUserDashboard.css";
import axios from "axios";
import SupportAdminNav from "../components/layout/SupportAdminNav";
import SupportAdminMenu from "../components/layout/SupportAdminMenu";
import Loader from "../components/layout/Loader";
import { useHistory } from "react-router-dom";

const { Search } = Input;
const apiUrl = process.env.REACT_APP_BACKEND_URL;

const SupportAllClients = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]); // For search
  const [loadingData, setLoadingData] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null); // Track hovered row
  const [searchTerm, setSearchTerm] = useState(""); // Track the search term
  const history = useHistory();

  const getClients = async () => {
    setLoadingData(true);
    try {
      const response = await axios.get(`${apiUrl}/api/support/getallclients`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      if (Array.isArray(response.data)) {
        setClients(response.data);
        setFilteredClients(response.data);
      } else {
        console.error("Error: API response is not an array", response.data);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
    setLoadingData(false);
  };

  useEffect(() => {
    getClients();
  }, []);

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (value === "") {
      setFilteredClients(clients);
    } else {
      const filtered = clients.filter(
        (client) =>
          client.name.toLowerCase().includes(value.toLowerCase()) ||
          client.email.toLowerCase().includes(value.toLowerCase()) ||
          client.platform.toLowerCase().includes(value.toLowerCase()) ||
          client.enrollmentNumber.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredClients(filtered);
    }
  };

  // Define columns for the table
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Platform",
      dataIndex: "platform",
      key: "platform",
    },
    {
      title: "Enrollment Number",
      dataIndex: "enrollmentNumber",
      key: "enrollmentNumber",
    },
    {
      title: "Password",
      dataIndex: "password",
      key: "password",
    },
    {
      title: "Date of Joining",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => new Date(createdAt).toLocaleDateString(),
    },
  ];

  return (
    <>
      <SupportAdminNav />
      <div className="smain">
        <div className="smenu">
          <SupportAdminMenu />
        </div>
        <div className="scontent">
          <Search
            placeholder="Search clients by name, email, platform, or enrollment number"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            enterButton
            style={{ marginBottom: "20px", width: "40%" }}
          />

          {loadingData ? (
            <Loader />
          ) : filteredClients.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <Table
                bordered
                columns={columns}
                dataSource={filteredClients.map((client) => ({
                  key: client._id, // Unique key for each row
                  ...client,
                }))}
                pagination={{ pageSize: 10 }}
                rowClassName={(record) =>
                  hoveredRow === record._id ? "table-row-hover" : ""
                }
                onRow={(record) => ({
                  onMouseEnter: () => setHoveredRow(record._id), // Set hovered row
                  onMouseLeave: () => setHoveredRow(null), // Reset hovered row
                  onClick: () => {
                    // Handle row click (optional)
                    console.log("Row clicked", record);
                  },
                })}
              />
            </div>
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
    </>
  );
};

export default SupportAllClients;
