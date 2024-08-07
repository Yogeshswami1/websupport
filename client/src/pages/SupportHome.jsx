import React, { useEffect } from "react";
import SupportNavbar from "../components/layout/SupportNavbar.jsx";
import "./SupportHome.css";
import BookAppointmentForm from "../components/BookAppointmentForm.jsx";
import SupportFooter from "../components/layout/SupportFooter.jsx";
import { getUser } from "../redux/userSlice.jsx";
import { useDispatch } from "react-redux";
import axios from "axios";

const SupportHome = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/support");
        console.log("user exist in ", response.data);
        // dispatch(getUser(response.data));
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <SupportNavbar />
      <div className="mainHome">
        <div className="heroTitle">
          <h1>
            PREMIUM SUPPORT
            <br />
            AND HELP DESK
          </h1>
          <BookAppointmentForm />
        </div>
        <div className="heroImg">
          <img
            src="https://support.saumiccraft.com/wp-content/uploads/2023/05/support-illustration-600x698-1.png"
            alt="support"
          />
        </div>
      </div>

      <div className="video">
        <div className="videoContent">
          <h2>How to use support portal</h2>
        </div>
        <div className="childVideo">
          <div className="innerVideo">
            {" "}
            <h1>video 1</h1>
          </div>
          <div className="innerVideo">
            {" "}
            <h1>video 2</h1>
          </div>
          <div className="innerVideo">
            {" "}
            <h1>video 3</h1>
          </div>
        </div>
      </div>
      <SupportFooter />
    </>
  );
};

export default SupportHome;
