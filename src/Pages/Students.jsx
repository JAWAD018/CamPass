import React, { useEffect, useState } from 'react';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../auth/config';
import DashboardLayout from '../layouts/DashboardLayout';

function Students() {
  const [students, setStudents] = useState([]);
  const [searchEvent, setSearchEvent] = useState('');
  const [searchDept, setSearchDept] = useState('');
  const [allStudents, setAllStudents] = useState([]);

  const fetchStudents = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const eventQuery = query(collection(db, 'events'), where('createdBy.uid', '==', user.uid));
    const eventSnapshot = await getDocs(eventQuery);

    const allFetchedStudents = [];

    for (const docSnap of eventSnapshot.docs) {
      const eventId = docSnap.id;
      const eventData = docSnap.data();

      const stuSnap = await getDocs(collection(db, 'events', eventId, 'students'));

      stuSnap.forEach((stuDoc) => {
        allFetchedStudents.push({
          id: stuDoc.id,
          ...stuDoc.data(),
          eventName: eventData.eventname,
        });
      });
    }

    setStudents(allFetchedStudents);
    setAllStudents(allFetchedStudents);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleFilter = () => {
    const filtered = allStudents.filter((s) => {
      const matchEvent = searchEvent === '' || s.eventName.toLowerCase().includes(searchEvent.toLowerCase());
      const matchDept = searchDept === '' || s.branch?.toLowerCase().includes(searchDept.toLowerCase());
      return matchEvent && matchDept;
    });
    setStudents(filtered);
  };

  return (
    <DashboardLayout>
      <div className="md:flex md:justify-between mb-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Students</h1>
          <p className="text-lg font-Fira">Manage student records and event registrations</p>
        </div>
      </div>

      {/* Filters */}
          <div className="border border-gray-200 p-5  rounded-lg mb-5">        
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
          <input
          type="text"
          placeholder="Search by Event Name"
          className="p-2 border rounded"
          value={searchEvent}
          onChange={(e) => setSearchEvent(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by Department"
          className="p-2 border rounded"
          value={searchDept}
          onChange={(e) => setSearchDept(e.target.value)}
        />
        <button onClick={handleFilter} className="bg-purple-600 text-white px-4 py-2 rounded">
          Filter
        </button>
      </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
          <h1 className='text-2xl font-semibold p-2'>Student Records</h1>
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Roll No</th>
              <th className="border border-gray-300 px-4 py-2">Branch</th>
              <th className="border border-gray-300 px-4 py-2">Event</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((stu, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{stu.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{stu.email}</td>
                  <td className="border border-gray-300 px-4 py-2">{stu.roll}</td>
                  <td className="border border-gray-300 px-4 py-2">{stu.branch || '-'}</td>
                  <td className="border border-gray-300 px-4 py-2">{stu.eventName}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-4" colSpan="5">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}

export default Students;
