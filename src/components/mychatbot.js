// MyChatBot.js
import React from "react";
import { render } from "react-dom";
import ChatBot from "react-chatbotify";

const MyChatBot = () => {
  const [form, setForm] = React.useState({});
  const formStyle = {
    marginTop: 10,
    marginLeft: 20,
    border: "1px solid #491d8d",
    padding: 10,
    borderRadius: 5,
    maxWidth: 300
  };
  const Q1Options = ["Yes, I want to see if I am eligible for compensation", "Existing Client", "Something Else"];

  const flow = {
    start: {
      message: "Hi, I’m a bot here to chat with you and get your questions and answers in front of a member of our 9/11 compensation fund team ASAP. What is your name?",
      function: (params) => setForm({ ...form, name: params.userInput }),
      path: "ask_consultation"
    },
    ask_consultation: {
      message: (params) => `Nice to meet you ${params.userInput}, are you looking for a 9/11 compensation consultation?`,
      function: (params) => setForm({ ...form, initial_question: params.userInput }),
      options: Q1Options,
      path: (params) => {
        if (params.userInput === "Yes, I want to see if I am eligible for compensation") {
          return "eligible";
        } else if (params.userInput === "Existing Client") {
          return "existing";
        } else {
          return "other";
        }
      }
    },
	eligible: {
		message: "Great, I'll just ask you a few questions to help us get started.",
		transition: { duration: 1000 },
		path: "ask_contact_type" 
	  },
	  ask_contact_type: { 
		message: "Are you contacting us today about yourself, or someone else?",
		function: (params) => setForm({ ...form, contact_type: params.userInput }),
		options: ["Myself", "My Parent", "My Child", "Another Relative", "Other"],
		chatDisabled: false,
		path: (params) => {
		  if (params.userInput === "Myself") {
			return "myself";
		  } else {
			return "other_relationship";
		  }
		}
	  },
    myself: {
      message: "Between September 11, 2001 and May 30, 2002 were you present at any of the following areas?",
      checkboxes: { items: ["Lower Manhattan Exposure zone Below Canal Street", "Worked with debris at the Fresh Kills landfill", "Pentagon in Washington, D.C.", "Shanksville, PA crash site", "None of the above"], min: 1, max: 5 }, 
      chatDisabled: true,
      function: (params) => setForm({ ...form, exposure_zone: params.userInput }), 
      path: (params) => {
        if (params.userInput === "None of the above") {
          return "noexposure";
        } else {
          return "exposurezone";
        }
      }
    },
    exposurezone: { 
      message: "Do you have any medical condition such as cancer, respiratory illness, or disorders of the musculoskeletal system?",
      checkboxes: { items: ["Cancer", "Respiratory illness", "Carpel tunnel syndrome or other disorders of the Musculoskeletal System",  "None of the above"], min: 1, max: 4 },
      chatDisabled: true,
      function: (params) => setForm({ ...form, medical_conditions: params.userInput }),
      path: (params) => {
        if (params.userInput === "None of the above") {
          return "nocondition";
        } else {
          return "condition";
        }
      }
    },
    end_success: { 
      message: "We've received your information and will be in contact with you as soon as possible using the contact information you provided. Thank you for contacting Kreindler & Kreindler LLP."
    },
    end_unqualified: { 
      message: "Thank you for contacting Kreindler & Kreindler LLP. If you'd like to get in touch regarding another matter, you can start a new chat."
    }
  };

  return (
    <ChatBot options={{ theme: { embedded: true }, chatHistory: { storageKey: "example_advanced_form" } }} flow={flow} />
  );
};

export default MyChatBot;

//TO DO: 
// Finish other_relationship tree + finalization of myself tree 
//Create Exisiting client (existing) + Something Else (other)
//Make "none of the above" exclusive -> cannot be selected along with any other option
//integrate dropdown for disease list