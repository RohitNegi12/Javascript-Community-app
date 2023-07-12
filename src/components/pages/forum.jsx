import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import backgroundImage from "./images/user-background-image.png";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { io } from "socket.io-client";
const socket = io.connect("http://localhost:5002");

function Forum({ children }) {
    const [message, setMessage] = useState("");
    const [listOfMessages, setListOfMessages] = useState([]);

    const navigate = useNavigate();

    const sendMessage = () => {
        const packet = {
            message: message,
            author: {
                email: JSON.parse(localStorage.getItem("user")).email,
                fname: JSON.parse(localStorage.getItem("user")).fname,
                lname: JSON.parse(localStorage.getItem("user")).lname,
            },
        };
        setListOfMessages((list) => [...list, packet]);
        socket.emit("send_message", packet);
        document.getElementById("msg-field").value = "";
        document.getElementById("msg-field").focus();
    };

    const sendMessageOnEnter = (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const user = jwtDecode(token);
            if (!user) {
                localStorage.removeItem("token");
                navigate("/login");
            } else {
            }
        } else {
            navigate("/login");
        }
    }, []);

    useEffect(() => {
        socket.on("received_message", (data) => {
            setListOfMessages((list) => [...list, data]);
        });
    }, [socket]);

    return (
        <>
            {children}
            <style>
                {`
                    body {
                        background-image: url(${backgroundImage});
                        background-size: cover;
                    }

                    .forum-container {
                        backdrop-filter: blur(5px);
                        background-color: rgba(36, 36, 36, 0.3);
                        border-radius: 10px;
                        min-width: 400px;
                        min-height: 85vh;
                        width: 30%;
                        padding: 20px 0 0;
                        color: var(--accent);
                        flex-grow: 1;
                        line-height: 1.5;
                        margin-bottom: 20px;
                        margin-top: 80px;

                        display: flex;
                        flex-direction: column;
                        overflow: hidden;
                        font-family: "Ubuntu";
                        align-self: center;
                    }

                    .message-container {
                        flex-grow: 1;
                        padding: 0px 15px 15px;
                        display: flex;
                        flex-direction: column;
                        row-gap: 10px;
                        overflow: auto;
                    }
                    .input-box {
                        height: 50px;
                        display: flex;
                        align-items: stretch;
                    }
                    .message {
                        background-color: rgba(0,0,0,0.2);
                        padding: 25px 15px 5px;
                        border-radius: 5px;
                        width: 60%;
                        position: relative;
                        font-size: 24px;
                        display: flex;
                        flex-direction: column;
                    }
                    .animate {
                        animation: popIn 0.15s ease-out;
                    }
                    
                    .msg-author {
                        font-size: 14px;
                        font-weight: bold;
                        position: absolute;
                    }

                    .msg-author.owner {
                        top: 2px;
                        right: 8px;
                    }
                    .msg-author.other {
                        top: 2px;
                        left: 8px;
                    }

                    .owner {
                        align-self: flex-end;
                    }

                    .other {
                        align-self: flex-start;
                    }
                    @keyframes popIn {
                        from {
                            transform: scale(0.7);
                        }
                        to {
                            transform: scale(1);
                        }
                    }
                    canvas {
                        display: none;
                    }
                `}
            </style>
            <div className="forum-container">
                <div className="message-container">
                    <MessagesReceived listOfMessages={listOfMessages} />
                </div>
                <div className="input-box">
                    <input
                        id="msg-field"
                        type="text"
                        style={{
                            flexGrow: "1",
                            fontSize: "24px",
                            padding: "15px",
                        }}
                        onChange={(event) => {
                            setMessage(event.target.value);
                        }}
                        onKeyDown={sendMessageOnEnter}
                    />
                    <button
                        style={{
                            width: "80px",
                            fontSize: "30px",
                            color: "rgba(79, 24, 102)",
                            cursor: "pointer",
                        }}
                        onClick={sendMessage}
                    >
                        <FontAwesomeIcon icon={faPaperPlane} />
                    </button>
                </div>
            </div>
        </>
    );
}

function MessagesReceived({ listOfMessages }) {
    let renderMessages = [];
    listOfMessages.map((msg, index) => {
        const isOwner =
            msg.author.email == JSON.parse(localStorage.getItem("user")).email
                ? true
                : false;
        let classNames = isOwner ? "message owner" : "message other";
        classNames =
            index == listOfMessages.length - 1
                ? classNames + " animate"
                : classNames;
        renderMessages.push(
            <div className={classNames} key={index}>
                <span
                    className={
                        isOwner ? "msg-author owner" : "msg-author other"
                    }
                    style={{
                        textAlign: "right",
                    }}
                >
                    {isOwner
                        ? "You"
                        : msg.author.fname + " " + msg.author.lname}
                </span>
                {msg.message}
            </div>
        );
    });

    return renderMessages;
}

export default Forum;
