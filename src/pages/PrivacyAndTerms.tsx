import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

const PrivacyAndTerms = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <Button variant="outline" asChild className="mb-8">
          <Link to="/">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
        </Button>

        <div className="prose prose-sm max-w-4xl mx-auto">
          <h1>Privacy Policy & Terms of Use</h1>
          
          <h2 id="terms">Terms of Use</h2>
          <p>
            By using this tool, you agree to these terms of use. This tool is provided for legitimate democratic engagement 
            and must be used responsibly and legally.
          </p>

          <h3>Acceptable Use</h3>
          <ul>
            <li>You may use this tool to communicate with elected representatives and candidates</li>
            <li>Communications must be respectful and free from abuse, harassment, or threats</li>
            <li>You must only submit accurate personal information</li>
            <li>You must not impersonate others or provide false information</li>
          </ul>

          <h3>Limitations of Use</h3>
          <ul>
            <li>The tool is for personal, non-commercial use</li>
            <li>You may not use automated scripts or bots</li>
            <li>You may not flood representatives with excessive communications</li>
            <li>Mass campaigns must be conducted responsibly and ethically</li>
          </ul>

          <h2 id="privacy">Privacy Policy</h2>
          
          <h3>Information Collection</h3>
          <p>
            We collect only the information you explicitly provide:
          </p>
          <ul>
            <li>Name and contact details you enter</li>
            <li>Postcode for electoral lookup</li>
            <li>Message content you compose</li>
          </ul>

          <h3>Information Use</h3>
          <p>
            Your information is used solely to:
          </p>
          <ul>
            <li>Generate appropriate communications to representatives</li>
            <li>Ensure messages are properly addressed and delivered</li>
            <li>Maintain system functionality and prevent abuse</li>
          </ul>

          <h3>Data Storage</h3>
          <ul>
            <li>We do not store your messages or personal information after generation</li>
            <li>Messages are transmitted directly through your email client</li>
            <li>No message content is retained on our servers</li>
          </ul>

          <h3>Third-Party Services</h3>
          <p>
            We use the Australian Electoral Commission data to provide electoral information. 
            Your use of this tool is subject to their terms and privacy policies as well.
          </p>

          <h3>Disclaimer</h3>
          <p>
            This tool is provided "as is" without warranties of any kind. We are not responsible for:
          </p>
          <ul>
            <li>The accuracy of electoral data</li>
            <li>The delivery or receipt of messages</li>
            <li>The responses or actions of representatives</li>
            <li>Any consequences of using this tool</li>
          </ul>

          <p className="text-sm text-muted-foreground mt-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyAndTerms;
