import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineLink,
  HiOutlineLightningBolt,
  HiOutlineShieldCheck,
  HiOutlineChartBar,
  HiOutlineQrcode,
  HiOutlineGlobe,
  HiOutlineClipboardCopy,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineStar,
} from 'react-icons/hi';
import Navbar from '../components/Navbar.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const features = [
  { icon: <HiOutlineLightningBolt className="w-6 h-6" />, title: 'Lightning Fast', description: 'Generate short URLs in milliseconds with our optimized infrastructure.' },
  { icon: <HiOutlineShieldCheck className="w-6 h-6" />, title: 'Secure & Reliable', description: 'Enterprise-grade security with HTTPS, rate limiting, and input validation.' },
  { icon: <HiOutlineChartBar className="w-6 h-6" />, title: 'Detailed Analytics', description: 'Track clicks, devices, browsers, and trends with beautiful dashboards.' },
  { icon: <HiOutlineQrcode className="w-6 h-6" />, title: 'QR Code Generation', description: 'Auto-generate QR codes for every link. Download as PNG instantly.' },
  { icon: <HiOutlineLink className="w-6 h-6" />, title: 'Custom Aliases', description: 'Create memorable branded links with custom aliases of your choice.' },
  { icon: <HiOutlineGlobe className="w-6 h-6" />, title: 'Link Management', description: 'Full CRUD dashboard to manage, edit, and organize all your links.' },
];

const steps = [
  { step: '01', title: 'Paste Your URL', description: 'Enter any long URL you want to shorten into the input field.' },
  { step: '02', title: 'Customize & Shorten', description: 'Optionally add a custom alias, then click shorten to generate your link.' },
  { step: '03', title: 'Share & Track', description: 'Copy your short link, share it anywhere, and track clicks in real-time.' },
];

const testimonials = [
  { name: 'Sarah Johnson', role: 'Marketing Manager', text: 'SnipLink transformed how we track our campaign links. The analytics are incredible!', rating: 5 },
  { name: 'Alex Chen', role: 'Developer', text: 'Clean API, fast redirects, and the QR code feature saves us so much time.', rating: 5 },
  { name: 'Maria Garcia', role: 'Content Creator', text: 'I love the custom aliases feature. My links look professional and branded now.', rating: 5 },
];

const faqs = [
  { question: 'Is SnipLink free to use?', answer: 'Yes! SnipLink offers a generous free tier with all core features including URL shortening, QR codes, custom aliases, and analytics.' },
  { question: 'How long do short URLs last?', answer: 'Short URLs created on SnipLink never expire. They will continue to redirect for as long as the service is running.' },
  { question: 'Can I use custom aliases?', answer: 'Absolutely! You can create memorable custom aliases like sniplink.com/my-brand instead of random characters.' },
  { question: 'Is my data secure?', answer: 'We use industry-standard encryption, secure password hashing, and follow best security practices to protect your data.' },
  { question: 'Can I track link performance?', answer: 'Yes, every link comes with detailed analytics including click counts, device types, browsers, and click trends over time.' },
];

/**
 * Landing page with hero, features, how it works, testimonials, FAQ, and footer
 */
