"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import getUserData from "@/lib/auth";
import { FiPhone, FiVideo, FiPaperclip, FiMic, FiX } from "react-icons/fi";

interface Project {
  _id: string;
  title: string;
  color?: string;
  description?: string;
  createdBy?: { _id: string; username: string };
  members?: { username: string }[];
}

interface Message {
  _id: string;
  content: string;
  sender?: { username?: string };
  createdAt: string;
}

export default function MessagesPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const { user } = getUserData();
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // =========================
  // Fetch all projects (owned + joined)
  // =========================
  const fetchProjects = async () => {
    try {
      const res = await axios.get("http://localhost:5000/project/my-projects", { withCredentials: true });
      const joined = await axios.get("http://localhost:5000/project/joined-projects", { withCredentials: true });

      const allProjects = [...res.data.projects, ...joined.data.projects].map(p => ({
        ...p,
        color: p.color || "#4ade80",
      }));

      setProjects(allProjects);
    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // Fetch messages for selected project
  // =========================
  const fetchMessages = async (projectId: string) => {
    try {
      const res = await axios.get(`http://localhost:5000/messages/${projectId}`, { withCredentials: true });
      setMessages(res.data.messages);
      scrollToBottom();
    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // Select project and fetch messages
  // =========================
  const selectProject = (project: Project) => {
    setSelectedProject(project);
    fetchMessages(project._id);
  };

  // =========================
  // Fetch project full details (for modal)
  // =========================
  const fetchProjectDetails = async (projectId: string) => {
    try {
      const res = await axios.get(`http://localhost:5000/project/details/${projectId}`, { withCredentials: true });
      if (res.data.success) {
        const projectData = res.data.project;
        setSelectedProject({
          _id: projectData._id,
          title: projectData.title,
          color: projectData.color || "#4ade80",
          description: projectData.description,
          createdBy: projectData.createdBy,
          members: projectData.teamMembers,
        });
        setShowGroupInfo(true);
      }
    } catch (err) {
      console.error("Error fetching project details:", err);
    }
  };

  // =========================
  // Send message
  // =========================
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedProject) return;
    try {
      const res = await axios.post(
        "http://localhost:5000/messages/send",
        { projectId: selectedProject._id, content: newMessage },
        { withCredentials: true }
      );

      const newMsgWithSender = {
        ...res.data.data,
        sender: { username: user?.username || "Unknown" },
      };

      setMessages(prev => [...prev, newMsgWithSender]);
      setNewMessage("");
      scrollToBottom();
    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // Auto-refresh messages
  // =========================
  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (!selectedProject) return;
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`http://localhost:5000/messages/${selectedProject._id}`, { withCredentials: true });
        if (res.data.messages.length > messages.length) {
          setMessages(res.data.messages);
          scrollToBottom();
        }
      } catch (err) {
        console.error(err);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [selectedProject, messages]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const chatBg = selectedProject?.color || "#1f1f2e";

  return (
    <div className="flex h-screen text-gray-900 bg-gray-100 relative">
      {/* =========================
          Left Sidebar
      ========================= */}
      <div className="w-1/3 bg-purple-600 text-white border-r border-gray-300 flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-gray-300">Projects</div>
        <div className="flex-1 overflow-y-auto">
          {projects.length === 0 && <p className="text-center mt-4 text-gray-400">No groups</p>}
          {projects.map((p) => (
            <div
              key={p._id}
              className={`px-4 py-3 cursor-pointer hover:bg-purple-500 flex items-center space-x-3 transition-colors ${
                selectedProject?._id === p._id ? "bg-purple-900 font-semibold" : ""
              }`}
            >
              <div
                className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold"
                onClick={() => fetchProjectDetails(p._id)}
              >
                {p.title[0]}
              </div>
              <span onClick={() => selectProject(p)}>{p.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* =========================
          Right Chat Area
      ========================= */}
      <div className="flex-1 flex flex-col">
        {!selectedProject ? (
          // Landing view when no group is selected
          <div className="flex-1 bg-purple-900 text-white flex items-center justify-center">
            <div className="text-center text-gray-200 ">
              <h2 className="text-2xl font-semibold mb-2">Select a group to start chatting</h2>
              <p className="text-gray-400">All your projects will appear on the left sidebar</p>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-purple-900 text-white border-b border-gray-300 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-semibold text-lg">{selectedProject.title}</span>
                <span className="text-sm text-gray-200">
                  Created by: {selectedProject.createdBy?.username || "Unknown"}
                </span>
              </div>
              <div className="flex space-x-3 text-white">
                <button className="p-2 rounded-full hover:bg-gray-600 transition-colors">
                  <FiPhone className="text-white h-5 w-5" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-600 transition-colors">
                  <FiVideo className="text-white h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3" style={{ backgroundColor: "#1c1d65ff" }}>
              {messages.map((m) => {
                const isOwn = m.sender?.username === user?.username;
                return (
                  <div key={m._id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[70%] px-4 py-2 rounded-2xl break-words relative flex flex-col text-white`}
                      style={{ backgroundColor: isOwn ? "#0a8527ff" : "#9242d0ff" }}
                    >
                      {!isOwn && <span className="text-xs text-white font-semibold mb-1">{m.sender?.username}</span>}
                      <span>{m.content}</span>
                      <span className="text-xs text-gray-100 mt-1 self-end">
                        {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef}></div>
            </div>

            {/* Input Box */}
            <div className="p-4 border-t border-gray-300 flex items-center space-x-2 bg-white">
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <FiPaperclip className="text-gray-700 h-5 w-5" />
              </button>

              <input
                type="text"
                className="flex-1 px-4 py-2 rounded-full bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />

              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <FiMic className="text-gray-700 h-5 w-5" />
              </button>

              <button
                onClick={sendMessage}
                className="px-4 py-2 bg-green-500 rounded-full hover:bg-green-600 transition-colors font-semibold text-white"
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>

      {/* =========================
          Group Info Modal
      ========================= */}
      {showGroupInfo && selectedProject && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-1/3 p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-700 hover:text-gray-900"
              onClick={() => setShowGroupInfo(false)}
            >
              <FiX className="h-5 w-5" />
            </button>

            <h2 className="text-xl font-bold mb-1">{selectedProject.title}</h2>
            <p className="text-sm text-gray-500 mb-3">
              Created by: <span className="font-semibold">{selectedProject.createdBy?.username || "Unknown"}</span>
            </p>
            <p className="text-gray-700 mb-4">{selectedProject.description || "No description available"}</p>

            <p className="mb-2 font-semibold">Members:</p>
            <ul className="list-disc pl-5 text-gray-700">
              {selectedProject.members?.length
                ? selectedProject.members.map((m, i) => <li key={i}>{m.username}</li>)
                : <li>No members info</li>}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
