import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import UpcomingIcon from "@mui/icons-material/Upcoming";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonIcon from "@mui/icons-material/Person";
import { Form, Input, Modal, notification } from "antd";
import axios from "axios";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const { Item } = Form;

const SupportAdminMenu = () => {
  const history = useHistory();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleDashboarClick = () => {
    history.push("/supportadmindash");
  };

  const handleAppointmentClick = () => {
    history.push("/supportadminappointments");
  };

  const handleGetManagerClick = () => {
    history.push("/allmanagers");
  };
  const handleOpenTicketClicked = () => {
    history.push("/supportadminopentickets");
  };

  const handleLogoutClick = () => {
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    openNotificationWithIcon("success", "Success", "Logged out successfully.");
    history.push("/supportadmin");
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const openNotificationWithIcon = (type, message, description) => {
    notification[type]({
      message,
      description,
      style: { marginTop: 120 },
    });
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        console.log(values);
        axios
          .post("http://localhost:5000/api/support/create-manager", values)
          .then((response) => {
            console.log("Success:", response.data);
            handleCancel();
            openNotificationWithIcon(
              "success",
              "Success",
              "New manager has been created successfully."
            );
          })
          .catch((error) => {
            console.error("Error:", error);
            openNotificationWithIcon(
              "error",
              "Failed",
              "There is an problem creating new manager. Please try again."
            );
          });
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 5,
        bgcolor: "background.paper",
        borderRadius: 5,
        maxWidth: 300,
        m: "auto",
        textAlign: "center",
        position: "absolute",
        left: 2,
        marginTop: "-40px",
      }}
    >
      <h1
        style={{
          fontWeight: "bold",
          fontSize: "x-large",
        }}
      >
        Welcome Back {localStorage.getItem("name")}
      </h1>
      <Button
        variant="contained"
        startIcon={<DashboardIcon />}
        sx={{
          mb: 2,
          height: "50px",
          width: "200px",
          backgroundColor: "white",
          color: "black",
          fontWeight: "bold",
          borderRadius: "30px",
          fontSize: "medium",
          boxShadow: 5,
          "&:hover": {
            backgroundColor: "white",
          },
        }}
        onClick={handleDashboarClick}
      >
        Dashboard
      </Button>

      <Button
        variant="contained"
        startIcon={<UpcomingIcon />}
        sx={{
          mb: 2,
          height: "50px",
          width: "200px",
          backgroundColor: "white",
          color: "black",
          fontWeight: "bold",
          borderRadius: "30px",
          fontSize: "medium",
          boxShadow: 5,
          "&:hover": {
            backgroundColor: "white",
          },
        }}
        onClick={handleAppointmentClick}
      >
        Appointments
      </Button>

      <Button
        variant="contained"
        startIcon={<PersonAddIcon />}
        sx={{
          mb: 2,
          height: "50px",
          width: "200px",
          backgroundColor: "white",
          color: "black",
          fontWeight: "bold",
          borderRadius: "30px",
          fontSize: "medium",
          boxShadow: 5,
          "&:hover": {
            backgroundColor: "white",
          },
        }}
        onClick={showModal}
      >
        New manager
      </Button>
      <Button
        variant="contained"
        startIcon={<PersonIcon />}
        sx={{
          mb: 2,
          height: "50px",
          width: "200px",
          backgroundColor: "white",
          color: "black",
          fontWeight: "bold",
          borderRadius: "30px",
          fontSize: "medium",
          boxShadow: 5,
          "&:hover": {
            backgroundColor: "white",
          },
        }}
        onClick={handleGetManagerClick}
      >
        All managers
      </Button>

      <Button
        variant="contained"
        startIcon={<UpcomingIcon />}
        sx={{
          mb: 2,
          height: "50px",
          width: "200px",
          backgroundColor: "white",
          color: "black",
          fontWeight: "bold",
          borderRadius: "30px",
          fontSize: "medium",
          boxShadow: 5,
          "&:hover": {
            backgroundColor: "white",
          },
        }}
        onClick={handleOpenTicketClicked}
      >
        Open Ticket
      </Button>

      <Button
        variant="contained"
        startIcon={<LogoutIcon />}
        sx={{
          height: "50px",
          width: "200px",
          backgroundColor: "white",
          color: "black",
          borderRadius: "30px",
          fontWeight: "bold",
          fontSize: "medium",
          boxShadow: 5,
          "&:hover": {
            backgroundColor: "white",
          },
        }}
        onClick={handleLogoutClick}
      >
        Logout
      </Button>

      <Modal
        title="Create New Manager"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Create"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical" name="create_user_form">
          <Item
            name="name"
            label="Name"
            rules={[
              {
                required: true,
                message: "Please input the name!",
              },
            ]}
          >
            <Input />
          </Item>
          <Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                message: "Please input the email!",
                type: "email",
              },
            ]}
          >
            <Input />
          </Item>
          <Item
            name="platform"
            label="Platform"
            rules={[
              {
                required: true,
                message: "Please input the platform name!",
              },
            ]}
          >
            <Input />
          </Item>
          <Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: "Please input the password!",
              },
            ]}
          >
            <Input.Password />
          </Item>
        </Form>
      </Modal>
    </Box>
  );
};

export default SupportAdminMenu;
