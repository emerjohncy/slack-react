import React from "react";
import { useState, useEffect } from "react";

export default function Messages({
  requiredHeaders,
  selectedUserEmail,
  setSelectedUserEmail,
  selectedUserId,
  setSelectedUserId,
  receiverClass,
}) {
  const [messageInput, setMessageInput] = useState("");
  const [listOfMessages, setListOfMessages] = useState([]);
  const [searchUserInput, setSearchUserInput] = useState("");
  const [searchedUser, setSearchedUser] = useState([]);

  // Send Message API ========================================

  function sendMessage(headersObject, receiverId, message) {
    let myHeaders = new Headers();
    myHeaders.append("access-token", headersObject.accessToken);
    myHeaders.append("client", headersObject.clientToken);
    myHeaders.append("expiry", headersObject.expiry);
    myHeaders.append("uid", headersObject.uid);
    myHeaders.append("Content-Type", "Application/json");

    let raw = {
      receiver_id: receiverId,
      receiver_class: receiverClass,
      body: message,
    };

    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(raw),
      redirect: "follow",
    };

    fetch("/api//api/v1/messages", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  }

  // ========================================

  // Retrieve Message API ========================================

  function retrieveMessage(headersObject, senderId) {
    let myHeaders = new Headers();
    myHeaders.append("access-token", headersObject.accessToken);
    myHeaders.append("client", headersObject.clientToken);
    myHeaders.append("expiry", headersObject.expiry);
    myHeaders.append("uid", headersObject.uid);
    myHeaders.append("Content-Type", "Application/json");

    let requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `/api//api/v1/messages?sender_id=${headersObject.currentUserId}&receiver_class=${receiverClass}&receiver_id=${senderId}`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => setListOfMessages(JSON.parse(result).data || []))
      .catch((error) => console.log("error", error));
  }

  // ========================================

  let messages = listOfMessages.map((message, i) => {
    return (
      <div className="message-container" key={i}>
        <div className="sender-details">
          <h2 className="sender-uid">{message.sender.uid}</h2>
          <p className="time-sent">{message.created_at}</p>
        </div>
        <p className="message-body">{message.body}</p>
      </div>
    );
  });

  let searchedUserList = searchedUser.map((user, i) => (
    <li
      key={i}
      id={user.id}
      data={user.uid}
      onClick={(e) => {
        setSelectedUserId(e.target.id);
        setSelectedUserEmail(e.target.getAttribute("data"));
        setSearchUserInput("");
      }}
    >
      {user.uid}
    </li>
  ));

  useEffect(() => {
    /* Remove list of searched user */
    setSearchUserInput("");
  }, [selectedUserId]);

  useEffect(() => {
    /* To refresh message history upon changing the selected user & every second */
    retrieveMessage(requiredHeaders, selectedUserId);

    const interval = setInterval(() => {
      if (selectedUserId === null || selectedUserId === "") return;
      console.log(selectedUserId);
      retrieveMessage(requiredHeaders, selectedUserId);
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedUserId]);

  useEffect(() => {
    /* Show all user based on what is entered on input */
    getListOfUser(requiredHeaders);
  }, [searchUserInput]);

  function updateScroll(element) {
    /* Scroll to bottom of overflow */
    element.scrollTop = element.scrollHeight;
  }

  function submitHandler(e) {
    e.preventDefault();
    sendMessage(requiredHeaders, selectedUserId, messageInput);
    retrieveMessage(requiredHeaders, selectedUserId);
    setMessageInput("");
    setTimeout(() => {
      updateScroll(document.querySelector(".messages-container"));
    }, 500);
  }

  function getListOfUser(headersObject) {
    let myHeaders = new Headers();
    myHeaders.append("access-token", headersObject.accessToken);
    myHeaders.append("client", headersObject.clientToken);
    myHeaders.append("expiry", headersObject.expiry);
    myHeaders.append("uid", headersObject.uid);
    myHeaders.append("Content-Type", "Application/json");

    let requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch("/api//api/v1/users", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        let arrayOfUsers = JSON.parse(result).data;

        setSearchedUser(
          arrayOfUsers.filter((user) => user.uid.includes(searchUserInput))
        );
      })
      .catch((error) => console.log("error", error));
  }

  return (
    <div className="messages-dashboard">
      {receiverClass === "Channel" ? null : (
        <div className="name-and-input">
          <h1 className="receiver-name">{selectedUserEmail}</h1>
          {selectedUserId === "" ? (
            <div className="search-div">
              <p>To:</p>
              <input
                className="search-all-user-input"
                placeholder="name@email.com"
                type="text"
                value={searchUserInput}
                onChange={(e) => setSearchUserInput(e.target.value)}
              />
            </div>
          ) : null}
        </div>
      )}
      {searchUserInput === "" ? null : (
        <ul className="searched-user-container">{searchedUserList}</ul>
      )}
      <div className="messages-container">
        {selectedUserId === "" ? null : messages}
      </div>
      <form
        className="send-message-form"
        onKeyDown={(e) => {
          if (e.key == "Enter") {
            e.preventDefault();
            sendMessage(requiredHeaders, selectedUserId, messageInput);
            retrieveMessage(requiredHeaders, selectedUserId);
            setMessageInput("");
            setTimeout(() => {
              updateScroll(document.querySelector(".messages-container"));
            }, 500);
          }
        }}
        onSubmit={submitHandler}
      >
        <textarea
          className="message-body-input"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder={`Message ${selectedUserEmail}`}
        ></textarea>
        <input className="send-message-button" type="submit" value="Send" />
      </form>
    </div>
  );
}
