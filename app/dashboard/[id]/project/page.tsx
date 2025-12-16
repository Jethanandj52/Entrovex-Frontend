"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import KanbanBoard from "@/components/dashboard/KanbanBoard";
import { useProjects } from "@/lib/hooks/useProject";
import { useModal } from "@/context/Global";
import { FaUser, FaUserPlus, FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";

// ===================== INTERFACES =====================
interface Member {
  _id: string;
  username: string;
  email: string;
  isAdmin?: boolean;
}

interface Project {
  _id: string;
  title: string;
  description?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: Member;
  teamMembers?: Member[];
  invitedMembers?: { email: string; status: string }[];
}

// ===================== MAIN COMPONENT =====================
export default function ProjectDetailsPage() {
  const params = useParams();
  const projectId = params.id as string;
  const { openInviteModal } = useModal();
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const { projectDetailsQuery } = useProjects(projectId);

  // ----------------- LOADING -----------------
  if (projectDetailsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-purple-300 animate-pulse">Loading project...</div>
      </div>
    );
  }

  // ----------------- ERROR -----------------
  if (projectDetailsQuery.isError || !projectDetailsQuery.data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-400 p-4 bg-red-500/10 rounded max-w-md text-center">
          <h2 className="text-2xl font-bold mb-2">Project Not Found</h2>
          <p className="mb-4">You don’t have access to this project or it doesn’t exist.</p>
          <a
            href="/dashboard"
            className="inline-block px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  // ----------------- SAFE ASSIGNMENT -----------------
const project: Project = {
  _id: projectDetailsQuery.data!._id || "",
  title: projectDetailsQuery.data!.title || "Untitled Project",
  description: projectDetailsQuery.data!.description || "",
  color: projectDetailsQuery.data!.color || "#7e22ce",
  createdBy: projectDetailsQuery.data!.createdBy ?? { _id: "", username: "Unknown", email: "unknown@example.com" },
  teamMembers: projectDetailsQuery.data!.teamMembers || [],
  invitedMembers: projectDetailsQuery.data!.invitedMembers || [],
   
  createdAt: projectDetailsQuery.data!.createdAt || new Date().toISOString(),
  updatedAt: projectDetailsQuery.data!.updatedAt || new Date().toISOString(),
};

// safe, already checked above
  const allMembers: Member[] = [
    { ...project.createdBy, isAdmin: true },
    ...(project.teamMembers || []),
  ];

  return (
    <div className="p-4 md:p-6">
      {/* PROJECT HEADER */}
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: project.color || "#7e22ce" }}
          />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{project.title}</h1>
            {project.description && (
              <p className="text-purple-300 mt-1 text-sm md:text-base">{project.description}</p>
            )}
          </div>
        </div>

        {/* MEMBERS + INVITE */}
        <div className="flex items-center space-x-3">
          <div className="flex -space-x-2">
            {allMembers.map((member) => (
              <div
                key={member._id}
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 border-purple-900 text-white cursor-pointer ${
                  member.isAdmin ? "bg-red-500" : "bg-blue-500"
                }`}
                title={member.username}
                onClick={() => setSelectedMember(member)}
              >
                <FaUser size={12} />
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              localStorage.setItem("currentProjectId", project._id);
              openInviteModal();
            }}
            className="px-4 py-2 flex items-center gap-2 glass-effect rounded-lg hover:bg-white/20 transition-all cursor-pointer"
          >
            <FaUserPlus /> Invite
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Created" value={project.createdAt} />
        <Stat label="Members" value={allMembers.length} />
        <Stat label="Updated" value={project.updatedAt} />
        <Stat label="Status" value="Active" />
      </div>

      {/* MEMBERS CARDS */}
      <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4">Team Members</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allMembers.map((member) => (
          <MemberCard
            key={member._id}
            member={member}
            onClick={() => setSelectedMember(member)}
          />
        ))}
      </div>

      {/* KANBAN BOARD */}
      <div className="mt-8">
        <h2 className="text-xl md:text-2xl font-bold mb-4">Project Tasks</h2>
        <KanbanBoard projectId={project._id} members={allMembers} />
      </div>

      {/* MEMBER DETAIL MODAL */}
      {selectedMember && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="bg-gradient-to-br from-purple-800 to-purple-900 p-6 rounded-2xl shadow-2xl w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-4 mb-4">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl font-bold ${
                  selectedMember.isAdmin ? "bg-red-500" : "bg-blue-500"
                }`}
              >
                <FaUser />
              </div>
              <div className="flex flex-col">
                <h3 className="text-white text-xl font-bold">{selectedMember.username}</h3>
                {selectedMember.isAdmin && (
                  <span className="text-red-400 font-semibold text-sm mt-1">Admin</span>
                )}
                <p className="text-purple-300 text-sm mt-1">{selectedMember.email}</p>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex gap-4 mb-4">
              <a href="#" className="text-blue-400 hover:text-blue-600 transition-colors" title="Twitter">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-blue-400 hover:text-blue-600 transition-colors" title="LinkedIn">
                <FaLinkedin size={20} />
              </a>
              <a href="#" className="text-blue-400 hover:text-blue-600 transition-colors" title="GitHub">
                <FaGithub size={20} />
              </a>
            </div>

            <button
              className="mt-2 w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
              onClick={() => setSelectedMember(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ===================== MEMBER CARD COMPONENT =====================
function MemberCard({ member, onClick }: { member: Member; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:shadow-lg transition-all"
    >
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${
          member.isAdmin ? "bg-red-500" : "bg-blue-500"
        }`}
      >
        <FaUser size={16} />
      </div>

      <div className="flex-1">
        <div className="flex flex-col">
          <h4 className="font-semibold text-white">{member.username}</h4>
          <p className="text-sm text-purple-300">{member.email}</p>
        </div>

        {member.isAdmin && (
          <span className="text-xs text-red-300 font-semibold mt-1">Admin</span>
        )}

        <div className="flex gap-3 mt-2">
          <a href="#" className="text-blue-400 hover:text-blue-600" title="Twitter">
            <FaTwitter size={16} />
          </a>
          <a href="#" className="text-blue-400 hover:text-blue-600" title="LinkedIn">
            <FaLinkedin size={16} />
          </a>
          <a href="#" className="text-blue-400 hover:text-blue-600" title="GitHub">
            <FaGithub size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}

// ===================== STAT COMPONENT =====================
function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white/5 rounded-lg p-4">
      <div className="text-sm text-purple-300">{label}</div>
      <div className="text-lg font-semibold">
        {typeof value === "string" ? new Date(value).toLocaleDateString() : value}
      </div>
    </div>
  );
}
