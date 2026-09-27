'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Calendar, Clock, CheckCircle2, MessageSquare, ArrowRight } from 'lucide-react';

export default function Home() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    service: 'General Consultation',
    date: '',
    time: '10:00 AM',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1. Insert into Supabase
    const { error } = await supabase.from('bookings').insert([
      {
        client_name: form.name,
        phone: form.phone,
        email: form.email,
        service: form.service,
        booking_date: form.date,
        booking_time: form.time,
        notes: form.notes,
        status: 'pending',
      },
    ]);

    setLoading(false);

    if (error) {
      alert('Error creating booking: ' + error.message);
      return;
    }

    setSubmitted(true);

    // 2. Format zero-cost WhatsApp direct message
    const businessWhatsAppNumber = '916379354232'; // Replace with target business WhatsApp
    const message = encodeURIComponent(
      `*New Appointment Booking*\n\n` +
      `*Name:* ${form.name}\n` +
      `*Phone:* ${form.phone}\n` +
      `*Service:* ${form.service}\n` +
      `*Slot:* ${form.date} at ${form.time}\n` +
      `*Notes:* ${form.notes || 'None'}\n\n` +
      `_Submitted via Instant Portal_`
    );

    // Auto-open WhatsApp web/app
    window.open(`https://wa.me/${businessWhatsAppNumber}?text=${message}`, '_blank');
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12">
      <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <div className="mb-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-full">
            Instant 24/7 Scheduling
          </span>
          <h1 className="text-3xl font-bold mt-4 tracking-tight">Book Your Appointment</h1>
          <p className="text-slate-400 text-sm mt-2">
            Select your preferred time slot. You will receive an instant WhatsApp confirmation.
          </p>
        </div>

        {submitted ? (
          <div className="p-6 bg-emerald-950/40 border border-emerald-800/80 rounded-xl text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h2 className="text-xl font-semibold text-emerald-300">Booking Received!</h2>
            <p className="text-slate-300 text-sm">
              Your details are registered and forwarded to WhatsApp for instant confirmation.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition"
            >
              Book Another Slot
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <input
                required
                type="text"
                placeholder="Dr. Rajesh Kumar"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">WhatsApp Phone Number</label>
                <input
                  required
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Service Type</label>
              <select
                value={form.service}
                onChange={(e) => setForm({ ...form, service: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
              >
                <option>General Consultation</option>
                <option>Specialist Review</option>
                <option>Diagnostic Checkup</option>
                <option>Personal Coaching Session</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Date</label>
                <div className="relative">
                  <input
                    required
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Preferred Time Slot</label>
                <select
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option>10:00 AM</option>
                  <option>11:30 AM</option>
                  <option>02:00 PM</option>
                  <option>04:30 PM</option>
                  <option>06:00 PM</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Additional Notes (Optional)</label>
              <textarea
                rows={2}
                placeholder="Briefly state symptoms or requirements..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold py-3 px-4 rounded-xl transition duration-150 disabled:opacity-50"
            >
              {loading ? 'Confirming...' : 'Reserve Slot via WhatsApp'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </main>
  );
}