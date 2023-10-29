import React from "react";
import { auth, provider } from "../config/firebase";
import { signInWithPopup } from "firebase/auth";
// import "./Auth.css";

import Cookies from "universal-cookie";
const cookies = new Cookies();

export const Auth = () => {
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      cookies.set("auth-token", result.user?.refreshToken);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container auth">
      <h1>Login page</h1>
      <p> Sign in with Google to continue </p>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </div>
  );
};
