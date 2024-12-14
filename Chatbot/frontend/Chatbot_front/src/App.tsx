// Developed by Arnob Saha Ankon

import FileUpload from "./component/File"; 
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import "./App.css";
import BotIcon from "./assets/bot2.png";
import Logo from "./assets/chatbot.png";
import SendIcon from "./assets/message.png";
import "./component/chat.css";
// icons from https://www.flaticon.com/search?word=bot
import axios from "axios";
import Footer from "./component/Footer";

interface ChatLogEntry {
  role: string;
  content: string;
}

function App() {
  const [message, setMessage] = useState(""); //usr msg
  const [chatLog, setChatLog] = useState<ChatLogEntry[]>([]); // logs
  const welcome="Welcome to TechGuide. Ask anything you don't understand, and feel free to upload PDF files."

  useEffect(() => {
    
    setChatLog( [
      { role: "bot", content: welcome },
    ]);

    speak(welcome);
  }, []); 

      

  //  message submission
  const handleSendMessage = async (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    if (message.trim() === "") return; 

    try {
      setChatLog((chatLog) => [...chatLog, { role: "user", content: message }]);
      setMessage("");

      const response = await axios.post(
        "http://127.0.0.1:8000/ask-question/",
        JSON.stringify({ question: message }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data.answer);

      setChatLog((chatLog) => [
        ...chatLog,
        { role: "bot", content: response.data.answer },
      ]);

      speak(response.data.answer);

    } catch (e) {
      console.log("Error: ", e);
      setChatLog((chatLog) => [
        ...chatLog,
        { role: "bot", content: "Something wrong! Please ask again" },
      ]);
      setMessage("");
    }
  };

  const [fileUploaded, setFileUploaded] = useState(false); // Track if file is uploaded

  const handleFileUploadComplete = () => {
    setFileUploaded(true);
  };

  const speak=(text:string)=>{
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  }

  return (
    <div className="App">
       <div className="head">
          <img src={BotIcon} alt="Bot" className="head-icon" />
         <h1>
            Tech<span className="guide">Guide</span>
          </h1>
        </div>

      <div className="card mb-3">
       
        <div className="row g-0">
          {/* img left */}
          <div className="col-md-4">
            <img
              src={Logo}
              className="img-fluid rounded-start"
              alt="Chatbot Illustration"
            />
          </div>

          {/* chatbox*/}
          <div className="col-md-8">
            <div className="chatbox-container">
              <div className="chatbox">
                {/* chatlog */}
                <div className="card-body chat-log overflow-auto">
                  {chatLog.map((msg, index) => (
                    <div key={index} className="media mb-3">
                      {msg.role === "user" ? (
                        <div className="media-body text-end">
                          <div className="alert-user text-dark rounded-2 d-inline-block p-2 mb-2">
                            {msg.content}
                          </div>
                        </div>
                      ) : (
                        <div className="bot d-flex align-items-start mb-3">
                          <button className="bot-btn me-2">
                            <img src={BotIcon} alt="Bot" className="bot-icon" />
                          </button>
                          <div className="media-body text-start">
                            <div className="alert-bot text-dark rounded-2 d-inline-block p-2 mb-2">
                              {msg.content}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* post */}
                <div className="card-footer bg-white">
                  <form className="d-flex" onSubmit={handleSendMessage}>
                    <input
                      type="text"
                      className="form-control me-2"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your query..."
                    />
                    <button className="circular-btn" type="submit">
                      <img src={SendIcon} alt="Send" className="send-icon" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* file Upload  */}
      <FileUpload onUploadComplete={handleFileUploadComplete} />


      <Footer />
     </div>
  );
}

export default App;
