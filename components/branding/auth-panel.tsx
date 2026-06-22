"use client";

import { Mail, UserRound, Chrome } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AuthPanel() {
  return (
    <Card className="h-full border-gold/20 bg-black/35">
      <CardHeader>
        <CardTitle>Authentication</CardTitle>
        <p className="text-sm text-muted-foreground">Secure premium desk access for students and practice accounts.</p>
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
