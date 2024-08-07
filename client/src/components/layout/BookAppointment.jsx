import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import { useEffect } from "react";
import StepLabel from "@mui/material/StepLabel";
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Radio,
  notification,
} from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import { useState } from "react";

dayjs.extend(customParseFormat);

const steps = ["Details", "Services", "Time and date"];
const dropDownStyle = {
  width: 470,
};

const arr = [
  { title: "Amazon.com", options: ["Mukesh", "Charu", "Prakash(Amazon.in)"] },
  {
    title: "Flipkart",
    options: ["Dipanshu", "SM6(Ujwal)", "Team Leader7(Ramesh)"],
  },
  { title: "Meesho", options: ["Dinesh", "Team Leader4(Rahul)", "Yogendra"] },
  { title: "Esty", options: ["Team Leader3(Ritu)", "SM13(Akhil)"] },
  {
    title: "Amazon India",
    options: ["Dipanshu", "Mukesh", "Team Leader4(Rahul)"],
  },
  { title: "Website", options: ["Team Leader7(Ramesh)", "SM6(Ujwal)"] },
];

const timeSlots = [
  "10:05 am",
  "10:10 am",
  "10:15 am",
  "10:20 am",
  "10:25 am",
  "10:30 am",
  "10:35 am",
  "10:40 am",
  "10:45 am",
  "10:50 am",
  "11:00 am",
  "11:10 am",
  "11:20 am",
  "11:30 am",
  "11:40 am",
  "11:50 am",
  "12:00 pm",
  "12:10 pm",
  "12:20 pm",
  "12:30 pm",
  "12:40 pm",
  "12:50 pm",
  "1:00 pm",
  "1:10 pm",
  "1:20 pm",
  "1:30 pm",
  "1:40 pm",
  "1:50 pm",
  "2:00 pm",
  "2:10 pm",
  "2:20 pm",
  "2:30 pm",
  "2:40 pm",
  "2:50 pm",
];

