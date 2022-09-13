import React, { useEffect } from "react";
import { useState } from "react";
import { MdArrowDropDown } from "react-icons/md";
import { MdArrowRight } from "react-icons/md";
import { AiOutlinePlus } from "react-icons/ai";

export default function ListOfDMs({
  requiredHeaders,
  setSelectedUserEmail,
  setSelectedUserId,
  setReceiverClass,
}) {
  const [isDMHeaderClicked, setIsDMHeaderClicked] = useState(true);
  const [isDMHeaderHovered, setIsDMHeaderHovered] = useState(false);
  const [recentDMUsers, setRecentDMUsers] = useState([]);

  useEffect(() => {
    let intervalId = setInterval(() => {
      apiRecentDM();
    }, 1000);
    return () => clearInterval(intervalId);
  });

  const handleNewMessageClicked = () => {
    setSelectedUserEmail("New Message");
    setReceiverClass("User");
    setSelectedUserId("");
  };

  function apiRecentDM() {
    //Get recently DMS API
    var myHeaders = new Headers();
    myHeaders.append("access-token", requiredHeaders.accessToken);
    myHeaders.append("client", requiredHeaders.clientToken);
    myHeaders.append("expiry", requiredHeaders.expiry);
    myHeaders.append("uid", requiredHeaders.uid);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch("/api//api/v1/users/recent", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        let listOfRecentDMs = result.data;
        setRecentDMUsers(
          listOfRecentDMs.map(({ email, id }) => ({ email, id }))
        );
        // setRecentDMUsers(listOfRecentDMs.filter((obj, i) => listOfRecentDMs.indexOf(obj) === i))
      })
      .catch((error) => console.log("error", error));
  }

  const handleDMHeaderCLicked = () => {
    setIsDMHeaderClicked(!isDMHeaderClicked);
    apiRecentDM();
  };

  function DMUsers({ recentDMUsers, setSelectedUserEmail, setSelectedUserId }) {
    let uniqueRecentDMUsers = [
      ...new Map(recentDMUsers.map((item) => [item["id"], item])).values(),
    ];

    return uniqueRecentDMUsers.map(({ email, id }) => (
      <div key={id}>
        <DMUser
          email={email}
          id={id}
          setSelectedUserEmail={setSelectedUserEmail}
          setSelectedUserId={setSelectedUserId}
        />
      </div>
    ));
  }

  function DMUser({ email, id, setSelectedUserEmail, setSelectedUserId }) {
    const handleUserClicked = () => {
      setSelectedUserEmail(email);
      setSelectedUserId(id);
      setReceiverClass("User");
    };

    return (
      <li
        className="li-DMUser"
        onClick={handleUserClicked}
        // className={`li-DMUser ${isUserClicked ? 'clicked' : 'not-clicked'}`}
      >
        {email}
      </li>
    );
  }

  return (
    <div>
      <div
        className="header"
        onMouseEnter={() => setIsDMHeaderHovered(true)}
        onMouseLeave={() => setIsDMHeaderHovered(false)}
      >
        <div className="header-title" onClick={handleDMHeaderCLicked}>
          <div className="button-dropdown">
            {isDMHeaderClicked ? <MdArrowDropDown /> : <MdArrowRight />}
          </div>
          <span>Direct messages</span>
        </div>
        <div
          className={`button-plus ${
            isDMHeaderHovered ? "hovered" : "not-hovered"
          }`}
          onClick={handleNewMessageClicked}
        >
          <AiOutlinePlus />
        </div>
      </div>
      <nav className={`${isDMHeaderClicked ? "active" : "inactive"}`}>
        <ul className="ul-DMUsers">
          <DMUsers
            recentDMUsers={recentDMUsers}
            setSelectedUserEmail={setSelectedUserEmail}
            setSelectedUserId={setSelectedUserId}
          />
        </ul>
      </nav>
    </div>
  );
}
