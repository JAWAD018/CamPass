import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, getDocs, deleteDoc, updateDoc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../auth/config';
import DashboardLayout from '../layouts/DashboardLayout';
import QRCode from 'qrcode';
import axios from 'axios';
import { toast } from 'react-toastify';

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
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    await deleteDoc(doc(db, 'events', id));
    toast.success('✅ Event deleted!');
    navigate('/dashboard');
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    await updateDoc(doc(db, 'events', id), eventEditData);
    toast.success('✅ Event updated!');
    setEditing(false);
    setEvent(prev => ({ ...prev, ...eventEditData }));
  };

  const handleAddOrUpdateStudent = async (e) => {
    e.preventDefault();
    const existing = students.find(s => s.roll === newStudent.roll);
    if (existing && editStudentRoll === null) {
      toast.error('❌ Student with this Roll No already exists!');
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
    toast.success('✅ Student saved');
  };

  const handleEditStudent = (student) => {
    setNewStudent(student);
    setEditStudentRoll(student.roll);
  };

 const handleDeleteStudent = async (docId) => {
  if (!window.confirm('Delete this student?')) return;
  await deleteDoc(doc(db, `events/${id}/students/${docId}`));
  setStudents(prev => prev.filter(s => s.id !== docId));
  toast.success('✅ Student deleted');
};


  const sendTicketEmail = async ({ name, email, qrCode, clgName }) => {
    try {
      if (!qrCode || typeof qrCode !== 'string') throw new Error('Invalid QR Code data');
      await axios.post('https://api.brevo.com/v3/smtp/email', {
        sender: { name: 'CamPass', email: 'mohammedjawad0036@gmail.com' },
        to: [{ email, name }],
        subject: `🎫 Ticket for ${event.eventname}`,
        htmlContent: `Your ticket is below...`,
      }, {
        headers: {
          'api-key': import.meta.env.VITE_BREVO_API_KEY,
          'Content-Type': 'application/json'
        }
      });
      toast.success(`✅ Email sent to ${email}`);
    } catch (error) {
      console.error(`❌ Failed to send to ${email}`, error);
      toast.error(`❌ Failed to send to ${email}`);
    }
  };

  const handleSendTickets = async () => {
    if (!window.confirm("Send tickets to all students?")) return;
    const collegeRef = doc(db, "colleges", event.createdBy.email);
    const collegeSnap = await getDoc(collegeRef);
    const clgName = collegeSnap.exists() ? collegeSnap.data().clgName : "Your College";

    for (const stu of students) {
      try {
        const qrData = JSON.stringify({ eventId: event.id, roll: stu.roll, name: stu.name });
        const qrCodeUrl = await QRCode.toDataURL(qrData);
        await sendTicketEmail({ name: stu.name, email: stu.email, qrCode: qrCodeUrl, clgName });
        const stuRef = doc(db, `events/${id}/students/${stu.roll}`);
        await updateDoc(stuRef, { ticketSent: true });
      } catch (err) {
        console.error(err);
      }
    }
    toast.success("🎉 All tickets sent!");
  };

  const handleDownloadCSV = () => {
    const csvHeader = "Name,Roll,Email,Ticket Sent\n";
    const csvRows = students.map(stu => `${stu.name},${stu.roll},${stu.email},${stu.ticketSent ? 'Yes' : 'No'}`).join("\n");
    const csvContent = csvHeader + csvRows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${event.eventname}_students.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <p>Loading event...</p>;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start sm:items-center gap-5 mb-6">
          <div>
            <h1 className="text-2xl font-bold">{event.eventname}</h1>
            <p className="text-gray-600 text-sm">{event.description}</p>
            <p className="text-sm mt-1">📍 {event.venue} | 📅 {event.date}</p>
            <p className="text-xs text-gray-500 mt-1">Created by: {event.createdBy.name}</p>
          </div>
          {user?.uid === event.createdBy.uid && (
            <div className="flex flex-wrap gap-2">
              <button onClick={handleSendTickets} className="bg-purple-600 text-white px-3 py-1 rounded text-sm">🎟 Send Tickets</button>
              <button onClick={() => setEditing(!editing)} className="bg-blue-500 text-white px-3 py-1 rounded text-sm">{editing ? 'Cancel' : 'Edit'}</button>
              <button onClick={handleDelete} className="bg-red-500 text-white px-3 py-1 rounded text-sm">Delete</button>
              <button onClick={handleDownloadCSV} className="bg-green-600 text-white px-3 py-1 rounded text-sm">⬇️ Download Students</button>
            </div>
          )}
        </div>

        {editing && (
          <form onSubmit={handleEditSubmit} className="space-y-2 mb-4">
            <input type="text" defaultValue={event.eventname} onChange={(e) => setEventEditData({ ...eventEditData, eventname: e.target.value })} className="w-full border p-2 rounded" />
            <input type="text" defaultValue={event.description} onChange={(e) => setEventEditData({ ...eventEditData, description: e.target.value })} className="w-full border p-2 rounded" />
            <input type="text" defaultValue={event.venue} onChange={(e) => setEventEditData({ ...eventEditData, venue: e.target.value })} className="w-full border p-2 rounded" />
            <input type="date" defaultValue={event.date} onChange={(e) => setEventEditData({ ...eventEditData, date: e.target.value })} className="w-full border p-2 rounded" />
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
          </form>
        )}

        <h2 className="text-lg font-semibold mb-2">Registered Students</h2>
        {students.length === 0 ? (
          <p className="text-gray-500 text-sm">No students registered yet.</p>
        ) : (
          <ul className="divide-y divide-gray-200 bg-white rounded-lg shadow">
            {students.map((stu, index) => (
              <li key={index} className="p-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-sm">
                <div>
                  <p className="font-medium">{stu.name} ({stu.roll})</p>
                  <p className="text-gray-600">{stu.email}</p>
                  {stu.ticketSent && <span className="text-green-600 text-xs">🎟 Ticket Sent</span>}
                </div>
                {user?.uid === event.createdBy.uid && (
                  <div className="flex gap-2">
                    <button onClick={() => handleEditStudent(stu)} className="text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => handleDeleteStudent(stu.roll)} className="text-red-600 hover:underline">Delete</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        {user?.uid === event.createdBy.uid && (
          <form onSubmit={handleAddOrUpdateStudent} className="mt-6 space-y-2">
            <h3 className="font-semibold text-base">{editStudentRoll ? 'Edit Student' : 'Add New Student'}</h3>
            <input type="text" value={newStudent.name} placeholder="Name" onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })} className="w-full border p-2 rounded" />
            <input type="text" value={newStudent.roll} placeholder="Roll No" disabled={!!editStudentRoll} onChange={(e) => setNewStudent({ ...newStudent, roll: e.target.value })} className="w-full border p-2 rounded" />
            <input type="email" value={newStudent.email} placeholder="Email" onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })} className="w-full border p-2 rounded" />
            <button type="submit" className="bg-primary text-white px-4 py-2 rounded">{editStudentRoll ? 'Update Student' : 'Add Student'}</button>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
}

export default EventDetail;
