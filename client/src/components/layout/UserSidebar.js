import React, { useState } from "react";
import { Menu, notification, Modal, Form, Input, Select } from "antd";
import { NavLink, useLocation, useHistory, Redirect } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import logo from "../../assets/images/logo.png";
import axios from "axios";

const { Option } = Select;

function UserSidebar({ color }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loggedout, setLoggedout] = useState(false);
  const [form] = Form.useForm();

  const history = useHistory();
  const { pathname } = useLocation();
  const page = pathname.replace("/", "");

  const dashboard = [
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        d="M3 4C3 3.44772 3.44772 3 4 3H16C16.5523 3 17 3.44772 17 4V6C17 6.55228 16.5523 7 16 7H4C3.44772 7 3 6.55228 3 6V4Z"
        fill={color}
      ></path>
      <path
        d="M3 10C3 9.44771 3.44772 9 4 9H10C10.5523 9 11 9.44771 11 10V16C11 16.5523 10.5523 17 10 17H4C3.44772 17 3 16.5523 3 16V10Z"
        fill={color}
      ></path>
      <path
        d="M14 9C13.4477 9 13 9.44771 13 10V16C13 16.5523 13.4477 17 14 17H16C16.5523 17 17 16.5523 17 16V10C17 9.44771 16.5523 9 16 9H14Z"
        fill={color}
      ></path>
    </svg>,
  ];

  const openNotificationWithIcon = (type, message, description) => {
    notification[type]({
      message,
      description,
      style: { marginTop: 120 },
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setLoggedout(true);
    openNotificationWithIcon(
      "success",
      "Success",
      "User logged out successfully."
    );
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinish = async (values) => {
    console.log("Form values:", localStorage.getItem("id"));
    console.log("manager is : " + values.manager);
    const formattedValues = {
      ...values,
      userId: localStorage.getItem("id"),
      name: localStorage.getItem("name"),
      status: "open",
      priority: "normal",
      assignee: values.manager,
    };
    axios
      .post("http://localhost:5000/api/support/newticket", formattedValues, {
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then((response) => {
        console.log(response.data);
        setIsModalVisible(false);
        form.resetFields();
        openNotificationWithIcon(
          "success",
          "New ticket raised",
          "New ticket created successfully."
        );
      })
      .catch((error) => {
        console.error(error);
        openNotificationWithIcon(
          "error",
          "Failed",
          "There was an error creating new ticket. Please try again."
        );
      });
  };

  if (loggedout) {
    return <Redirect to="/support"></Redirect>;
  }

  return (
    <div style={{ marginTop: "100px" }}>
      <h1 style={{ fontWeight: "bold" }}>
        Welcom back {localStorage.getItem("name")}
      </h1>
      <Menu theme="light" mode="inline">
        <Menu.Item key="1">
          <NavLink to="/supportuserdash">
            <span
              className="icon"
              style={{
                background: page === "dashboard" ? color : "rgb(53, 57, 121)",
              }}
            >
              {dashboard}
            </span>
            <span className="label">Dashboard</span>
          </NavLink>
        </Menu.Item>
        <Menu.Item key="2">
          <NavLink to="/supportuserappointment">
            <span
              className="icon"
              style={{
                background: page === "appointment" ? color : "rgb(53, 57, 121)",
              }}
            >
              {dashboard}
            </span>
            <span className="label">Appointment</span>
          </NavLink>
        </Menu.Item>
        <Menu.Item key="3">
          <NavLink to="/supportuseropenticket">
            <span
              className="icon"
              style={{
                background: page === "openticket" ? color : "rgb(53, 57, 121)",
              }}
            >
              {dashboard}
            </span>
            <span className="label">Open Ticket</span>
          </NavLink>
        </Menu.Item>
        <Menu.Item key="4" onClick={showModal}>
          <span
            className="icon"
            style={{
              background: "rgb(53, 57, 121)",
              marginLeft: "16px",
              marginTop: "15px",
              marginBottom: "15px",
            }}
          >
            <AddCircleOutlineIcon />
          </span>
          <span className="label">Raise Ticket</span>
        </Menu.Item>
        <Menu.Item key="5">
          <NavLink
            to="/support"
            style={{ border: "0 solid transparent" }}
            onClick={handleLogout}
          >
            <span
              className="icon"
              style={{
                background: page === "logout" ? color : "rgb(53, 57, 121)",
              }}
            >
              <LogoutIcon />
            </span>
            <span className="label">Logout</span>
          </NavLink>
        </Menu.Item>
      </Menu>

      <Modal
        title="New Ticket"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form layout="vertical" onFinish={onFinish} form={form}>
          <Form.Item
            name="platform"
            label="Platform"
            rules={[{ required: true, message: "Please select a platform!" }]}
          >
            <Select placeholder="Select a platform">
              <Option value="amazon">Amazon.in</Option>
              <Option value="flipkart">Flipkart</Option>
              <Option value="meesho">Meesho</Option>
              <Option value="esty">Esty</Option>
              <Option value="website">Website</Option>
              <Option value="amazon india">Amazon India</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: "Please input the description!" },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="manager"
            label="Managers"
            rules={[{ required: true, message: "Please select a manager!" }]}
          >
            <Select placeholder="Select a manager">
              <Option value="SM 1">SM 1</Option>
              <Option value="SM 2">SM 2</Option>
              <Option value="SM 3">SM 3</Option>
              <Option value="SM 8">SM 8</Option>
              <Option value="Team Leader 2(Habib)">Team Leader 2(Habib)</Option>
              <Option value="Prakash(Esty)">Prakash(Esty)</Option>
              <Option value="Prakash(Amazon.in)">Prakash(Amazon.in)</Option>
              <Option value="Dipanshu(Amazon.com)">Dipanshu(Amazon.com)</Option>
              <Option value="Team Leader 6 Ujjawal (Amazon.in)">
                Team Leader 6 Ujjawal (Amazon.in)
              </Option>
              <Option value="Mukesh (Payment)">Mukesh (Payment)</Option>
              <Option value="Dinesh (Glowroad)">Dinesh (Glowroad)</Option>
              <Option value="Team Leader 7 (Meesho)">
                Team Leader 7 (Meesho)
              </Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <button
              className="ant-btn ant-btn-primary"
              style={{ width: "100%" }}
              type="submit"
            >
              Submit
            </button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default UserSidebar;
