import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import {
    faInstagram,
    faTwitter,
    faGithub,
    faLinkedin,
    faReddit,
} from "@fortawesome/free-brands-svg-icons";

import backgroundImage from "./images/user-background-image.png";
import sampleProfileImage from "./images/sample-profile.webp";

const Profile = ({ children }) => {
    const [photo, setPhoto] = useState();
    const [langsKnown, setLangsKnown] = useState([]);
    const [socialMediaHandles, setSocialMediaHandles] = useState([]);
    const [completed, setCompleted] = useState(0);
    const [isSet, setIsSet] = useState(false);
    const [user, setUser] = useState({});

    const navigate = new useNavigate();
    async function setProfileCompletion() {
        const response = await fetch(
            "http://localhost:5001/get-profile-completion-status",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: JSON.parse(localStorage.getItem("user")).email,
                }),
            }
        );
        const data = await response.json();
        if (data.status == "ok") {
            setCompleted(Math.ceil((parseInt(data.completed) / 3) * 100));
        } else {
            setCompleted(0);
            alert("Couldn't get profile completion status.");
        }
    }

    async function populateProfile() {
        //Stuff to do when the user logs in successfully
        setProfileCompletion();
    }

    useEffect(() => {
        const token = localStorage.getItem("token");
        console.log(token);
        if (token) {
            const user = jwtDecode(token);
            if (!user) {
                localStorage.removeItem("token");
                navigate("/login");
            } else {
                setUser({
                    fname: JSON.parse(localStorage.getItem("user")).fname,
                    lname: JSON.parse(localStorage.getItem("user")).lname,
                });
                populateProfile();
            }
        } else {
            navigate("/login");
        }
    }, []);

    async function saveUser() {
        //Get languages known
        const email = JSON.parse(localStorage.getItem("user")).email;
        const response = await fetch("http://localhost:5001/update-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: email,
                langsKnown: langsKnown,
                socialMediaHandles: socialMediaHandles,
            }),
        });

        const data = await response.json();
        if (data.status == "ok") alert(data.msg);
        else alert(data.error);

        //get profile photo
        const reader = new FileReader();

        reader.addEventListener("load", async () => {
            const response = await fetch(
                "http://localhost:5001/update-profile-photo",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        imageDataURL: reader.result,
                        imageName: photo[0].name,
                        email: email,
                    }),
                }
            );
            const data = await response.json();
            if (data.status == "ok") {
                alert("Profile photo updated.");
            } else {
                alert(data.error);
            }
        });
        if (typeof photo == "object") {
            console.log("Reading profile photo");
            reader.readAsDataURL(photo[0]);
        }

        setProfileCompletion();
    }

    return (
        <>
            {children} {/*navbar*/}
            <style>
                {`
                body {
                    background-image: url(${backgroundImage});
                    background-size: cover;
                }
                .profile-container {
                    backdrop-filter: blur(5px);
                    background-color: rgba(36, 36, 36, 0.3);

                    border-radius: 10px;
                    margin: 80px 250px 15px;
                    padding: 20px 50px;
                    color: var(--accent);
                    flex-grow: 1;
                    font-family: "Ubuntu";
                    line-height: 1.5;
                    display: flex;
                    flex-direction: column;
                }

                .profile-container p {
                    font-size: 20px;
                }
                
                .single-chart {
                    width: 100px;
                    justify-content: space-around ;
                }
                  
                .circular-chart {
                    display: block;
                    margin: 10px auto;
                    max-width: 80%;
                    max-height: 250px;
                }
                  
                .circle-bg {
                    fill: none;
                    stroke: #eee;
                    stroke-width: 3.8;
                }
                  
                .circle {
                    fill: none;
                    stroke-width: 2.8;
                    stroke-linecap: round;
                    animation: progress 1s ease-out forwards;
                }
                  
                @keyframes progress {
                    0% {
                            stroke-dasharray: 0 100;
                    }
                }
                  
                .circular-chart.purple .circle {
                    stroke: rgba(83, 18, 130);
                }
                  
                .percentage {
                    fill: var(--accent);
                    font-family: "Ubuntu";
                    font-size: 0.5em;
                    text-anchor: middle;
                }

                .profile-question {
                    align-self: center;
                    text-align: center;
                    margin-bottom: 20px;
                }

                .profile-fields {
                    font-family: "Ubuntu";
                    border-style: none;
                    font-size: 16px;
                    padding: 10px;
                    width: 100%;
                }

                .lang-display {
                    min-height: 100px;
                    background-color: rgba(36, 36, 36, 0.4);
                    border-radius: 10px 10px 0 0;
                    padding: 15px;
                    display: flex;
                    flex-wrap: wrap;
                    align-items: flex-start;
                    row-gap: 15px;
                    column-gap: 15px;
                    transition: all 0.2s ease-out;
                }
            
                .lang-box {
                    background-color: rgb(230, 18, 130);
                    border-radius: 5px;
                    padding: 0px 10px;
                    font-size: 20px;
                    text-overflow: ellipsis;
                    max-width: 370px;
                    max-height: 30px;
                    overflow: hidden;
                    white-space: nowrap;
                    cursor: pointer;
                    transition: all 0.2s ease-out;
                    display: flex;
                    column-gap: 5px;
                }

                .lang-box-container {
                    transition: all 0.2s ease-out;
                }

                .cross-close {
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    z-index: 2;
                    width: 17px;
                    height: 17px;
                    background-color: var(--accent);
                    color: rgb(230, 18, 130);
                    border-radius: 100%;
                    line-height: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: all 0.1s ease-out;
                }

                .lang-box:hover + .cross-close {
                    opacity: 1;
                }

                .lang-box:hover {
                    transform: scale(0.9);
                }

                #lastLang {
                    animation-name: grow;
                    animation-duration: 0.2s;
                }

                @keyframes grow {
                    from { transform: scale(0) }
                    to { transform: scale(1) }
                }

                @keyframes shrink {
                    from { transform: scale(1) }
                    to { transform: scale(0) }
                }

                .divider {
                    width: 100%;
                    height: 5px;
                    border-bottom: solid 2px var(--accent);

                }

                .profile-form-container {
                    display: flex;
                    justify-content: space-evenly;
                }

                .profile-btn {
                    width: 150px;
                    front-family: Ubunty;
                    font-size: 20px;
                    line-height: 1.6;
                    padding: 0 15px;
                    align-self: center;
                    background-color: rgb(197, 18, 130);
                    border-style: none;
                    color: var(--accent);
                    box-shadow: -3px 3px 5px #222;
                    transition: all 0.1s ease-out;
                    cursor: pointer;
                    text-align: center;
                    border-radius: 10px;
                }
                .profile-btn:hover {
                    box-shadow: -1px 1px 5px #222;
                    background-color: rgb(153, 18, 130);
                }

                canvas {
                    display: none;
                }
                
                `}
            </style>
            <div className="profile-container">
                <div
                    className="profile-completion-stat"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        columnGap: "15px",
                    }}
                >
                    {/* <SingleChart completed={completed} key={completed} /> */}

                    <div className="single-chart" key={completed}>
                        <svg
                            viewBox="0 0 36 36"
                            className="circular-chart purple circle"
                        >
                            <path
                                className="circle-bg"
                                strokeDasharray="100, 100"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                                className="circle"
                                strokeDasharray={`${completed}, 100`}
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <text x="18" y="20.35" className="percentage">
                                {`${completed}%`}
                            </text>
                        </svg>
                    </div>

                    <h1>Update profile</h1>
                </div>
                <div className="divider"></div>
                <br />
                <div className="profile-form-container">
                    <div
                        className="lang-container"
                        style={{
                            width: "400px",
                            display: "flex",
                            flexDirection: "column",
                            rowGap: "20px",
                        }}
                    >
                        <LanguagesKnown setLangsKnown={setLangsKnown} />
                        <SocialMediaHandles
                            setSocialMediaHandles={setSocialMediaHandles}
                        />
                    </div>
                    <div
                        className="lang-container"
                        style={{
                            width: "400px",
                            display: "flex",
                            flexDirection: "column",
                            rowGap: "20px",
                        }}
                    >
                        <ProfilePhoto
                            setPhoto={setPhoto}
                            // isSet={
                            //     photo === undefined || typeof photo == "object"
                            //         ? false
                            //         : photo
                            // }
                            isSet={isSet}
                            user={user}
                        />
                    </div>
                </div>
                <input
                    type="button"
                    className="profile-btn"
                    value="Save"
                    onClick={saveUser}
                    style={{ marginTop: "20px", fontSize: "24px" }}
                />
            </div>
        </>
    );
};

