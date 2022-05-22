import React, { Component } from "react";
import {
  Collapse,
  Container,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
} from "reactstrap";
import { Link } from "react-router-dom";
import * as currentUserActions from "../../redux/actions/currentUserActions";
import { connect } from "react-redux";
import { axiosJWT } from "../../App.js";

import "./NavMenu.css";

export class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor(props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true,
    };
  }

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  logout() {
    localStorage.removeItem("token")
    this.props.logout();
    axiosJWT
      .post("/api/logout", {
        token: localStorage.getItem("token"),
      })
      .catch((error) => console.log(error));
  }

  returnTeachersItems() {
    return (
      <ul className="navbar-nav flex-grow">
        <NavItem>
          <NavLink tag={Link} className="text-dark" to="/home">
            Pradinis
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={Link} className="text-dark" to="/leaderboard">
            Lyderių lenta
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={Link} className="text-dark" to="/students">
            Mokiniai
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            tag={Link}
            className="text-dark"
            to="/"
            onClick={() => this.logout()}
          >
            Atsijungti
          </NavLink>
        </NavItem>
      </ul>
    );
  }

  returnStudentsItems() {
    return (
      <ul className="navbar-nav flex-grow">
        <NavItem>
          <NavLink tag={Link} className="text-dark" to="/stud-home">
            Pradinis
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={Link} className="text-dark" to="/leaderboard">
            Lyderių lenta
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            tag={Link}
            className="text-dark"
            to="/"
            onClick={() => this.props.logout()}
          >
            Atsijungti
          </NavLink>
        </NavItem>
      </ul>
    );
  }

  render() {
    return (
      <header>
        <Navbar
          className="navbar-expand-sm navbar-toggleable-sm bg-white border-bottom box-shadow mb-3"
          light
          style={{ height: "50px" }}
        >
          <Container>
            <NavbarBrand tag={Link} to="/home">
              Educalee
            </NavbarBrand>
            <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
            <Collapse
              className="d-sm-inline-flex flex-sm-row-reverse"
              isOpen={!this.state.collapsed}
              navbar
            >
              {this.props.currentUser.isTeacher === "Y" ? (
                <ul className="navbar-nav flex-grow">
                  {this.returnTeachersItems()}
                </ul>
              ) : (
                <ul className="navbar-nav flex-grow">
                  {this.returnStudentsItems()}
                </ul>
              )}
            </Collapse>
          </Container>
        </Navbar>
      </header>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: state.currentUser,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    logout: () => dispatch(currentUserActions.logout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NavMenu);
