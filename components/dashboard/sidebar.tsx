"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import getUserData from "@/lib/auth";
import { useProjects } from "@/lib/hooks/useProject";

export default function Sidebar({
  collapsed,
  setCollapsed,
  setIsOpen,
}: {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
  setIsOpen: (val: boolean) => void;
}) {
  const router = useRouter();
  const toggleSidebar = () => setCollapsed(!collapsed);
  const { user } = getUserData();

  const { projectsQuery, joinedProjectsQuery } = useProjects();

  // Merge created + joined projects
  const allProjects = [
    ...(projectsQuery.data || []),
    ...(joinedProjectsQuery.data || []),
  ].map((p) => ({
    ...p,
    color: p.color || "bg-green-500",
    _id: p._id,
  }));

  // Function to save clicked project id in localStorage
  const handleProjectClick = (projectId: string) => {
    localStorage.setItem("currentProjectId", projectId);
    console.log("Saved projectId:", projectId);
  };

  return (
    <aside
      id="sidebar"
      className={`fixed top-0 left-0 h-screen z-40 flex flex-col 
        bg-purple-950/80 backdrop-blur-md transition-all duration-300
        ${collapsed ? "w-0 sm:w-20 " : "w-screen sm:w-64"}`}
    >
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-6 w-6 h-6 bg-purple-700 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors"
      >
        <i
          className={`fas ${
            collapsed ? "fa-chevron-right" : "fa-chevron-left"
          } text-xs`}
        ></i>
      </button>

      {/* USER PROFILE */}
      <div
        className={`p-6 ${collapsed ? " border-b-0 sm:border-b" : "border-b"} border-b border-white/10`}
      >
        <div
          className={`flex items-center space-x-3 ${collapsed ? "hidden sm:flex" : "flex"}`}
        >
          <div
            className="avatar-circle bg-gradient-to-br from-yellow-400 to-amber-500 
            text-purple-900 items-center justify-center rounded-full h-10 min-w-10 font-bold"
          >
            {user?.username?.slice(0, 1).toUpperCase()}
          </div>

          {!collapsed && (
            <div className="sidebar-text">
              <p className="font-semibold text-sm">{user?.username}</p>
              <p className="text-xs text-purple-300">{user?.email}</p>
            </div>
          )}
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="px-3 space-y-1">
          <SidebarItem icon="fa-home" label="Dashboard" collapsed={collapsed} href="/dashboard" />
          <SidebarItem icon="fa-tasks" label="My Tasks" collapsed={collapsed} href="/dashboard/my-tasks" />

          {/* MESSAGE ICON -> Open Messages Page */}
          <SidebarItem
            icon="fa-comment"
            label="Messages"
            collapsed={collapsed}
            href="/dashboard/messages" // <-- New Messages page route
          />

          {/* PROJECTS SECTION */}
          {!collapsed && (
            <div className="pt-4">
              <div className="flex items-center justify-between px-3 mb-2">
                <span className="text-xs font-semibold text-purple-300 uppercase">Projects</span>
                <button
                  onClick={() => setIsOpen(true)}
                  className="text-yellow-400 hover:text-yellow-300 cursor-pointer"
                >
                  <i className="fas fa-plus text-xs"></i>
                </button>
              </div>

              {projectsQuery.isLoading || joinedProjectsQuery.isLoading ? (
                <SidebarProject label="Loading..." color="bg-yellow-500" href="#" />
              ) : allProjects.length <= 0 ? (
                <SidebarProject label="No Project Found" color="bg-red-500" href="#" />
              ) : (
                allProjects.map((project) => (
                  <SidebarProject
                    key={project._id}
                    label={project.title}
                    color={project.color}
                    href={`/dashboard/${project._id}/project`}
                    onClick={() => handleProjectClick(project._id)}
                  />
                ))
              )}
            </div>
          )}

          <SidebarItem icon="fa-bell" label="Notifications" badge="3" collapsed={collapsed} href="/dashboard/notifications" />
          <SidebarItem icon="fa-user-plus" label="Invitations" collapsed={collapsed} href="/dashboard/invitations" />
          <SidebarItem icon="fa-cog" label="Settings" collapsed={collapsed} href="/dashboard/settings" />
        </div>
      </nav>

      {/* BOTTOM BUTTONS */}
      {!collapsed && (
        <div className="p-4 border-t border-white/10 space-y-2">
          <button
            onClick={() => setIsOpen(true)}
            className="w-full px-4 py-2.5 bg-gradient-to-r from-yellow-400 to-amber-500 
          text-purple-900 rounded-lg font-semibold hover:shadow-lg transition-all text-sm cursor-pointer"
          >
            <span>Create Project</span>
          </button>
        </div>
      )}
    </aside>
  );
}

/* ---------------- Reusable Components ---------------- */

function SidebarItem({
  icon,
  label,
  href,
  collapsed,
  badge,
}: {
  icon: string;
  label: string;
  href: string;
  collapsed: boolean;
  badge?: string;
}) {
  return (
    <Link
      href={href}
      className="nav-item w-full flex items-center space-x-3 px-3 py-2.5 
      rounded-lg hover:bg-white/10 transition-colors text-left"
    >
      <i className={`fas ${icon} text-yellow-400 w-5`}></i>
      {!collapsed && <span className="sidebar-text">{label}</span>}
      {!collapsed && badge && (
        <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </Link>
  );
}

function SidebarProject({
  label,
  color,
  href,
  onClick,
}: {
  label: string;
  color: string;
  href: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="nav-item w-full flex items-center space-x-3 px-3 py-2.5 
      rounded-lg hover:bg-white/10 transition-colors text-left"
    >
      <span className={`status-dot ${color} h-2 w-2 rounded-full`}></span>
      <span className="text-sm">{label}</span>
    </Link>
  );
}
