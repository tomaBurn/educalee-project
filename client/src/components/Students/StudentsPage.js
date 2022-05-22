import React from "react";
import { Button, Row, Form, Container } from "reactstrap";
import { connect } from "react-redux";
import Divider from "@mui/material/Divider";
import { axiosJWT } from "../../App.js";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import TextField from "@mui/material/TextField";
import { withSnackbar } from "../SnackbarHOC";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import "./StudentsPage.css";

class StudentsPage extends React.Component {
  constructor() {
    super();
    this.state = {
      students: null,
      invites: null,
      username: "",
      password: "",
      email: "",
      loading: true,
      loadingInvites: true,
      showEdit: false,
      editStudName: "",
      editStudPass: "",
      editStudEmail: "",
      editStudId: null,
      showPassDialog: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  getStudents(currentUser) {
    axiosJWT
      .post(`/api/get-students/`, {
        headers: { "x-access-token": localStorage.getItem("token") },
        teacherId: currentUser.id,
      })
      .then((response) => {
        this.setState({ students: response.data, loading: false });
      })
      .catch(() => this.props.snackbarShowMessage(`Įvyko klaida`, "error"));
  }

  componentDidMount() {
    const { currentUser } = this.props;
    this.getStudents(currentUser);
  }

  removeStudent(index) {
    confirmAlert({
      title: "Pašalinti mokinį",
      message: "Ar tikrai norite pašalinti šį mokinį?",
      buttons: [
        {
          label: "Taip",
          onClick: () =>
            axiosJWT
              .post(`/api/students/`, {
                headers: { "x-access-token": localStorage.getItem("token") },
                id: index,
              })
              .then((response) => {
                this.getStudents(this.props.currentUser);
                this.props.snackbarShowMessage(`Mokinys pašalintas`);
              })
              .catch((error) =>
                this.props.snackbarShowMessage(`Įvyko klaida`, "error")
              ),
        },
        {
          label: "Ne",
        },
      ],
    });
  }

  showStudents() {
    return !this.state.students ? null : (
      <div className="students-grid">
        {this.state.students.map((item) => (
          <React.Fragment key={item.id}>
            <div className="stud-username-col">
              <h5 className="stud-username-header">{item.username}</h5>
            </div>
            <div className="remove-stud-btn">
              <Button onClick={(e) => this.removeStudent(item.id)}>
                Pašalinti
              </Button>
            </div>
            <div className="edit-stud-btn">
              <Button
                onClick={(e) =>
                  this.setState({
                    showEdit: true,
                    editStudName: item.username,
                    editStudPass: item.password,
                    editStudEmail: item.email,
                    editStudId: item.id,
                  })
                }
              >
                Redaguoti duomenis
              </Button>
            </div>
            <div className="check-pass-btn">
              <Button
                onClick={(e) =>
                  this.setState({
                    showPassDialog: true,
                    editStudPass: item.password,
                  })
                }
              >
                Peržiūrėti slaptažodį
              </Button>
            </div>
          </React.Fragment>
        ))}
      </div>
    );
  }

  handleSubmit(e) {
    e.preventDefault();
    const { currentUser } = this.props;

    axiosJWT
      .post("/api/register-student", {
        headers: { "x-access-token": localStorage.getItem("token") },
        username: this.state.username,
        password: this.state.password,
        teacherId: currentUser.id,
        email: this.state.email,
      })
      .then((response) => {
        this.props.snackbarShowMessage(`Mokinys pridėtas`, "success");
        this.setState({ username: "", password: "", email: "" });
        this.getStudents(currentUser);
      })
      .catch((error) => {
        if (error.response.data)
          this.props.snackbarShowMessage(error.response.data, "error");
        else {
          this.props.snackbarShowMessage("Įvyko klaida", "error");
        }
      });
  }

  handleEditSubmit(name, pass, email, id) {
    axiosJWT
      .post("/api/update-student", {
        headers: { "x-access-token": localStorage.getItem("token") },
        username: name,
        password: pass,
        email: email,
        id: id,
      })
      .then((response) => {
        this.props.snackbarShowMessage(`Duomenys pakeisti`, "success");
        this.setState({ showEdit: false });
        this.getStudents(this.props.currentUser);
      })
      .catch((error) =>
        this.props.snackbarShowMessage(`Įvyko klaida`, "error")
      );
  }
  render() {
    return this.state.loading ? null : (
      <Container>
        <Dialog open={this.state.showEdit} fullWidth maxWidth="xs">
          <DialogTitle>Redaguoti duomenis</DialogTitle>
          <DialogContent>
            <Row>
              <TextField
                label="Mokinio prisijungimo vardas"
                variant="standard"
                onChange={(e) =>
                  this.setState({ editStudName: e.target.value })
                }
                required
                sx={{ ml: 3, mr: 3, flex: 1 }}
                value={this.state.editStudName}
              />
            </Row>
            <Row>
              <TextField
                label="Mokinio prisijungimo slaptažodis"
                variant="standard"
                onChange={(e) =>
                  this.setState({ editStudPass: e.target.value })
                }
                required
                sx={{ ml: 3, mr: 3, flex: 1 }}
                value={this.state.editStudPass}
                type="password"
              />
            </Row>
          </DialogContent>
          <DialogActions>
            <Button outline onClick={() => this.setState({ showEdit: false })}>
              Atšaukti
            </Button>
            <Button
              onClick={() =>
                this.handleEditSubmit(
                  this.state.editStudName,
                  this.state.editStudPass,
                  this.state.editStudEmail,
                  this.state.editStudId
                )
              }
            >
              Išsaugoti
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={this.state.showPassDialog}>
          <DialogContentText sx={{ ml: 3, mr: 5, mt: 3 }}>
            {this.state.editStudPass}
          </DialogContentText>
          <DialogActions>
            <Button onClick={() => this.setState({ showPassDialog: false })}>
              Uždaryti
            </Button>
          </DialogActions>
        </Dialog>

        <div className="holder">
          <Form onSubmit={this.handleSubmit}>
            <h3>Pridėti mokinį</h3>
            <div className="stud-info">
              <Row className="add-stud-row">
                <TextField
                  label="Mokinio prisijungimo vardas"
                  variant="standard"
                  onChange={(e) => this.setState({ username: e.target.value })}
                  required
                  sx={{ ml: 2, flex: 0.5 }}
                  value={this.state.username}
                />
              </Row>
              <Row className="add-stud-row">
                <TextField
                  label="Mokinio prisijungimo slaptažodis"
                  variant="standard"
                  onChange={(e) => this.setState({ password: e.target.value })}
                  required
                  sx={{ ml: 2, flex: 0.5 }}
                  value={this.state.password}
                  type="password"
                />
              </Row>
              <Row className="add-stud-row">
                <TextField
                  label="Mokinio el. pašto adresas"
                  variant="standard"
                  onChange={(e) => this.setState({ email: e.target.value })}
                  required
                  sx={{ ml: 2, flex: 0.5 }}
                  value={this.state.email}
                  type="email"
                />
              </Row>
              <Button type="submit" style={{ marginTop: 8, marginBottom: 16 }}>
                Pridėti
              </Button>
            </div>
          </Form>
          <Divider className="stud-list-divider" />
          <h3 style={{ paddingTop: 16 }}>Mokiniai</h3>
          {this.showStudents()}
        </div>
      </Container>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: state.currentUser,
  };
};

export default compose(
  withRouter,
  withSnackbar,
  connect(mapStateToProps, null)
)(StudentsPage);