function LanguagesKnown({ setLangsKnown }) {
    const [langList, setLangList] = useState([]);
    const [animate, setAnimate] = useState(true);

    const populateLangList = async () => {
        const email = JSON.parse(localStorage.getItem("user")).email;
        const response = await fetch("http://localhost:5001/get-user-info", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
            }),
        });
        const data = await response.json();
        if (data.status == "ok") {
            const userLangsKnown =
                data.langsKnown[0] == "" ? [] : data.langsKnown;
            setLangList(userLangsKnown);
            setLangsKnown(userLangsKnown);
        }
    };

    useEffect(() => {
        populateLangList();
    }, []);

    function addToList(e) {
        if (e.target.value.includes(" ") && e.target.value.trim() != "") {
            setAnimate(true);
            const lang = e.target.value.trim();
            setLangList([...langList, lang]);
            setLangsKnown([...langList, lang]);
            e.target.value = "";
        }
    }

    function addToListByEnter(e) {
        if (e.key === "Enter" && e.target.value.trim() != "") {
            setAnimate(true);
            const lang = e.target.value.trim();
            setLangList([...langList, lang]);
            setLangsKnown([...langList, lang]);
            e.target.value = "";
        }
    }

    let renderLangs = [];
    langList.map((lang, index) => {
        const isLastAdded =
            index == langList.length - 1 && animate ? true : false;
        renderLangs.push(
            <div
                style={{
                    position: "relative",
                    animation: isLastAdded ? "grow 0.2s ease-out" : "",
                    // animationDuration: isLastAdded ? "0.2s" : "",
                }}
                className="lang-box-container"
                key={index}
                onClick={() => {
                    setAnimate(false);
                    const newList = [...langList];
                    newList.splice(index, 1);
                    setLangList(newList);
                    setLangsKnown(newList);
                }}
                // id={index == langList.length - 1 ? "lastLang" : ""}
            >
                <div className="lang-box">#{lang}</div>
                <div className="cross-close">
                    <FontAwesomeIcon icon={faTimes} />
                </div>
            </div>
        );
    });

    return (
        <>
            <div
                className="profile-question-field-container"
                id="langsKnown"
                langsknown={langList}
            >
                <p className="profile-question">What languages do you know?</p>
                <div className="lang-display">{renderLangs}</div>
                <input
                    type="text"
                    className="profile-fields"
                    placeholder="Space to separate"
                    onChange={addToList}
                    onKeyDown={addToListByEnter}
                />
            </div>
        </>
    );
}

