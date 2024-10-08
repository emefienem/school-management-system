import React, { useState, useEffect } from "react";
import { useAuth } from "@/api/useAuth";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

interface ProfileData {
  dob: string;
  age: string | number;
  height: string | number;
  weight: string | number;
  profileImage: string | null;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, currentRole } = useAuth();

  const [profileData, setProfileData] = useState<ProfileData>({
    dob: "",
    age: "",
    height: "",
    weight: "",
    profileImage: null,
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const savedProfile = localStorage.getItem(currentUser?.user?.id || "");
    if (savedProfile) {
      setProfileData(JSON.parse(savedProfile));
    }
  }, [currentUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileData({ ...profileData, profileImage: reader.result as string });
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileData({ ...profileData, profileImage: null });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    localStorage.setItem(
      currentUser?.user?.id || "",
      JSON.stringify(profileData)
    );
    alert("Profile updated successfully!");
    setIsEditing(false);
  };

  return (
    <div className="p-6 max-w-lg md:max-w-full mx-auto bg-white shadow-md rounded-lg">
      <ArrowLeft
        onClick={() => navigate(-1)}
        className="bg-blue-500 text-white mb-8"
      />
      <h2 className="text-xl font-bold uppercase mb-4 text-center">Profile</h2>
      <div className="mb-4 flex justify-center">
        <div className="w-32 h-32 border-4 border-gray-300 rounded-full flex items-center justify-center overflow-hidden">
          {profileData.profileImage ? (
            <img
              src={profileData.profileImage}
              alt="Profile"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <span className="text-gray-400">No Image</span>
          )}
        </div>
      </div>

      {isEditing && profileData.profileImage && (
        <button
          type="button"
          onClick={handleRemoveImage}
          className="text-red-500 underline mb-4"
        >
          Remove Image
        </button>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={currentUser?.user?.name || ""}
              disabled
              className="w-full border border-gray-300 p-2 rounded-md"
            />
          </div>
          <div>
            <label className="block mb-2">Role</label>
            <input
              type="text"
              name="role"
              value={currentRole || ""}
              disabled
              className="w-full border border-gray-300 p-2 rounded-md"
            />
          </div>
          <div>
            <label className="block mb-2">School Name</label>
            <input
              type="text"
              name="schoolName"
              value={currentUser?.user?.schoolName || ""}
              disabled
              className="w-full border border-gray-300 p-2 rounded-md"
            />
          </div>

          <div>
            <label className="block mb-2">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={profileData.dob}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full border border-gray-300 p-2 rounded-md ${
                !isEditing ? "bg-gray-100" : ""
              }`}
            />
          </div>
          <div>
            <label className="block mb-2">Age</label>
            <input
              type="number"
              name="age"
              value={profileData.age}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full border border-gray-300 p-2 rounded-md ${
                !isEditing ? "bg-gray-100" : ""
              }`}
            />
          </div>
          <div>
            <label className="block mb-2">Height (cm)</label>
            <input
              type="number"
              name="height"
              value={profileData.height}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full border border-gray-300 p-2 rounded-md ${
                !isEditing ? "bg-gray-100" : ""
              }`}
            />
          </div>
          <div>
            <label className="block mb-2">Weight (kg)</label>
            <input
              type="number"
              name="weight"
              value={profileData.weight}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full border border-gray-300 p-2 rounded-md ${
                !isEditing ? "bg-gray-100" : ""
              }`}
            />
          </div>

          <div>
            <label className="block mb-2">Profile Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={!isEditing}
              className="w-full border border-gray-300 p-2 rounded-md"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className="bg-blue-500 text-white mt-6 px-4 py-2 rounded-md hover:bg-blue-600 w-full"
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>

        {isEditing && (
          <button
            type="submit"
            className="bg-green-500 text-white mt-4 px-4 py-2 rounded-md hover:bg-green-600 w-full"
          >
            Update Profile
          </button>
        )}
      </form>
    </div>
  );
};

export default Profile;
