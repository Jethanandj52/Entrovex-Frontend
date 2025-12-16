"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { InviteState } from "@/types/invite";

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InviteModal({ isOpen, onClose }: InviteModalProps) {
  const [invite, setInvite] = useState<InviteState>({
    email: "",
    role: "Viewer",
    message: "",
  });

  const [projectId, setProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Get projectId from localStorage whenever modal opens
  useEffect(() => {
    if (isOpen) {
      const storedId = localStorage.getItem("currentProjectId");
      if (storedId) setProjectId(storedId);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!invite.email) {
      setError("Email is required");
      return;
    }

    if (!projectId) {
      setError("Project ID not found.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const { data } = await axios.post(
        "http://localhost:5000/project/invite",
        {
          projectId,
          email: invite.email,
          role: invite.role,
          message: invite.message,
        },
        { withCredentials: true }
      );

      if (!data.success) {
        setError(data.message || "Failed to send invitation");
      } else {
        setSuccess("Invitation sent successfully!");
        setInvite({ email: "", role: "Viewer", message: "" });
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Server error, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-effect rounded-3xl max-w-2xl w-full">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Invite People</h2>
          <button onClick={onClose} className="text-purple-300 hover:text-white cursor-pointer">
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {error && <p className="text-red-400">{error}</p>}
          {success && <p className="text-green-400">{success}</p>}

          <div>
            <label className="block text-sm font-semibold mb-2">Email Address</label>
            <input
              type="email"
              value={invite.email}
              onChange={(e) => setInvite({ ...invite, email: e.target.value })}
              placeholder="colleague@example.com"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Role</label>
            <select
              value={invite.role}
              onChange={(e) => setInvite({ ...invite, role: e.target.value as InviteState["role"] })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
            >
              <option value="Viewer">Viewer</option>
              <option value="Collaborator">Collaborator</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Message (Optional)</label>
            <textarea
              rows={3}
              value={invite.message}
              onChange={(e) => setInvite({ ...invite, message: e.target.value })}
              placeholder="Add a personal message..."
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 flex justify-end space-x-3">
          <button onClick={onClose} className="px-6 py-2.5 glass-effect rounded-lg hover:bg-white/20 cursor-pointer">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-purple-900 rounded-lg font-semibold hover:shadow-lg cursor-pointer"
          >
            {loading ? "Sending..." : "Send Invitation"}
          </button>
        </div>
      </div>
    </div>
  );
}
