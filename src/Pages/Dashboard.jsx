import DashboardLayout from "../layouts/DashboardLayout";
import { auth } from "../auth/config";
import { useAuthState } from "react-firebase-hooks/auth";
import EventCards from "../Components/EventCard";
import EventsList from "../Components/EventList";
export default function Dashboard() {
  const [user] = useAuthState(auth);
  const name=user.displayName
  
  return (
    <DashboardLayout>
      <div className="">
      <h1 className="text-2xl md:text-3xl  font-bold mb-2 " >Dashboard</h1>
      <h1 className="text-2xl font-bold mb-2">👋 Welcome, {name}</h1>
      </div>
      <EventsList />
    </DashboardLayout>
  );
}
