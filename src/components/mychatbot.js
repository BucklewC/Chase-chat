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
      message: "Are you contacting us today about yourself, or someone else?",
      options: ["Yes", "No"],
      chatDisabled: true,
      function: (params) => setForm({ ...form, pet_ownership: params.userInput }),
      path: "ask_choice"
    },
    ask_choice: {
      message: "Select at least 2 and at most 4 pets that you are comfortable to work with:",
      checkboxes: { items: ["Dog", "Cat", "Rabbit", "Hamster", "Bird"], min: 2, max: 4 },
      chatDisabled: true,
      function: (params) => setForm({ ...form, pet_choices: params.userInput }),
      path: "ask_work_days"
    },
    ask_work_days: {
      message: "How many days can you work per week?",
      function: (params) => setForm({ ...form, num_work_days: params.userInput }),
      path: async (params) => {
        if (isNaN(Number(params.userInput))) {
          await params.injectMessage("Number of work day(s) need to be a number!");
          return "ask_work_days";
        }
        return "end_success";
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