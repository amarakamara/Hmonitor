import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./components/App.jsx";
import MainRoutes from "./utils/mainroutes.jsx";
import "./index.css";
import { UserInfoProvider } from "./contexts/UserContext";
import { StateInfoProvider } from "./contexts/StateContext";
import { TabContextProvider } from "./contexts/TabContext";
import { ThresholdContextProvider } from "./contexts/ThresholdContext";
import { AuthContextProvider } from "./contexts/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserInfoProvider>
        <StateInfoProvider>
          <TabContextProvider>
            <ThresholdContextProvider>
              <AuthContextProvider>
                <MainRoutes />
              </AuthContextProvider>
            </ThresholdContextProvider>
          </TabContextProvider>
        </StateInfoProvider>
      </UserInfoProvider>
    </BrowserRouter>
  </React.StrictMode>
);
