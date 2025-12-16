"use client";

import { useEffect, useState } from "react";
import QuickStatsCard from "./QuickStatsCard";
import RecentProjectCard from "./RecentProjectCard";
import ActivityItem from "./ActivityItem";
import getUserData from "@/lib/auth";
import { useRouter } from "next/navigation";

// =========================
// TYPES
// =========================
interface User {
  _id: string;
  username: string;
  email: string;
}

interface Summary {
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  inprocessTasks: number;
  todoTasks: number;
}

interface TeamMember {
  _id: string;
  username: string;
}

interface Project {
  _id: string;
  title: string;
  tasksCount?: number;
  completedTasks?: number;
  updatedAt: string;
  teamMembers: TeamMember[];
}

interface Activity {
  user: string;
  action: string;
  target: string;
  time: string;
}

export default function DashboardHome() {
  const router = useRouter();
  const { user } = getUserData() as { user: User | null };

  const [summary, setSummary] = useState<Summary>({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    inprocessTasks: 0,
    todoTasks: 0,
  });

  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [activityFeed, setActivityFeed] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH DASHBOARD DATA
  // =========================
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // SUMMARY
        const resSummary = await fetch(
          "http://localhost:5000/dashboard/summary",
          { credentials: "include" }
        );
        const dataSummary = await resSummary.json();
        if (dataSummary.success) setSummary(dataSummary.summary);

        // RECENT PROJECTS
        const resProjects = await fetch(
          "http://localhost:5000/dashboard/recent",
          { credentials: "include" }
        );
        const dataProjects = await resProjects.json();
        if (dataProjects.success) setRecentProjects(dataProjects.projects);

        // ACTIVITY
        const resActivity = await fetch(
          "http://localhost:5000/dashboard/recent-activity",
          { credentials: "include" }
        );
        const dataActivity = await resActivity.json();
        if (dataActivity.success) setActivityFeed(dataActivity.activity);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // =========================
  // QUICK STATS
  // =========================
  const quickStats = [
    {
      icon: "fa-tasks",
      iconBGColor: "bg-blue-500/20",
      iconColor: "text-blue-400",
      label: "Tasks",
      value: summary.todoTasks,
      subtitle: "Pending",
    },
    {
      icon: "fa-check-circle",
      iconBGColor: "bg-green-500/20",
      iconColor: "text-green-400",
      label: "Tasks",
      value: summary.completedTasks,
      subtitle: "Completed",
    },
    {
      icon: "fa-clock",
      iconBGColor: "bg-yellow-500/20",
      iconColor: "text-yellow-400",
      label: "Tasks",
      value: summary.inprocessTasks,
      subtitle: "In Progress",
    },
    {
      icon: "fa-folder",
      iconBGColor: "bg-purple-500/20",
      iconColor: "text-purple-400",
      label: "Projects",
      value: summary.totalProjects,
      subtitle: "Total",
    },
  ];

  if (loading) {
    return <div className="p-6 text-purple-300">Loading dashboard...</div>;
  }

  return (
    <div className="p-6 no-scrollbar">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.username}!
        </h1>
        <p className="text-purple-300">
          Here's what's happening with your projects today.
        </p>
      </div>

      {/* QUICK STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickStats.map((stat, i) => (
          <QuickStatsCard key={i} {...stat} />
        ))}
      </div>

      {/* PROJECTS + ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* RECENT PROJECTS */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-4">Recent Projects</h2>

          <div className="space-y-4">
            {recentProjects.map((project) => (
              <RecentProjectCard
                key={project._id}
                projectId={project._id} // ✅ ROUTE ID
                title={project.title}
                tasks={project.tasksCount || 0}
                completed={project.completedTasks || 0}
                updated={new Date(project.updatedAt).toLocaleTimeString()}
                members={project.teamMembers.map((m) => ({
                  initials: m.username[0].toUpperCase(),
                }))}
                onClick={() => {
                  // Save projectId to localStorage for KanbanBoard
                  localStorage.setItem("currentProjectId", project._id);
                  // Navigate to KanbanBoard or project page
                  router.push(`/projects/${project._id}`);
                }}
              />
            ))}
          </div>
        </div>

        {/* ACTIVITY */}
        <div>
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="glass-effect rounded-2xl p-6 space-y-4">
            {activityFeed.map((activity, i) => (
              <ActivityItem
                key={i}
                user={activity.user}
                action={activity.action}
                target={activity.target}
                time={activity.time}
                bgColorFrom="blue-400"
                bgColorTo="blue-600"
                textColor="white"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
