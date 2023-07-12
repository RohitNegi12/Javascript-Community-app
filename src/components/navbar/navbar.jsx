import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import "./navbar.css";
import { Link, useMatch, useNavigate, useResolvedPath } from "react-router-dom";

class Navbar extends Component {
    state = {};

    render() {
        const defaultNav = (
            <nav>
                <p className="logo">Questo</p>
                <div
                    className="menu-icon"
                    onClick={this.props.handleMenu}
                    style={{ cursor: "pointer" }}
                >
                    <i
                        className={
                            this.props.isMenuActive
                                ? "fa-solid fa-xmark"
                                : "fas fa-bars"
                        }
                    ></i>
                </div>
                <ul className={this.props.isMenuActive ? "menu-active" : ""}>
                    <CustomLink to="/">Home</CustomLink>
                    {/* <CustomLink to="/about">About</CustomLink>
                    <CustomLink to="/contactus">Contact Us</CustomLink> */}
                    <CustomLink to="/login" className="btn">
                        Login
                    </CustomLink>
                </ul>
            </nav>
        );

        const userNav = (
            <nav>
                <p className="logo">
                    <Link to="/">Questo</Link>
                </p>
                <ul>
                    <CustomLink to="/profile">Profile</CustomLink>
                    <CustomLink to="/forum">Forum</CustomLink>
                    <CustomLink
                        to="/login"
                        onClick={() => {
                            localStorage.removeItem("token");
                            localStorage.removeItem("user");
                            useNavigate("/login");
                        }}
                    >
                        <FontAwesomeIcon
                            icon={faArrowRightFromBracket}
                            className="tooltip"
                        ></FontAwesomeIcon>
                    </CustomLink>
                </ul>
            </nav>
        );

        return this.props.isAuth ? userNav : defaultNav;
    }
}

function CustomLink({ to, children, className, ...props }) {
    // const { className } = props;
    const resolvedPath = useResolvedPath(to);
    const isActive = useMatch({ path: resolvedPath.pathname, end: true });
    return (
        <Link to={to} {...props}>
            <li
                className={
                    isActive
                        ? className + " nav-links active-link"
                        : className + " nav-links"
                }
            >
                {children}
            </li>
        </Link>
    );
}

export default Navbar;
