"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function TermsPage() {
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
          href="signup"
          className="text-white mb-4 inline-block hover:underline"
        >
          ← Back to Home
        </Link>

        <h1 className="text-3xl font-bold text-yellow-400 mb-4">Terms of Service</h1>

        <p className="text-gray-100 mb-2">
          By using TaskHive, you agree to follow these Terms of Service.
        </p>

        <ol className="list-decimal list-inside text-gray-100 space-y-2">
          <li><strong>Account Responsibility:</strong> Users must provide accurate information and keep their account secure. You are responsible for all activity under your account.</li>
          <li><strong>Use of TaskHive:</strong> TaskHive is intended for task management and productivity. You may not use it for illegal or harmful activities.</li>
          <li><strong>Prohibited Actions:</strong> Unauthorized access, uploading malicious content, spamming, or misuse of the platform is prohibited.</li>
          <li><strong>Content Ownership:</strong> You retain ownership of the tasks and content you create. TaskHive may use anonymized data to improve the service.</li>
          <li><strong>Termination:</strong> TaskHive may suspend or terminate accounts that violate these Terms.</li>
          <li><strong>Changes to Terms:</strong> TaskHive may update these Terms, and continued use constitutes acceptance.</li>
        </ol>
      </motion.div>
    </div>
  );
}
