import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

function EditProfilePage() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("cc_user"));

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    department: "",
    yearOfStudy: "",
    skills: "",
    linkedinUrl: "",
    githubUrl: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    console.log("USER =", user);
    try {
      const res = await api.get(`/users/${user.userId}`);
      console.log(res.data);
      const profile = res.data.data;

      setFormData({
        name: profile.name || "",
        bio: profile.bio || "",
        department: profile.department || "",
        yearOfStudy: profile.yearOfStudy || "",
        skills: profile.skills || "",
        linkedinUrl: profile.linkedinUrl || "",
        githubUrl: profile.githubUrl || "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/users/${user.userId}`, formData);

      alert("Profile updated successfully!");

      navigate(`/profile/${user.userId}`);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white shadow rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-6">
          Edit Profile
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <textarea
            name="bio"
            placeholder="Bio"
            value={formData.bio}
            onChange={handleChange}
            rows="4"
            className="w-full border rounded-lg p-3"
          />

          <input
            type="text"
            name="department"
            placeholder="Department"
            value={formData.department}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <input
            type="text"
            name="yearOfStudy"
            placeholder="Year of Study"
            value={formData.yearOfStudy}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <input
            type="text"
            name="skills"
            placeholder="Skills (comma separated)"
            value={formData.skills}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <input
            type="url"
            name="linkedinUrl"
            placeholder="LinkedIn URL"
            value={formData.linkedinUrl}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <input
            type="url"
            name="githubUrl"
            placeholder="GitHub URL"
            value={formData.githubUrl}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProfilePage;