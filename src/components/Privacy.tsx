
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Privacy = () => {
  return (
    <Card className="mb-8 bg-white/5 backdrop-blur-lg border-white/10">
      <CardHeader>
        <CardTitle id="privacy" className="text-2xl font-bold text-aus-green scroll-m-20">
          Privacy Policy
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-aus-green">Information Collection</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            We collect only the information you explicitly provide:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
            <li>Name and contact details you enter</li>
            <li>Postcode for electoral lookup</li>
            <li>Message content you compose</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-aus-green">Information Use</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            Your information is used solely to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
            <li>Generate appropriate communications to representatives</li>
            <li>Ensure messages are properly addressed and delivered</li>
            <li>Maintain system functionality and prevent abuse</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-aus-green">Data Storage</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
            <li>We do not store your messages or personal information after generation</li>
            <li>Messages are transmitted directly through your email client</li>
            <li>No message content is retained on our servers</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-aus-green">Third-Party Services</h3>
          <p className="text-gray-600 dark:text-gray-300">
            We use the Australian Electoral Commission data to provide electoral information. 
            Your use of this tool is subject to their terms and privacy policies as well.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-aus-green">Disclaimer</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            This tool is provided "as is" without warranties of any kind. We are not responsible for:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
            <li>The accuracy of electoral data</li>
            <li>The delivery or receipt of messages</li>
            <li>The responses or actions of representatives</li>
            <li>Any consequences of using this tool</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default Privacy;
