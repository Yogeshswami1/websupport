import React, { useEffect } from "react";
import SupportMngrNavbar from "../components/layout/SupportMngrNavbar.jsx";
import "./SupportHome.css";
import SupportFooter from "../components/layout/SupportFooter.jsx";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min.js";

const SupportManager = () => {
  const history = useHistory();
  const role = localStorage.getItem("role");
  useEffect(() => {
    if (role === "manager") {
      history.push("/supportmanagerdashboard");
    }
  });
  return (
    <>
      <SupportMngrNavbar />
      <div className="mainHome">
        <div className="heroTitle">
          <h1>
            PREMIUM SUPPORT
            <br />
            AND HELP DESK
          </h1>
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
export default SupportManager;
