import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, PlusCircle } from 'lucide-react';

export default function EmptyState({ title = "No Reports Yet", message = "You haven't reported any civic problems in your area.", onAction }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-10 rounded-2xl bg-white border border-slate-200 text-center max-w-md mx-auto my-8 shadow-xs"
    >
      <motion.div 
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="w-16 h-16 rounded-2xl bg-[#8ACFF8]/20 flex items-center justify-center text-[#006199] mx-auto mb-4"
      >
        <ShieldAlert className="w-8 h-8" />
      </motion.div>

      <h3 className="text-lg font-bold text-slate-900 mb-1.5">{title}</h3>
      <p className="text-xs text-slate-500 max-w-xs mx-auto mb-6 leading-relaxed">
        {message}
      </p>

      {onAction && (
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onAction}
          className="px-5 py-2.5 rounded-xl bg-[#FFD444] hover:bg-[#ffe066] text-[#003F66] font-bold text-xs flex items-center justify-center space-x-2 mx-auto shadow-md shadow-[#FFD444]/30"
        >
          <PlusCircle className="w-4 h-4 text-[#006199]" />
          <span>Report Your First Problem</span>
        </motion.button>
      )}
    </motion.div>
  );
}
