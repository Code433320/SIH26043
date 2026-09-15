import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCheck, Trash2 } from 'lucide-react';
import NotificationCard from '../components/NotificationCard';

export default function NotificationsView({ notifications = [], onMarkRead, onMarkAllRead, onSelectReport }) {
  const [filter, setFilter] = useState('ALL'); // ALL or UNREAD

  const filteredNotifs = notifications.filter(n => {
    if (filter === 'UNREAD') return !n.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-black text-slate-900">Notifications</h2>
            {unreadCount > 0 && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FFD444] text-[#003F66]">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time status updates and department action alerts for your reported issues.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={onMarkAllRead}
            className="text-xs font-bold text-[#006199] hover:underline flex items-center space-x-1"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 text-xs font-bold">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            filter === 'ALL' ? "bg-[#006199] text-white" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          All Notifications ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('UNREAD')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            filter === 'UNREAD' ? "bg-[#006199] text-white" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Unread Only ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifs.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center text-slate-500 text-xs">
            No notifications in this view.
          </div>
        ) : (
          filteredNotifs.map((notif) => (
            <NotificationCard
              key={notif.id}
              notification={notif}
              onRead={onMarkRead}
              onClick={onSelectReport}
            />
          ))
        )}
      </div>
    </div>
  );
}
