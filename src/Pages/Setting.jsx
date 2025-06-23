import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../auth/config";
import DashboardLayout from "../layouts/DashboardLayout";

function Setting() {
  const auth = getAuth();
  const user = auth.currentUser;

  const [formData, setFormData] = useState({
    clgName: "",
    code: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchCollegeData = async () => {
      if (!user) return;

      try {
        const docRef = doc(db, "colleges", user.email);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setFormData(docSnap.data());
        }
        setLoading(false);
      } catch (error) {
        console.error("Error loading college data:", error);
        setLoading(false);
      }
    };

    fetchCollegeData();
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      const docRef = doc(db, "colleges", user.email);
      await setDoc(docRef, formData);
      setStatus("✅ College information saved/updated!");
    } catch (error) {
      console.error("Error saving college data:", error);
      setStatus("❌ Failed to save data");
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">College Settings</h1>

        {loading ? (
          <p>Loading college data...</p>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block font-medium mb-1">College Name</label>
              <input
                type="text"
                name="clgName"
                value={formData.clgName}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">College Code</label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
                rows={3}
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Save / Update
            </button>
          </form>
        )}

        {status && <p className="mt-4 font-semibold text-green-700">{status}</p>}
      </div>
    </DashboardLayout>
  );
}

export default Setting;
