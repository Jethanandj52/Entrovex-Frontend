"use client";
import Header from "@/components/dashboard/header";
import CreateProjectModal from "@/components/dashboard/modals/CreateprojectModal";
import InviteModal from "@/components/dashboard/modals/InviteModal";
import Sidebar from "@/components/dashboard/sidebar";
import { InviteState } from "@/types/invite";
import { CreateProjectInput } from "@/types/project";
import { useState, useEffect } from "react";
import { ModalProvider, useModal } from "@/context/Global";
import TaskDetailModal, { Task } from "@/components/dashboard/modals/TaskModal";
import { useProjects } from "@/lib/hooks/useProject";
import { toast } from "react-toastify";
import { useTasks } from "@/lib/hooks/useTasks";
import { useParams } from "next/navigation";
import useUserData from "@/lib/auth";

// Inner component that uses the modal context
function DashboardContent({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUserData();

  const [project, setProject] = useState<CreateProjectInput>({
    name: "",
    description: "",
    color: "",
    members: "",
  });
  const [invite, setInvite] = useState<InviteState>({
    email: "",
    role: "Viewer",
    message: "",
  });
  const [currentTask, setCurrentTask] = useState<Task | null>(null);

  const params = useParams();
  const projectId = params.id as string;

  // Get modal state from context
  const {
    isInviteModalOpen,
    closeInviteModal,
    isTaskModalOpen,
    closeTaskModal,
    taskModalData, // Assuming your context provides task data
  } = useModal();

  // Get projects and tasks hooks
  const { createProject, updateProject } = useProjects();
  const {
    createTask,
    updateTask,
    isLoading: taskLoading,
  } = useTasks(projectId);

  // Initialize task modal data when it opens
  useEffect(() => {
    if (isTaskModalOpen && taskModalData) {
      if (taskModalData._id) {
        // Editing existing task
        setCurrentTask(taskModalData);
      } else {
        // Creating new task
        setCurrentTask({
          _id: "",
          title: taskModalData.title || "",
          status: taskModalData.status || "to-do",
          priority: taskModalData.priority || "normal",
          dueDate: taskModalData.dueDate || new Date().toISOString(),
          description: taskModalData.description || "",
          projectId: projectId,
          tags: taskModalData.tags || [],
          assignees: taskModalData.assignees || [],
        });
      }
    } else {
      setCurrentTask(null);
    }
  }, [isTaskModalOpen, taskModalData, projectId]);

  const handleCreateProject = () => {
    createProject.mutate(project, {
      onSuccess: () => {
        setProject({
          name: "",
          description: "",
          color: "#3B82F6",
          members: "",
        });
        setIsOpen(false);
        toast.success("Project created successfully!");
      },
      onError: (error) => {
        toast.error(`Error: ${error.message}`);
      },
    });
  };

  const handleInvite = () => {
    // Here you would make an API call to invite user
    console.log("Inviting:", invite);
    closeInviteModal();
    toast.success("Invitation sent!");
  };

  const handleSaveTask = (updatedTask: Task & { comment?: string }) => {
    const { comment, ...taskData } = updatedTask;
    console.log(taskData);

    if (taskData._id) {
      updateTask.mutate(
        {
          id: taskData._id,
          data: {
            title: taskData.title,
            description: taskData.description,
            status: taskData.status,
            priority: taskData.priority,
            dueDate: taskData.dueDate,
            assignedTo: taskData.assignedTo || user._id,
            tags: taskData.tags,
          },
        },
        {
          onSuccess: () => {
            closeTaskModal();
            toast.success("Task updated successfully!");
          },
          onError: (error) => {
            toast.error(`Error updating task: ${error.message}`);
          },
        }
      );
    } else {
      // Create new task
      createTask.mutate(
        {
          title: taskData.title,
          description: taskData.description,
          status: taskData.status,
          priority: taskData.priority,
          dueDate: taskData.dueDate,
          assignedTo: taskData.assignedTo || user._id,
          projectId: projectId,
          tags: taskData.tags || [],
        },
        {
          onSuccess: () => {
            closeTaskModal();
            toast.success("Task created successfully!");
          },
          onError: (error) => {
            toast.error(`Error creating task: ${error.message}`);
          },
        }
      );
    }
  };

  // Default task data for new tasks
  const getDefaultTaskData = (): Task => ({
    title: "",
    status: "to-do",
    priority: "normal",
    dueDate: new Date().toISOString(),
    description: "",
    projectId: projectId,
    tags: [],
    assignees: [],
  });


  return (
    <div className="flex">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        setIsOpen={setIsOpen}
      />

      <CreateProjectModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        project={project}
        setProject={setProject}
        onSubmit={handleCreateProject}
        isLoading={createProject.isLoading}
      />

      <InviteModal
        isOpen={isInviteModalOpen}
        onClose={closeInviteModal}
        invite={invite}
        setInvite={setInvite}
        onSubmit={handleInvite}
      />

      {isTaskModalOpen && currentTask && (
        <TaskDetailModal
          isOpen={isTaskModalOpen}
          onClose={closeTaskModal}
          task={currentTask}
          onSave={handleSaveTask}
          projectId={projectId}
          isLoading={taskLoading}
          // Pass available users if you have them
          // availableUsers={availableUsers}
        />
      )}

      <div
        className={`flex-1 ${
          collapsed ? "ml-0 sm:ml-20" : "ml-[255px]"
        } transition-all duration-300`}
      >
        <div className="flex-1 overflow-y-auto">
          <Header setIsOpen={setIsOpen} />
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ModalProvider>
      <div className="bg-linear-to-br from-purple-900 via-purple-800 to-indigo-900 text-white relative overflow-x-hidden overflow-y-auto h-auto min-h-screen">
        <DashboardContent>{children}</DashboardContent>
      </div>
    </ModalProvider>
  );
}
