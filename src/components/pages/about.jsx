import React, { Component } from "react";

class About extends Component {
    state = {};
    render() {
        return (
            <>
                {this.props.children}
                <h1>This is About</h1>;
            </>
        );
    }
}

export default About;
