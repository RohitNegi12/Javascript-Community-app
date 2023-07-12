import React, { Component, useEffect, useState } from "react";
import Navbar from "./components/navbar/navbar";
import Home from "./components/pages/home";
import About from "./components/pages/about";
import ContactUs from "./components/pages/contactus";
import SignUp from "./components/pages/signup";
import Login from "./components/pages/login";
import Profile from "./components/pages/profile";
import Forum from "./components/pages/forum";
import { Route, Routes } from "react-router-dom";
import jwtDecode from "jwt-decode";

class App extends Component {
    state = {
        mainIndex: 0,
        isMenuActive: false,
        isAuth: false,
    };

    componentDidMount() {
        const token = localStorage.getItem("token");
        if (token) {
            if (jwtDecode(token)) this.setState({ isAuth: true });
        }
    }

    componendDidUpdate() {
        console.log("Component updated");
    }

    render() {
        const { mainIndex, isMenuActive } = this.state;
        const handleMain = (Index) => {
            this.setState({
                mainIndex: Index,
            });
        };

        const handleMenu = () => {
            this.setState({ isMenuActive: !this.state.isMenuActive });
        };

        const nav = (
            <VariableNav
                handleMain={handleMain}
                active={mainIndex}
                isMenuActive={isMenuActive}
                handleMenu={handleMenu}
            />
        );

        return (
            <React.Fragment>
                <Routes>
                    <Route path="/" element={<Home>{nav}</Home>}></Route>
                    <Route
                        path="/signup"
                        element={<SignUp>{nav}</SignUp>}
                    ></Route>
                    <Route path="/login" element={<Login>{nav}</Login>}></Route>
                    <Route
                        path="/profile"
                        element={<Profile>{nav}</Profile>}
                    ></Route>
                    <Route path="/forum" element={<Forum>{nav}</Forum>}></Route>
                </Routes>
            </React.Fragment>
        );
    }
}

function VariableNav({ ...props }) {
    const [authStat, setAuthStat] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token && jwtDecode(token)) {
            setAuthStat(true);
        }
    });

    return (
        <Navbar
            handleMain={props.handleMain}
            active={props.mainIndex}
            isMenuActive={props.isMenuActive}
            handleMenu={props.handleMenu}
            isAuth={authStat}
        />
    );
}

export default App;
