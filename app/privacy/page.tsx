"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#6720a1]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl overflow-y-auto max-h-[90vh]"
      >
        {/* Back Link */}
        <Link
          href="/signup"
          className="text-white mb-4 inline-block hover:underline"
        >
          ← Back to Home
        </Link>

        <h1 className="text-3xl font-bold text-yellow-400 mb-4">Privacy Policy</h1>

        <p className="text-gray-100 mb-2">
          This Privacy Policy describes how TaskHive collects, uses, and protects your data.
        </p>

        <ol className="list-decimal list-inside text-gray-100 space-y-2">
          <li><strong>Information We Collect:</strong> Account information (name, email, password) and usage data (tasks, activity logs, preferences).</li>
          <li><strong>How We Use Information:</strong> To provide and improve TaskHive services, communicate with users, and analyze usage for performance improvements.</li>
          <li><strong>Data Protection:</strong> We use industry-standard security measures. We do not share personal information without consent, except as required by law.</li>
          <li><strong>Cookies and Tracking:</strong> TaskHive may use cookies or similar technologies to enhance the user experience.</li>
          <li><strong>User Rights:</strong> Users can update or delete their account information and request a copy of their data.</li>
          <li><strong>Policy Updates:</strong> This Privacy Policy may change over time. Changes will be notified within the app or via email.</li>
        </ol>
      </motion.div>
    </div>
  );
}
