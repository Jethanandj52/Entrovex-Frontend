"use client";

import React from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import KanbanTaskCard from "./KanbanTaskCard";
import { Task } from "@/types/task";

type ColumnProps = {
  id: string;
  title: string;
  tasks: Task[];
  color: string;
  projectId: string; // ✅ pass projectId
  openTaskModal: (task?: Task, status?: string) => void;
};

export default function Column({
  id,
  title,
  tasks,
  color,
  projectId,
  openTaskModal,
}: ColumnProps) {
  const handleAddTask = () => {
    openTaskModal(undefined, id);
  };

  const handleTaskClick = (task: Task) => {
    openTaskModal(task);
  };

  return (
    <Droppable droppableId={id}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`bg-white/5 border rounded-2xl p-4 min-h-[300px] transition-all duration-200 ${
            snapshot.isDraggingOver
              ? "bg-white/10 border-yellow-500/50 shadow-lg"
              : "border-white/10"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${color}`}></span>
              <h3 className="font-semibold text-white">{title}</h3>
              <span className="text-xs text-purple-300 bg-white/10 px-2 py-0.5 rounded">
                {tasks.length}
              </span>
            </div>
            <button
              onClick={handleAddTask}
              className="text-yellow-400 hover:text-yellow-300 hover:scale-110 transition-transform"
              title="Add task"
            >
              <i className="fas fa-plus cursor-pointer"></i>
            </button>
          </div>

          <div className="space-y-3">
            {tasks.map((task, index) => (
              <Draggable key={task._id} draggableId={task._id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`${
                      snapshot.isDragging ? "dragging opacity-50" : ""
                    } transition-opacity duration-200`}
                    style={provided.draggableProps.style}
                  >
                    <KanbanTaskCard
                      {...task}
                      index={index}
                      projectId={projectId} // ✅ pass projectId to card
                      onClick={() => handleTaskClick(task)}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>

          {tasks.length === 0 && !snapshot.isDraggingOver && (
            <div
              className="h-full flex flex-col items-center justify-center mt-8 cursor-pointer"
              onClick={handleAddTask}
            >
              <div className="text-purple-300/50 text-sm mb-2">No tasks yet</div>
              <button className="text-yellow-400 hover:text-yellow-300 text-sm">
                + Add first task
              </button>
            </div>
          )}
        </div>
      )}
    </Droppable>
  );
}
