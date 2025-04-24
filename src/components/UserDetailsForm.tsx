
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface UserDetailsFormProps {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  onChange: (field: string, value: string) => void;
}

const UserDetailsForm = ({ firstName, lastName, phone, email, onChange }: UserDetailsFormProps) => {
  const { toast } = useToast();

  const handleEmailChange = (value: string) => {
    // Only validate if there's actually content and it's invalid
    if (value && value.trim() !== "" && !value.includes('@')) {
      toast({
        variant: "destructive",
        title: "Invalid email",
        description: "Please enter a valid email address",
      });
    }
    onChange("email", value);
  };

  const handlePhoneChange = (value: string) => {
    // Only validate if there's actually content and it's invalid
    if (value && value.trim() !== "" && !/^[\d\s\-+()]*$/.test(value)) {
      toast({
        variant: "destructive",
        title: "Invalid phone number",
        description: "Please enter a valid phone number",
      });
    }
    onChange("phone", value);
  };

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h3 className="font-medium mb-2">Your Contact Details (Optional)</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => onChange("firstName", e.target.value)}
            placeholder="Enter your first name"
            maxLength={50}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => onChange("lastName", e.target.value)}
            placeholder="Enter your last name"
            maxLength={50}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            placeholder="Enter your phone number"
            maxLength={20}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
            placeholder="Enter your email address"
            maxLength={100}
          />
        </div>
      </div>
    </div>
  );
};

export default UserDetailsForm;
