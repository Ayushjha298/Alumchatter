import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginRoute } from "../utils/APIRoutes";

export default function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ username: "", password: "" });
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

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

  const validateForm = () => {
    const { username, password } = values;
    if (username === "" || password === "") {
      toast.error("Username and Password are required.", toastOptions);
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      const { username, password } = values;
      const { data } = await axios.post(loginRoute, {
        username,
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
              min="3"
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={(e) => handleChange(e)}
            />
            <button type="submit">Log In</button>
            <span>
              Don't have an account? <Link to="/register">Create One.</Link>
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
