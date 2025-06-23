import React, { useEffect, useRef, useState } from 'react';
import { collection, getDocs, doc, getDoc, setDoc, query, deleteDoc } from 'firebase/firestore';
import { db } from '../auth/config';
import { getAuth } from 'firebase/auth';
import DashboardLayout from '../layouts/DashboardLayout';

function CheckIn() {
  const scannerRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState('');
  const [scanning, setScanning] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [checkIns, setCheckIns] = useState([]);
  const [globalStats, setGlobalStats] = useState({ totalCheckins: 0, totalRegistered: 0 });

  const fetchGlobalStats = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, 'events'));
    const snapshot = await getDocs(q);
    let allRegistered = 0;
    let allCheckins = 0;
    let allCheckInList = [];

    await Promise.all(snapshot.docs.map(async (docSnap) => {
      const eventId = docSnap.id;
      const stuSnap = await getDocs(collection(db, `events/${eventId}/students`));
      const chkSnap = await getDocs(collection(db, `events/${eventId}/checkins`));
      allRegistered += stuSnap.size;
      allCheckins += chkSnap.size;

      chkSnap.forEach(doc => {
        allCheckInList.push({ ...doc.data(), eventId });
      });
    }));

    setGlobalStats({ totalCheckins: allCheckins, totalRegistered: allRegistered });
    setCheckIns(allCheckInList.sort((a, b) => b.timestamp?.seconds - a.timestamp?.seconds));
  };

  useEffect(() => {
    const fetchEvents = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const q = query(collection(db, 'events'));
      const snapshot = await getDocs(q);
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(fetched);
    };

    fetchEvents();
    fetchGlobalStats();
  }, []);

  const handleScan = async (text) => {
    const rollScanned = text.trim();
    let found = false;

    if (!selectedEventId) {
      setStatus('❌ Please select an event first');
      return;
    }

    const studentsSnap = await getDocs(collection(db, `events/${selectedEventId}/students`));
    const match = studentsSnap.docs.find(doc => String(doc.data().roll).trim() === rollScanned);

    if (match) {
      found = true;
      const data = match.data();
      setResult(data);

      const checkinRef = doc(db, `events/${selectedEventId}/checkins/${rollScanned}`);
      const checkinSnap = await getDoc(checkinRef);

      if (checkinSnap.exists()) {
        setStatus('⚠️ Already checked in');
      } else {
        await setDoc(checkinRef, {
          ...data,
          roll: Number(data.roll),
          timestamp: new Date()
        });
        setStatus('✅ Checked in');
      }
    }

    if (!found) {
      setStatus('❌ Student not found in selected event');
      setResult(null);
    }

    scannerRef.current?.stop();
    setScanning(false);
    fetchGlobalStats();
  };

  const startCamera = async () => {
    if (scanning) return;
    const { Html5Qrcode } = await import('html5-qrcode');

    const scanner = new Html5Qrcode('reader');
    scannerRef.current = scanner;

    try {
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: 250 },
        handleScan,
        (err) => { }
      );
      setScanning(true);
      setCameraError(false);
    } catch (err) {
      setCameraError(true);
      setStatus('❌ Camera access denied or not available');
    }
  };

  // ✅ Delete Function
  const deleteCheckIn = async (stu) => {
    try {
      const deleteRef = doc(db, "events", stu.eventId, "checkins", String(stu.roll));
      await deleteDoc(deleteRef);

      // Update UI
      setCheckIns(prev => prev.filter(item =>
        item.roll !== stu.roll || item.eventId !== stu.eventId
      ));

      setStatus(`🗑️ Deleted check-in: ${stu.name}`);
    } catch (error) {
      console.error("Delete failed:", error);
      setStatus("❌ Failed to delete check-in");
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-1">Check-in</h1>
        <p className="text-sm text-gray-600 mb-4">Scan QR codes to verify student attendance</p>

        <div className="mb-4">
          <label className="block font-medium mb-1">Select Event</label>
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="w-full md:w-1/2 border p-2 rounded"
          >
            <option value="">-- Select Event --</option>
            {events.map(ev => (
              <option key={ev.id} value={ev.id}>{ev.eventname} ({ev.date})</option>
            ))}
          </select>
        </div>

        {selectedEventId && (
          <div className="flex flex-wrap gap-4 mb-6">
            <button onClick={startCamera} className="bg-purple-600 text-white px-4 py-2 rounded">
              📷 Start QR Scanner
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard title="Checked In" value={globalStats.totalCheckins} />
          <StatCard title="Total Registered" value={globalStats.totalRegistered} />
          <StatCard title="Pending" value={globalStats.totalRegistered - globalStats.totalCheckins} />
          <StatCard title="Attendance Rate" value={
            globalStats.totalRegistered
              ? `${Math.round((globalStats.totalCheckins / globalStats.totalRegistered) * 100)}%`
              : '0%'}
          />
        </div>

        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-1">QR Code Scanner</h2>
          <p className="text-sm text-gray-600 mb-2">Click "Start QR Scanner" to begin</p>
          <div id="reader" className="w-full max-w-md mx-auto border rounded shadow mb-4" />
          {cameraError && <p className="text-red-600 mt-2">Please allow camera access and retry.</p>}
        </div>

        {status && <div className="mt-4 font-semibold text-purple-700">{status}</div>}

        {result && (
          <div className="mt-4 p-4 border rounded bg-white shadow-md">
            <p><strong>Name:</strong> {result.name}</p>
            <p><strong>Roll No:</strong> {result.roll}</p>
            <p><strong>Branch:</strong> {result.branch || '-'}</p>
          </div>
        )}

        <div className="mt-10">
          <h2 className="text-xl font-bold mb-2">All Check-ins</h2>
          <div className="overflow-x-auto border rounded">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2">Name</th>
                  <th className="p-2">Roll</th>
                  <th className="p-2">Branch</th>
                  <th className="p-2">Time</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {checkIns.map((stu, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="p-2">{stu.name}</td>
                    <td className="p-2">{stu.roll}</td>
                    <td className="p-2">{stu.branch || '-'}</td>
                    <td className="p-2">{stu.timestamp?.toDate().toLocaleString()}</td>
                    <td className="p-2">
                      <button
                        onClick={() => deleteCheckIn(stu)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

const StatCard = ({ title, value }) => (
  <div className="p-4 bg-white rounded shadow text-center">
    <div className="text-lg font-bold">{value}</div>
    <div className="text-sm text-gray-500">{title}</div>
  </div>
);

export default CheckIn;
