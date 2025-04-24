
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Terms = () => {
  return (
    <Card className="mb-8 bg-white/5 backdrop-blur-lg border-white/10">
      <CardHeader>
        <CardTitle id="terms" className="text-2xl font-bold text-aus-green scroll-m-20">
          Terms of Use
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          By using this tool, you agree to these terms of use. This tool is provided for legitimate democratic engagement 
          and must be used responsibly and legally.
        </p>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-aus-green">Acceptable Use</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
            <li>You may use this tool to communicate with elected representatives and candidates</li>
            <li>Communications must be respectful and free from abuse, harassment, or threats</li>
            <li>You must only submit accurate personal information</li>
            <li>You must not impersonate others or provide false information</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-aus-green">Limitations of Use</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
            <li>The tool is for personal, non-commercial use</li>
            <li>You may not use automated scripts or bots</li>
            <li>You may not flood representatives with excessive communications</li>
            <li>Mass campaigns must be conducted responsibly and ethically</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default Terms;
