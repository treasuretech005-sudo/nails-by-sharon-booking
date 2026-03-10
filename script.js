/* =============================================
   NAILS BY SHARON — script.js
   ============================================= */

// ── Reveal logo only after Great Vibes font is loaded (prevents capital-N flash) ──
if (document.fonts && document.fonts.load) {
  document.fonts.load('1em "Great Vibes"').then(function () {
    document.documentElement.classList.add('fonts-loaded');
  });
} else {
  // Fallback for browsers without font loading API
  document.documentElement.classList.add('fonts-loaded');
}

// ── WhatsApp number (with country code, digits only) ──
const WHATSAPP_NUMBER = "2348130142458";

// ─────────────────────────────────────────────
// NAVBAR: scroll shadow + hamburger toggle
// ─────────────────────────────────────────────
(function () {
  const navbar = document.getElementById("navbar");
  const toggle = document.getElementById("navToggle");
  const links  = document.getElementById("navLinks");

  // Shadow on scroll
  window.addEventListener("scroll", function () {
    navbar.classList.toggle("scrolled", window.scrollY > 18);
  });

  // Hamburger open / close
  toggle.addEventListener("click", function () {
    const isOpen = links.classList.toggle("open");
    toggle.classList.toggle("open", isOpen);
    toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  // Close when any nav link is tapped
  links.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      links.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-label", "Open menu");
    });
  });
}());

// ─────────────────────────────────────────────
// SMOOTH SCROLL (polyfill for older browsers)
// ─────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener("click", function (e) {
    var href   = this.getAttribute("href");
    var target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    var navH = document.getElementById("navbar").offsetHeight;
    var top  = target.getBoundingClientRect().top + window.pageYOffset - navH;
    window.scrollTo({ top: top, behavior: "smooth" });
  });
});

// ─────────────────────────────────────────────
// SCROLL REVEAL
// ─────────────────────────────────────────────
(function () {
  var revealEls = document.querySelectorAll(".reveal");
  if (!revealEls.length) return;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        // Stagger siblings that haven't revealed yet
        var siblings = Array.from(
          entry.target.parentElement.querySelectorAll(".reveal:not(.visible)")
        );
        var delay = siblings.indexOf(entry.target) * 75;

        setTimeout(function () {
          entry.target.classList.add("visible");
        }, delay);

        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.1 }
  );

  revealEls.forEach(function (el) { observer.observe(el); });
}());

// ─────────────────────────────────────────────
// FOOTER — current year
// ─────────────────────────────────────────────
var yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ─────────────────────────────────────────────
// BOOKING FORM → WhatsApp
// ─────────────────────────────────────────────
(function () {
  var form = document.getElementById("bookingForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var nailType    = form.nailType.value;
    var nailLength  = form.nailLength.value;
    var nailShape   = form.nailShape.value;
    var designStyle = form.designStyle.value;
    var prefDate    = form.prefDate.value;
    var prefTime    = form.prefTime.value;

    // Validate — highlight empty fields
    if (!nailType || !nailLength || !nailShape || !designStyle || !prefDate || !prefTime) {
      highlightEmpty(form);
      return;
    }

    // Format date nicely (e.g. "Monday, 14 April 2025")
    var dateObj       = new Date(prefDate + "T00:00:00");
    var dateFormatted = dateObj.toLocaleDateString("en-NG", {
      weekday: "long",
      year:    "numeric",
      month:   "long",
      day:     "numeric"
    });

    // Format time nicely (e.g. "02:30 PM")
    var timeParts     = prefTime.split(":");
    var timeDate      = new Date();
    timeDate.setHours(parseInt(timeParts[0], 10), parseInt(timeParts[1], 10));
    var timeFormatted = timeDate.toLocaleTimeString("en-NG", {
      hour:   "2-digit",
      minute: "2-digit"
    });

    var message = [
      "Hello, I would like to book an appointment.",
      "",
      "Nail Type: "    + nailType,
      "Nail Length: "  + nailLength,
      "Nail Shape: "   + nailShape,
      "Design Style: " + designStyle,
      "Preferred Date: " + dateFormatted,
      "Preferred Time: " + timeFormatted
    ].join("\n");

    var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
    window.open(url, "_blank", "noopener,noreferrer");
  });

  function highlightEmpty(form) {
    var fields = form.querySelectorAll("select, input");

    fields.forEach(function (field) {
      if (!field.value) {
        field.classList.add("error");
        field.addEventListener("change", function () {
          field.classList.remove("error");
        }, { once: true });
      }
    });

    // Scroll to and focus the first empty field
    var first = Array.from(fields).find(function (f) { return !f.value; });
    if (first) {
      first.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(function () { first.focus(); }, 400);
    }
  }
}());
