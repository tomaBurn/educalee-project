import React from "react";
import { Form, Row, Button, Container } from "reactstrap";
import { withRouter } from "react-router-dom";
import { axiosJWT } from "../../App.js";
import { connect } from "react-redux";
import { compose } from "redux";
import TextField from "@mui/material/TextField";

import "./TopicPage.css";

class TopicPage extends React.Component {
  constructor() {
    super();
    this.state = {
      topics: null,
      title: "",
      level: null,
      showSuccessAlert: false,
      showErrorAlert: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const { currentUser } = this.props;
    axiosJWT
      .post("/api/topics/insert", {
        headers: { "x-access-token": localStorage.getItem("token") },
        title: this.state.title,
        level: this.state.level,
        teacherId: currentUser.id,
      })
      .then(() => this.props.history.push("/home"))
      .catch((error) => {
        this.props.history.push("/");
      });
  }

  render() {
    return (
      <Container>
        <div>
          <div className="topic-header">
            <h3>Pridėti naują lygį</h3>
          </div>
          <Form onSubmit={this.handleSubmit}>
            <Row className="add-stud-row">
              <TextField
                label="Pavadinimas"
                variant="standard"
                onChange={(e) => this.setState({ title: e.target.value })}
                required
                sx={{ ml: 2, flex: 0.4 }}
              />
            </Row>
            <Row className="add-stud-row">
              <TextField
                label="Lygis"
                variant="standard"
                type="number"
                onChange={(e) => this.setState({ level: e.target.value })}
                required
                sx={{ ml: 2, flex: 0.4 }}
              />
            </Row>
            <Button
              outline
              color="secondary"
              className="topic-btn-back"
              onClick={() => this.props.history.push("/home")}
            >
              Atgal
            </Button>
            <Button type="submit" className="topic-btn-submit">
              Patvirtinti
            </Button>
          </Form>
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

export default compose(withRouter, connect(mapStateToProps, null))(TopicPage);
