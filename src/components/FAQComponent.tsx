import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, BookOpen, Shield, AlertTriangle } from "lucide-react";

const FAQComponent = () => {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="text-center mb-6"> {/* Added text-center here */}
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">FAQ & Best Practices</h2>
      </div>
      
      <div className="space-y-4">
        {/* Card 1: What is Secure Nomad? */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <HelpCircle className="h-4 w-4 mr-1 text-yellow-500" />
              What is Secure Nomad?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Secure Nomad is a client-side encryption tool designed for travelers, journalists, and anyone needing to protect sensitive information. It allows you to encrypt text, files, and folders directly in your browser, without sending any data to a server.
            </p>
          </CardContent>
        </Card>

        {/* Card 2: How does it work? */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <BookOpen className="h-4 w-4 mr-1 text-blue-500" />
              How does it work?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Secure Nomad uses AES-256 encryption in the browser using the Web Crypto API. Your data is encrypted locally, and the encrypted output can be stored or transmitted securely. The password you use to encrypt the data is the key, so keep it safe!
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Is it really secure? */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Shield className="h-4 w-4 mr-1 text-green-500" />
              Is it really secure?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Yes, Secure Nomad is designed to be secure. It uses AES-256, which is considered unbreakable. The encryption happens in your browser, so your data never touches a server. However, security depends on you keeping your password safe.
            </p>
          </CardContent>
        </Card>

        {/* Card 4: What if I lose my password? */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 mr-1 text-red-500" />
              What if I lose my password?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              If you lose your password, you will not be able to decrypt your data. There is no password recovery. This is a security feature to ensure that only you can access your data. Store your passwords securely!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FAQComponent;
