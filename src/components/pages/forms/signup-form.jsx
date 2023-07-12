import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignupForm = () => {
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPwd, setConfirmPwd] = useState("");

    const validEmailRegex = new RegExp("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        //Checking for empty input fields
        if (
            fname.trim() == "" ||
            lname.trim() == "" ||
            email.trim() == "" ||
            password == "" ||
            confirmPwd == ""
        )
            alert("Please fill all fields.");
        else if (password != confirmPwd) alert("Passwords do not match");
        //RegEx validation of email
        else if (validEmailRegex.test(email) == false)
            alert("Please enter a valid email address.");
        else {
            const response = await fetch("http://localhost:5001/signup-user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fname: fname,
                    lname: lname,
                    email: email,
                    password: password,
                }),
            });
            const data = await response.json();
            if (data.status == "ok") {
                navigate("/login");
            } else if (data.status == "failed") {
                alert(data.error);
            } else {
                alert("Something went wrong. Please try again later.");
            }
        }
    };

    return (
        <div className="signup-form">
            <form action="#" onSubmit={handleSubmit}>
                <h1>Sign Up</h1>
                <input
                    type="text"
                    name="fname"
                    placeholder="First Name"
                    id="field"
                    onChange={(e) => {
                        setFname(e.target.value);
                    }}
                />
                <input
                    type="text"
                    name="lname"
                    placeholder="Last Name"
                    id="field"
                    onChange={(e) => {
                        setLname(e.target.value);
                    }}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    id="field"
                    onChange={(e) => {
                        setEmail(e.target.value);
                    }}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    id="field"
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                />
                <input
                    type="password"
                    name="confirmpwd"
                    placeholder="Confirm Password"
                    id="field"
                    onChange={(e) => {
                        setConfirmPwd(e.target.value);
                    }}
                />
                <input type="submit" value="Submit" />
            </form>
            <p>
                Already a member? <Link to="/login">Login</Link> to continue
            </p>
        </div>
    );
};

export default SignupForm;
