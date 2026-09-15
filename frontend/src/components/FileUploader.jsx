import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, Image as ImageIcon, Video, Trash2, CheckCircle, File } from 'lucide-react';

export default function FileUploader({ files = [], onFilesChange }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleSimulatedAdd = () => {
    const samplePhotos = [
      { id: Date.now() + 1, name: 'pothole_evidence_01.jpg', size: '2.4 MB', type: 'image', url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop' },
      { id: Date.now() + 2, name: 'street_perspective.jpg', size: '1.8 MB', type: 'image', url: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=800&auto=format&fit=crop' }
    ];
    onFilesChange([...files, ...samplePhotos]);
  };

  const handleRemove = (id) => {
    onFilesChange(files.filter(f => f.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* Drag and Drop Dropzone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleSimulatedAdd(); }}
        onClick={handleSimulatedAdd}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragging 
            ? "border-[#006199] bg-[#8ACFF8]/15 scale-[0.99]" 
            : "border-slate-200 hover:border-[#006199]/50 bg-slate-50/50 hover:bg-slate-50"
        }`}
      >
        <div className="w-14 h-14 mx-auto rounded-full bg-[#8ACFF8]/20 flex items-center justify-center text-[#006199] mb-3">
          <UploadCloud className="w-7 h-7" />
        </div>
        <h4 className="text-base font-bold text-slate-800 mb-1">
          Upload Evidence (Photos or Videos)
        </h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mb-3">
          Drag and drop files here, or click to browse. Max size 15MB per file (PNG, JPG, MP4).
        </p>
        <button
          type="button"
          className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-[#006199] font-bold text-xs shadow-xs hover:border-[#006199] transition-colors"
        >
          Select Files from Device
        </button>
      </div>

      {/* Uploaded Files Preview Grid */}
      {files.length > 0 && (
        <div className="space-y-2 pt-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Attached Media ({files.length})
          </p>

          <AnimatePresence>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {files.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between shadow-xs group"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    {file.url ? (
                      <img src={file.url} alt={file.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-[#8ACFF8]/20 flex items-center justify-center text-[#006199] flex-shrink-0">
                        {file.type === 'video' ? <Video className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{file.name}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{file.size} • Uploaded</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-[#006199]" />
                    <button
                      type="button"
                      onClick={() => handleRemove(file.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
