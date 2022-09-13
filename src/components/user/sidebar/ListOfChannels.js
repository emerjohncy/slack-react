import React from "react";
import { useState, useEffect } from "react";
import { MdArrowDropDown } from "react-icons/md";
import { MdArrowRight } from "react-icons/md";

export default function ListOfChannels({
  requiredHeaders,
  setCurrentChannel,
  setChannelStatus,
  setReceiverClass,
  setSelectedUserId,
  setSelectedUserEmail,
}) {
  let [newChannel, setNewChannel] = useState("");
  let [modal, setModal] = useState(false);
  let [members, setMembers] = useState([]);
  let [member, setMember] = useState("");
  let [ids, setIds] = useState([]);
  let [channels, setChannels] = useState([]);
  let [isChannelHeaderClicked, setIsChannelHeaderClicked] = useState(true);

  useEffect(() => {
    setChannels(channels);
  }, [channels]);

  //Headers
  var myHeaders = new Headers();
  myHeaders.append("access-token", requiredHeaders.accessToken);
  myHeaders.append("client", requiredHeaders.clientToken);
  myHeaders.append("expiry", requiredHeaders.expiry);
  myHeaders.append("uid", requiredHeaders.uid);
  myHeaders.append("Content-Type", "Application/json");

  //Get request
  var requestGet = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  //Create Channel
  let createChannel = (newChannel, ids) => {
    let data = {
      name: newChannel,
      user_ids: ids,
    };

    var raw = JSON.stringify(data);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("/api//api/v1/channels", requestOptions)
      .then((response) => {
        return response.text();
      })
      .then((result) => {
        console.log(result);
        getChannelList();
      })
      .catch((error) => console.log("error", error));
  };

  let addMember = (newMember) => {
    fetch("/api//api/v1/users", requestGet)
      .then((response) => response.text())
      .then((result) => {
        let parse = JSON.parse(result).data;
        let find = parse.find((email) => {
          return email.uid === member;
        });

        if (find !== undefined) {
          let id = find.id;
          let same = members.find((email) => {
            return email === find.uid;
          });
          if (same === find.uid) {
            console.log("user already added");
          } else {
            setMembers((prevData) => {
              return [newMember, ...prevData];
            });
            setIds((prevData) => {
              return [id, ...prevData];
            });
          }
        } else {
          console.log("no user");
        }
        setMember("");
      })
      .catch((error) => console.log("error", error));
  };

  // show channels
  const getChannelList = () => {
    fetch("/api//api/v1/channels", requestGet)
      .then((response) => response.text())
      .then((result) => {
        let parse = JSON.parse(result).data;
        let channels = parse.map((data) => {
          return { name: data.name, id: data.id };
        });
        setChannels(channels);
      })
      .catch((error) => console.log("error", error));
  };

  // prevent getChannelList from running every second
  useEffect(() => {
    const refresh = setInterval(() => {
      getChannelList();
    }, 1000);
    return () => {
      clearInterval(refresh);
    };
  });

  // My Channels Component
  let MyChannels = () => {
    return (
      <>
        {channels.map((channels, index) => (
          <div
            className="channel-con"
            key={index}
            onClick={() => {
              getChannelInfo(channels.id);
              setReceiverClass("Channel");
              setSelectedUserId(channels.id);
              setSelectedUserEmail(`Channel: ${channels.name}`);
            }}
          >
            <img
              src={`${process.env.PUBLIC_URL}hash.png`}
              alt="hash"
              className="icon"
            />
            <div className="channel-name">{channels.name}</div>
          </div>
        ))}
        <div className="channel-con">
          <img
            src={`${process.env.PUBLIC_URL}add.png`}
            alt="add"
            className="icon"
          />
          <div id="" onClick={() => setModal(true)} className="channel-name">
            Add Channels
          </div>
        </div>
      </>
    );
  };

  //get channel info
  let getChannelInfo = (channelid) => {
    fetch(
      "/api//api/v1/channels/" + channelid.toString(),
      requestGet
    )
      .then((response) => response.text())
      .then((result) => {
        let parse = JSON.parse(result).data;
        setCurrentChannel(parse);
        setChannelStatus(true);
      })
      .catch((error) => console.log("error", error));
  };

  //output
  return (
    <>
      <div className="header">
        <div
          className="header-title"
          onClick={() => {
            setIsChannelHeaderClicked(!isChannelHeaderClicked);
          }}
        >
          <div className="button-dropdown">
            {isChannelHeaderClicked ? <MdArrowDropDown /> : <MdArrowRight />}
          </div>
          <span>Channels</span>
        </div>
      </div>
      <nav className={`${isChannelHeaderClicked ? "active" : "inactive"}`}>
        <ul className="ul-DMUsers">
          <MyChannels />
        </ul>
      </nav>
      {modal ? (
        <div>
          <div className="modal-overlay">
            <div className="modal-box">
              <div className="modal-header">
                <div className="modal-title-bar">
                  <h1>Create a channel</h1>
                </div>
              </div>
              <div className="modal-middle">
                <div className="modal-inner">
                  <div className="modal-content-section">
                    <div className="modal-text">
                      Channels are where your team communicates. They’re best
                      when organized around a topic — #marketing, for example.
                    </div>
                    <div>
                      <label>
                        <span className="modal-label">
                          <strong>Name</strong>
                        </span>
                      </label>
                      <div className="modal-channel-con">
                        <form>
                          <input
                            className="modal-input"
                            placeholder="e.g. plan-budget"
                            type="text"
                            value={newChannel}
                            onChange={(e) => setNewChannel(e.target.value)}
                          />
                        </form>
                      </div>
                    </div>
                    <div>
                      <label>
                        <span className="modal-label">
                          <strong>Add Members</strong>
                        </span>
                      </label>
                      <div className="modal-members-input-con">
                        <form
                          className="flex"
                          onSubmit={(e) => {
                            e.preventDefault();
                            addMember(member);
                          }}
                        >
                          <input
                            className="modal-input"
                            placeholder="email"
                            type="email"
                            value={member}
                            onChange={(e) => setMember(e.target.value)}
                          />
                          <button type="submit" className="modal-button">
                            add
                          </button>
                        </form>
                        <div className="flex wrapperr">
                          {members.map((email, index) => (
                            <div key={index} className="members">
                              <p className="box">{email}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer-con">
                <div className="modal-footer-button">
                  <button
                    className="modal-button"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      createChannel(newChannel, ids);
                    }}
                  >
                    Create
                  </button>
                </div>
              </div>
              <button
                className="modal-close-button"
                type="button"
                onClick={() => setModal(false)}
              >
                <span>&#10006;</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
