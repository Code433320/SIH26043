import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Search, Navigation, Check, Layers, Compass } from 'lucide-react';

export default function LocationPicker({ selectedLocation, onSelectLocation }) {
  const [address, setAddress] = useState(selectedLocation.address || 'Swargate Main Road, Pune');
  const [landmark, setLandmark] = useState(selectedLocation.landmark || 'Near Swargate Bus Stand');
  const [mapType, setMapType] = useState('street'); // street or satellite
  const [isLocating, setIsLocating] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleAutoLocate = () => {
    setIsLocating(true);
    setTimeout(() => {
      setAddress('Kothrud Industrial Area, DP Road, Pune');
      setLandmark('Opposite Ideal Colony Gate #4');
      setIsLocating(false);
      onSelectLocation({
        address: 'Kothrud Industrial Area, DP Road, Pune',
        landmark: 'Opposite Ideal Colony Gate #4',
        lat: 18.5074,
        lng: 73.8077
      });
    }, 800);
  };

  const handleConfirm = () => {
    setConfirmed(true);
    onSelectLocation({
      address,
      landmark,
      lat: 18.5204,
      lng: 73.8567
    });
    setTimeout(() => setConfirmed(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Location Input Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Street Address / Location *
          </label>
          <div className="relative">
            <MapPin className="w-5 h-5 absolute left-3 top-3 text-[#006199]" />
            <input 
              type="text" 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter street, area, or ward..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#006199] focus:ring-2 focus:ring-[#006199]/20 outline-none text-sm font-medium transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Landmark / Reference Point
          </label>
          <div className="relative">
            <Compass className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
            <input 
              type="text" 
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="Near school, signal, bus stop..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#006199] focus:ring-2 focus:ring-[#006199]/20 outline-none text-sm font-medium transition-all"
            />
          </div>
        </div>
      </div>

      {/* Map Header Controls */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleAutoLocate}
            disabled={isLocating}
            className="px-3 py-1.5 rounded-lg bg-[#8ACFF8]/20 hover:bg-[#8ACFF8]/40 text-[#006199] text-xs font-bold flex items-center space-x-1.5 transition-colors"
          >
            <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Detecting GPS...' : 'Use Current GPS'}</span>
          </button>
        </div>

        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setMapType('street')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
              mapType === 'street' ? 'bg-white text-[#006199] shadow-xs' : 'text-slate-500'
            }`}
          >
            Street View
          </button>
          <button
            type="button"
            onClick={() => setMapType('satellite')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
              mapType === 'satellite' ? 'bg-[#006199] text-white' : 'text-slate-500'
            }`}
          >
            Satellite
          </button>
        </div>
      </div>

      {/* Simulated Interactive Map Display */}
      <div className="relative h-64 rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100 group">
        {mapType === 'street' ? (
          <div className="w-full h-full bg-[#EBF2F7] relative flex items-center justify-center overflow-hidden">
            {/* Grid SVG Roads */}
            <svg className="absolute inset-0 w-full h-full opacity-40" width="100%" height="100%">
              <line x1="0" y1="30%" x2="100%" y2="30%" stroke="#006199" strokeWidth="8" />
              <line x1="0" y1="70%" x2="100%" y2="70%" stroke="#CBD5E1" strokeWidth="6" />
              <line x1="40%" y1="0" x2="40%" y2="100%" stroke="#006199" strokeWidth="10" />
              <line x1="75%" y1="0" x2="75%" y2="100%" stroke="#CBD5E1" strokeWidth="6" />
              <circle cx="40%" cy="30%" r="20" fill="#FFD444" opacity="0.3" />
            </svg>
            <div className="absolute inset-0 bg-radial from-transparent to-slate-200/50" />
          </div>
        ) : (
          <div className="w-full h-full bg-[#1E293B] relative flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-emerald-950/40 mix-blend-overlay" />
            <svg className="absolute inset-0 w-full h-full opacity-20" width="100%" height="100%">
              <line x1="0" y1="40%" x2="100%" y2="40%" stroke="#94A3B8" strokeWidth="4" />
              <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#94A3B8" strokeWidth="4" />
            </svg>
          </div>
        )}

        {/* Center Animated Location Marker Pin */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div 
            initial={{ y: -10 }}
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="flex flex-col items-center"
          >
            <div className="px-3 py-1 bg-[#006199] text-white text-[11px] font-bold rounded-lg shadow-lg mb-1 border border-[#8ACFF8]/40 flex items-center space-x-1">
              <span>{address}</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#FFD444] text-[#003F66] flex items-center justify-center shadow-lg border-2 border-white gold-active-glow">
              <MapPin className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="w-4 h-1.5 rounded-full bg-black/30 blur-xs mt-0.5" />
          </motion.div>
        </div>

        {/* Map Information Overlay Badge */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/80 text-[11px] font-mono text-slate-700 shadow-sm flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-[#006199] animate-ping" />
          <span>GPS Pin: 18.5204° N, 73.8567° E (Ward 8)</span>
        </div>

        {/* Map Action Button */}
        <div className="absolute bottom-3 right-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={handleConfirm}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md transition-all ${
              confirmed 
                ? 'bg-emerald-600 text-white' 
                : 'bg-[#FFD444] hover:bg-[#ffe066] text-[#003F66]'
            }`}
          >
            {confirmed ? <Check className="w-4 h-4" /> : <MapPin className="w-4 h-4 text-[#006199]" />}
            <span>{confirmed ? 'Location Confirmed!' : 'Confirm Location'}</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
