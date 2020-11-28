import Logo from "./assests/images/chatbotLogo.svg";
import React, { Component } from "react";
import {
  Widget,
  addResponseMessage,
  setQuickButtons,
  addLinkSnippet,
  addUserMessage,
} from "react-chat-widget";
import "react-chat-widget/lib/styles.css";
import axios from "axios";
import ProjectDetails from "./projectDetails";
// axios.defaults.baseURL = "http://localhost:5000";

function getResponse(message) {
  axios
    .get("/get-response", {
      params: {
        query: message,
      },
    })
    .then((res) => {
      let response = res.data;
      console.log(response);

      response.forEach((val) => {
        if (val.message === "text") {
          val.text.text.forEach((message) => addResponseMessage(message));
        }
        if (val.message === "card") {
          addLinkSnippet({
            title: val.card.buttons[0].text,
            link: val.card.buttons[0].postback,
            target: "_blank",
          });
        }
        if (val.message === "quickReplies") {
          let repliesArr = [];
          val.quickReplies.quickReplies.forEach((replies) => {
            console.log(replies);
            repliesArr.push({ label: replies, value: replies });
          });
          setQuickButtons(repliesArr);
        }
      });
    });
}

class ChatWidget extends Component {
  handleNewUserMessage(message) {
    getResponse(message);
    setQuickButtons([]);
  }

  handleQuickButtonClicked(message) {
    console.log(message);
    setQuickButtons([]);
    addUserMessage(message);
    getResponse(message);
  }

  render() {
    return (
      <>
        <ProjectDetails />
        <div className="chat-widget">
          <Widget
            handleNewUserMessage={this.handleNewUserMessage.bind(this)}
            showCloseButton
            profileAvatar={Logo}
            title="Digital Assistant"
            subtitle="VIT CAPSTONE PROJECT"
            launcherOpenLabel="Talk to me I'm Special"
            toggleMsgLoader="..."
            handleQuickButtonClicked={this.handleQuickButtonClicked.bind(this)}
          />
        </div>
      </>
    );
  }
}

export default ChatWidget;
