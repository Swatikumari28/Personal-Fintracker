import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import getCurrentUser from "../utils/getCurrentUser";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getCurrentUser();
      if (!userData) return navigate("/");
      setUser(userData);
      setFormData({ name: userData.name, email: userData.email });
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/auth/update`,
        { name: formData.name, email: formData.email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Profile updated successfully!");
      setUser(res.data.user); // Updated user returned from backend
      setEditMode(false);
    } catch (error) {
      console.error("Failed to update profile", error);
      alert("Error updating profile");
    }
  };

  if (!user) return <div className="p-6">Loading Profile...</div>;

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      <Header />
      <div className="max-w-3xl mx-auto mt-10 bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-6">
          <img
            src={`https://ui-avatars.com/api/?name=${user.name}&background=random`}
            alt="User Avatar"
            className="w-24 h-24 rounded-full border-4 border-indigo-500"
          />
          <div className="flex-1">
            {editMode ? (
              <div className="space-y-3">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded"
                  placeholder="Name"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded"
                  placeholder="Email"
                />
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-green-500 text-white rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 bg-gray-300 text-black rounded ml-2"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-indigo-600">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-400 mt-1">User ID: {user._id}</p>
                <button
                  onClick={() => setEditMode(true)}
                  className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
