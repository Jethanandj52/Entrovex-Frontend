"use client";

import { useState } from "react";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";

interface InvitationCardProps {
  _id: string; // project ID
  invitedByName: string; // invited by username
  invitedByEmail?: string; // invited by email
  projectTitle: string; // project title
  projectDescription: string; // project description
  time: string; // formatted invitation time
  avatarLetter: string; // first letter of inviter
  avatarGradient: string;
}

export default function InvitationCard({
  _id,
  invitedByName,
  invitedByEmail,
  projectTitle,
  projectDescription,
  time,
  avatarLetter,
  avatarGradient,
}: InvitationCardProps) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const handleResponse = async (response: "accepted" | "rejected") => {
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/project/respond-invite",
        { projectId: _id, response },
        { withCredentials: true }
      );

      if (!res.data.success) throw new Error(res.data.message || "Failed");

      queryClient.invalidateQueries({ queryKey: ["my-invitations"] });
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Server error, try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white/5 p-4 rounded-xl">
      {/* LEFT: Invited By */}
      <div className="flex items-center space-x-3 mb-2 md:mb-0">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${avatarGradient}`}
        >
          {avatarLetter}
        </div>
        <div>
          <p className="text-sm text-purple-300">Invited by:</p>
          <p className="font-semibold text-white">{invitedByName}</p>
          {invitedByEmail && <p className="text-purple-400 text-xs">{invitedByEmail}</p>}
        </div>
      </div>

      {/* CENTER: Project Details */}
      <div className="flex-1 px-4 mb-2 md:mb-0">
        <p className="font-semibold text-white">{projectTitle}</p>
        <p className="text-purple-300 text-sm">{projectDescription}</p>
        <p className="text-purple-400 text-xs mt-1">{time}</p>
      </div>

      {/* RIGHT: Action Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={() => handleResponse("accepted")}
          disabled={loading}
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          Accept
        </button>
        <button
          onClick={() => handleResponse("rejected")}
          disabled={loading}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
        >
          Reject
        </button>
      </div>
    </div>
  );
}
