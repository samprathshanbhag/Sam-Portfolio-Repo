'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Mail, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';
import { useModal } from '@/context/ModalContext';
import { profile } from '@/data/profile';

export function ContactModal() {
  const { isContactOpen, closeContact } = useModal();
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Anti-bot honeypot
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Focus trap & Escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeContact();
    };

    if (isContactOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isContactOpen, closeContact]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Check honeypot
    if (honeypot) {
      setIsSubmitted(true);
      return;
    }

    if (!name.trim()) {
      setError('Please provide your name.');
      return;
    }

    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!message.trim()) {
      setError('Please let me know what you need or how we can collaborate.');
      return;
    }

    // Compose prefilled mailto URL
    const subject = encodeURIComponent(`Collaboration Inquiry from ${name.trim()}`);
    const bodyContent = [
      `Hi Samprath,`,
      ``,
      `Name: ${name.trim()}`,
      `Email: ${email.trim()}`,
      phone.trim() ? `Phone: ${phone.trim()}` : null,
      ``,
      `Project / Inquiries:`,
      message.trim(),
    ]
      .filter((line) => line !== null)
      .join('\n');

    const mailtoUrl = `mailto:${profile.email}?subject=${subject}&body=${encodeURIComponent(bodyContent)}`;

    // Open mail client
    window.location.href = mailtoUrl;

    // Show success state
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
    setIsSubmitted(false);
    setError(null);
  };

  return (
    <AnimatePresence>
      {isContactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeContact}
            className="fixed inset-0 bg-[#0A0A0A]/80 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg rounded-3xl bg-[#181717] border border-surface-border p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.85)] z-10"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
          >
            {/* Close button */}
            <button
              onClick={closeContact}
              className="absolute top-5 right-5 p-2 rounded-full bg-surface-subtle border border-surface-border text-content-secondary hover:text-content-primary hover:border-accent transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>

            {!isSubmitted ? (
              <>
                <div className="mb-6">
                  <span className="text-xs font-mono text-accent uppercase tracking-wider block mb-1">
                    Get in touch
                  </span>
                  <h3
                    id="contact-modal-title"
                    className="text-2xl font-semibold tracking-tight text-content-primary"
                  >
                    Let&apos;s start a conversation.
                  </h3>
                  <p className="text-xs sm:text-sm text-content-secondary mt-1">
                    Direct line to Samprath. Send your project details, data challenge, or opportunity.
                  </p>
                </div>

                {error && (
                  <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                  {/* Honeypot field for anti-spam (hidden) */}
                  <input
                    type="text"
                    name="website_pot"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    style={{ display: 'none' }}
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-xs font-mono text-content-secondary mb-1.5"
                    >
                      Your Name <span className="text-accent">*</span>
                    </label>
                    <input
                      ref={firstInputRef}
                      id="contact-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full px-4 py-2.5 rounded-xl bg-surface-subtle border border-surface-border focus:border-accent text-content-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent placeholder:text-content-muted"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-xs font-mono text-content-secondary mb-1.5"
                    >
                      Email Address <span className="text-accent">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@company.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-surface-subtle border border-surface-border focus:border-accent text-content-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent placeholder:text-content-muted"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-phone"
                      className="block text-xs font-mono text-content-secondary mb-1.5"
                    >
                      Phone Number <span className="text-content-muted">(Optional)</span>
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-2.5 rounded-xl bg-surface-subtle border border-surface-border focus:border-accent text-content-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent placeholder:text-content-muted"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-xs font-mono text-content-secondary mb-1.5"
                    >
                      What do you need? <span className="text-accent">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell me about your dataset, analytics goals, or role requirements..."
                      className="w-full px-4 py-2.5 rounded-xl bg-surface-subtle border border-surface-border focus:border-accent text-content-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent placeholder:text-content-muted resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-xl bg-accent hover:bg-accent-hover text-[#141313] font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(232,176,74,0.25)] hover:shadow-[0_0_30px_rgba(232,176,74,0.4)] focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </button>
                </form>
              </>
            ) : (
              /* Success State */
              <div className="py-8 text-center space-y-5">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h4 className="text-xl font-semibold text-content-primary">
                    Almost there!
                  </h4>
                  <p className="text-sm text-content-secondary leading-relaxed max-w-sm mx-auto">
                    Your email app has opened with your message ready to go. Simply hit Send in your email client.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-surface-subtle border border-surface-border text-xs text-content-secondary space-y-2">
                  <p>Email app didn&apos;t open automatically?</p>
                  <a
                    href={`mailto:${profile.email}?subject=Direct%20Inquiry&body=Hi%20Samprath,`}
                    className="inline-flex items-center gap-1.5 text-accent font-medium hover:underline"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Write directly to {profile.email}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 rounded-lg bg-surface-subtle hover:bg-surface-elevated text-xs font-mono text-content-secondary transition-colors"
                  >
                    Send another message
                  </button>
                  <button
                    onClick={closeContact}
                    className="px-5 py-2 rounded-lg bg-accent text-[#141313] text-xs font-mono font-medium transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

