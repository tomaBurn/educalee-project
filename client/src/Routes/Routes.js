import React from "react";
import { Switch, Route } from "react-router-dom";
import * as currentUserActions from "../redux/actions/currentUserActions";
import { connect } from "react-redux";

import Layout from "../components/Layout/Layout";
import Home from "../components/Home/HomePage";
import StudentsPage from "../components/Students/StudentsPage";
import QuizPage from "../components/Quiz/QuizPage";
import TopicPage from "../components/Topic/TopicPage";
import CreateQuiz from "../components/CreateQuiz/CreateQuizPage";
import LoginPage from "../components/Login/LoginPage";
import RegisterPage from "../components/Register/RegisterPage";
import StudentHomePage from "../components/StudentHomePage/StudentHomePage";
import LeaderBoardPage from "../components/LeaderBoardPage/LeaderBoardPage";
import ResultsPage from "../components/LeaderBoardPage/ResultsPage";

class Routes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      components: [
        { component: Home, path: "/home" },
        { component: StudentsPage, path: "/students" },
        { component: QuizPage, path: "/quiz" },
        { component: TopicPage, path: "/add-topic" },
        { component: CreateQuiz, path: "/create-quiz" },
        { component: LeaderBoardPage, path: "/leaderboard" },
        { component: ResultsPage, path: "/quiz-results" },
      ],
      studComponents: [
        { component: StudentHomePage, path: "/stud-home" },
        { component: QuizPage, path: "/quiz" },
        { component: LeaderBoardPage, path: "/leaderboard" },
      ],
    };
  }

  render() {
    const { currentUser } = this.props;
    if (!currentUser.id)
      return (
        <Switch>
          <Route path="/" exact component={LoginPage} />
          <Route path="/register" exact component={RegisterPage} />
        </Switch>
      );

    if (currentUser.isTeacher === "Y") {
      return (
        <Switch>
          <Route path="/" exact component={LoginPage} />
          {this.state.components.map((comp, i) => {
            let wrappedComponent = () => (
              <Layout>
                <comp.component />
              </Layout>
            );
            return (
              <Route
                component={wrappedComponent}
                path={comp.path}
                key={`route_key_${i}`}
                title="Educalee"
              />
            );
          })}
        </Switch>
      );
    } else if (currentUser.isTeacher === "N") {
      return (
        <Switch>
          <Route path="/" exact component={LoginPage} />
          {this.state.studComponents.map((comp, i) => {
            let wrappedComponent = () => (
              <Layout>
                <comp.component />
              </Layout>
            );
            return (
              <Route
                component={wrappedComponent}
                path={comp.path}
                key={`route_key_${i}`}
                title="Educalee"
              />
            );
          })}
        </Switch>
      );
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: state.currentUser,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    login: (currentUser) =>
      dispatch(currentUserActions.loginSuccess(currentUser)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Routes);
