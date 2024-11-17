import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { useAuth } from "../contexts/AuthContext";

const apiBase =
  import.meta.env.VITE_ENV === "development"
    ? import.meta.env.VITE_DEV_API_BASE
    : import.meta.env.VITE_PROD_API_BASE;

export default function Login() {
  const { setUserInfo, setPatientInfo } = useUser();

  const { setToken, authenticated, setAuthenticated } = useAuth();

  const [loginInfo, setLoginInfo] = useState({
    email: "akamar5050@gmail.com",
    password: "Hmadmin@123",
  });

  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;

    setLoginInfo((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(apiBase + "/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: loginInfo.email,
          password: loginInfo.password,
        }),
      });

      if (!response.ok) {
        const errorMessage =
          response.status === 401
            ? "Invalid email or password"
            : "Internal Server error";
        throw new Error(errorMessage);
      }
      const data = await response.json();
      const { user, token, authenticated } = data;

      // Set user info
      setUserInfo(user);
      localStorage.setItem("userInfo", JSON.stringify(user));

      // Set authentication status
      setAuthenticated(authenticated);
      localStorage.setItem("authenticated", authenticated);

      // Set token
      setToken(token);
      localStorage.setItem("token", token);

      // Clear patient info
      setPatientInfo({});

      navigate("/home", { replace: true });
    } catch (error) {
      console.error("Error logging in:", error.message);
      setMessage(error.message);
      setShowMessage(true);
      setAuthenticated(false);
      setToken("");
    }
  };

  const togglePasswordView = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="img-container w-screen h-screen">
      <div className="flex justify-center items-center h-full w-full px-4 bg-teal-900 bg-opacity-90 overflow-hidden">
        <form
          onSubmit={handleSubmit}
          method="post"
          className="text-teal-900 form  max-w-md w-full text-center bg-white rounded-md shadow-md border border-teal-900 px-4 py-6"
        >
          <h2 className=" font-bold text-xl mb-4">WELCOME BACK ADMIN</h2>
          <div className="w-full flex justify-center text-red-400">
            {showMessage && <h3 className="text-xs">{message}</h3>}
          </div>
          <p className="text-sm my-2">
            Enter your login info below to gain access.
          </p>
          <input
            onChange={handleChange}
            id="login-email"
            name="email"
            type="email"
            value={loginInfo.email}
            autoComplete="on"
            placeholder="Enter your email"
            className="input mb-4"
            required
          />

          <div className="input-div flex flex-row items-center">
            <input
              onChange={handleChange}
              id="current-password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={loginInfo.password}
              autoComplete="off"
              placeholder="Enter your password"
              required
              className="w-full focus:outline-none"
            />
            <a
              href="#"
              onClick={togglePasswordView}
              className="p-0 text-teal-900 text-xs hover:text-teal-900"
            >
              {showPassword ? "hide" : "show"}
            </a>
          </div>

          <button
            className="w-full bg-teal-900 text-white px-4 py-2 rounded-md shadow-md hover:bg-teal-700 transition duration-300"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
