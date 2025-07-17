import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import getCurrentUser from "../utils/getCurrentUser";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getCurrentUser();
      if (!userData) return navigate("/");
      setUser(userData);
    };
    fetchUser();
  }, []);

  if (!user) return <div className="p-6">Loading Profile...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-3xl mx-auto mt-10 bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-6">
          <img
            src={`https://i.pravatar.cc/150?u=${user.email}`} // use unique avatar
            alt="User Avatar"
            className="w-24 h-24 rounded-full border-4 border-indigo-500"
          />
          <div>
            <h2 className="text-2xl font-bold text-indigo-600">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-400 mt-1">User ID: {user._id}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
