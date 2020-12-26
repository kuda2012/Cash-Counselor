import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
import React, { useState } from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import Router from "./Router";
import checkLoggedIn from "./helpers/CheckLoggedIn";
import Timeout from "./helpers/Timeout";
import { useSelector } from "react-redux";
function App() {
  checkLoggedIn();
  const currentLocation = useSelector((state) => state.currentLocation);
  const [triggerModal, setTriggerModal] = useState(false);

  return (
    <div className="App">
      {
        <>
          <NavBar
            triggerModal={triggerModal}
            setTriggerModal={setTriggerModal}
            currentLocation={currentLocation}
          />
          <Router />
          <Timeout
            triggerModal={triggerModal}
            setTriggerModal={setTriggerModal}
          />
        </>
      }
    </div>
  );
}
export default App;
