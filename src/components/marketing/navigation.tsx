"use client";

import { useEffect, useRef, useState } from "react";
import { Brand, Icon } from "./icons";

const links = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#applications", label: "Your applications" },
  { href: "#faq", label: "FAQ" },
];

export function MarketingNavigation() {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    function onEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    }
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [open]);

  return (
    <header className="marketing-header">
      <div className="marketing-container marketing-header-inner">
        <a href="#top" aria-label="[Name] home" onClick={() => setOpen(false)}>
          <Brand />
        </a>
        <nav className="marketing-desktop-nav" aria-label="Main navigation">
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="marketing-header-actions">
          <a
            className="marketing-button marketing-button-small"
            href="#early-access"
            data-landing-event="cta_click"
            data-placement="navigation"
          >
            Join early access <Icon name="arrow" size={16} />
          </a>
          <button
            ref={menuButton}
            type="button"
            className="marketing-menu-button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(!open)}
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
      </div>
      {open && (
        <nav
          id="mobile-navigation"
          className="marketing-mobile-nav"
          aria-label="Mobile navigation"
        >
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
              <Icon name="arrow" size={16} />
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
