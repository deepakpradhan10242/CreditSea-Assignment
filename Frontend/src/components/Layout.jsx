import { motion } from 'framer-motion';

export default function Layout({ children }) {
  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans text-gray-800 flex flex-col"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Main content area */}
      <main className="flex-grow w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-700 to-indigo-600 text-white text-center py-6 mt-8 shadow-inner">
        <p className="text-sm tracking-wide">
          © {new Date().getFullYear()} <span className="font-semibold">CreditSea</span> — All rights reserved.
        </p>
      </footer>
    </motion.div>
  );
}