export default function BookAppointment() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState({
    title: "Amazon.com",
    options: ["Mukesh", "Charu", "Prakash(Amazon.in)"],
  });
    const [appointments, setAppointments] = useState([]);
    console.log(appointments)


  const openNotificationWithIcon = (type, message, description) => {
    notification[type]({
      message,
      description,
      style: { marginTop: 120 },
    });
  };

  const handleFinish = (values) => {
    console.log("Form values:", values);

    const formattedValues = {
      ...values,
      date: values.date.format("YYYY-MM-DD"),
    };

    axios
      .post(
        "http://localhost:5000/api/support/appointmentRoute",
        formattedValues,
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      )
      .then((response) => {
        console.log(response.data);
        setIsModalVisible(false);
        form.resetFields();
        openNotificationWithIcon(
          "success",
          "Appointment Booked",
          "Your appointment has been successfully booked."
        );
      })
      .catch((error) => {
        console.error(error);
        openNotificationWithIcon(
          "error",
          "Booking Failed",
          "There was an error booking your appointment. Please try again."
        );
      });
  };

  const [form] = Form.useForm();

    const getAppointments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/support/getappointments",
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        console.log("API Response:", response.data);
        if (Array.isArray(response.data)) {
          // Sort the appointments by date in descending order
          const sortedAppointments = response.data.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
          setAppointments(sortedAppointments);
        } else {
          console.error("Error: API response is not an array", response.data);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    useEffect(() => {
      getAppointments();
    }, []);

  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    number: "",
    subject: "",
    enrollment: "",
    platform: "",
    manager: "",
    description: "",
    date: null,
    time: null,
    ad: "",
  });
  const [errors, setErrors] = React.useState({
    name: "",
    email: "",
    number: "",
    subject: "",
    enrollment: "",
    platform: "",
    manager: "",
    description: "",
    date: "",
    time: "",
    ad: "",
  });

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      history.push("/supportuserdashboard");
    }

    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    if (activeStep === steps.length - 1) {
      await handleSubmit();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }

    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const history = useHistory();
  const handleReset = () => {
    history.push("/supportuserdashboard");
    setActiveStep(0);
    setErrors({
      name: "",
      email: "",
      number: "",
      subject: "",
      enrollment: "",
      platform: "",
      manager: "",
      description: "",
      date: "",
      time: "",
      ad: "",
    });
  };

  const handleChange = (e) => {
    console.log(`Field name: ${e.target.name}, Value: ${e.target.value}`);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateStep = (step) => {
    let valid = true;
    let newErrors = { ...errors };

    switch (step) {
      case 0:
        if (!formData.name) {
          newErrors.name = "Please enter your full name";
          valid = false;
        }
        if (!formData.email) {
          newErrors.email = "Please enter your email";
          valid = false;
        }
        if (!formData.number) {
          newErrors.number = "Please enter your phone number";
          valid = false;
        }
        if (!formData.subject) {
          newErrors.subject = "Please enter your subject";
          valid = false;
        }
        break;
      case 1:
        if (!formData.enrollment) {
          newErrors.enrollment = "Please enter your enrollment number";
          valid = false;
        }
        if (!formData.platform) {
          newErrors.platform = "Please choose your platform";
          valid = false;
        }
        if (!formData.manager) {
          newErrors.manager = "Please choose your manager";
          valid = false;
        }
        if (!formData.description) {
          newErrors.description = "Please enter the description";
          valid = false;
        }
        break;
      case 2:
        if (!formData.date) {
          newErrors.date = "Please select a date";
          valid = false;
        }
        if (!formData.time) {
          newErrors.time = "Please select a time";
          valid = false;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    console.log("Form Data:", formData);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/support/appointmentRoute",
        formData
      );
      console.log("Appointment booked successfully", response.data);
      openNotificationWithIcon(
        "success",
        "Appointment Booked",
        "Your appointment has been successfully booked."
      );
    } catch (error) {
      console.error("Error booking appointment", error);
      openNotificationWithIcon(
        "error",
        "Failed",
        "Your appointment couldn't be booked at this time, please try again."
      );
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div style={{ padding: "0 20px 10px 20px" }}>
            <Form form={form} layout="vertical" onFinish={handleFinish}>
              <Form.Item
                style={{ width: "75%" }}
                name="name"
                label="Full Name"
                required
                rules={[
                  { required: true, message: "Please enter your full name" },
                ]}
              >
                <Input
                  type="text"
                  name="name"
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </Form.Item>
              <Form.Item
                style={{ width: "75%" }}
                name="email"
                label="Email"
                rules={[{ required: true, message: "Please enter your email" }]}
              >
                <Input
                  type="email"
                  name="email"
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </Form.Item>
              <Form.Item
                style={{ width: "75%" }}
                name="number"
                label="Phone Number"
                rules={[
                  { required: true, message: "Please enter your phone number" },
                ]}
              >
                <Input
                  type="tel"
                  name="number"
                  onChange={(e) =>
                    setFormData({ ...formData, number: e.target.value })
                  }
                />
              </Form.Item>
              <Form.Item
                style={{ width: "75%" }}
                name="subject"
                label="Subject"
                rules={[
                  { required: true, message: "Please enter your subject" },
                ]}
              >
                <Input
                  type="text"
                  name="subject"
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                />
              </Form.Item>
            </Form>
          </div>
        );
      case 1:
        return (
          <div style={{ padding: "0 20px 10px 20px" }}>
            <Form form={form} layout="vertical" onFinish={handleFinish}>
              <Form.Item
                style={{ width: "75%" }}
                name="enrollment"
                label="Enrollment Number"
                rules={[
                  {
                    required: true,
                    message: "Please enter your enrollment number",
                  },
                ]}
              >
                <Input
                  type="text"
                  name="enrollment"
                  onChange={(e) =>
                    setFormData({ ...formData, enrollment: e.target.value })
                  }
                />
              </Form.Item>
              <Form.Item
                style={{ width: "75%" }}
                name="platform"
                label="Platform"
                rules={[
                  { required: true, message: "Please choose your platform!" },
                ]}
              >
                <Select
                  placeholder="Choose your platform"
                  style={{ width: "100%" }}
                  onChange={(value) => {
                    setFormData({ ...formData, platform: value });
                    console.log(value);
                    const platform = arr.find((ar) => ar.title === value);
                    setSelectedPlatform(platform);
                  }}
                  options={arr.map((ar) => ({
                    value: ar.title,
                    label: ar.title,
                  }))}
                  // options={[
                  //   { label: "Amazon.com", value: "amazon.com" },
                  //   { label: "Flipkart", value: "flipkart" },
                  //   { label: "Meesho", value: "meesho" },
                  //   { label: "Etsy", value: "etsy" },
                  //   { label: "Amazon India", value: "amazon-india" },
                  //   { label: "Website", value: "website" },
                  // ]}
                />
              </Form.Item>
              <Form.Item
                style={{ width: "75%" }}
                name="manager"
                label="Managers"
                rules={[
                  { required: true, message: "Please choose your managers!" },
                ]}
              >
                <Select
                  style={{ width: "100%" }}
                  placeholder="Choose your manager"
                  onChange={(manager) =>
                    setFormData({ ...formData, manager: manager })
                  }
                  options={selectedPlatform?.options?.map((option) => ({
                    label: option,
                    value: option,
                  }))}
                  // options={[
                  //   { label: "SM1(Manish)", value: "sm1(manish)" },
                  //   { label: "Mukesh", value: "mukesh" },
                  //   { label: "Charu", value: "charu" },
                  //   { label: "Yogendra", value: "yogendra" },
                  //   { label: "Dipanshu", value: "dipanshu" },
                  //   { label: "SM6(Ujwal)", value: "sm6(ujwal)" },
                  //   {
                  //     label: "TEAM Leader7(Ramesh)",
                  //     value: "team-leader7(ramesh)",
                  //   },
                  //   { label: "Dinesh", value: "dinesh" },
                  //   {
                  //     label: "Team Leader 4 (Rahul)",
                  //     value: "team-leader4(rahul)",
                  //   },
                  //   { label: "Prakash(Amazon.in)", value: "Prakash(Amazon.in)" },
                  //   { label: "Team Leader 3 (Ritu)", value: "team-leader3(ritu)" },
                  //   { label: "SMB (Uzair)", value: "smb(uzair)" },
                  //   { label: "SM 13 (Akhil)", value: "sm13(akhil)" },
                  // ]}
                />
              </Form.Item>
              <Form.Item
                style={{ width: "75%" }}
                name="description"
                label="Description"
                rules={[
                  { required: true, message: "Please enter the description" },
                ]}
              >
                <Input.TextArea
                  name="description"
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </Form.Item>
            </Form>
          </div>
        );
      case 2:
        return (
          <div style={{ padding: "0 20px 10px 20px" }}>
            <Form form={form} layout="vertical" onFinish={handleFinish}>
              <Form.Item
                style={{ width: "75%" }}
                name="date"
                label="Date"
                rules={[{ required: true, message: "Please select a date" }]}
              >
                <DatePicker
                  style={{ width: "75%" }}
                  name="date"
                  onChange={(date) => setFormData({ ...formData, date: date })}
                />
              </Form.Item>
              <Form.Item
                style={{ width: "75%" }}
                name="time"
                label="Time"
                rules={[{ required: true, message: "Please select a time" }]}
              >
                <Radio.Group
                  style={{ width: "75%" }}
                  name="time"
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                >
                  {timeSlots.map((slot) => (
                    <Radio.Button key={slot} value={slot}>
                      {slot}
                    </Radio.Button>
                  ))}
                </Radio.Group>
              </Form.Item>
            </Form>
          </div>
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};

          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }

          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you're finished
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            {getStepContent(activeStep)}
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button onClick={handleNext}>
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
            </Box>
          </React.Fragment>
        )}
      </div>
    </Box>
  );
}
