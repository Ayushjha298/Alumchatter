import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerRoute } from "../utils/APIRoutes";

export default function Register() {
  const navigate = useNavigate();
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const checkLocalStorage = () => {
      if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
        navigate("/");
      }
    };

    checkLocalStorage(); 

  }, [navigate]);
  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleValidation = () => {
    const { password, confirmPassword, username, email } = values;
    if (password !== confirmPassword) {
      toast.error(
        "Password and confirm password should be same.",
        toastOptions
      );
      return false;
    } else if (username.length < 3) {
      toast.error(
        "Username should be greater than 3 characters.",
        toastOptions
      );
      return false;
    } else if (password.length < 8) {
      toast.error(
        "Password should be equal or greater than 8 characters.",
        toastOptions
      );
      return false;
    } else if (email === "") {
      toast.error("Email is required.", toastOptions);
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { email, username, password } = values;
      const { data } = await axios.post(registerRoute, {
        username,
        email,
        password,
      });

      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(data.user)
        );
        navigate("/");
      }
    }
  };

  return (
    <>
      <FormContainer>
        <div className="content-wrapper">
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h1>BlinkChat</h1>
          </div>
          <form action="" onSubmit={(event) => handleSubmit(event)}>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={(e) => handleChange(e)}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={(e) => handleChange(e)}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={(e) => handleChange(e)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              onChange={(e) => handleChange(e)}
            />
            <button type="submit">Create User</button>
            <span>
              Already have an account? <Link to="/login">Login.</Link>
            </span>
          </form>
        </div>
      </FormContainer>
      <ToastContainer />
    </>
  );
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e8f5e9;

  .content-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #ffffff;
    border-radius: 10px;
    padding: 3rem 4rem;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  }

  .brand {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 2rem;
    img {
      height: 4rem;
    }
    h1 {
      color: #4caf50;
      margin-top: 1rem;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
  }

  input {
    background-color: #f1f8e9;
    padding: 1rem;
    border: 1px solid #c8e6c9;
    border-radius: 5px;
    color: #388e3c;
    font-size: 1rem;
    &:focus {
      border-color: #4caf50;
      outline: none;
    }
  }

  button {
    background-color: #4caf50;
    color: white;
    padding: 1rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 5px;
    font-size: 1rem;
    text-transform: uppercase;
    transition: background-color 0.3s ease;
    &:hover {
      background-color: #388e3c;
    }
  }

  span {
    color: #4caf50;
    text-align: center;
    a {
      color: #388e3c;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;
