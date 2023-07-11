import "../../blue-background.css";
import { useEffect } from "react";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";

const Home = (props) => {
    return (
        <>
            {props.children}
            <h1>This is Home</h1>
        </>
    );
};

export default Home;
