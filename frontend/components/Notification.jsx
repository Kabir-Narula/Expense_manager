import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Bell, X, Check } from 'lucide-react';
import axios from 'axios';
import api from '../src/Utils/api';

const Notifications = () => {
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

   useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get('/auth/getUser');
        setUser(data);
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };

    fetchUser();
  }, []);

  const fetchNotifications = async () => {
    console.log(user);
    if (!user?._id) return;
    
    try {
      setIsLoading(true);
      console.log(user._id);
      const response = await api.get(`/notifications/${user._id}`);
      setNotifications(response.data.data);
    } catch (err) {
      setError('Failed to fetch notifications');
      console.error('Error fetching notifications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchNotifications();
    }
  }, [user?._id]);


  const markAsRead = async (notificationId, e) => {
    e?.stopPropagation?.();
    try {
      console.log(notificationId);
      await api.put(`/notifications/${notificationId}`);
      setNotifications(notifications.map(notif => 
        notif._id === notificationId ? { ...notif, readAt: new Date() } : notif
      ));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const deleteNotification = async (notificationId, e) => {
    e.stopPropagation();
    try {
      await axios.delete(`/api/v1/notifications/${notificationId}`);
      setNotifications(notifications.filter(notif => notif._id !== notificationId));
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const unreadCount = notifications.filter(notif => !notif.readAt).length;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-100 relative"
        aria-label="Notifications"
      >
        <Bell className="h-6 w-6 text-gray-600" />
        {notifications.some(n => n.readAt) && (
          <span className="absolute top-0.5 right-0.5 h-3 w-3 bg-red-500 rounded-full border-2 border-white" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold">Notifications</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : error ? (
              <div className="p-4 text-center text-red-500">{error}</div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No notifications</div>
            ) : (
              <ul>
                {notifications.map((notification) => (
                  <li 
                    key={notification._id}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${
                      !notification.readAt ? 'bg-blue-50' : ''
                    }`}
                    
                    onClick={() => markAsRead(notification._id)}
                  >
                    {/* Red dot for unread notifications */}
                    {!notification.readAt && (
                      <span className="absolute top-3 left-2 h-2 w-2 bg-red-500 rounded-full" />
                    )}
                    
                    <div className="pl-1">
                      <div className="flex justify-between">
                        <p className="font-medium">{notification.data.title}</p>
                        <span className="text-xs text-gray-400">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{notification.data.message}</p>
                      {notification.data.amount && (
                        <p className="text-sm font-medium mt-1">
                          ${parseFloat(notification.data.amount).toFixed(2)}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;