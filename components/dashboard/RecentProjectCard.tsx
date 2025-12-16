"use client";

import Link from "next/link";

interface Member {
  initials: string;
}

interface Props {
  projectId: string;
  title: string;
  tasks: number;
  completed: number;
  updated: string;
  members: Member[];
}

export default function RecentProjectCard({
  projectId,
  title,
  tasks,
  completed,
  updated,
  members,
}: Props) {
  const progress =
    tasks > 0 ? Math.round((completed / tasks) * 100) : 0;

  const handleClick = () => {
    localStorage.setItem("currentProjectId", projectId);
  };

  return (
    <Link
      href={`/dashboard/${projectId}/project`}
      onClick={handleClick}   // ✅ ID SAVE HERE
    >
      <div
        className="group relative overflow-hidden
        rounded-2xl p-5 mb-2 cursor-pointer
        bg-white/5 backdrop-blur-md
        border border-white/10
        hover:border-purple-500/40
        hover:shadow-xl hover:shadow-purple-900/30
        transition-all duration-300"
      >
        {/* HEADER */}
        <div className="relative flex justify-between items-start">
          <h3 className="text-lg font-semibold tracking-wide">
            {title}
          </h3>
          <span className="text-xs text-purple-300">
            Updated {updated}
          </span>
        </div>

        <p className="relative text-sm text-purple-300 mt-1">
          {completed} / {tasks} Tasks Completed
        </p>

        {/* PROGRESS */}
        <div className="relative mt-3">
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="absolute right-0 -top-5 text-xs text-green-400">
            {progress}%
          </span>
        </div>

        {/* FOOTER */}
        <div className="relative flex justify-between items-center mt-4">
          <div className="flex -space-x-2">
            {members.slice(0, 4).map((m, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full
                bg-gradient-to-br from-blue-400 to-blue-600
                text-white text-xs font-semibold
                flex items-center justify-center
                border-2 border-purple-900"
              >
                {m.initials}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-1 text-purple-300">
            <span className="text-xs">Open</span>
            <i className="fas fa-arrow-right text-sm"></i>
          </div>
        </div>
      </div>
    </Link>
  );
}
