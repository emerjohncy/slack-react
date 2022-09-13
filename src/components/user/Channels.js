import { useState, useEffect } from "react";

export default function Channels({
  currentChannel,
  channelStatus,
  requiredHeaders,
  receiverClass,
}) {
  let [modal, setModal] = useState(false);
  let [member, setMember] = useState("");
  let [currentMembers, setCurrentMembers] = useState([]);
  let [currentId, setCurrentId] = useState();
  let [owner, setOwner] = useState("");
  const [memberNumber, setMemberNumber] = useState(0);

  useEffect(() => {
    setMemberNumber(currentMembers.length);
  }, [currentMembers]);

  var myHeaders = new Headers();
  myHeaders.append("access-token", requiredHeaders.accessToken);
  myHeaders.append("client", requiredHeaders.clientToken);
  myHeaders.append("expiry", requiredHeaders.expiry);
  myHeaders.append("uid", requiredHeaders.uid);
  var requestGet = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  let searchMember = (member) => {
    fetch("/api//api/v1/users", requestGet)
      .then((response) => response.text())
      .then((result) => {
        let parse = JSON.parse(result).data;
        let find = parse.find((email) => {
          return email.uid === member;
        });
        setCurrentId(find.id);
      })
      .catch((error) => console.log("error", error));
  };

  useEffect(() => {
    fetch("/api//api/v1/users", requestGet)
      .then((response) => response.text())
      .then((result) => {
        let parse = JSON.parse(result).data;
        let find = parse.find((email) => {
          return email.id === currentChannel.owner_id;
        });
        setOwner(find.uid);
      })
      .catch((error) => console.log("error", error));
  }, [currentChannel.owner_id]);

  let addMember = () => {
    let data = {
      id: currentChannel.id,
      member_id: currentId,
    };

    var raw = JSON.stringify(data);

    myHeaders.append("Content-Type", "Application/json");

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("/api//api/v1/channel/add_member", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        let a = JSON.parse(result);
        if (
          a.error !== "Invalid user" ||
          a.error !== "User is already a member of this channel!"
        )
          temporary(member);
      })
      .catch((error) => console.log("error", error));
  };

  useEffect(() => {
    addMember();
  }, [currentId]);

  let temporary = (newMember) => {
    setCurrentMembers((data) => {
      return [newMember, ...data];
    });
  };

  useEffect(() => {
    fetch("/api//api/v1/users", requestGet)
      .then((response) => response.text())
      .then((result) => {
        let parse = JSON.parse(result).data;
        let membersArray = currentChannel.channel_members.map((id) => {
          return parse.find((email) => {
            return email.id === id.user_id;
          });
        });
        setCurrentMembers(
          membersArray.map((email) => {
            return email.uid;
          })
        );
      })
      .catch((error) => console.log("error", error));
  }, [currentChannel.channel_members]);

  return (
    <>
      {channelStatus ? (
        <>
          {modal ? (
            <div className="c-sk-overlay">
              <div className="c-sk-modal c-sk-modal--fixed p-channel_create_modal">
                <div className="c-sk-modal_title_bar c-sk-modal_title_bar--pad_right flex-dir">
                  <h1 className="">
                    <span>{currentChannel.name}</span>
                  </h1>

                  <div className="p-field_group">
                    <div className="paddingg">
                      <h3>Created by</h3>
                      <div>
                        {owner} on {currentChannel.created_at.substring(0, 10)}
                      </div>
                    </div>
                  </div>
                  <div className="c-scrollbar">
                    <label>Add New Members</label>
                    <form
                      className="flexx"
                      onSubmit={(e) => {
                        e.preventDefault();
                        searchMember(member);
                      }}
                    >
                      <input
                        className="c-input_text c-select_input"
                        placeholder="email"
                        type="email"
                        value={member}
                        onChange={(e) => setMember(e.target.value)}
                      />
                      <button
                        type="submit"
                        className="c-button c-button--primary c-button--medium"
                      >
                        add
                      </button>
                    </form>
                    <span>
                      <strong>
                        <div className="flexx wrapperr">
                          {currentMembers.map((email, index) => (
                            <div key={index} className="members">
                              <p className="boxx">{email}</p>
                            </div>
                          ))}
                        </div>
                      </strong>
                    </span>
                  </div>
                </div>
                <button
                  className="c-button-unstyled c-icon_button c-icon_button--size_medium c-sk-modal__close_button"
                  type="button"
                  onClick={() => setModal(false)}
                >
                  <span>&#10006;</span>
                </button>
              </div>
            </div>
          ) : (
            <></>
          )}
          {receiverClass === "Channel" ? (
            <div>
              <div class="name-and-input space-between">
                <h1
                  class="receiver-name on-hover"
                  onClick={() => {
                    setModal(true);
                  }}
                >
                  #{currentChannel.name}
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    stroke-width="0"
                    viewBox="0 0 24 24"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path fill="none" d="M0 0h24v24H0z"></path>
                    <path d="M7 10l5 5 5-5z"></path>
                  </svg>
                </h1>
                <div className="margin-right">
                  <button
                    className="receiver-name add-border on-hover"
                    onClick={() => {
                      setModal(true);
                    }}
                  >
                    {memberNumber} members
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </>
      ) : (
        <></>
      )}
    </>
  );
}
