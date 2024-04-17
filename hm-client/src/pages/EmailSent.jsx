import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

export default function EmailSent() {
  const { status } = useParams();

  const [message, setMessage] = useState({
    header: " ",
    body: " ",
  });

  useEffect(() => {
    if (status === "successful") {
      setMessage({
        header: "Email sent successfully",
        body: "Email sent successfully, ask the recipient to check their inbox",
      });
    } else {
      setMessage({
        header: "Something Went Wrong, Email not Sent!",
        body: "Email wasn't sent because of an error, please try again",
      });
    }
  }, [status]);

  return (
    <div className="flex text-white  flex-col justify-center items-center h-screen w-screen bg-teal-900">
      <div className="w-1/2 h-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
        <h2 className="font-extrabold text-4xl mb-4 whitespace-nowrap mx-auto">
          {message.header}
        </h2>
        <p>{message.body}</p>
        <div className="w-full flex justify-center">
          <button className=" flex justify-end bg-white text-teal-900 px-4 py-1 rounded-md shadow-md transition duration-300">
            <Link className="text-teal-900 " to="/home">
              Home
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
}
