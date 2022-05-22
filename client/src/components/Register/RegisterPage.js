import React from "react";
import { Button, Row, Form } from "reactstrap";
import Axios from "axios";
import { withRouter } from "react-router-dom";
import TextField from "@mui/material/TextField";

import "./RegisterPage.css";

class RegisterPage extends React.Component {
  constructor() {
    super();
    this.state = {
      name: null,
      password: null,
      email: null,
      passwordRepeat: null,
    };
    this.onSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();

    console.log("SUBMIT", this.state);
    if (this.state.password === this.state.passwordRepeat) {
      Axios.post("/api/register", {
        username: this.state.name,
        password: this.state.password,
        email: this.state.email,
      })
        .then((response) => {
          this.props.history.push("/");
        })
        .catch((error) => alert(error.response.data));
    } else {
      alert("Slaptažodžiai nesutampa");
    }
  }

  render() {
    return (
      <div className="register-wrapper">
        <div className="register-holder">
          <h3>Registracija</h3>
          <Form onSubmit={this.onSubmit}>
            <Row className="add-stud-row">
              <TextField
                label="Vartotojo vardas"
                variant="standard"
                onChange={(e) => this.setState({ name: e.target.value })}
                value={this.state.name}
                required
                sx={{ ml: 2, mr: 3, flex: 1 }}
              />
            </Row>
            <Row className="add-stud-row">
              <TextField
                label="El. pašto adresas"
                variant="standard"
                onChange={(e) => this.setState({ email: e.target.value })}
                value={this.state.email}
                required
                sx={{ ml: 2, mr: 3, flex: 1 }}
              />
            </Row>
            <Row className="add-stud-row">
              <TextField
                label="Slaptažodis"
                variant="standard"
                type="password"
                onChange={(e) => this.setState({ password: e.target.value })}
                required
                sx={{ ml: 2, mr: 3, flex: 1 }}
              />
            </Row>

            <Row className="add-stud-row">
              <TextField
                label="Pakartoti slaptažodį"
                variant="standard"
                type="password"
                onChange={(e) =>
                  this.setState({ passwordRepeat: e.target.value })
                }
                required
                sx={{ ml: 2, mr: 3, flex: 1 }}
              />
            </Row>
            <Row>
              <Button
                outline
                color="secondary"
                className="register-btn"
                onClick={() => this.props.history.push("/")}
              >
                Atgal
              </Button>
              <Button type="submit" className="register-btn">
                Registruotis
              </Button>
            </Row>
          </Form>
        </div>
      </div>
    );
  }
}

export default withRouter(RegisterPage);
