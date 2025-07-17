// src/pages/Auth/Profile.jsx
import React, { useEffect, useState } from 'react';
import useAuthStore from '../../store/useAuthStore';
import axios from '../../config/axios.configer';
import { toast } from 'react-toastify';
import { ImSpinner3 } from 'react-icons/im';
import { FiUser, FiMail, FiPhone, FiLock, FiKey, FiTrash2, FiUpload, FiLogOut } from 'react-icons/fi';

export default function Profile() {
  const { user, isLoading: authLoading, profile, logout } = useAuthStore();
  const [loading, setLoading] = useState(false);

  // Local form state
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: null,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Load user into form
  useEffect(() => {
    (async () => {
      await profile();
    })();
  }, []);

  useEffect(() => {
    if (user) {
      setForm(f => ({
        ...f,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      }));
    }
  }, [user]);

  const handleChange = e => {
    const { name, value, files } = e.target;
    setForm(f => ({
      ...f,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      // Build payload
      const data = new FormData();
      data.append('name', form.name);
      data.append('email', form.email);
      data.append('phone', form.phone);
      if (form.avatar) data.append('avatar', form.avatar);
      if (form.currentPassword && form.newPassword && form.newPassword === form.confirmPassword) {
        data.append('currentPassword', form.currentPassword);
        data.append('newPassword', form.newPassword);
      }

      await axios.patch('/api/auth/updateProfile', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Profile updated!');
      await profile();  // refresh store
      setForm(f => ({
        ...f,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="p-6 text-center text-gray-600">
        <ImSpinner3 className="mx-auto animate-spin" size={32} />
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-12">
      <h1 className="text-3xl font-bold text-gray-800">Account Profile</h1>

      {/* Personal Information */}
      <section className="bg-white p-6 rounded-2xl shadow-lg space-y-4">
        <h2 className="text-2xl font-semibold text-gray-700">Personal Information</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Avatar Upload */}
          <div className="md:col-span-2 flex items-center gap-6">
            <div className="w-24 h-24 bg-gray-100 rounded-full overflow-hidden border">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <FiUser size={48} className="text-gray-400 m-auto" />
              )}
            </div>
            <label className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full cursor-pointer transition">
              <FiUpload /> Change Avatar
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <div className="mt-1 flex items-center gap-2">
              <FiUser className="text-gray-500" /><input
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="mt-1 flex items-center gap-2">
              <FiMail className="text-gray-500" /><input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <div className="mt-1 flex items-center gap-2">
              <FiPhone className="text-gray-500" /><input
                name="phone"
                type="text"
                value={form.phone}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        </form>
      </section>

      {/* Security & Password */}
      <section className="bg-white p-6 rounded-2xl shadow-lg space-y-4">
        <h2 className="text-2xl font-semibold text-gray-700">Security</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Password</label>
            <input
              name="currentPassword"
              type="password"
              value={form.currentPassword}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-400"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              name="newPassword"
              type="password"
              value={form.newPassword}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-400"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <input
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-400"
              placeholder="••••••••"
            />
          </div>

          <div className="md:col-span-2 flex justify-end pt-2">
            <button
              onClick={logout}
              type="button"
              className="px-6 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-full transition mr-4"
            >
              {authLoading ? <ImSpinner3 className="animate-spin" /> : <><FiLogOut /> Logout</>}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full transition"
            >
              {loading ? <ImSpinner3 className="animate-spin" /> : 'Save Changes'}
            </button>
          </div>
        </form>
      </section>

      {/* API Keys & Sessions */}
      <section className="bg-white p-6 rounded-2xl shadow-lg space-y-4">
        <h2 className="text-2xl font-semibold text-gray-700">API Keys & Sessions</h2>
        <div className="space-y-3">
          {/* List existing tokens */}
          {user.apiKeys?.length ? (
            user.apiKeys.map((key) => (
              <div key={key.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <code className="text-sm text-gray-800">{key.token}</code>
                <button
                  onClick={() => {/* TODO revoke key */}}
                  className="text-red-500 hover:text-red-600"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No API keys generated yet.</p>
          )}
          <button
            onClick={() => {/* TODO create new key */}}
            className="flex items-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-600 rounded-full transition"
          >
            <FiKey /> Generate New Key
          </button>
        </div>
      </section>
    </div>
);
}
