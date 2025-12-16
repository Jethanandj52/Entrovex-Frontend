// context/Global.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Task } from "@/components/dashboard/modals/TaskModal";

interface ModalContextType {
  isInviteModalOpen: boolean;
  openInviteModal: () => void;
  closeInviteModal: () => void;

  isTaskModalOpen: boolean;
  openTaskModal: (task?: Partial<Task>) => void;
  closeTaskModal: () => void;
  taskModalData: Partial<Task> | null;

  isCreateProjectModalOpen: boolean;
  openCreateProjectModal: () => void;
  closeCreateProjectModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] =
    useState(false);
  const [taskModalData, setTaskModalData] = useState<Partial<Task> | null>(
    null
  );

  const openInviteModal = () => {
    setIsInviteModalOpen(true);
  };

  const closeInviteModal = () => {
    setIsInviteModalOpen(false);
  };

  const openTaskModal = (task?: Partial<Task>) => {
    setTaskModalData(task || null);
    setIsTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setTaskModalData(null);
  };

  const openCreateProjectModal = () => {
    setIsCreateProjectModalOpen(true);
  };

  const closeCreateProjectModal = () => {
    setIsCreateProjectModalOpen(false);
  };

  const value = {
    isInviteModalOpen,
    openInviteModal,
    closeInviteModal,

    isTaskModalOpen,
    openTaskModal,
    closeTaskModal,
    taskModalData,

    isCreateProjectModalOpen,
    openCreateProjectModal,
    closeCreateProjectModal,
  };

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
}

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
