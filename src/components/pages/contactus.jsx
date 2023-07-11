import React, { Component } from "react";

class ContactUs extends Component {
    state = {};
    render() {
        return (
            <>
                {this.props.children}
                <h1>This is Contact Us</h1>;
            </>
        );
    }
}

export default ContactUs;
