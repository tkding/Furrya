import React from "react";
import "./login.css";
import { auth, provider } from "../../config/firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, provider);
    console.log(result);
    navigate("/");
  };

  return (
    <div className="container-login d-flex justify-content-center align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card mb-3 shadow-5-strong  login-card">
              <div className="card-header login-header">
                <h2>Login Page</h2>
              </div>
              <div className="card-body d-flex flex-column justify-content-center align-items-center ">
                <p className="card-text mb-4">
                  Sign in with Google to continue
                </p>
                <button
                  type="button"
                  className="btn btn-login"
                  onClick={signInWithGoogle}
                >
                  <i className="fab fa-google"></i> Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
