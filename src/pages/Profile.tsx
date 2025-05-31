import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useAuth } from '../contexts/AuthContext';
import { User, Settings, Shield, Bell, Key } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isEditing, setIsEditing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call an API endpoint to update the user profile
    toast.success('Profile updated successfully');
    setIsEditing(false);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    // In a real app, this would call an API endpoint to change the password
    toast.success('Password changed successfully');
    
    // Reset form
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const TabButton = ({ id, label, icon }: { id: string; label: string; icon: React.ReactNode }) => (
    <button
      className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
        activeTab === id
          ? 'bg-primary-50 text-primary-600'
          : 'text-neutral-600 hover:bg-neutral-50'
      }`}
      onClick={() => setActiveTab(id)}
    >
      <span className="mr-2">{icon}</span>
      {label}
    </button>
  );

  return (
    <MainLayout title="Profile Settings">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card">
              <div className="flex flex-col items-center mb-6">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl font-semibold text-primary-600">
                    {user?.name.charAt(0)}
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-neutral-800">{user?.name}</h2>
                <p className="text-sm text-neutral-500">{user?.email}</p>
              </div>
              
              <div className="space-y-1">
                <TabButton id="personal" label="Personal Information" icon={<User size={18} />} />
                <TabButton id="security" label="Security" icon={<Shield size={18} />} />
                <TabButton id="notifications" label="Notifications" icon={<Bell size={18} />} />
                <TabButton id="preferences" label="Preferences" icon={<Settings size={18} />} />
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="lg:col-span-3">
            {/* Personal Information */}
            {activeTab === 'personal' && (
              <div className="card">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-neutral-900">Personal Information</h2>
                  {!isEditing && (
                    <button 
                      className="btn btn-outline text-sm"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
                
                <form onSubmit={handleSaveProfile}>
                  <div className="grid gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Full Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="input"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      ) : (
                        <p className="py-2 px-3 bg-neutral-50 rounded-md text-neutral-800">
                          {user?.name}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Email Address
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          className="input"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      ) : (
                        <p className="py-2 px-3 bg-neutral-50 rounded-md text-neutral-800">
                          {user?.email}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        User Role
                      </label>
                      <p className="py-2 px-3 bg-neutral-50 rounded-md text-neutral-800 capitalize">
                        {user?.role}
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Account Created
                      </label>
                      <p className="py-2 px-3 bg-neutral-50 rounded-md text-neutral-800">
                        {new Date().toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  {isEditing && (
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() => {
                          setIsEditing(false);
                          setName(user?.name || '');
                          setEmail(user?.email || '');
                        }}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Save Changes
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}
            
            {/* Security */}
            {activeTab === 'security' && (
              <div className="card">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-neutral-900">Security Settings</h2>
                  <p className="text-sm text-neutral-500">Manage your password and security preferences</p>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-md font-semibold text-neutral-800 mb-4 flex items-center">
                    <Key size={18} className="mr-2" />
                    Change Password
                  </h3>
                  
                  <form onSubmit={handleChangePassword}>
                    <div className="grid gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                          Current Password
                        </label>
                        <input
                          type="password"
                          className="input"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                          New Password
                        </label>
                        <input
                          type="password"
                          className="input"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          minLength={6}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          className="input"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          minLength={6}
                          required
                        />
                      </div>
                    </div>
                    
                    <button type="submit" className="btn btn-primary">
                      Update Password
                    </button>
                  </form>
                </div>
                
                <div className="border-t border-neutral-200 pt-6">
                  <h3 className="text-md font-semibold text-neutral-800 mb-4">Login Sessions</h3>
                  
                  <div className="bg-neutral-50 p-4 rounded-md mb-2 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-neutral-800">Current Session</p>
                      <p className="text-sm text-neutral-500">
                        Started {new Date().toLocaleDateString()} • Web Browser
                      </p>
                    </div>
                    <div className="bg-success-100 text-success-800 text-xs px-2 py-1 rounded-full">
                      Active
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Notifications */}
            {activeTab === 'notifications' && (
              <div className="card">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-neutral-900">Notification Settings</h2>
                  <p className="text-sm text-neutral-500">Manage how and when you receive notifications</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-neutral-100">
                    <div>
                      <h3 className="font-medium text-neutral-800">Transaction Alerts</h3>
                      <p className="text-sm text-neutral-500">Notifications for deposits, withdrawals, and transfers</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-neutral-100">
                    <div>
                      <h3 className="font-medium text-neutral-800">Security Alerts</h3>
                      <p className="text-sm text-neutral-500">Get notified about login attempts and password changes</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-neutral-100">
                    <div>
                      <h3 className="font-medium text-neutral-800">Marketing Communications</h3>
                      <p className="text-sm text-neutral-500">Receive news, updates, and promotional offers</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" value="" className="sr-only peer" />
                      <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                    </label>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-neutral-200">
                  <h3 className="text-md font-semibold text-neutral-800 mb-4">Notification Methods</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input id="email-notif" type="checkbox" className="w-4 h-4 text-primary-600 bg-neutral-100 rounded border-neutral-300 focus:ring-primary-500" defaultChecked />
                      <label htmlFor="email-notif" className="ml-2 text-sm font-medium text-neutral-700">Email Notifications</label>
                    </div>
                    
                    <div className="flex items-center">
                      <input id="push-notif" type="checkbox" className="w-4 h-4 text-primary-600 bg-neutral-100 rounded border-neutral-300 focus:ring-primary-500" defaultChecked />
                      <label htmlFor="push-notif" className="ml-2 text-sm font-medium text-neutral-700">Browser Push Notifications</label>
                    </div>
                  </div>
                  
                  <button className="btn btn-primary mt-6">
                    Save Notification Settings
                  </button>
                </div>
              </div>
            )}
            
            {/* Preferences */}
            {activeTab === 'preferences' && (
              <div className="card">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-neutral-900">Preferences</h2>
                  <p className="text-sm text-neutral-500">Customize your wallet experience</p>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-md font-semibold text-neutral-800 mb-4">Display Options</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Currency Display
                      </label>
                      <select className="input">
                        <option>USD ($)</option>
                        <option>EUR (€)</option>
                        <option>GBP (£)</option>
                        <option>JPY (¥)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Date Format
                      </label>
                      <select className="input">
                        <option>MM/DD/YYYY</option>
                        <option>DD/MM/YYYY</option>
                        <option>YYYY-MM-DD</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6 pt-6 border-t border-neutral-200">
                  <h3 className="text-md font-semibold text-neutral-800 mb-4">Theme Preferences</h3>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="border border-primary-400 bg-white p-3 rounded-md flex flex-col items-center cursor-pointer">
                      <div className="h-12 w-full bg-white mb-2 rounded"></div>
                      <span className="text-sm">Light</span>
                    </div>
                    <div className="border border-neutral-200 bg-white p-3 rounded-md flex flex-col items-center cursor-pointer">
                      <div className="h-12 w-full bg-neutral-800 mb-2 rounded"></div>
                      <span className="text-sm">Dark</span>
                    </div>
                    <div className="border border-neutral-200 bg-white p-3 rounded-md flex flex-col items-center cursor-pointer">
                      <div className="h-12 w-full bg-gradient-to-r from-white to-neutral-800 mb-2 rounded"></div>
                      <span className="text-sm">System</span>
                    </div>
                  </div>
                </div>
                
                <button className="btn btn-primary">
                  Save Preferences
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default Profile;