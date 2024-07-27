import React from "react";
import TaskManager from "./components/TaskManager";
import axios from "axios";

const App: React.FC = () => {
  // Function to get the CSRF token
  const getCSRFToken = () => {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken"))
      ?.split("=")[1];
    return cookieValue || "";
  };

  // Set CSRF token in axios defaults
  axios.defaults.headers.common["X-CSRFToken"] = getCSRFToken();

  return (
    <div className="App">
      <TaskManager />
    </div>
  );
};

export default App;
