import { useState, useEffect } from "react";
import jwtDecode from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";

function LoginForm() {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const user = jwtDecode(token);
            if (user) navigate("/profile");
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.email.trim() == "" || form.password == "")
            alert("Please fill all fields");
        else {
            fetch("http://localhost:5001/login-user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: form.email,
                    password: form.password,
                }),
            })
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    if (data.user) {
                        localStorage.setItem("token", data.user);
                        localStorage.setItem(
                            "user",
                            JSON.stringify(data.userInfo)
                        );
                        navigate("/profile");
                    } else if (data.status == "failed") {
                        alert(data.error);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    alert("Could not connect to server");
                });
        }
    };

    return (
        <>
            <div className="login-form">
                <form action="#" onSubmit={handleSubmit}>
                    <h1>Login</h1>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        id="field"
                        onChange={(e) =>
                            setForm({
                                email: e.target.value,
                                password: form.password,
                            })
                        }
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        id="field"
                        onChange={(e) =>
                            setForm({
                                email: form.email,
                                password: e.target.value,
                            })
                        }
                    />
                    <input type="submit" value="Submit" />
                </form>
                <p>
                    New here? <Link to="/signup">Sign up</Link> to become a
                    member.
                </p>
            </div>
        </>
    );
}

export default LoginForm;
