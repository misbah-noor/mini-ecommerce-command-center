import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaGithub, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[var(--color-bg)] border-t border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-4 gap-10">

        {/* Brand Section */}
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">
            Mini Commerce
          </h2>
          <p className="text-[var(--color-muted)] leading-relaxed">
            A modern ecommerce command center built with precision,
            performance, and simplicity.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
          <ul className="space-y-3 text-[var(--color-muted)]">
            <li>
              <Link to="/home" className="hover:text-[var(--color-primary)] transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-[var(--color-primary)] transition">
                Cart
              </Link>
            </li>
            <li>
              <Link to="/orders" className="hover:text-[var(--color-primary)] transition">
                Orders
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Support</h3>
          <ul className="space-y-3 text-[var(--color-muted)]">
            <li className="hover:text-[var(--color-primary)] transition cursor-pointer">
              Help Center
            </li>
            <li className="hover:text-[var(--color-primary)] transition cursor-pointer">
              Privacy Policy
            </li>
            <li className="hover:text-[var(--color-primary)] transition cursor-pointer">
              Terms & Conditions
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Connect</h3>
          <div className="flex gap-4">
            <a
              href="https://www.facebook.com"
              className="w-10 h-10 flex items-center justify-center rounded-full 
              bg-[var(--color-bg)] border border-[var(--color-border)] 
              hover:bg-[var(--color-primary)] hover:text-white transition"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://www.instagram.com"
              className="w-10 h-10 flex items-center justify-center rounded-full 
              bg-[var(--color-bg)] border border-[var(--color-border)] 
              hover:bg-[var(--color-primary)] hover:text-white transition"
            >
              <FaInstagram />
            </a>
            <a
              href="https://github.com/misbah-noor"
              className="w-10 h-10 flex items-center justify-center rounded-full 
              bg-[var(--color-bg)] border border-[var(--color-border)] 
              hover:bg-[var(--color-primary)] hover:text-white transition"
            >
              <FaGithub />
            </a>
            <a
              href="https://www.linkedin.com/in/misbah-noor-9a1b3220b/"
              className="w-10 h-10 flex items-center justify-center rounded-full 
              bg-[var(--color-bg)] border border-[var(--color-border)] 
              hover:bg-[var(--color-primary)] hover:text-white transition"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-[var(--color-border)] py-6 text-center text-[var(--color-muted)] text-sm">
        © {new Date().getFullYear()} Mini Commerce Command Center. Developed by Misbah Noor.
      </div>
    </footer>
  );
};

export default Footer;