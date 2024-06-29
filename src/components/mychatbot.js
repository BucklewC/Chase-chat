// MyChatBot.js
import React from 'react';
import ChatBot from 'react-chatbotify';
import Dropdown from './Dropdown';

export const MyChatBot = () => {
	const [form, setForm] = React.useState({});

	const handleDropdownSelect = (value) => {
		setForm({ ...form, diagnosis_year: value });
	};

	const yearOptions = generateYearOptions(2024, 2001);

	const flow = {
		start: {
			message:
				'Hi, I’m a bot here to chat with you and get your questions and answers in front of a member of our 9/11 compensation fund team ASAP. What is your name?',
			function: (params) => setForm({ ...form, name: params.userInput }),
			path: 'ask_consultation',
		},
		ask_consultation: {
			message: (params) =>
				`Nice to meet you ${params.userInput}, are you looking for a 9/11 compensation consultation?`,
			function: (params) =>
				setForm({ ...form, initial_question: params.userInput }),
			options: [
				'Yes, I want to see if I am eligible for compensation',
				'Existing Client',
				'Something Else',
			],
			path: (params) => {
				switch (params.userInput) {
					case 'Yes, I want to see if I am eligible for compensation':
						return 'eligible';
					case 'Existing Client':
						return 'existing';
					default:
						return 'other';
				}
			},
		},
		existing: {
			message:
				"Great, we're excited to continue working with you. Who have you been working with at Kreindler & Kreindler?",
			transition: { duration: 1000 },
			path: 'ask_contact',
		},
		ask_contact: {
			message:
				'Thanks for letting us know. Please provide the following information: Full Name, Phone Number & Email Address. We will use this information to contact you shortly.',
			path: 'existing_end',
		},
		existing_end: {
			message:
				'Thank you! We will be in contact with you as soon as possible using the contact information you provided. Thank you for contacting Kreindler & Kreindler LLP.',
		},
		eligible: {
			message:
				"Great, I'll just ask you a few questions to help us get started.",
			transition: { duration: 1000 },
			path: 'ask_contact_type',
		},
		ask_contact_type: {
			message: 'Are you contacting us today about yourself, or someone else?',
			function: (params) =>
				setForm({ ...form, contact_type: params.userInput }),
			options: ['Myself', 'My Parent', 'My Child', 'Another Relative', 'Other'],
			chatDisabled: false,
			path: (params) => {
				switch (params.userInput) {
					case 'Myself':
						return 'myself';
					default:
						return 'someoneelse';
				}
			},
		},
		myself: {
			message:
				'Between September 11, 2001 and May 30, 2002 were you present at any of the following areas?',
			checkboxes: {
				items: [
					'Lower Manhattan Exposure zone Below Canal Street',
					'Worked with debris at the Fresh Kills landfill',
					'Pentagon in Washington, D.C.',
					'Shanksville, PA crash site',
					'None of the above',
				],
				min: 1,
				max: 5,
			},
			chatDisabled: true,
			function: (params) =>
				setForm({ ...form, exposure_zone: params.userInput }),
			path: (params) => {
				if (params.userInput.includes('None of the above')) {
					return 'noexposure';
				} else {
					return 'exposurezone';
				}
			},
		},
		someoneelse: {
			message:
				'Thank you - just a few questions to help us connect you with the right person',
			transition: { duration: 1000 },
			path: 'someoneelse_questions',
		},
		someoneelse_questions: {
			message:
				'Between September 11, 2001 and May 30, 2002 was this person present at any of the following areas?',
			checkboxes: {
				items: [
					'Lower Manhattan Exposure zone Below Canal Street',
					'Worked with debris at the Fresh Kills landfill',
					'Pentagon in Washington, D.C.',
					'Shanksville, PA crash site',
					'None of the above',
				],
				min: 1,
				max: 5,
			},
			chatDisabled: true,
			function: (params) =>
				setForm({ ...form, exposure_zone2: params.userInput }),
			path: (params) => {
				if (params.userInput.includes('None of the above')) {
					return 'noexposure2';
				} else {
					return 'exposurezone2';
				}
			},
		},
		noexposure2: {
			message:
				'Without a diagnosis of one of the covered conditions as dictated by the World Trade Center Health program, an individual may not be eligible for compensation from the September 11th Victim Compensation Fund. Would you like to end the session now or continue?',
			function: (params) => setForm({ ...form, end_chat: params.userInput }),
			options: ['Yes, end chat', 'No, continue'],
			chatDisabled: true,
			path: (params) => {
				switch (params.userInput) {
					case 'Yes, end chat':
						return 'end_unqualified';
					default:
						return 'unqualified_opentext1';
				}
			},
		},
		exposurezone: {
			message:
				'Do you have any medical condition such as cancer, respiratory illness, or disorders of the musculoskeletal system?',
			checkboxes: {
				items: [
					'Cancer',
					'Respiratory illness',
					'Carpal tunnel syndrome or other disorders of the Musculoskeletal System',
					'None of the above',
				],
				min: 1,
				max: 4,
			},
			chatDisabled: true,
			function: (params) =>
				setForm({ ...form, medical_conditions: params.userInput }),
			path: (params) => {
				if (params.userInput.includes('None of the above')) {
					return 'noexposure';
				} else if (params.userInput.includes('Cancer')) {
					return 'cancer';
				} else if (params.userInput.includes('Respiratory illness')) {
					return 'respiratory';
				} else {
					return 'hascondition';
				}
			},
		},
		hascondition: {
			message: 'Just one more question. What year were you diagnosed?',
			function: (params) =>
				setForm({ ...form, diagnosis_year: params.userInput }),
			component: () => (
				<Dropdown options={yearOptions} onSelect={handleDropdownSelect} />
			),
			chatDisabled: true,
			path: 'qualified',
		},
		noexposure: {
			message:
				'Without a diagnosis of one of the covered conditions as dictated by the World Trade Center Health program, an individual may not be eligible for compensation from the September 11th Victim Compensation Fund. Would you like to end the chat session now or continue?',
			function: (params) => setForm({ ...form, end_chat: params.userInput }),
			options: ['Yes, end chat', 'No, continue'],
			chatDisabled: true,
			path: (params) => {
				switch (params.userInput) {
					case 'Yes, end chat':
						return 'end_unqualified';
					default:
						return 'unqualified_opentext';
				}
			},
		},
		unqualified_opentext: {
			message:
				'Can you give me some details about your situation that I can pass along to our legal team?',
			function: (params) =>
				setForm({ ...form, unqualified_answer: params.userInput }),
			path: 'end_unqualified_open',
		},
		unqualified_opentext2: {
			message:
				'Can you give me some details about your situation that I can pass along to our legal team?',
			function: (params) =>
				setForm({ ...form, unqualified_answer: params.userInput }),
			path: 'end_unqualified_open2',
		},
		end_unqualified: {
			message: 'Thank you for contacting Kreindler & Kreindler LLP.',
		},
		qualified: {
			message:
				'Thank you. Based on your answers, you may be eligible for the Victim Compensation Fund. Please provide the following information: Full Name, Phone Number & Email Address. We will use this information to contact you shortly for a free consultation.',
			path: 'end_success',
		},
		end_unqualified_open: {
			message:
				"We've received your information and will review it as soon as possible. Thank you for contacting Kreindler & Kreindler LLP.",
		},
		end_success: {
			message:
				"We've received your information and will be in contact with you as soon as possible using the contact information you provided. Thank you for contacting Kreindler & Kreindler LLP.",
		},
		end_unqualified_open2: {
			message:
				'Thank you. Please provide the following information: Full Name, Phone Number & Email Address.',
			path: 'end_someoneelse',
		},
		end_someoneelse: {
			message:
				"We've received your information and will review it as soon as possible. Thank you for contacting Kreindler & Kreindler LLP.",
		},
		other: {
			message: 'Would you like a Free Consultation for another legal issue?',
			function: (params) =>
				setForm({ ...form, something_else: params.userInput }),
			options: ['Yes', 'No'],
			chatDisabled: true,
			path: (params) => {
				switch (params.userInput) {
					case 'Yes':
						return 'consultation';
					default:
						return 'end_unqualified';
				}
			},
		},
		consultation: {
			message: 'What practice area is your concern about?',
			options: [
				'Maritime Accident',
				'Toxic Exposure',
				'Premises Liability',
				'Aviation Accident',
				'Terrorism',
				'Medical or Pharmaceutical',
				'Other',
			],
			function: (params) =>
				setForm({ ...form, consultation_area: params.userInput }),
			path: 'consultation_open',
		},
		consultation_open: {
			message:
				'Please provide the following information: Full Name, Phone Number & Email Address. We will use this information to contact you shortly for a free consultation.',
			function: (params) =>
				setForm({ ...form, contact_information: params.userInput }),
			path: 'end_consultation',
		},
		end_consultation: {
			message:
				"We've received your information and will be in contact with you as soon as possible using the contact information you provided. Thank you for contacting Kreindler & Kreindler LLP.",
		},
	};

	return (
		<ChatBot
			options={{
				theme: { embedded: true },
				chatHistory: { storageKey: 'example_advanced_form' },
			}}
			flow={flow}
		/>
	);
};

function generateYearOptions(startYear, endYear) {
	const years = [];
	for (let year = startYear; year >= endYear; year--) {
		years.push(year.toString());
	}
	return years;
};

render(<MyChatBot />);