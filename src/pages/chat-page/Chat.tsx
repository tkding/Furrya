import React, { useEffect, useRef } from "react";

import { auth, db } from "../../config/firebase";
// hook form
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

import { ChatProps as ChatPropsI } from "./chat-main";

import "./ChatMain.css";
interface FormData {
  message: string;
}

interface ChatProps {
  ChatProps: ChatPropsI;
}

interface Message {
  id: string;
  message: string;
  creatAt: string;
  room: number | null;
  userId: string;
  username: string;
}

export const Chat = ({ ChatProps }: ChatProps) => {
  const [user] = useAuthState(auth);
  const [messages, setMessages] = React.useState<Message[]>([]);

  // new TODO
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const schema = yup.object().shape({
    message: yup
      .string()
      .required("message is required")
      .min(4, "message is too short")
      .max(200, "message is too long"),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const messagesRef = collection(db, "messages");

  // onSnapShot() is used to listen for real-time updates
  const onSubmit = async (data: FormData) => {
    try {
      // send message to firestore
      await addDoc(messagesRef, {
        ...data,
        creatAt: serverTimestamp(),
        room: ChatProps.room,
        userId: user?.uid,
        username: user?.displayName,
      });
      // set message input to empty
      reset();

      const container = document.getElementsByClassName("chat-messages")[0];
      container && (container.scrollTop = container.scrollHeight);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  useEffect(() => {
    const queryMessages = query(
      messagesRef,
      where("room", "==", ChatProps.room),
      orderBy("creatAt", "desc"),
      limit(100)
    );
    const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
      let messages: Message[] = [];
      snapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() } as Message);
      });
      setMessages(messages);
      return () => unsubscribe;
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-app">
      <h1 className="chat-header">Chat</h1>
      <div className="container">
        <div className="row">
          <div className="col-lg-8 col-md-12">
            <div className="chat-box">
              <div className="chat-messages">
                {messages
                  .slice()
                  .reverse()
                  .map((message) => (
                    <div
                      key={message.id}
                      className={`message d-flex ${
                        message.userId === user?.uid
                          ? "justify-content-end"
                          : "justify-content-start"
                      }`}
                    >
                      <div
                        className={`message-info ${
                          message.userId === user?.uid
                            ? "message-user"
                            : "message-other"
                        }`}
                      >
                        {message.userId !== user?.uid && (
                          <span className="user">{message.username}: </span>
                        )}
                        <span className="message-text">{message.message}</span>
                      </div>
                    </div>
                  ))}
                <div ref={messagesEndRef} />
              </div>
              <form
                className="new-message-form"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control new-message-input"
                    placeholder="Message"
                    {...register("message")}
                  />
                  <input
                    className="btn-outline-secondary form-submit-btn chat-btn"
                    type="submit"
                  />
                </div>
                <p style={{ color: "red" }}>{errors.message?.message}</p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

{
  /* <div className="chat-messages">
                {messages
                  .slice()
                  .reverse()
                  .map((message) => (
                    <div key={message.id} className="message">
                      <span className="user">{message.username}: </span>
                      <span className="message-text">{message.message}</span>
                    </div>
                  ))}
                <div ref={messagesEndRef} />
              </div> */
}
