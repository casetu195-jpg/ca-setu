import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: 'Firm Verification', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <h1 className="text-3xl font-extrabold text-[#173B63]">
          Contact CA Dwar Support
        </h1>
        <p className="text-sm text-slate-600">
          Have questions regarding CA firm verification, job moderation, or partnership opportunities? Reach out to our team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Info Column */}
        <div className="bg-[#173B63] text-white rounded-2xl p-6 space-y-6">
          <h3 className="font-bold text-lg">Support Channels</h3>
          
          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-[#EEF6FC] mt-0.5" />
              <div>
                <strong className="block text-white">General & Verification Email</strong>
                <span className="text-slate-300">support@cadwar.in</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-[#EEF6FC] mt-0.5" />
              <div>
                <strong className="block text-white">Helpline (Mon–Fri 10am–6pm)</strong>
                <span className="text-slate-300">+91 (022) 4890-2340</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#EEF6FC] mt-0.5" />
              <div>
                <strong className="block text-white">Corporate Headquarters</strong>
                <span className="text-slate-300">Bandra Kurla Complex (BKC), Mumbai, MH 400051</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div className="md:col-span-2 bg-white border border-[#DCE5ED] rounded-2xl p-6 sm:p-8 shadow-2xs">
          {submitted ? (
            <div className="text-center py-8 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-[#16805C] mx-auto" />
              <h3 className="text-lg font-bold text-[#173B63]">Inquiry Dispatched</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Thank you for getting in touch. A CA Dwar operations representative will follow up via email within 24 business hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#176FA8] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Your Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#176FA8] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Subject Area
                </label>
                <select
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#176FA8] focus:outline-hidden"
                >
                  <option value="Firm Verification">CA Firm FRN Verification</option>
                  <option value="Student Support">Student Profile or Resume Issue</option>
                  <option value="Job Moderation">Job Listing Query</option>
                  <option value="Partnership">Campus / Firm Partnership</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Message
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Describe your question or firm details..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#176FA8] focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#173B63] hover:bg-[#176FA8] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
