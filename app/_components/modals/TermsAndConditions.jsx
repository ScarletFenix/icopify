import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaBan,
  FaDollarSign,
  FaInfoCircle,
} from 'react-icons/fa';

const TermsAndConditions = ({ onAccept, onDecline }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <Card className="w-full max-w-3xl rounded-lg shadow-lg mt-12 overflow-hidden">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-blue-800">
            Terms &amp; Conditions
          </h2>
          <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-4">
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded">
              <FaCheckCircle className="text-green-600 mt-1" />
              <p className="text-sm text-blue-800">
                <strong>Page Count:</strong> The web pages to be indexed by Google should not be less than 100 pages.
              </p>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded">
              <FaInfoCircle className="text-blue-600 mt-1" />
              <p className="text-sm text-blue-800">
                <strong>Traffic:</strong> The website must have a minimum traffic of 500 visitors per month.
              </p>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded">
              <FaCheckCircle className="text-green-600 mt-1" />
              <p className="text-sm text-blue-800">
                <strong>Domain Age:</strong> The domain must be at least 6 months old.
              </p>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded">
              <FaCheckCircle className="text-green-600 mt-1" />
              <p className="text-sm text-blue-800">
                <strong>Moz Domain Authority:</strong> Should be above 20 with a spam score below 20%.
              </p>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded">
              <FaCheckCircle className="text-green-600 mt-1" />
              <p className="text-sm text-blue-800">
                <strong>Ahrefs Domain Rating:</strong> Must be more than 20.
              </p>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded">
              <FaExclamationTriangle className="text-yellow-600 mt-1" />
              <p className="text-sm text-blue-800">
                The website should be regularly updated with unique and relevant content.
              </p>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded">
              <FaBan className="text-red-600 mt-1" />
              <p className="text-sm text-blue-800">
                Websites violating any laws or not adhering to copyrights are not allowed.
              </p>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded">
              <FaBan className="text-red-600 mt-1" />
              <p className="text-sm text-blue-800">
                Forbidden: Adult, dating, gambling, weapon sales, tobacco, or any unethical content.
              </p>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded">
              <FaDollarSign className="text-green-600 mt-1" />
              <p className="text-sm text-blue-800">
                Payments are made weekly on Mondays. Minimum payout is $5.00 with a 10% fee deduction.
              </p>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded">
              <FaExclamationTriangle className="text-yellow-600 mt-1" />
              <p className="text-sm text-blue-800">
                Our decision may change later if the website's quality depreciates.
              </p>
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="outline" onClick={onDecline}>
              Decline
            </Button>
            <Button onClick={onAccept}>Accept</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TermsAndConditions;
