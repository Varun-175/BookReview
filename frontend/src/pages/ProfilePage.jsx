import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const ProfilePage = () => {
  const { user: contextUser } = useContext(AuthContext);

  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', avatar: '' });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const [booksAdded, setBooksAdded] = useState(0);
  const [reviewsGiven, setReviewsGiven] = useState(0);

  // Fetch user profile
  const loadProfile = async () => {
    setLoading(true);
    setErr('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setErr('Not authenticated');
        setLoading(false);
        return;
      }
      const res = await fetch('/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        const maybeJson = await res.json().catch(() => ({}));
        throw new Error(maybeJson.message || 'Failed to load profile');
      }

      const data = await res.json();
      const u = data?.user || data;
      setProfile(u);
      setFormData({
        name: u?.name || '',
        avatar: u?.avatar || ''
      });
    } catch (e) {
      setErr(e.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  // Fetch counts from backend
  const loadCounts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch('/api/profile/counts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      // Make sure the backend returns booksAdded and reviewsGiven fields
      setBooksAdded(typeof data.booksAdded === 'number' ? data.booksAdded : 0);
      setReviewsGiven(typeof data.reviewsGiven === 'number' ? data.reviewsGiven : 0);
    } catch {
      setBooksAdded(0);
      setReviewsGiven(0);
    }
  };

  useEffect(() => {
    // Pre-populate if already known (optional)
    if (contextUser) {
      setProfile(contextUser);
      setFormData({
        name: contextUser.name || '',
        avatar: contextUser.avatar || ''
      });
      setLoading(false);
    }
    // Always fetch for update
    loadProfile();
    loadCounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    try {
      setErr('');
      const token = localStorage.getItem('token');
      if (!token) {
        setErr('Not authenticated');
        return;
      }
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const maybeJson = await res.json().catch(() => ({}));
        throw new Error(maybeJson.message || 'Failed to update profile');
      }

      const updated = await res.json();
      const u = updated?.user || updated;
      setProfile((prev) => ({ ...(prev || {}), ...u }));
      setEditing(false);
    } catch (e) {
      setErr(e.message || 'Failed to update profile');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (err) return <div className="text-red-600 p-4">{err}</div>;
  if (!profile) return <div className="p-4">No profile data</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="bg-white rounded-lg shadow p-6">
        {editing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Avatar URL</label>
              <input
                type="url"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setFormData({
                    name: profile?.name || '',
                    avatar: profile?.avatar || ''
                  });
                }}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center mb-6">
              {profile?.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile?.name || 'Avatar'}
                  className="w-16 h-16 rounded-full mr-4 object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full mr-4 bg-gray-200 flex items-center justify-center text-gray-500">
                  {profile?.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
              )}
              <div>
                <h2 className="text-xl font-semibold">{profile?.name || '-'}</h2>
                <p className="text-gray-600">{profile?.email || '-'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {booksAdded}
                </div>
                <div className="text-sm text-gray-600">Books Added</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {reviewsGiven}
                </div>
                <div className="text-sm text-gray-600">Reviews Given</div>
              </div>
            </div>

            <button
              onClick={() => setEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
