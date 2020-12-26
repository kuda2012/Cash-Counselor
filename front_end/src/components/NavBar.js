import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";
import "../styles/NavBar.css";
import {
  Navbar,
  Nav,
  NavItem,
  Popover,
  PopoverBody,
  PopoverHeader,
  Button,
} from "reactstrap";
import { deleteTransactions } from "../helpers/actionCreators";

const NavBar = ({ triggerModal, setTriggerModal }) => {
  const currentLocation = useSelector((state) => state.currentLocation);
  const dispatch = useDispatch();
  dispatch({
    type: "SET_CURRENT_LOCATION",
    currentLocation: window.location.pathname,
  });
  const token = useSelector((state) => state.token);
  const history = useHistory();
  const _token = useSelector((state) => state._token);
  const access_token = useSelector((state) => state.access_token);
  const item_id = useSelector((state) => state.item_id);
  const timerId = useRef(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const toggle = () => setPopoverOpen(!popoverOpen);

  const signOff = (fullSignOut) => {
    if (triggerModal) {
      setTriggerModal(false);
    }

    if (fullSignOut) {
      setPopoverOpen(false);
      localStorage.removeItem("token");
      localStorage.removeItem("_token");
      localStorage.removeItem("access_token");
      if (item_id) {
        dispatch(deleteTransactions(_token, access_token, item_id));
      }
      dispatch({
        type: "FULL-RESET",
      });
      history.push("/");
      timerId.current = setTimeout(() => {
        alert("Thanks for using Cash Counselor. See you soon!");
      }, 1000);
      return () => {
        clearTimeout(timerId.current);
      };
    } else {
      setPopoverOpen(false);
      localStorage.removeItem("_token");
      localStorage.removeItem("access_token");
      if (item_id) {
        dispatch(deleteTransactions(_token, access_token, item_id));
      }
      dispatch({
        type: "HALF-RESET",
      });
      history.push("/");
      timerId.current = setTimeout(() => {
        alert(
          "You've signed out of just the banking portal of the app. Proceed as you wish."
        );
      }, 1000);
      return () => {
        clearTimeout(timerId.current);
      };
    }
  };
  return (
    <div>
      {!token && (
        <Navbar expand="md" className="bg-primary">
          <NavLink to="/" className="navbar-brand">
            Cash Counselor
          </NavLink>
        </Navbar>
      )}

      {token && !access_token && !_token && (
        <Navbar expand="md" className="bg-primary">
          <NavLink to="/" className="navbar-brand">
            Cash Counselor
          </NavLink>
          <Nav className="ml-auto">
            <NavItem>
              <NavLink to="/" className="nav-link">
                Home
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/profile" className="nav-link">
                Profile
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                to={currentLocation || "/"}
                id="Popover1"
                className="nav-link"
              >
                Sign Out
                <Popover
                  placement="bottom"
                  isOpen={popoverOpen}
                  target="Popover1"
                  toggle={toggle}
                >
                  <PopoverHeader>
                    <Button
                      color="primary"
                      onClick={() => toggle()}
                      id="PopOver-cancel"
                    >
                      X
                    </Button>
                    <div>Are you sure you want to sign out of the app?</div>
                  </PopoverHeader>
                  <PopoverBody>
                    <div id="PopOver-buttons-first">
                      <Button onClick={() => signOff(true)} color="success">
                        Yes
                      </Button>
                      <Button onClick={() => toggle()} color="primary">
                        No
                      </Button>
                    </div>
                  </PopoverBody>
                </Popover>
              </NavLink>
            </NavItem>
          </Nav>
        </Navbar>
      )}
      {token && access_token && _token && (
        <Navbar expand="md" className="bg-primary">
          <NavLink to="/" className="navbar-brand">
            Cash Counselor
          </NavLink>
          <Nav className="ml-auto">
            <NavItem>
              <NavLink to="/" className="nav-link">
                Home
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/accounts/trends" className="nav-link">
                Trends
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className="nav-link"
                to="/"
                onClick={() =>
                  window.open(
                    "https://www.desmos.com/scientific",
                    "name",
                    "width=400,height=400"
                  )
                }
              >
                Calculator
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/profile" className="nav-link">
                Profile
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className="nav-link"
                to={currentLocation || "/"}
                id="Popover1"
              >
                Sign Out
                <Popover
                  placement="bottom"
                  isOpen={popoverOpen}
                  target="Popover1"
                  toggle={toggle}
                >
                  <PopoverHeader>
                    <Button
                      color="primary"
                      onClick={() => toggle()}
                      id="PopOver-cancel"
                    >
                      X
                    </Button>
                    <div>There are two sign-out options</div>
                  </PopoverHeader>
                  <PopoverBody>
                    <div>1.Sign out of ONLY Banking Portal.</div>
                    <div>2. Sign out of entire application completely</div>
                    <div id="PopOver-buttons-second">
                      <Button onClick={() => signOff()} color="primary">
                        Sign out of just Banking Portal
                      </Button>
                      <Button onClick={() => signOff(true)} color="danger">
                        Sign out of entire application
                      </Button>
                    </div>
                  </PopoverBody>
                </Popover>
              </NavLink>
            </NavItem>
          </Nav>
        </Navbar>
      )}
    </div>
  );
};

export default NavBar;
