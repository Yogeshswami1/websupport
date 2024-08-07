import * as React from "react";
import AppBar from "@mui/material/AppBar";
import { Box, Button, MenuItem } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import RaiseTicket from "./RaiseTicket";
import BookAppointmentForm from "../BookAppointmentForm";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import MenuIcon from "@mui/icons-material/Menu";

export default function SupportNavbar({
  onPress,
  name,
  subName,
  handleSidenavColor,
  handleSidenavType,
  handleFixedNavbar,
}) {
  const token = localStorage.getItem("token");
  const history = useHistory();
  const styles = {
    height: "100px",
    width: "130px",
    padding: "10px",
    cursor: "pointer",
  };

  const handleButtonClick = () => {
    history.push("/supportuserbookappointment");
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar sx={{ backgroundColor: "#353979", position: "fixed" }}>
        {/* position="static" */}
        <Toolbar>
          <Button
            type="link"
            className="sidebar-toggler"
            sx={{ color: "white", display: { md: "none" } }}
            onClick={() => onPress()}
          >
            {/* <MenuItem sx={{ color: "white" }} /> */}
            <MenuIcon />
          </Button>
          <img
            style={styles}
            className="heroImage"
            src="https://support.saumiccraft.com/wp-content/uploads/2023/05/logo-saumic-new.png"
            alt=""
          />

          {!token ? (
            <RaiseTicket />
          ) : (
            <Button
              onClick={handleButtonClick}
              style={{
                backgroundColor: "white",
                color: "black",
                borderRadius: "20px",
                fontWeight: "bold",
                padding: "8px 15px 8px 15px",

                boxShadow:
                  "0 4px 8px 0 rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",

                position: "absolute",
                right: "30px",
              }}
            >
              Book Appointment
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
