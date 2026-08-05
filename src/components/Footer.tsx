import { useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter, FaStore } from "react-icons/fa";
import { IoMail, IoCall, IoLocationSharp } from "react-icons/io5";
import { brand } from "../data/data";
import { toast } from "react-toastify";

const Footer: React.FC = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }
    toast.success("Subscribed! You'll hear from us soon.");
    setEmail("");
  };

  return (
    <footer className="bg-gray-950 text-gray-300">
      <div className="container-app grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-lg text-white">
              <FaStore />
            </span>
            <span className="font-display text-2xl font-bold text-white">
              Best<span className="text-brand-400">Eats</span>
            </span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed">
            {brand.tagline} Fresh ingredients, honest recipes and reliable
            delivery every single day.
          </p>
          <div className="mt-5 flex gap-3">
            {[
              { href: brand.socials.facebook, label: "Facebook", Icon: FaFacebookF },
              { href: brand.socials.twitter, label: "Twitter", Icon: FaTwitter },
              { href: brand.socials.instagram, label: "Instagram", Icon: FaInstagram },
            ].map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-brand hover:text-white"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-4 font-display text-base font-bold text-white">
            Quick Links
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-brand-400">Home</Link>
            </li>
            <li>
              <Link to="/menu" className="hover:text-brand-400">Menu</Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-brand-400">Cart</Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-brand-400">My account</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-display text-base font-bold text-white">
            Contact
          </h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <IoLocationSharp className="mt-0.5 text-brand-400" />
              {brand.address}
            </li>
            <li className="flex items-center gap-3">
              <IoCall className="text-brand-400" /> {brand.phone}
            </li>
            <li className="flex items-center gap-3">
              <IoMail className="text-brand-400" /> {brand.email}
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-display text-base font-bold text-white">
            Newsletter
          </h4>
          <p className="mb-4 text-sm">
            Get exclusive deals and new menu drops in your inbox.
          </p>
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="input !bg-white/10 !border-white/10 !text-white placeholder:!text-gray-400"
              aria-label="Email address"
            />
            <button type="submit" className="btn-primary shrink-0">
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} {brand.name}. All rights reserved. Demo
        project — data is fictional.
      </div>
    </footer>
  );
};

export default Footer;
