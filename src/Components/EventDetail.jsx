// 📁 EventDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, getDocs, deleteDoc, updateDoc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../auth/config';
import DashboardLayout from '../layouts/DashboardLayout';

function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [eventEditData, setEventEditData] = useState({});
  const [newStudent, setNewStudent] = useState({ name: '', roll: '', email: '' });
  const [editStudentRoll, setEditStudentRoll] = useState(null);
  const user = getAuth().currentUser;

  useEffect(() => {
    const fetchEventAndStudents = async () => {
      const eventDoc = await getDoc(doc(db, 'events', id));
      if (!eventDoc.exists()) return;

      setEvent({ id: eventDoc.id, ...eventDoc.data() });

      const studentSnap = await getDocs(collection(db, `events/${id}/students`));
      setStudents(studentSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };

    fetchEventAndStudents();
  }, [id]);

  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete this event?");
    if (!confirm) return;

    await deleteDoc(doc(db, 'events', id));
    alert('Event deleted!');
    navigate('/dashboard');
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    await updateDoc(doc(db, 'events', id), eventEditData);
    alert('Event updated!');
    setEditing(false);
    setEvent(prev => ({ ...prev, ...eventEditData }));
  };

  const handleAddOrUpdateStudent = async (e) => {
    e.preventDefault();
    const existing = students.find(s => s.roll === newStudent.roll);

    if (existing && editStudentRoll === null) {
      alert('Student with this Roll No already exists!');
      return;
    }

    const stuRef = doc(db, `events/${id}/students/${newStudent.roll}`);
    await setDoc(stuRef, newStudent);

    if (editStudentRoll) {
      setStudents(prev => prev.map(s => s.roll === editStudentRoll ? newStudent : s));
      setEditStudentRoll(null);
    } else {
      setStudents(prev => [...prev, newStudent]);
    }

    setNewStudent({ name: '', roll: '', email: '' });
    alert('Student saved ✅');
  };

  const handleEditStudent = (student) => {
    setNewStudent(student);
    setEditStudentRoll(student.roll);
  };

  if (loading) return <p>Loading event...</p>;

  return (
    <DashboardLayout>
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">{event.eventname}</h1>
        <p className="mb-2">{event.description}</p>
        <p>📍 {event.venue}</p>
        <p>📅 {event.date}</p>
        <p className="text-sm text-gray-500 mt-2">Created by: {event.createdBy.name}</p>

        {user?.uid === event.createdBy.uid && (
          <div className="mt-4 flex gap-3">
            <button onClick={() => setEditing(!editing)} className="bg-blue-500 text-white px-4 py-2 rounded">
              {editing ? 'Cancel' : 'Edit Event'}
            </button>
            <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">
              Delete
            </button>
          </div>
        )}

        {editing && (
          <form onSubmit={handleEditSubmit} className="mt-4 space-y-3">
            <input type="text" placeholder="Event Name" defaultValue={event.eventname}
              onChange={(e) => setEventEditData({ ...eventEditData, eventname: e.target.value })}
              className="w-full border p-2 rounded" />
            <input type="text" placeholder="Description" defaultValue={event.description}
              onChange={(e) => setEventEditData({ ...eventEditData, description: e.target.value })}
              className="w-full border p-2 rounded" />
            <input type="text" placeholder="Venue" defaultValue={event.venue}
              onChange={(e) => setEventEditData({ ...eventEditData, venue: e.target.value })}
              className="w-full border p-2 rounded" />
            <input type="date" defaultValue={event.date}
              onChange={(e) => setEventEditData({ ...eventEditData, date: e.target.value })}
              className="w-full border p-2 rounded" />
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Save Changes</button>
          </form>
        )}

        <h2 className="text-xl mt-6 font-semibold mb-2">Registered Students</h2>
        {students.length === 0 ? (
          <p>No students found.</p>
        ) : (
          <ul className="list-disc pl-6 space-y-1 text-sm">
            {students.map((stu, index) => (
              <li key={index} className="flex justify-between">
                <span>{stu.name} ({stu.roll}) - {stu.email}</span>
                {user?.uid === event.createdBy.uid && (
                  <button onClick={() => handleEditStudent(stu)} className="text-blue-600 hover:underline">Edit</button>
                )}
              </li>
            ))}
          </ul>
        )}

        {user?.uid === event.createdBy.uid && (
          <form onSubmit={handleAddOrUpdateStudent} className="mt-6 space-y-2">
            <h3 className="font-semibold">{editStudentRoll ? 'Edit Student' : 'Add New Student'}</h3>
            <input type="text" value={newStudent.name} placeholder="Name"
              onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
              className="w-full border p-2 rounded" />
            <input type="text" value={newStudent.roll} placeholder="Roll No" disabled={!!editStudentRoll}
              onChange={(e) => setNewStudent({ ...newStudent, roll: e.target.value })}
              className="w-full border p-2 rounded" />
            <input type="email" value={newStudent.email} placeholder="Email"
              onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
              className="w-full border p-2 rounded" />
            <button type="submit" className="bg-primary text-white px-4 py-2 rounded">
              {editStudentRoll ? 'Update Student' : 'Add Student'}
            </button>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
}

export default EventDetail;
