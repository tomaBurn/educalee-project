import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import getStore from "./redux/store";
import Axios from "axios";
import Routes from "./Routes/Routes";

const { store } = getStore();

export const axiosJWT = Axios.create();

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
