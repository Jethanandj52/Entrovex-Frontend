
// app/page.tsx
import Link from "next/link";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";

const queryClient = new QueryClient();
export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#6720a1]">
      <h1 className="text-4xl text-yellow-400 font-bold mb-4">Welcome to Task Hive</h1>
      <p className="mb-6 text-gray-100">Log in to your Task Hive account</p>
      <Link
        href="/login"
        className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transform transition-transform duration-200 hover:scale-105"
      >
        Go to Login
      </Link>
    </div>
  );
}
