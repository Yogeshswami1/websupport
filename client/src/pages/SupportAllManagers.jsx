import React, { useEffect, useState } from "react";
import { Card, Col, Row, Input } from "antd"; // Import Input for search
import "./SupportUserDashboard.css";
import axios from "axios";
import SupportAdminNav from "../components/layout/SupportAdminNav";
import SupportAdminMenu from "../components/layout/SupportAdminMenu";
import Loader from "../components/layout/Loader";
import { useHistory } from "react-router-dom";

const { Meta } = Card;
const { Search } = Input; // Destructure Search from Input
const apiUrl = process.env.REACT_APP_BACKEND_URL;

const SupportAllmanager = () => {
  const [managers, setManagers] = useState([]);
  const [filteredManagers, setFilteredManagers] = useState([]); // For search
  const [loadingData, setLoadingData] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null); // Track hovered card
  const [searchTerm, setSearchTerm] = useState(""); // Track the search term
  const history = useHistory();

  const getManagers = async () => {
    setLoadingData(true);
    try {
      const response = await axios.get(`${apiUrl}/api/support/getallmanagers`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      if (Array.isArray(response.data)) {
        setManagers(response.data);
        setFilteredManagers(response.data); // Initialize filteredManagers
      } else {
        console.error("Error: API response is not an array", response.data);
      }
    } catch (error) {
      console.error("Error fetching managers:", error);
    }
    setLoadingData(false);
  };

  useEffect(() => {
    getManagers();
  }, []);

  const handleSearch = (value) => {
    setSearchTerm(value); // Update search term
    if (value === "") {
      setFilteredManagers(managers); // Reset to all managers if search is empty
    } else {
      const filtered = managers.filter(
        (manager) =>
          manager.name.toLowerCase().includes(value.toLowerCase()) ||
          manager.email.toLowerCase().includes(value.toLowerCase()) ||
          manager.platform.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredManagers(filtered);
    }
  };

  const handleCardClick = (id) => {
    history.push(`/manager/${id}`);
  };

  const handleMouseEnter = (id) => {
    setHoveredCard(id);
  };

  const handleMouseLeave = () => {
    setHoveredCard(null);
  };

  return (
    <>
      <SupportAdminNav />
      <div className="smain">
        <div className="smenu">
          <SupportAdminMenu />
        </div>
        <div className="scontent">
          {/* Search Bar */}
          <Search
            placeholder="Search managers by name, email, or platform"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            enterButton
            style={{ marginBottom: "20px", width: "40%" }} // Add some margin below the search bar
          />

          {loadingData ? (
            <Loader />
          ) : filteredManagers.length > 0 ? (
            <Row gutter={[16, 16]}>
              {filteredManagers.map((manager) => (
                <Col key={manager._id} span={8}>
                  <Card
                    style={{
                      boxShadow:
                        hoveredCard === manager._id
                          ? "0 8px 16px 0 rgba(0, 0, 0, 0.2), 0 12px 40px 0 rgba(0, 0, 0, 0.19)"
                          : "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                      transform:
                        hoveredCard === manager._id
                          ? "scale(1.05)"
                          : "scale(1)",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    }}
                    hoverable
                    onMouseEnter={() => handleMouseEnter(manager._id)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleCardClick(manager._id)}
                  >
                    <Meta
                      style={{ textAlign: "center" }}
                      title={manager.name}
                      description={
                        <>
                          <p>Email: {manager.email}</p>
                          <p>Platform: {manager.platform}</p>
                          <p>
                            Date of Joining:{" "}
                            {new Date(manager.createdAt).toLocaleDateString()}
                          </p>
                        </>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
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

export default SupportAllmanager;
