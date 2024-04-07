import react, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const apiBase = "http://localhost:5000";

export default function EmailShare() {
  const { id, username } = useParams();
  const navigate = useNavigate();

  const { token } = useAuth();

  const [recipientData, setrecipientData] = useState({
    name: "",
    email: " ",
  });

  const [isChecked, setIsChecked] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setrecipientData((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
  };

  const handleCheckboxChange = () => {
    setIsChecked((prevChecked) => !prevChecked);
  };

  const headers = {
    Authorization: `Bearer ${token}`,
    "content-type": "application/json",
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      recipientmail: recipientData.email,
      recipientname: recipientData.name,
      checked: !isChecked,
    };

    try {
      const response = await fetch(apiBase + `/share-data/${id}`, {
        method: "POST",
        credentials: "include",
        headers,
        body: JSON.stringify(data),
      });
      if (response.ok) {
        navigate("/email-sent/successful");
      } else {
        navigate("/email-sent/failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex text-green-900 flex-col justify-center items-center h-screen w-screen bg-teal-900">
      <form
        onSubmit={handleSubmit}
        method="post"
        className="form text-center max-w-2/4 w-96 h-auto rounded-md shadow-md bg-white border border-teal-900 px-10 py-6"
      >
        <div>
          <h2 className="font-bold text-md mb-4 whitespace-nowrap">
            Share {username}'s Result To Email
          </h2>
          <p className="text-sm md:text-xs lg:text-sm my-2">
            Enter the recipient's info below:
          </p>
        </div>
        <input
          onChange={handleChange}
          name="name"
          type="text"
          value={recipientData.name}
          autoComplete="on"
          placeholder="Enter recipient's name:"
          className="input mb-3 w-full px-2.5 focus:outline-none"
          required
        />
        <input
          onChange={handleChange}
          name="email"
          type="email"
          value={recipientData.email}
          placeholder="Enter recipient's email:"
          required
          className="input  w-full px-2.5 focus:outline-none"
        />
        <label className="flex items-center cursor-pointer my-2 space-x-2">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
            className="rounded focus:ring-1 focus:ring-offset-2 focus:ring-teal-900 focus:outline-none w-4 h-4 border-gray-300"
          />
          <span className="text-sm font-medium text-gray-700">
            Send to patient
          </span>
        </label>

        <button
          className="w-full bg-teal-900 text-white px-4 py-2 rounded-md shadow-md hover:bg-teal-700 transition duration-300"
          type="submit"
        >
          Send
        </button>
      </form>
    </div>
  );
}