const LandingPage = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
  };

  return (
    <div className="min-h-screen bg-white dark:bg-surface-950">
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 gradient-hero opacity-5 dark:opacity-20" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent-400/10 rounded-full blur-3xl" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium mb-6">
              <HiOutlineLightningBolt className="w-4 h-4" />
              Fast, Secure & Beautiful Link Shortener
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-surface-900 dark:text-white leading-tight mb-6">
              Shorten Your Links,{' '}
              <span className="gradient-text">Amplify Your Reach</span>
            </h1>

            <p className="text-lg sm:text-xl text-surface-600 dark:text-surface-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              Transform long, complex URLs into short, memorable links. Track every click
              with powerful analytics and boost your marketing performance.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
                className="px-8 py-3.5 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl text-base font-semibold hover:shadow-xl hover:shadow-primary-500/30 transition-all duration-300 transform hover:-translate-y-1 w-full sm:w-auto"
              >
                Start Shortening — Free
              </button>
              <a
                href="#features"
                className="px-8 py-3.5 border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 rounded-xl text-base font-semibold hover:bg-surface-50 dark:hover:bg-surface-800 transition-all w-full sm:w-auto text-center"
              >
                Explore Features
              </a>
            </div>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto"
          >
            {[
              { value: '10K+', label: 'Links Created' },
              { value: '500K+', label: 'Clicks Tracked' },
              { value: '99.9%', label: 'Uptime' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold gradient-text">{value}</p>
                <p className="text-xs sm:text-sm text-surface-500 dark:text-surface-400 mt-1">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="py-20 px-4 bg-surface-50 dark:bg-surface-900">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-white mb-4">
              Powerful Features for{' '}
              <span className="gradient-text">Modern Teams</span>
            </h2>
            <p className="text-surface-600 dark:text-surface-400 max-w-xl mx-auto">
              Everything you need to manage, track, and optimize your links in one place.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon, title, description }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="glass rounded-2xl p-6 hover:shadow-card-hover transition-all duration-300 group cursor-default"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                  {icon}
                </div>
                <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">
                  {title}
                </h3>
                <p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed">
                  {description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-white mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-surface-600 dark:text-surface-400 max-w-xl mx-auto">
              Three simple steps to start shortening and tracking your links.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map(({ step, title, description }, index) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className="text-center relative"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xl font-bold mx-auto mb-4 shadow-lg shadow-primary-500/25">
                  {step}
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary-300 to-accent-300 dark:from-primary-700 dark:to-accent-700" />
                )}
                <h3 className="text-xl font-semibold text-surface-900 dark:text-white mb-2">
                  {title}
                </h3>
                <p className="text-sm text-surface-600 dark:text-surface-400">
                  {description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="py-20 px-4 bg-surface-50 dark:bg-surface-900">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-white mb-4">
              Why Choose <span className="gradient-text">SnipLink</span>?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'No Link Expiration', desc: 'Your short links stay active forever — no renewals needed.' },
              { title: 'Real-Time Analytics', desc: 'Monitor click performance with live dashboards and charts.' },
              { title: 'Branded Short Links', desc: 'Use custom aliases to create professional, branded URLs.' },
              { title: 'Privacy Focused', desc: 'We respect your privacy. No tracking beyond what you need.' },
            ].map(({ title, desc }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex gap-4 glass rounded-2xl p-6"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white shrink-0">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold text-surface-900 dark:text-white mb-1">{title}</h3>
                  <p className="text-sm text-surface-600 dark:text-surface-400">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-white mb-4">
              Loved by <span className="gradient-text">Thousands</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, text, rating }, index) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className="glass rounded-2xl p-6"
              >
                <div className="flex gap-1 mb-3">
                  {[...Array(rating)].map((_, i) => (
                    <HiOutlineStar key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-surface-700 dark:text-surface-300 text-sm leading-relaxed mb-4">
                  &ldquo;{text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-semibold text-sm">
                    {name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-surface-900 dark:text-white">{name}</p>
                    <p className="text-xs text-surface-500">{role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" className="py-20 px-4 bg-surface-50 dark:bg-surface-900">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-white mb-4">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map(({ question, answer }, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="glass rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                >
                  <span className="font-medium text-surface-900 dark:text-white text-sm">
                    {question}
                  </span>
                  {openFaq === index ? (
                    <HiOutlineChevronUp className="w-5 h-5 text-primary-500 shrink-0" />
                  ) : (
                    <HiOutlineChevronDown className="w-5 h-5 text-surface-400 shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="px-6 pb-4"
                  >
                    <p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed">
                      {answer}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-white mb-4">
              Ready to <span className="gradient-text">Get Started</span>?
            </h2>
            <p className="text-surface-600 dark:text-surface-400 mb-8">
              Join thousands of users who trust SnipLink for their link management needs.
            </p>
            <Link
              to={isAuthenticated ? '/dashboard' : '/register'}
              className="inline-flex px-8 py-3.5 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl text-base font-semibold hover:shadow-xl hover:shadow-primary-500/30 transition-all duration-300 transform hover:-translate-y-1"
            >
              Create Your Free Account
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-8 px-4 border-t border-surface-200 dark:border-surface-800">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-xs">SL</span>
            </div>
            <span className="font-bold gradient-text">SnipLink</span>
          </div>
          <p className="text-sm text-surface-500 dark:text-surface-400">
            © {new Date().getFullYear()} SnipLink. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-surface-500 hover:text-primary-600 dark:text-surface-400 transition-colors">Privacy</a>
            <a href="#" className="text-sm text-surface-500 hover:text-primary-600 dark:text-surface-400 transition-colors">Terms</a>
            <a href="#" className="text-sm text-surface-500 hover:text-primary-600 dark:text-surface-400 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
