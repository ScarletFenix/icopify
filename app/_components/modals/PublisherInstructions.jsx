import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const PublisherInstructions = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="mt-4 bg-blue-50 border border-blue-200 rounded-md text-blue-800">
      {/* Collapsible Header */}
      <button
        onClick={handleToggle}
        className="w-full flex justify-between items-center p-3 text-left"
      >
        <span className="font-medium">
          Please click here to read and familiarise yourself with things you can and cannot do.
        </span>
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </button>

      {/* Collapsible Body */}
      {isOpen && (
        <div className="p-3 text-sm text-gray-700 space-y-2">
          <ul className="list-disc list-inside space-y-2">
            <li>Before you start working on a task, make sure you have accepted it.</li>
            <li>Reject the task as soon as you think you cannot complete it.</li>
            <li>The payment is not to the subdomain.</li>
            <li>Wait for the buyer to approve the task.</li>
            <li>
              If the Buyer doesn’t approve the task, it will be automatically marked as approved
              after 3 days.
            </li>
            <li>
              If the Buyer requests any changes, make sure your fix is as soon as possible or the
              task may be cancelled by the buyer or iCopy.
            </li>
            <li>Try not to renegotiate the price with the Buyer.</li>
            <li>Don’t exchange email, phone numbers, or any links with the Buyer.</li>
          </ul>

          <p className="mt-2 font-semibold">
            We read all messages and we reserve the right to suspend or ban your account if you fail
            any of these rules.
          </p>

          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>
              <strong>As a website Owner:</strong> After delivering the task, if it is approved, it
              will be automatically marked as complete after 3 days and the funds will be available
              for withdrawal.
            </li>
            <li>
              <strong>As a contributor on a website:</strong> After delivering the task, if the
              buyer doesn’t approve it, it will be automatically marked as complete after 3 days and
              the funds will be moved to your Balance Awaiting and will be available for withdrawal
              after 21 days.
            </li>
          </ul>

          <p className="mt-2 font-semibold">
            Payments are made weekly (Every Monday). Please make sure to request your payment
            before Sunday Midnight UK Time.
          </p>

          <p>
            Our decision may change later if the website’s quality depreciates and is no longer in
            sync with our rules.
          </p>
        </div>
      )}
    </div>
  );
};

export default PublisherInstructions;
