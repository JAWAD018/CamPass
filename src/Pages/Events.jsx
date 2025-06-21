import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import * as XLSX from 'xlsx';
import { addDoc, collection, doc, writeBatch, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../auth/config';
import EventsList from '../Components/EventList';

function Events() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    eventname: '',
    description: '',
    date: '',
    venue: '',
    file: null,
    category: ''
  });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🟢 Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  // 🟢 File -> ArrayBuffer converter
  const fileToArrayBuffer = (file) =>
    new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = (evt) => res(evt.target.result);
      reader.onerror = rej;
      reader.readAsArrayBuffer(file);
    });

  // 🟢 Submit Event + Students
  const handleSubmit = async (e) => {
    e.preventDefault();

    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      alert('You must be logged in to create an event');
      return;
    }

    if (!formData.file) {
      alert('Please upload a spreadsheet (.xlsx / .csv)');
      return;
    }

    try {
      const data = await fileToArrayBuffer(formData.file);
      const workbook = XLSX.read(new Uint8Array(data), { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet);

      const eventRef = await addDoc(collection(db, 'events'), {
        eventname: formData.eventname,
        description: formData.description,
        date: formData.date,
        venue: formData.venue,
        category: formData.category,
        createdAt: new Date(),
        createdBy: {
          uid: user.uid,
          email: user.email,
          name: user.displayName || ''
        }
      });

      const batch = writeBatch(db);
      rows.forEach((row) => {
        const name = row.Name || row.name || '';
        const roll = row.Roll || row['Roll No'] || row.roll || '';
        const email = row.Email || row.email || '';
        const branch = row.Branch || row.branch || ''; 

        const stuRef = doc(collection(db, `events/${eventRef.id}/students`));
        batch.set(stuRef, { name, roll, email ,branch});
      });
      await batch.commit();

      alert('Event created & students imported 🎉');
      setShowForm(false);
      setFormData({
        eventname: '',
        description: '',
        date: '',
        venue: '',
        file: null,
        category: ''
      });
      fetchEvents(); // Refresh list
    } catch (err) {
      console.error(err);
      alert('Upload failed – check console for details');
    }
  };

  // 🟢 Fetch only your events
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const q = query(collection(db, 'events'), where('createdBy.uid', '==', user.uid));
      const snapshot = await getDocs(q);
      const userEvents = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setEvents(userEvents);
    } catch (err) {
      console.error('Error fetching events:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <DashboardLayout>
      {/* 🔹 Top Bar */}
      <div className="md:flex md:justify-between mb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Events</h1>
          <p className="text-lg font-Fira">Manage and monitor all your college events</p>
        </div>
        <div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-primary p-3 w-full mt-5 md:mt-0 cursor-pointer font-semibold rounded-xl text-white"
          >
            Create Event
          </button>
        </div>
      </div>

      {/* 🔹 Search/Filter UI (Static) */}
      <div className="border border-gray-200 p-5 rounded-lg">
        <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input type="text" placeholder="Search Events" className="w-full border p-2 rounded" />
          <select className="w-full border p-2 rounded">
            <option>All Status</option>
            <option>Upcoming</option>
            <option>Completed</option>
          </select>
          <select className="w-full border p-2 rounded">
            <option>All Category</option>
            <option>Academic</option>
            <option>Sports</option>
          </select>
          <input type="date" className="w-full border p-2 rounded" />
        </form>
      </div>

      {/* 🔹 Display Events */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Your Events</h2>
        {loading ? <p>Loading events...</p> : <EventsList  events={events} />}
      </div>

      {/* 🔹 Event Form Popup */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 p-5 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg relative shadow-xl">
            <button className="absolute top-2 right-2 text-xl" onClick={() => setShowForm(false)}>
              ✖
            </button>
            <h2 className="text-xl font-bold mb-4">Create Event</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input name="eventname" value={formData.eventname} onChange={handleChange} type="text" placeholder="Event Name" className="w-full p-2 border rounded" />
              <input name="description" value={formData.description} onChange={handleChange} type="text" placeholder="Description" className="w-full p-2 border rounded" />
              <input name="date" value={formData.date} onChange={handleChange} type="date" className="w-full p-2 border rounded" />
              <input name="venue" value={formData.venue} onChange={handleChange} type="text" placeholder="Venue" className="w-full p-2 border rounded" />
              <input type="file" name="file" accept=".xlsx,.csv" onChange={handleChange} className="file:border file:p-2 file:rounded w-full" />
              <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded">
                <option value="">Select Category</option>
                <option>Academic</option>
                <option>Sports</option>
                <option>Cultural</option>
              </select>
              <button className="bg-primary text-white px-4 py-2 rounded w-full" type="submit">
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Events;
