import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import { Card, Modal, Select, notification, Input, Form } from "antd";
import SupportAdminNav from "../components/layout/SupportAdminNav";
import SupportAdminMenu from "../components/layout/SupportAdminMenu";
import Loader from "../components/layout/Loader";
import { Button } from "@mui/material";

const apiUrl = process.env.REACT_APP_BACKEND_URL;
const { Option } = Select;

const SupportManagerDetails = () => {
  const { id } = useParams();
  const history = useHistory(); // Use history to navigate after deletion
  const [manager, setManager] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // New state for edit modal
  const [platforms, setPlatforms] = useState([]);
  const [selectedPlatform, setSelectedPlatform] = useState(null);

  // State for editing form fields
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const openNotificationWithIcon = (type, message, description) => {
    notification[type]({
      message,
      description,
      style: { marginTop: 100 },
    });
  };

  useEffect(() => {
    const fetchManagerDetails = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/support/getmanager/${id}`,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        setManager(response.data);
        // Initialize edit form with fetched data
        setEditForm({ name: response.data.name, email: response.data.email });
      } catch (error) {
        console.error("Error fetching manager details:", error);
      } finally {
        setLoading(false);
      }
    };

    const getPlatform = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/support/get-platform`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });
        setPlatforms(response.data);
      } catch (err) {
        console.log("Error fetching platforms:", err);
      }
    };

    fetchManagerDetails();
    getPlatform();
  }, [id]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const response = await axios.put(
        `${apiUrl}/api/support/assign-platform/${id}`,
        { platform: selectedPlatform },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      openNotificationWithIcon(
        "success",
        "Success",
        "Platform assigned successfully."
      );
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error assigning platform:", error);
      openNotificationWithIcon(
        "error",
        "Error",
        "Manager Already exist. Please try again."
      );
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handlePlatformChange = (value) => {
    setSelectedPlatform(value);
  };

  const showEditModal = () => {
    setIsEditModalOpen(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleEditSubmit = async () => {
    try {
      const response = await axios.put(
        `${apiUrl}/api/support/update-manager/${id}`,
        editForm,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      openNotificationWithIcon(
        "success",
        "Success",
        "Manager details updated successfully."
      );

      setIsEditModalOpen(false);
      // Update manager state with new details
      setManager(response.data);
    } catch (error) {
      console.error("Error updating manager details:", error);
      openNotificationWithIcon(
        "error",
        "Error",
        "There was an error updating the manager details. Please try again."
      );
    }
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
  };

  // Handle Delete Function
  const handleDelete = async () => {
    try {
      // Confirm with the user before deleting
      Modal.confirm({
        title: "Are you sure you want to delete this manager?",
        content: "This action cannot be undone.",
        okText: "Yes",
        okType: "danger",
        cancelText: "No",
        onOk: async () => {
          try {
            await axios.delete(`${apiUrl}/api/support/delete-manager/${id}`, {
              headers: {
                Authorization: localStorage.getItem("token"),
              },
            });

            openNotificationWithIcon(
              "success",
              "Deleted",
              "Manager deleted successfully."
            );

            // Redirect to the manager listing page or home after deletion
            history.push("/allmanagers");
          } catch (error) {
            console.error("Error deleting manager:", error);
            openNotificationWithIcon(
              "error",
              "Error",
              "There was an error deleting the manager. Please try again."
            );
          }
        },
      });
    } catch (error) {
      console.error("Error initiating delete:", error);
    }
  };

  return (
    <>
      <SupportAdminNav />
      <div className="smain">
        <div className="smenu">
          <SupportAdminMenu />
        </div>
        <div className="scontent">
          {loading ? (
            <Loader />
          ) : manager ? (
            <Card
              title={manager.name}
              style={{
                boxShadow:
                  "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
              }}
            >
              <p>Email: {manager.email}</p>
              <p>Platform: {manager.platform}</p>
              <p>
                Date of Joining:{" "}
                {new Date(manager.createdAt).toLocaleDateString()}
              </p>
              <p>Other Details: {manager.otherDetails}</p>
              <Button variant="contained" onClick={showModal}>
                Update Platform
              </Button>
              <Button
                sx={{ marginLeft: "30px" }}
                variant="contained"
                onClick={showEditModal}
              >
                Edit
              </Button>
              <Button
                sx={{ marginLeft: "30px", backgroundColor: "red" }}
                variant="contained"
                onClick={handleDelete} // Call delete function here
              >
                Delete
              </Button>
            </Card>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "140px",
              }}
            >
              <h1>No details found</h1>
            </div>
          )}
        </div>
      </div>

      {/* Platform Modal */}
      <Modal
        title="Assign Platform"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Assign"
        cancelText="Cancel"
      >
        <Select
          placeholder="Select a platform"
          onChange={handlePlatformChange}
          style={{ width: "100%" }}
        >
          {platforms.map((platform) => (
            <Option key={platform._id} value={platform.platform}>
              {platform.platform}
            </Option>
          ))}
        </Select>
      </Modal>

      {/* Edit Manager Modal */}
      <Modal
        title="Edit Manager Details"
        open={isEditModalOpen}
        onOk={handleEditSubmit} // Handle submit
        onCancel={handleEditCancel}
        okText="Save"
        cancelText="Cancel"
      >
        <Form layout="vertical">
          <Form.Item label="Name">
            <Input
              name="name"
              value={editForm.name}
              onChange={handleEditFormChange}
            />
          </Form.Item>
          <Form.Item label="Email">
            <Input
              name="email"
              value={editForm.email}
              onChange={handleEditFormChange}
            />
          </Form.Item>
          <Form.Item label="Password">
            <Input.Password
              name="password"
              value={editForm.password}
              onChange={handleEditFormChange}
              placeholder="Enter new password"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default SupportManagerDetails;
