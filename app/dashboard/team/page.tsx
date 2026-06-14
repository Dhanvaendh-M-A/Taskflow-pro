"use client";

import { motion } from "framer-motion";
import { Users, Mail, Shield, Crown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { generateAvatarUrl } from "@/lib/utils";

const teamMembers = [
  { name: "Alex Johnson", email: "alex@example.com", role: "Owner", status: "active" },
  { name: "Sarah Chen", email: "sarah@example.com", role: "Admin", status: "active" },
  { name: "Mike Ross", email: "mike@example.com", role: "Member", status: "active" },
  { name: "Emily Davis", email: "emily@example.com", role: "Member", status: "offline" },
];

export default function TeamPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Team</h1>
        <p className="text-muted-foreground mt-1">
          Manage team members and permissions
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {teamMembers.map((member, index) => (
          <motion.div
            key={member.email}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <img
                    src={generateAvatarUrl(member.name)}
                    alt={member.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{member.name}</h3>
                      {member.role === "Owner" && (
                        <Crown className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Mail className="h-3 w-3" />
                      {member.email}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={member.role === "Owner" ? "default" : "secondary"}
                      className="mb-1"
                    >
                      {member.role}
                    </Badge>
                    <div className="flex items-center gap-1 justify-end">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          member.status === "active" ? "bg-green-500" : "bg-slate-400"
                        }`}
                      />
                      <span className="text-xs text-muted-foreground capitalize">
                        {member.status}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
