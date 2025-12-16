"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import InvitationCard from "./InvitationCard";

interface Invitation {
  _id: string;
  invitedByName: string;
  invitedByEmail?: string;
  projectTitle: string;
  projectDescription: string;
  time: string;
  avatarLetter: string;
  avatarGradient: string;
}

export default function InvitationList() {
  const { data, isLoading, isError, refetch } = useQuery<Invitation[]>({
    queryKey: ["my-invitations"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:5000/project/my-invitations", {
        withCredentials: true,
      });

      if (!res.data.success) throw new Error(res.data.message || "Failed to fetch invitations");

      return res.data.invitations.map((inv: any) => ({
        _id: inv._id,
        invitedByName: inv.createdBy?.username || "Unknown",
        invitedByEmail: inv.createdBy?.email,
        projectTitle: inv.title,
        projectDescription: inv.description || "",
        time: new Date(inv.updatedAt || inv.createdAt).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        avatarLetter: (inv.createdBy?.username || "U").charAt(0).toUpperCase(),
        avatarGradient: "bg-gradient-to-br from-blue-400 to-blue-600",
      }));
    },
  });

  if (isLoading)
    return <p className="text-purple-300 animate-pulse p-6">Loading invitations...</p>;

  if (isError)
    return (
      <div className="p-6 text-red-400">
        Failed to load invitations.
        <button
          onClick={() => refetch()}
          className="ml-2 px-3 py-1 bg-purple-600 rounded text-white"
        >
          Retry
        </button>
      </div>
    );

  if (!data || data.length === 0)
    return <p className="text-purple-300 p-6">No invitations found.</p>;

  return (
    <div id="invitations" className="view-section active p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Invitations</h1>
        <p className="text-purple-300">Manage your project invitations.</p>
      </div>

      <div className="glass-effect rounded-2xl p-6 space-y-4">
        {data.map((item) => (
          <InvitationCard key={item._id} {...item} />
        ))}
      </div>
    </div>
  );
}
