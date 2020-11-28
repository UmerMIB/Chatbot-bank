import React from "react";
import "./index.css";

const ProjectDetails = () => {
  return (
    <div className="projectDetails">
      <img
        src={require("./assests/images/chatbot_thumb.png")}
        alt="image"
        className="projectDetails-img"
      />
      <div className="projectDetails-details">
        <h1>VIT CAPSTONE PROJECT </h1>
        <h1>"DIGITAL ASSISTANT"</h1>
      </div>
    </div>
  );
};

export default ProjectDetails;
