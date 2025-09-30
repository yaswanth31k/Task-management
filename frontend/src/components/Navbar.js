import React from "react";
import { Navbar, Nav, Container, Button, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AppNavbar({ user }) {
  const navigate = useNavigate();

  // Always fallback to localStorage if no user prop is passed
  const currentUser = user || JSON.parse(localStorage.getItem("user"));

  const handleLogout = async () => {
    try {
      await axios.post(`http://${process.env.REACT_APP_API_URL}/api/auth/logout`, {
        id: currentUser.id,
      });

      localStorage.removeItem("user"); // Clear session
      navigate("/"); // Redirect to login
    } catch (err) {
      console.error("Logout error:", err);
      alert("Logout failed, please try again!");
    }
  };

  const goToProfile = () => {
    navigate("/profile", { state: { user: currentUser } });
  };

  if (!currentUser) {
    // Prevent rendering Navbar when no user is logged in
    return null;
  }

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="#">
          {currentUser.role === "admin" ? "Admin Dashboard" : "Employee Dashboard"}
        </Navbar.Brand>

        <Nav className="ms-auto">
          {currentUser.role === "admin" && (
            <Nav className="me-auto">
              <Nav.Link href="/assign-task">Assign Task</Nav.Link>
              <Nav.Link href="/progress">Progress</Nav.Link>


            </Nav>
          )}

          <Dropdown align="end">
            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
              {currentUser?.name || "User"}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={goToProfile}>Profile</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item as="button" onClick={handleLogout}>
                <Button variant="danger" size="sm" className="w-100">
                  Logout
                </Button>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
