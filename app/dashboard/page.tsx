"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  Activity,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatRelativeTime } from "@/lib/utils";
import type { DashboardStats } from "@/types";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 w-24 bg-muted rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      title: "Total Tasks",
      value: stats.totalTasks,
      icon: Activity,
      change: "+12%",
      trend: "up",
      color: "from-blue-500/20 to-blue-600/20 text-blue-500",
    },
    {
      title: "Completed",
      value: stats.completedTasks,
      icon: CheckCircle2,
      change: "+8%",
      trend: "up",
      color: "from-green-500/20 to-green-600/20 text-green-500",
    },
    {
      title: "In Progress",
      value: stats.inProgressTasks,
      icon: Clock,
      change: "+3%",
      trend: "up",
      color: "from-yellow-500/20 to-yellow-600/20 text-yellow-500",
    },
    {
      title: "Overdue",
      value: stats.overdueTasks,
      icon: AlertTriangle,
      change: "-2%",
      trend: "down",
      color: "from-red-500/20 to-red-600/20 text-red-500",
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s what&apos;s happening with your tasks today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} rounded-bl-full opacity-50 group-hover:scale-110 transition-transform`} />
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color.split(" ").pop()}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center mt-1 text-xs">
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>
                    {stat.change}
                  </span>
                  <span className="text-muted-foreground ml-1">vs last week</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Task Status Distribution */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Task Status Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.tasksByStatus.map((status) => {
                  const percentage = stats.totalTasks > 0
                    ? Math.round((status.count / stats.totalTasks) * 100)
                    : 0;
                  const colors: Record<string, string> = {
                    TODO: "bg-slate-500",
                    IN_PROGRESS: "bg-blue-500",
                    IN_REVIEW: "bg-purple-500",
                    DONE: "bg-green-500",
                    CANCELLED: "bg-red-500",
                  };
                  return (
                    <div key={status.status} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{status.status.replace("_", " ")}</span>
                        <span className="text-muted-foreground">
                          {status.count} ({percentage}%)
                        </span>
                      </div>
                      <Progress value={percentage} className="h-2">
                        <div className={`h-full ${colors[status.status] || "bg-primary"} rounded-full transition-all`} style={{ width: `${percentage}%` }} />
                      </Progress>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium">Completion Rate</span>
                  <span className="text-2xl font-bold">{stats.completionRate}%</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.completionRate}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Priority Distribution */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>By Priority</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.tasksByPriority.map((priority) => {
                  const colors: Record<string, string> = {
                    URGENT: "bg-red-500",
                    HIGH: "bg-orange-500",
                    MEDIUM: "bg-yellow-500",
                    LOW: "bg-green-500",
                  };
                  return (
                    <div key={priority.priority} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${colors[priority.priority]}`} />
                        <span className="text-sm">{priority.priority}</span>
                      </div>
                      <Badge variant="secondary">{priority.count}</Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Weekly Progress & Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Weekly Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between h-48 gap-2">
                {stats.weeklyProgress.map((day, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex flex-col gap-1">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.max(day.completed * 10, 4)}px` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="w-full bg-green-500/80 rounded-t-sm"
                      />
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.max(day.created * 10, 4)}px` }}
                        transition={{ duration: 0.5, delay: index * 0.1 + 0.05 }}
                        className="w-full bg-primary/60 rounded-t-sm"
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{day.day}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500/80 rounded" />
                  <span>Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary/60 rounded" />
                  <span>Created</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-48">
                <div className="space-y-4">
                  {stats.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Activity className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatRelativeTime(activity.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
