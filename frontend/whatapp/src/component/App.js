import React, { useEffect, useState } from "react";
import "./App.css";
import Chat from "./Chat";
import Sidebar from "./Sidebar";
import Pusher from "pusher-js";
import axios from "./axios";

const App = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    axios.get("/messages/sync").then((respose) => {
      setMessages(respose.data);
    });
  }, []);

  useEffect(() => {
    const pusher = new Pusher("1c5e35971cd268c5d2ec", {
      cluster: "ap2",
    });
    const channel = pusher.subscribe("message");
    channel.bind("inserted", function (data) {
      setMessages([...messages, data]);
    });
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [messages]);

  return (
    <div className="app">
      <div className="app_body">
        <Sidebar />
        <Chat messages={messages} />
      </div>
    </div>
  );
};

export default App;
