import React from 'react';
import { Link } from 'react-router-dom';

function EventCard({ event }) {
  if (!event) return null;

  return (
    <Link to={`/event/${event.id}`} className="block">
      <div className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition border">
        <h3 className="text-xl font-semibold text-primary mb-1">{event.eventname}</h3>
        <p className="text-gray-600 text-sm mb-2">{event.description}</p>
        <p className="text-sm">📍 {event.venue} | 📅 {event.date}</p>
        <p className="text-xs text-gray-400 mt-2">Created by: {event.createdBy?.name}</p>
      </div>
    </Link>
  );
}

export default EventCard;
