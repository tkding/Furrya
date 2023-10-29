import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ChatMain } from "./pages/chat-page/chat-main";
import { NavigationBar } from "./components/Navbar";
import { CreatePost } from "./pages/create-post/create-post";
import { PostMain } from "./pages/post-page/post-main";
import { useState, createContext, useEffect } from "react";
import { UserPostMain } from "./pages/user-post-page/user-post-main";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "./config/firebase";
import {
  FieldValue,
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

import { Login } from "./pages/login-page/login";

export interface Post {
  title: string;
  description: string;
  username: string;
  userId: string;
  id: string;
  createAt: FieldValue;
}

export interface Likes {
  userId: string;
  postId: string;
  id: String;
}

interface AppContextProps {
  room: number | null;
  setRoom: React.Dispatch<React.SetStateAction<number | null>>;
  postsList: Post[] | null;
  setPostsList: React.Dispatch<React.SetStateAction<Post[] | null>>;
  likes: Likes[] | null;
  setLikes: React.Dispatch<React.SetStateAction<Likes[] | null>>;
}

export const AppContext = createContext<AppContextProps>({
  room: null,
  setRoom: () => {},
  postsList: null,
  setPostsList: () => {},
  likes: null,
  setLikes: () => {},
});

function App() {
  const [room, setRoom] = useState<number | null>(null);
  const [postsList, setPostsList] = useState<Post[] | null>(null);
  const [likes, setLikes] = useState<Likes[] | null>(null);
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <head>
        <link
          rel="stylesheet"
          href="https://use.fontawesome.com/releases/v5.8.2/css/all.css"
        />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>

      <body>
        <AppContext.Provider
          value={{ room, setRoom, postsList, setPostsList, likes, setLikes }}
        >
          <Router>
            <NavigationBar />
            <Routes>
              <Route path="/" element={<PostMain />} />
              <Route
                path={`/user/${user?.displayName}`}
                element={<UserPostMain />}
              />
              <Route path="/createpost" element={<CreatePost />} />
              <Route path="/chat" element={<ChatMain />} />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<h1>404 Not Found</h1>} />
            </Routes>
          </Router>
        </AppContext.Provider>
      </body>
    </div>
  );
}

export default App;
