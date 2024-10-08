import React, { useEffect, useState } from "react";
import { Table, Input, Button, Modal, Form, message, notification } from "antd";
import axios from "axios";
import SupportAdminNav from "../components/layout/SupportAdminNav";
import SupportAdminMenu from "../components/layout/SupportAdminMenu";
import Loader from "../components/layout/Loader";
import { useHistory } from "react-router-dom";
import "./SupportUserDashboard.css";

const { Search } = Input;
const apiUrl = process.env.REACT_APP_BACKEND_URL;

const SupportAllClients = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]); // For search
  const [loadingData, setLoadingData] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null); // Track hovered row
  const [searchTerm, setSearchTerm] = useState(""); // Track the search term
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingClient, setEditingClient] = useState(null); // Track client to edit
  const history = useHistory();
  const [form] = Form.useForm();
  const openNotificationWithIcon = (type, message, description) => {
    notification[type]({
      message,
      description,
      style: { marginTop: 100 },
    });
  };

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

  // Handle delete client
  const deleteClient = async (clientId) => {
    try {
      await axios.delete(`${apiUrl}/api/support/deleteclient/${clientId}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      openNotificationWithIcon(
        "success",
        "Success",
        "Client deleted successfully."
      );
      getClients(); // Refresh the clients list after deletion
    } catch (error) {
      openNotificationWithIcon(
        "error",
        "Error",
        "There is an issue in deleting the client"
      );
      console.error("Error deleting client:", error);
    }
  };

  // Handle edit client
  const handleEdit = (client) => {
    setEditingClient(client);
    form.setFieldsValue(client); // Pre-fill form with client data
    setIsModalVisible(true);
  };

  const handleUpdate = async () => {
    try {
      const updatedClient = await form.validateFields();
      await axios.put(
        `${apiUrl}/api/support/updateclient/${editingClient._id}`,
        updatedClient,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      openNotificationWithIcon(
        "success",
        "Success",
        "Client updated successfully."
      );
      setIsModalVisible(false);
      getClients(); // Refresh the clients list after updating
    } catch (error) {
      console.error("Error updating client:", error);
      openNotificationWithIcon(
        "error",
        "Error",
        "There is an issue in updating client."
      );
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
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <>
          <Button
            type="primary"
            onClick={() => handleEdit(record)}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Button type="danger" onClick={() => deleteClient(record._id)}>
            Delete
          </Button>
        </>
      ),
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

      {/* Edit Modal */}
      <Modal
        title="Edit Client"
        visible={isModalVisible}
        onOk={handleUpdate}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default SupportAllClients;
