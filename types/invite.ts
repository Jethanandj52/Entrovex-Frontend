// types/invite.ts
export interface InviteState {
  email: string;
  role: "Viewer" | "Collaborator" | "Admin";
  message: string;
}
