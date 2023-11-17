import { auth, db } from "../../config/firebase";
import { useState, useEffect, useContext } from "react";
import { UserPost } from "./user-post";
// import { getDocs } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { Post as IPost, Likes as ILikes, AppContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

import "./user-post.css";
import "../post-page/post-main.css";

export const UserPostMain = () => {
  const [user] = useAuthState(auth);

  const navigate = useNavigate();

  const userPostsListContext = useContext(AppContext).postsList?.filter(
    (post) => post.userId === user?.uid
  ) as IPost[];
  const [userPostsList, setUserPostsList] =
    useState<IPost[]>(userPostsListContext);

  useEffect(() => {
    // console.log("called useEffect in UserPostMain");
    if (!user) {
      alert("You must be logged in to view this page.");
      navigate("/login");
    }
  }, []);

  return (
    <div className="post-container">
      <h1 className="post-title">{user?.displayName}'s Posts</h1>
      {!userPostsList?.length && (
        <>
          <p>No posts yet.</p>
        </>
      )}
      {userPostsList?.map((post) => (
        <div className="container">
          <div className="row">
            <div className="col"></div>
            <div className="col-lg-8 col-md-12">
              <UserPost
                key={post.id}
                post={post}
                setUserPostsList={setUserPostsList}
              />
            </div>
            <div className="col"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
