import React from "react";
import { Navbar, Nav, Container, Button, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";


function AppNavbar1({ user }) {
    const navigate = useNavigate();

    const handleLogout = async () => {
    try {
      // Call backend to save logout_time
      await axios.post(`http://${process.env.REACT_APP_API_URL}/api/auth/logout`, {
        id: user.id, // user ID from props
      });

      // Clear local storage
      localStorage.removeItem("user");

      // Redirect to login page
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
      alert("Logout failed, please try again!");
    }
  };

    const goToProfile = () => {
        navigate("/profile", { state: { user } });
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand href="#">
                    Employee Dashboard
                </Navbar.Brand>

                <Nav className="ms-auto">


                    <Dropdown align="end">
                        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                            {user.name}
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

export default AppNavbar1;
