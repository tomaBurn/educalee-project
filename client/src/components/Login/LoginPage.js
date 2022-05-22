import React from "react";
import { Button, Row, Form } from "reactstrap";
import * as currentUserActions from "../../redux/actions/currentUserActions";
import { connect } from "react-redux";
import Axios from "axios";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { axiosJWT } from "../../App";

import "./LoginPage.css";

class LoginPage extends React.Component {
  constructor() {
    super();
    this.state = {
      name: null,
      password: null,
      loginStatus: false,
      remidPassName: "",
      showDialog: false,
    };
    this.onSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    
    console.log(localStorage.getItem('token'))
    if(localStorage.getItem('token')) {
      console.log('ay', this.props.currentUser)
      if(this.props.currentUser.isTeacher === 'Y') {
        this.props.history.push("/home");
      }
      else if(this.props.currentUser.isTeacher === 'N') {
        this.props.history.push("/stud-home");
      }

    }

  }

  handleSubmit(e) {
    e.preventDefault();

    Axios.post(`/api/login`, {
      username: this.state.name,
      password: this.state.password,
    })
      .then((response) => {
        this.setState({ loginStatus: true });
        if (response.data.result.is_teacher === "Y" && response.data.auth) {
          this.props.history.push("/home");
        } else if (response.data.auth) this.props.history.push("/stud-home");

        localStorage.setItem("token", response.data.token);

        this.props.login(response.data.result);
      })
      .catch((error) => {
        alert("Prisijungimo klaida");
      });
  }

  handleRemindPassSubmit(name) {
    axiosJWT
      .post("/api/remind-password", {
        username: name,
      })
      .then(() => this.setState({ showDialog: false }))
      .catch((error) => alert(error.response.data));
  }

  render() {
    return (
      <div className="login-wrapper">
        <div className="login-holder">
          <Form onSubmit={this.onSubmit}>
            <Row className="add-stud-row">
              <TextField
                label="Prisijungimo  vardas"
                variant="standard"
                onChange={(e) => this.setState({ name: e.target.value })}
                required
                sx={{ ml: 3, mr: 3, flex: 1 }}
              />
            </Row>
            <Row className="add-stud-row">
              <TextField
                label="Slaptažodis"
                variant="standard"
                type="password"
                onChange={(e) => this.setState({ password: e.target.value })}
                required
                sx={{ ml: 3, mr: 3, flex: 1 }}
              />
            </Row>
            <Row style={{ marginTop: 16, marginLeft: 8 }}>
              <Button type="submit">Prisijungti</Button>
              <Button
                className="register-button"
                onClick={() => {
                  this.props.history.push("/register/");
                }}
              >
                Registruotis
              </Button>
            </Row>
            <Link
              onClick={() => this.setState({ showDialog: true })}
              sx={{ ml: 1, mt: 1 }}
              component="button"
            >
              Pamiršau slaptažodį
            </Link>
          </Form>
        </div>
        <Dialog open={this.state.showDialog}>
          <DialogTitle>Priminti slaptažodį</DialogTitle>
          <DialogContentText sx={{ ml: 3, mr: 3 }}>
            Jūsų slaptažodis bus išsiųstas el. pašto adresu, kurį naudojote
            registracijos metu
          </DialogContentText>
          <DialogContent>
            <Row>
              <TextField
                label="Prisijungimo vardas"
                variant="standard"
                onChange={(e) =>
                  this.setState({ remindPassName: e.target.value })
                }
                required
                sx={{ ml: 3, mr: 3, flex: 1 }}
              />
            </Row>
          </DialogContent>
          <DialogActions>
            <Button outline onClick={() => this.setState({ showDialog: false })}>
              Atšaukti
            </Button>
            <Button
              onClick={() =>
                this.handleRemindPassSubmit(this.state.remindPassName)
              }
            >
              Patvirtinti
            </Button>
          </DialogActions>
        </Dialog>
      </div>
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
    login: (currentUser) => {
      dispatch(currentUserActions.loginSuccess(currentUser));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
