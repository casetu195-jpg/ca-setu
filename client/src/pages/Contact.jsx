import React, { useState } from 'react';
import SEO from '../components/common/SEO';
import { Mail, Phone, ExternalLink, Send, CheckCircle2, ShieldCheck, MessageSquare } from 'lucide-react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: 'Opportunity Inquiry',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <SEO
        title="Contact CA Dwar | Support, Verification & Inquiries"
        description="Get in touch with CA Dwar. Contact us for Articleship and Industrial Training inquiries, firm verification, or candidate support."
        canonicalPath="/contact"
      />

      <div className="text-center space-y-2 max-w-xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-[#176FA8] bg-[#EEF6FC] px-3.5 py-1.5 rounded-full border border-[#DCE5ED]">
          Get in Touch
        </span>
        <h1 className="text-3xl font-extrabold text-[#173B63]">
          Contact CA Dwar
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Have questions regarding CA firm verification, opportunity postings, or platform support? Reach out to our team directly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Info Column */}
        <div className="bg-[#173B63] text-white rounded-2xl p-6 sm:p-7 space-y-6 shadow-sm">
          <h2 className="font-bold text-lg border-b border-white/15 pb-3">
            Official Channels
          </h2>

          <div className="space-y-5 text-xs">
            {/* Email */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-[#EEF6FC]" />
              </div>
              <div>
                <strong className="block text-white font-semibold">Company Email</strong>
                <a
                  href="mailto:casetu195@gmail.com"
                  className="text-slate-300 hover:text-white underline underline-offset-2 transition-colors break-all"
                >
                  casetu195@gmail.com
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4 text-[#EEF6FC]" />
              </div>
              <div>
                <strong className="block text-white font-semibold">Founder Helpline</strong>
                <a
                  href="tel:+919699426036"
                  className="text-slate-300 hover:text-white font-medium transition-colors"
                >
                  +91 9699426036
                </a>
              </div>
            </div>

            {/* Official LinkedIn */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 fill-current text-[#EEF6FC]" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.77v8.37H6.46v-8.37M7.85 6.46a1.61 1.61 0 1 0 0 3.22 1.61 1.61 0 0 0 0-3.22Z" />
                </svg>
              </div>
              <div>
                <strong className="block text-white font-semibold">Company LinkedIn</strong>
                <a
                  href="https://www.linkedin.com/company/ca-dwar/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-white inline-flex items-center gap-1 transition-colors underline underline-offset-2"
                >
                  <span>CA Dwar Company Page</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>
            </div>

            {/* Founder Profile */}
            <div className="pt-3 border-t border-white/10">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300 block mb-1">
                Founder
              </span>
              <div className="font-bold text-white text-sm">Mohit Pandey</div>
              <div className="text-[11px] text-slate-300">Founder, CA Dwar</div>
              <a
                href="https://www.linkedin.com/in/mohitpandey195"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-xs text-sky-200 hover:text-white font-medium underline underline-offset-2"
              >
                <span>Mohit Pandey on LinkedIn</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Message Form Column */}
        <div className="md:col-span-2 bg-white border border-[#DCE5ED] rounded-2xl p-6 sm:p-8 shadow-2xs">
          {submitted ? (
            <div className="text-center py-8 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-[#16805C] mx-auto" />
              <h2 className="text-lg font-bold text-[#173B63]">Inquiry Received</h2>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                Thank you for reaching out. We will review your message and reply to your email address shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="flex items-center gap-2 pb-2 border-b border-[#DCE5ED]">
                <MessageSquare className="w-4 h-4 text-[#176FA8]" />
                <h2 className="text-sm font-bold text-[#173B63]">Send an Inquiry</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Mohit Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#176FA8] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Your Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="name@domain.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#176FA8] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Topic / Category
                </label>
                <select
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#176FA8] focus:outline-hidden"
                >
                  <option value="Opportunity Inquiry">Opportunity Listing Query</option>
                  <option value="CA Firm Verification">CA Firm Verification</option>
                  <option value="Industrial Training">Industrial Training Application</option>
                  <option value="General Support">General Support &amp; Feedback</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Message *
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="How can we assist you?"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#176FA8] focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#173B63] hover:bg-[#176FA8] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
