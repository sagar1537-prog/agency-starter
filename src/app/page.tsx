'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Calendar, Clock, Phone, Mail, Trash2 } from 'lucide-react';

interface Booking {
  id: string;
  created_at: string;
  client_name: string;
  phone: string;
  email: string | null;
  service: string;
  booking_date: string;
  booking_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes: string | null;
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('booking_date', { ascending: true });

    if (error) {
      console.error('Error fetching bookings:', error.message);
    } else {
      setBookings(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id: string, newStatus: Booking['status']) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      alert('Failed to update status: ' + error.message);
    } else {
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
      );
    }
  };

  const deleteBooking = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this booking record?');
    if (!confirmed) return;

    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Failed to delete booking: ' + error.message);
    } else {
      setBookings((prev) => prev.filter((b) => b.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-slate-800 gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Appointments Portal</h1>
            <p className="text-slate-400 text-sm mt-1">Real-time incoming client reservations</p>
          </div>
          <button
            onClick={fetchBookings}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg transition border border-slate-700"
          >
            Refresh Records
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-500 text-sm">Loading appointment stream...</div>
        ) : bookings.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-sm">No reservations submitted yet.</div>
        ) : (
          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Slot</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-900/40 transition">
                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-200">{booking.client_name}</div>
                      {booking.notes && (
                        <div className="text-xs text-slate-500 mt-0.5 max-w-xs truncate">{booking.notes}</div>
                      )}
                    </td>
                    <td className="py-4 px-4 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-300">
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        <a href={`https://wa.me/${booking.phone.replace(/[^0-9]/g, '')}`} target="_blank" className="hover:underline">
                          {booking.phone}
                        </a>
                      </div>
                      {booking.email && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Mail className="w-3.5 h-3.5 text-slate-500" />
                          {booking.email}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className="bg-slate-800 border border-slate-700/60 px-2.5 py-1 rounded-md text-xs font-medium text-slate-300">
                        {booking.service}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-300">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {booking.booking_date}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {booking.booking_time}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          booking.status === 'confirmed'
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/80'
                            : booking.status === 'completed'
                            ? 'bg-blue-950/60 text-blue-400 border border-blue-800/80'
                            : 'bg-amber-950/60 text-amber-400 border border-amber-800/80'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right space-x-2">
                      {booking.status !== 'confirmed' && (
                        <button
                          onClick={() => updateStatus(booking.id, 'confirmed')}
                          className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded text-xs transition"
                        >
                          Confirm
                        </button>
                      )}
                      {booking.status !== 'completed' && (
                        <button
                          onClick={() => updateStatus(booking.id, 'completed')}
                          className="px-2.5 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded text-xs transition"
                        >
                          Complete
                        </button>
                      )}
                      <button
                        onClick={() => deleteBooking(booking.id)}
                        className="p-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/60 rounded text-xs transition inline-flex items-center"
                        title="Delete booking"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}