"use client";

import { useState, useRef, useEffect } from "react";
import getUserData from "@/lib/auth";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Project {
  _id: string;
  title: string;
}

interface Message {
  _id: string;
  content: string;
  sender?: { username?: string };
  createdAt: string;
}

export default function Header({ setIsOpen }: { setIsOpen: (val: boolean) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [alertNewMsg, setAlertNewMsg] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const notifRef = useRef<HTMLDivElement | null>(null);
  const chatRef = useRef<HTMLDivElement | null>(null);

  const router = useRouter();
  const { user } = getUserData();

  // =========================
  // Click outside to close
  // =========================
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (chatRef.current && !chatRef.current.contains(e.target as Node)) setChatOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // =========================
  // Notifications
  // =========================
  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://localhost:5000/notification/my", { withCredentials: true });
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.notifications.filter((n: any) => !n.isRead).length);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  const handleNotifClick = () => {
    setNotifOpen(!notifOpen);
    if (!notifOpen) fetchNotifications();
  };

  const markAsRead = async (id: string) => {
    try {
      await axios.put(`http://localhost:5000/notification/read/${id}`, {}, { withCredentials: true });
      setNotifications(prev => prev.map(n => (n._id === id ? { ...n, isRead: true } : n)));
      setUnreadCount(prev => Math.max(prev - 1, 0));
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put("http://localhost:5000/notification/read-all", {}, { withCredentials: true });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  // =========================
  // Chat functions
  // =========================
  const fetchProjects = async () => {
    try {
      const res = await axios.get("http://localhost:5000/project/my-projects", { withCredentials: true });
      const joined = await axios.get("http://localhost:5000/project/joined-projects", { withCredentials: true });
      setProjects([...res.data.projects, ...joined.data.projects]);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    }
  };

  const fetchMessages = async (projectId: string) => {
    try {
      const res = await axios.get(`http://localhost:5000/messages/${projectId}`, { withCredentials: true });
      setMessages(res.data.messages);
      setAlertNewMsg(false);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

  const handleChatClick = () => {
    setChatOpen(!chatOpen);
    if (!chatOpen) fetchProjects();
  };

  const selectProject = (project: Project) => {
    setSelectedProject(project);
    fetchMessages(project._id);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedProject) return;
    try {
      const res = await axios.post(
        "http://localhost:5000/messages/send",
        { projectId: selectedProject._id, content: newMessage },
        { withCredentials: true }
      );

      // Add current user's username manually
      const newMsgWithSender = {
        ...res.data.data,
        sender: { username: user?.username || "Unknown" },
      };

      setMessages(prev => [...prev, newMsgWithSender]);
      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  // Polling for new messages
  useEffect(() => {
    if (!selectedProject) return;
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`http://localhost:5000/messages/${selectedProject._id}`, { withCredentials: true });
        if (res.data.messages.length > messages.length) {
          setMessages(res.data.messages);
          setAlertNewMsg(true);
        }
      } catch (err) {
        console.error(err);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [selectedProject, messages]);

  // =========================
  // Logout
  // =========================
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/auth/logout", {}, { withCredentials: true });
      localStorage.clear();
      sessionStorage.clear();
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // =========================
  // JSX
  // =========================
  return (
    <header className="sticky top-0 z-50 glass-effect border-b border-white/10 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* SEARCH BAR */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-purple-300"></i>
            <input
              type="text"
              placeholder="Search tasks, projects, or people..."
              className="w-full pl-12 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 transition-all duration-300 focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400"
            />
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex items-center space-x-4 ml-6">
          {/* Chat Icon */}
          <div className="relative" ref={chatRef}>
            <button
              onClick={handleChatClick}
              className="relative w-10 h-10 glass-effect rounded-lg flex items-center justify-center hover:bg-white/20 transition-all duration-300"
            >
              <i className="fas fa-comment"></i>
              {alertNewMsg && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-semibold text-white animate-pulse"></span>
              )}
            </button>

         {chatOpen && (
  <div
    className="absolute right-0 mt-2 w-[700px] h-[500px] flex border border-white/20 rounded-lg overflow-hidden z-[9999]"
    style={{ backgroundColor: "#2c0468ff" }}
  >
    {/* Left: Projects */}
    <div className="w-1/3 border-r border-white/20 overflow-y-auto">
      {projects.length === 0 && (
        <p className="text-center text-white text-sm mt-4">No projects</p>
      )}
      {projects.map((p, idx) => (
        <div
          key={p._id || idx}
          className={`px-4 py-3 cursor-pointer hover:bg-purple-700 ${
            selectedProject?._id === p._id ? "bg-purple-600 font-semibold" : ""
          }`}
          onClick={() => selectProject(p)}
        >
          {p.title}
        </div>
      ))}
    </div>

    {/* Right: Chat */}
    <div className="w-2/3 flex flex-col justify-between p-4">
      <div className="overflow-y-auto flex-1 mb-2 space-y-2">
        {messages.map((m, idx) => {
          const isOwn = m.sender?.username === user?.username; // apna message right me
          return (
            <div
              key={m._id || idx}
              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-2xl break-words ${
                  isOwn
                    ? "bg-green-500 text-white rounded-br-none"
                    : "bg-purple-700 text-white rounded-bl-none"
                }`}
              >
                {!isOwn && (
                  <p className="text-xs text-yellow-300 font-semibold mb-1">
                    {m.sender?.username || "Unknown"}
                  </p>
                )}
                <p>{m.content || ""}</p>
                <span className="text-xs text-gray-300 block mt-1 text-right">
                  {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="flex mt-2">
        <input
          type="text"
          className="flex-1 px-3 py-2 rounded-l-lg bg-white/10 text-white placeholder-purple-300"
          placeholder="Type a message..."
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="px-4 bg-yellow-400 text-purple-900 rounded-r-lg hover:shadow-lg"
        >
          Send
        </button>
      </div>
    </div>
  </div>
)}

          </div>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={handleNotifClick}
              className="relative w-10 h-10 glass-effect rounded-lg flex items-center justify-center hover:bg-white/20 transition-all duration-300"
            >
              <i className="fas fa-bell"></i>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-semibold text-white animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div
                className="absolute right-0 mt-2 w-96 max-h-96 overflow-y-auto rounded-lg shadow-2xl border border-white/20 z-[9999]"
                style={{ backgroundColor: "#2c0468ff" }}
              >
                {notifications.length > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="w-full text-left px-4 py-2 text-sm text-yellow-400 hover:bg-purple-800 transition-colors font-medium"
                  >
                    Mark all as read
                  </button>
                )}
                {notifications.length === 0 && (
                  <p className="text-center text-sm text-gray-300 py-4">No notifications</p>
                )}
                {notifications.map((n, idx) => (
                  <div
                    key={n._id || idx}
                    className={`flex flex-col px-4 py-3 cursor-pointer rounded-lg mb-1 transition-colors ${
                      !n.isRead ? "bg-blue-900 font-semibold" : "bg-purple-700"
                    }`}
                    onClick={() => markAsRead(n._id)}
                  >
                    <p className="text-sm text-white">{n.message}</p>
                    <span className="text-xs text-gray-300 mt-1">
                      {new Date(n.createdAt).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* USER MENU DROPDOWN */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="avatar-circle bg-gradient-to-br from-yellow-400 to-amber-500 text-purple-900 hover:shadow-lg transition-all duration-300"
            >
              {user?.username?.slice(0, 1).toUpperCase() || "U"}
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 glass-effect rounded-lg shadow-xl py-2 animate-fade-in z-[9999]" style={{ backgroundColor: "#2c0468ff" }}>
                {/* USER INFO */}
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="font-semibold text-white">{user?.username || "Unknown"}</p>
                  <p className="text-xs text-purple-300">{user?.email || ""}</p>
                </div>
                <a className="block px-4 py-2 hover:bg-white/10 transition-colors">
                  <i className="fas fa-user mr-2"></i>Profile
                </a>
                <a className="block px-4 py-2 hover:bg-white/10 transition-colors">
                  <i className="fas fa-cog mr-2"></i>Settings
                </a>
                <hr className="border-white/10 my-2" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-white/10 transition-colors text-red-400 font-semibold"
                >
                  <i className="fas fa-sign-out-alt mr-2"></i>Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
