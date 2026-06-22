"use client";

import { Chrome, Mail, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AuthPanel() {
  return (
    <Card className="h-full border-[#334155] bg-[#111827]">
      <CardHeader>
        <CardTitle>Authentication</CardTitle>
        <p className="text-sm text-slate-400">Secure desk access for students, scanner practice, and paper accounts.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button className="h-11 w-full" variant="outline">
          <UserRound />
          Guest Login
        </Button>
        <div className="grid gap-2">
          <Label htmlFor="email-login">Email Login</Label>
          <Input id="email-login" type="email" placeholder="trader@heiststoker.com" />
          <Button className="h-11" variant="secondary">
            <Mail />
            Continue with Email
          </Button>
        </div>
        <Button className="h-11 w-full" variant="secondary">
          <Chrome />
          Google Login
        </Button>
      </CardContent>
    </Card>
  );
}
