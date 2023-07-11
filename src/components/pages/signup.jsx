import React, { Component } from "react";
import "./signup.css";
import signupLogo from "./images/signup-logo.svg";
import SignupForm from "./forms/signup-form";

class SignUp extends Component {
    state = {};
    render() {
        return (
            <>
                {this.props.children}
                <style>
                    {`
                        body {
                            overflow-y: hidden;
                        }
                    `}
                </style>
                <div className="container">
                    <div className="left-half">
                        <div>
                            <img
                                src={signupLogo}
                                alt="Rocket Launching"
                                name="signup-logo"
                            />
                            <div
                                className="caption"
                                style={{ color: "var(--accent)" }}
                            >
                                Rocket your <p>experience. </p>
                                <p>portfolio. </p>
                                <p>career.</p>
                            </div>
                        </div>
                    </div>
                    <div className="right-half">
                        <SignupForm></SignupForm>
                    </div>
                </div>
            </>
        );
    }
}

export default SignUp;
