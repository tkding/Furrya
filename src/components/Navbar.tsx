import React from "react";
import "./Navbar.css";
import "./ProjectTitle.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { Navbar, Nav, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

export const NavigationBar = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const signUserOut = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container fluid>
        <Navbar.Brand>
          <div className="svg-box">
            <svg>
              <text
                className="project-title"
                x="50%"
                y="50%"
                dy=".25em"
                text-anchor="middle"
              >
                FurRya
              </text>
            </svg>
          </div>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navigationContent" />
        <Navbar.Collapse id="navigationContent">
          <Nav
            className="
            d-flex flex-column flex-lg-row 
            align-items-start
            align-items-lg-center
            ms-4 ms-lg-auto mb-2 mb-lg-0"
          >
            <LinkContainer to="/">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/chat">
              <Nav.Link>Chat</Nav.Link>
            </LinkContainer>
            {user && (
              <div className="right-content">
                <LinkContainer to="/createpost">
                  <Nav.Link>Create</Nav.Link>
                </LinkContainer>
              </div>
            )}
            {user && (
              <div className="right-content">
                <LinkContainer to={`/user/${user?.displayName}`}>
                  <Nav.Link>
                    <div className="user-info">
                      <img
                        className="profile-pic"
                        src={user?.photoURL || ""}
                        width="25"
                        height="25"
                        alt=""
                      />
                      <p className="log-in-text"> </p>
                      <p className="log-in-text short-text">
                        {user?.displayName}
                      </p>
                    </div>
                  </Nav.Link>
                </LinkContainer>
              </div>
            )}
            {user && (
              <div className="right-content">
                <button className="sign-out-btn" onClick={signUserOut}>
                  Sign Out
                </button>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
