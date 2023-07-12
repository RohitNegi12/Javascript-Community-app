import "../../blue-background.css";
import { useEffect } from "react";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import particlejs from "./meg_script.js";
import homeLogo from "./images/home-logo.svg";

const Home = (props) => {
    return (
        <>
            <style>
                {`
                    body {
                        height: 100%;
                        width: 100%;
                        overflow-y: hidden;
                    }   
                    .title {
                        position: absolute;
                        left: 50%;
                        top: 45%;
                        font-family: "Poppins";
                        text-align: center;
                        height: 280px;
                        width: 280px;
                        border-radius: 300px;
                        // border: 38px solid #130639;
                        border: 150px solid var(--accent);
                        background-color: rgba(19, 6, 57, 0.7);
                        color: var(--accent);
                        transform: translate(-50%) translateY(-50%);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        animation: circleback 4s linear 2.5s infinite alternate, circleborder 4s ease 2.5s 1 forwards;
                        // animation-iteration-count: infinite;
                        // animation-delay: 1.5s;
                        // animation-timing-function: linear;
                        // animation: circleborder 4s linear 1.5s 1 normal forwards;
                    }
                    .title > h1 {
                        position: relative;
                        color #EEEEEE;
                        font-weight: 600;
                        font-size: 60px;
                        padding: 0;
                        margin: 0;
                        line-height: 1;
                        text-shadow: 0 0 30px #000155;
                        color: var(--accent);
                        opacity: 0;
                        animation: fadein 3s ease 4.5s 1 forwards;
                    }
                    @keyframes slideIn {
                        from {
                            bottom: -70%;
                        }
                        to {
                            bottom: 0;
                        }
                    }
                    @keyframes slideInCaption {
                        from {
                            bottom: -70%;
                        }
                        to {
                            bottom: 50%;
                            transform: translateY(50%);
                        }
                    }
                    @keyframes circleback {
                        0% {
                            box-shadow: 0 0 500px #130639;
                        }
                        50% {
                            box-shadow: 0 0 500px var(--secondary);
                        }
                        100% {
                            box-shadow: 0 0 500px var(--blue);
                        }

                    }
                    @keyframes circleborder {
                        from {
                            border-width: 150px;
                        }
                        to {
                            border-width: 2px;
                        }
                    }
                    @keyframes fadein {
                        from { opacity: 0}
                        to { opacity: 1 }
                    }
                `}
            </style>
            {props.children}
            <div className="container">
                <div className="title">
                    <h1>Questo</h1>
                </div>
                <div
                    style={{
                        position: "absolute",
                        bottom: "-70%",
                        width: "50%",
                        // height: "100%",
                        display: "flex",
                        padding: "50px",
                        justifyContent: "flex-start",
                        alignItems: "flex-end",
                        animation: "slideIn 1s ease-out",
                        animationDelay: "0.5s",
                        animationFillMode: "forwards",
                    }}
                >
                    <img src={homeLogo} width="400px" />
                </div>
                <div
                    style={{
                        position: "absolute",
                        right: "100px",
                        bottom: "-70%",
                        width: "50%",
                        // height: "100%",
                        display: "flex",
                        padding: "50px",
                        justifyContent: "flex-end",
                        alignItems: "flex-end",
                        animation: "slideInCaption 1s ease-out",
                        animationDelay: "1.5s",
                        animationFillMode: "forwards",
                    }}
                >
                    <div className="caption" style={{ color: "var(--accent)" }}>
                        <p>connect. </p>
                        <p>collab. </p>
                        <p>create.</p>
                    </div>
                </div>
            </div>
            <script
                src="https://code.jquery.com/jquery-3.6.1.min.js"
                integrity="sha256-o88AwQnZB+VDvE9tvIXrMQaPlFFSUTR+nldQm1LuPXQ="
                crossorigin="anonymous"
            ></script>
            <script src="src\components\pages\meg_script.js"></script>
        </>
    );
};

export default Home;