function SocialMediaHandles({ setSocialMediaHandles }) {
    const [handles, setHandles] = useState([]);
    const [animate, setAnimate] = useState(true);

    const populateHandles = async () => {
        const email = JSON.parse(localStorage.getItem("user")).email;
        const response = await fetch("http://localhost:5001/get-user-info", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
            }),
        });
        const data = await response.json();
        if (data.status == "ok") {
            setHandles(data.socialMediaHandles);
            setSocialMediaHandles(data.socialMediaHandles);
        }
    };

    useEffect(() => {
        populateHandles();
    }, []);

    function processLink(link) {
        const knownHandles = [
            ["instagram.com/", faInstagram],
            ["twitter.com/", faTwitter],
            ["github.com/", faGithub],
            ["linkedin.com/", faLinkedin],
            ["reddit.com/u", faReddit],
        ];

        let handle, found;

        knownHandles.map((knownHandle) => {
            if (link.includes(knownHandle[0])) {
                link = [...link].reverse().join("");
                let match = link.match(/^(.*?)\/.*$/);
                if (match != null) {
                    match = [...match[1]].reverse().join("");
                    found = true;
                    handle = [match, knownHandle[1]];
                }
            }
        });

        if (found) return handle;
        else {
            alert("Unrecognized social media.");
            return -1;
        }
    }

    function addToList(e) {
        if (e.target.value.includes(" ") && e.target.value.trim() != "") {
            setAnimate(true);
            const handle = processLink(e.target.value.trim());
            if (handle != -1) {
                setHandles([...handles, handle]);
                setSocialMediaHandles([...handles, handle]);
            }
            e.target.value = "";
        }
    }

    function addToListByEnter(e) {
        if (e.key === "Enter" && e.target.value.trim() != "") {
            setAnimate(true);
            const handle = processLink(e.target.value.trim());
            if (handle != -1) {
                setHandles([...handles, handle]);
                setSocialMediaHandles([...handles, handle]);
            }
            e.target.value = "";
        }
    }

    let renderHandles = [];
    handles.map((handle, index) => {
        const isLastAdded =
            handles.length - 1 == index && animate ? true : false;
        renderHandles.push(
            <div
                style={{
                    position: "relative",
                    animation: isLastAdded ? "grow 0.2s ease-out" : "",
                }}
                className="lang-box-container"
                key={index}
                onClick={() => {
                    setAnimate(false);
                    const newList = [...handles];
                    newList.splice(index, 1);
                    setHandles(newList);
                    setSocialMediaHandles(newList);
                }}
                // id={index == langList.length - 1 ? "lastLang" : ""}
            >
                <div className="lang-box">
                    <div
                        style={{
                            height: "30px",
                            alignSelf: "center",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <FontAwesomeIcon icon={handle[1]} />
                    </div>
                    {handle[0]}
                </div>
                <div className="cross-close">
                    <FontAwesomeIcon icon={faTimes} />
                </div>
            </div>
        );
    });

    return (
        <>
            <div
                className="profile-question-field-container"
                id="socialMediaHandles"
                // key={handles.length}
            >
                <p className="profile-question">
                    Add link to your social media profile
                </p>
                <div className="lang-display">{renderHandles}</div>
                <input
                    type="text"
                    className="profile-fields"
                    placeholder="Space to separate"
                    onChange={addToList}
                    onKeyDown={addToListByEnter}
                    id="fieldtofocus"
                />
            </div>
        </>
    );
}

function ProfilePhoto({ setPhoto, isSet, user }) {
    const [profilePhoto, setProfilePhoto] = useState(sampleProfileImage);

    async function populatePhoto() {
        const response = await fetch(
            "http://localhost:5001/get-profile-photo",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: localStorage.getItem("user"),
            }
        );
        const data = await response.json();
        if (data.status == "profile-photo-set") {
            setProfilePhoto(data.photo);
        }
    }

    useEffect(() => {
        if (isSet !== false) {
            setProfilePhoto(isSet);
        }
        populatePhoto();
    }, []);

    function updateProfilePhoto(e) {
        const fileSize = e.target.files[0].size;
        if (fileSize > 524288) {
            alert("Please upload image below 512KB");
        } else {
            setProfilePhoto(URL.createObjectURL(e.target.files[0]));
            setPhoto(e.target.files);
        }
    }

    return (
        <>
            <p className="profile-question" style={{ marginBottom: "0" }}>
                Change profile photo
            </p>
            <div className="profile-question-field-container">
                <div
                    className="lang-display"
                    style={{
                        minHeight: "200px",
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <div
                        style={{
                            borderRadius: "300px",
                            height: "200px",
                            backgroundColor: "hotpink",
                            overflow: "hidden",
                        }}
                    >
                        <img
                            src={profilePhoto}
                            name="profilePhoto"
                            height="200px"
                            width="200px"
                            id="profilePhoto"
                            style={{
                                objectFit: "cover",
                                objectPosition: "50% 50%",
                            }}
                        />
                    </div>
                </div>
                <div
                    style={{
                        backgroundColor: "var(--accent)",
                        color: "#222",
                        fontSize: "24px",
                        textAlign: "center",
                        letterSpacing: "3px",
                    }}
                >
                    {user.fname + " " + user.lname}
                </div>
            </div>
            <input
                name="profilePhoto"
                className="profile-btn"
                type="file"
                id="editProfilePhoto"
                style={{ display: "none" }}
                onChange={updateProfilePhoto}
                accept=".png, .jpg, .jpeg"
            />
            <label htmlFor="editProfilePhoto" className="profile-btn">
                Edit
            </label>
        </>
    );
}

export default Profile;
