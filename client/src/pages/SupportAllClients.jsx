import React, { useEffect, useState } from "react";
import { Card, Col, Row, Input } from "antd";
import "./SupportUserDashboard.css";
import axios from "axios";
import SupportAdminNav from "../components/layout/SupportAdminNav";
import SupportAdminMenu from "../components/layout/SupportAdminMenu";
import Loader from "../components/layout/Loader";
import { useHistory } from "react-router-dom";

const { Meta } = Card;
const { Search } = Input;
const apiUrl = process.env.REACT_APP_BACKEND_URL;

const SupportAllClients = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]); // For search
  const [loadingData, setLoadingData] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
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
          <Search
            placeholder="Search clients by name, email, platform, or enrollment number"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            enterButton
            style={{ marginBottom: "20px",width:"40%" }} 
          />

          {loadingData ? (
            <Loader />
          ) : filteredClients.length > 0 ? (
            <Row gutter={[16, 16]}>
              {filteredClients.map((client) => (
                <Col key={client._id} span={8}>
                  <Card
                    style={{
                      boxShadow:
                        hoveredCard === client._id
                          ? "0 8px 16px 0 rgba(0, 0, 0, 0.2), 0 12px 40px 0 rgba(0, 0, 0, 0.19)"
                          : "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                      transform:
                        hoveredCard === client._id ? "scale(1.05)" : "scale(1)",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    }}
                    hoverable
                    onMouseEnter={() => handleMouseEnter(client._id)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Meta
                      style={{ textAlign: "center" }}
                      title={client.name}
                      description={
                        <>
                          <p>Email: {client.email}</p>
                          <p>Platform: {client.platform}</p>
                          <p>Enrollment: {client.enrollmentNumber}</p>
                          <p>Password: {client.password}</p>

                          <p>
                            Date of Joining:{" "}
                            {new Date(client.createdAt).toLocaleDateString()}
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

export default SupportAllClients;
