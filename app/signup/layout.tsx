// app/signup/layout.tsx
import React from "react";

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-fuchsia-800">
      {children}
    </div>
  );
}
