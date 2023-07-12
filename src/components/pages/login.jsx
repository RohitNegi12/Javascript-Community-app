import "./login.css";
import loginLogo from "./images/login-logo.svg";
import LoginForm from "./forms/login-form";

function Login({ children }) {
    return (
        <>
            {children}
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
                            src={loginLogo}
                            alt="Rocket Launching"
                            name="login-logo"
                        />
                        <div
                            className="caption"
                            style={{ color: "var(--accent)" }}
                        >
                            Continue <p>chasing. </p>
                            <p>your. </p>
                            <p>dreams.</p>
                        </div>
                    </div>
                </div>
                <div className="right-half">
                    {/* LoginForm */}
                    <LoginForm></LoginForm>;
                </div>
            </div>
        </>
    );
}

export default Login;
