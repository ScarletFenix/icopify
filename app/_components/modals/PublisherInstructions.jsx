import React, { useState } from 'react';
import {
  FaChevronDown,
  FaChevronUp,
  FaCheckCircle,
  FaExclamationTriangle,
  FaBan,
  FaInfoCircle,
} from 'react-icons/fa';

const PublisherInstructions = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  // Define your instructions and assign an appropriate icon for each.
  const listItems = [
    {
      text: "Before you start working on a task, make sure you have accepted it.",
      icon: <FaCheckCircle className="mt-1 mr-2 text-green-600" />,
    },
    {
      text: "Reject the task as soon as you think you cannot complete it.",
      icon: <FaExclamationTriangle className="mt-1 mr-2 text-yellow-600" />,
    },
    {
      text: "The payment is not to the subdomain.",
      icon: <FaInfoCircle className="mt-1 mr-2 text-blue-600" />,
    },
    {
      text: "Wait for the buyer to approve the task.",
      icon: <FaInfoCircle className="mt-1 mr-2 text-blue-600" />,
    },
    {
      text: "If the Buyer doesn’t approve the task, it will be automatically marked as approved after 3 days.",
      icon: <FaCheckCircle className="mt-1 mr-2 text-green-600" />,
    },
    {
      text: "If the Buyer requests any changes, make sure your fix is as soon as possible or the task may be cancelled by the buyer or iCopy.",
      icon: <FaExclamationTriangle className="mt-1 mr-2 text-yellow-600" />,
    },
    {
      text: "Try not to renegotiate the price with the Buyer.",
      icon: <FaCheckCircle className="mt-1 mr-2 text-green-600" />,
    },
    {
      text: "Don’t exchange email, phone numbers, or any links with the Buyer.",
      icon: <FaBan className="mt-1 mr-2 text-red-600" />,
    },
  ];

  const additionalItems = [
    {
      title: "As a website Owner:",
      description:
        "After delivering the task, if it is approved, it will be automatically marked as complete after 3 days and the funds will be available for withdrawal.",
      icon: <FaCheckCircle className="mt-1 mr-2 text-green-600" />,
    },
    {
      title: "As a contributor on a website:",
      description:
        "After delivering the task, if the buyer doesn’t approve it, it will be automatically marked as complete after 3 days and the funds will be moved to your Balance Awaiting and will be available for withdrawal after 21 days.",
      icon: <FaCheckCircle className="mt-1 mr-2 text-green-600" />,
    },
  ];

  return (
    <div className="mt-4 bg-blue-50 border border-blue-200 rounded-md text-blue-800">
      {/* Collapsible Header with Dropdown Icon on the Left */}
      <button
        onClick={handleToggle}
        className="w-full flex items-center p-3 text-left space-x-3"
      >
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        <span className="font-medium">
          Please click here to read and familiarise yourself with things you can and cannot do.
        </span>
      </button>

      {/* Collapsible Body */}
      {isOpen && (
        <div className="p-3 text-sm text-gray-700 space-y-2">
          <ul className="space-y-2">
            {listItems.map((item, index) => (
              <li key={index} className="flex items-start">
                {item.icon}
                <span>{item.text}</span>
              </li>
            ))}
          </ul>

          <p className="mt-2 font-semibold">
            We read all messages and we reserve the right to suspend or ban your account if you fail any of these rules.
          </p>

          <ul className="space-y-2 mt-2">
            {additionalItems.map((section, index) => (
              <li key={index} className="flex flex-col">
                <span className="flex items-center">
                  {section.icon}
                  <strong>{section.title}</strong>
                </span>
                <span className="ml-6">{section.description}</span>
              </li>
            ))}
          </ul>

          <p className="mt-2 font-semibold">
            Payments are made weekly (Every Monday). Please make sure to request your payment before Sunday Midnight UK Time.
          </p>

          <p>
            Our decision may change later if the website’s quality depreciates and is no longer in sync with our rules.
          </p>
        </div>
      )}
    </div>
  );
};

export default PublisherInstructions;
