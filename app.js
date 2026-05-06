/* ============================================================
   GapVice — app.js v2
   Enhanced: particles · cursor glow · ripple · page loader
   · counter animations · scroll-based effects · theme
   ============================================================ */

/* ── Apply saved theme immediately (no FOUC) ── */
(function () {
  const t = localStorage.getItem('gapvice_theme') || 'light';
  document.documentElement.setAttribute('data-theme', t);
})();

/* ══════════════════════════════════════════════
   DOM READY
══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function () {

  /* ── Page Loader ── */
  initPageLoader();

  /* ── Dark Mode ── */
  initTheme();

  /* ── Navbar ── */
  initNavbar();

  /* ── Mobile menu ── */
  initMobileMenu();

  /* ── Scroll Reveal ── */
  initScrollReveal();

  /* ── Smooth anchor scroll ── */
  initSmoothScroll();

  /* ── Active nav link ── */
  initActiveLink();

  /* ── Particles (hero only) ── */
  if (document.getElementById('particles-canvas')) initParticles();

  /* ── Cursor glow ── */
  initCursorGlow();

  /* ── Button ripple ── */
  initRipple();

  /* ── Load Dynamic Admin Content ── */
  loadDynamicContent();

  /* ── Counter animation (hero stats) ── */
  initCounters();

  /* ── Noise overlay ── */
  initNoise();

  /* ── Parallax blobs ── */
  initParallax();

  /* ── Card tilt effect ── */
  initCardTilt();

});

/* ══════════════════════════════════════════════
   DYNAMIC CONTENT LOADER (Admin Persistence)
══════════════════════════════════════════════ */
function loadDynamicContent() {
  const settings = JSON.parse(localStorage.getItem('gapvice_settings') || '{}');
  
  if (settings.headline) {
    const el = document.getElementById('dynamicHeroTitle');
    if (el) el.innerHTML = settings.headline;
  }
  
  if (settings.subheadline) {
    const el = document.getElementById('dynamicHeroDesc');
    if (el) el.textContent = settings.subheadline;
  }
  
  if (settings.email) {
    const textEl = document.getElementById('dynamicEmailText');
    const linkEl = document.getElementById('dynamicEmailLink');
    if (textEl) textEl.textContent = settings.email;
    if (linkEl) linkEl.href = `mailto:${settings.email}`;
  }
  
  if (settings.address) {
    const el = document.getElementById('dynamicAddressText');
    if (el) el.textContent = settings.address;
  }
  
  if (settings.statStudents) {
    const el = document.getElementById('dynamicHeroStatStudents');
    if (el) el.textContent = settings.statStudents;
  }
  
  if (settings.statRoles) {
    const el = document.getElementById('dynamicHeroStatRoles');
    if (el) el.textContent = settings.statRoles;
  }
  
  if (settings.statAccuracy) {
    const el = document.getElementById('dynamicHeroStatAccuracy');
    if (el) el.textContent = settings.statAccuracy;
  }
}

/* ══════════════════════════════════════════════
   PAGE LOADER
══════════════════════════════════════════════ */
function initPageLoader() {
  // Only show on first visit or navigation
  const loader = document.createElement('div');
  loader.className = 'page-loader';
  loader.id = 'pageLoader';
  loader.innerHTML = `
    <div class="page-loader-icon">🎯</div>
    <div class="page-loader-bar-wrap"><div class="page-loader-bar"></div></div>
    <div style="color:rgba(255,255,255,.75);font-size:.85rem;font-weight:600;letter-spacing:.05em;">Skill Match</div>
  `;
  document.body.appendChild(loader);
  setTimeout(() => {
    loader.classList.add('hidden');
    setTimeout(() => loader.remove(), 500);
  }, 700);
}

/* ══════════════════════════════════════════════
   THEME TOGGLE
══════════════════════════════════════════════ */
function initTheme() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  const updateIcon = () => {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    btn.textContent = dark ? '☀️' : '🌙';
    btn.title = dark ? 'Switch to light mode' : 'Switch to dark mode';
  };
  updateIcon();
  btn.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('skillmatch_theme', next);
    updateIcon();
    showToast(next === 'dark' ? '🌙 Dark mode on' : '☀️ Light mode on', 'default', 1800);
  });
}

/* ══════════════════════════════════════════════
   NAVBAR
══════════════════════════════════════════════ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 20);
    // Hide navbar on fast scroll down, show on up
    if (y > 100) {
      navbar.style.transform = y > lastY + 10 ? 'translateY(-100%)' : 'translateY(0)';
    } else {
      navbar.style.transform = 'translateY(0)';
    }
    lastY = y;
  }, { passive: true });
}

/* ══════════════════════════════════════════════
   MOBILE MENU
══════════════════════════════════════════════ */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  if (!hamburger || !menu) return;

  const toggle = (open) => {
    menu.classList.toggle('open', open);
    const spans = hamburger.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  };

  hamburger.addEventListener('click', () => toggle(!menu.classList.contains('open')));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggle(false)));
  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !menu.contains(e.target)) toggle(false);
  });
}

/* ══════════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════════ */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
}

/* ══════════════════════════════════════════════
   SMOOTH SCROLL
══════════════════════════════════════════════ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
      }
    });
  });
}

/* ══════════════════════════════════════════════
   ACTIVE LINK
══════════════════════════════════════════════ */
function initActiveLink() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href.includes(page)) link.classList.add('active');
    else if (page === '' && href === 'index.html') link.classList.add('active');
  });
}

/* ══════════════════════════════════════════════
   PARTICLES — Canvas-based floating dots
══════════════════════════════════════════════ */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  const resize = () => {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const COLORS = ['#6366f1','#a855f7','#ec4899','#06b6d4','#10b981','#f59e0b'];
  const COUNT = 55;

  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2.5 + .8,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      speedX: (Math.random() - .5) * .6,
      speedY: (Math.random() - .5) * .6,
      opacity: Math.random() * .5 + .15,
      opacityDir: Math.random() > .5 ? 1 : -1,
      opacitySpeed: Math.random() * .005 + .002,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + Math.round(p.opacity * 255).toString(16).padStart(2, '0');
      ctx.fill();

      p.x += p.speedX; p.y += p.speedY;
      p.opacity += p.opacityDir * p.opacitySpeed;
      if (p.opacity > .65 || p.opacity < .1) p.opacityDir *= -1;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
    });

    // Draw connections
    particles.forEach((a, i) => {
      particles.slice(i + 1).forEach(b => {
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(99,102,241,${(.08 * (1 - dist / 120)).toFixed(3)})`;
          ctx.lineWidth = .5;
          ctx.stroke();
        }
      });
    });

    requestAnimationFrame(draw);
  }
  draw();
}

/* ══════════════════════════════════════════════
   CURSOR GLOW
══════════════════════════════════════════════ */
function initCursorGlow() {
  // Only on larger screens
  if (window.innerWidth < 768) return;
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  }, { passive: true });
}

/* ══════════════════════════════════════════════
   BUTTON RIPPLE
══════════════════════════════════════════════ */
function initRipple() {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      const ripple = document.createElement('span');
      ripple.className = 'ripple-el';
      const size = Math.max(rect.width, rect.height);
      Object.assign(ripple.style, {
        width: size + 'px', height: size + 'px',
        left: (x - size / 2) + 'px', top: (y - size / 2) + 'px',
      });
      this.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });
}

/* ══════════════════════════════════════════════
   COUNTER ANIMATION
══════════════════════════════════════════════ */
function initCounters() {
  const statVals = document.querySelectorAll('.hero-stat-value');
  if (!statVals.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        statVals.forEach((el) => {
          const text = el.textContent.trim();
          let useK = text.toLowerCase().includes('k');
          let suffix = '';
          if (text.includes('+')) suffix += '+';
          if (text.includes('%')) suffix += '%';
          
          let num = parseFloat(text.replace(/[^0-9.]/g, ''));
          if(isNaN(num)) num = 0;
          if(useK) num = num * 1000;
          
          animateCounter(el, num, 1400, suffix, useK);
        });
        obs.disconnect();
      }
    });
  }, { threshold: 0.6 });
  if (statVals[0]) obs.observe(statVals[0]);
}

function animateCounter(el, target, duration, suffix = '', useK = false) {
  const start = performance.now();
  function update(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = Math.round(eased * target);
    el.textContent = useK && val >= 1000
      ? Math.round(val / 1000) + 'K' + suffix
      : val + suffix;
    if (p < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

/* ══════════════════════════════════════════════
   NOISE TEXTURE OVERLAY
══════════════════════════════════════════════ */
function initNoise() {
  const el = document.createElement('div');
  el.className = 'noise-overlay';
  document.body.appendChild(el);
}

/* ══════════════════════════════════════════════
   PARALLAX BLOBS ON MOUSEMOVE
══════════════════════════════════════════════ */
function initParallax() {
  const blobs = document.querySelectorAll('.hero-blob');
  if (!blobs.length) return;
  document.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth  - .5) * 24;
    const y = (e.clientY / window.innerHeight - .5) * 24;
    blobs.forEach((b, i) => {
      const factor = (i + 1) * .4;
      b.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });
  }, { passive: true });
}

/* ══════════════════════════════════════════════
   CARD 3D TILT
══════════════════════════════════════════════ */
function initCardTilt() {
  const cards = document.querySelectorAll('.role-card, .feature-card, .testimonial-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - .5) * 12;
      const y = ((e.clientY - rect.top)  / rect.height - .5) * 12;
      card.style.transform = `translateY(-8px) perspective(600px) rotateX(${-y}deg) rotateY(${x}deg) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform .5s cubic-bezier(.34,1.56,.64,1)';
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform .15s ease';
    });
  });
}

/* ══════════════════════════════════════════════
   TOAST NOTIFICATIONS
══════════════════════════════════════════════ */
function showToast(message, type = 'default', duration = 3200) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    container.id = 'toastContainer';
    document.body.appendChild(container);
  }
  const icons = { success: '✅', error: '❌', warning: '⚠️', default: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span style="font-size:1.1rem;flex-shrink:0;">${icons[type] || icons.default}</span><span style="flex:1;">${message}</span><span style="opacity:.55;font-size:.8rem;cursor:pointer;margin-left:8px;" onclick="this.parentElement.remove()">✕</span>`;
  container.appendChild(toast);

  const remove = () => {
    toast.style.animation = 'slideInRight .3s ease reverse';
    setTimeout(() => toast.remove(), 280);
  };
  toast.addEventListener('click', remove);
  const timer = setTimeout(remove, duration);
  toast.addEventListener('click', () => clearTimeout(timer));
}

/* ══════════════════════════════════════════════
   SECTION ENTRANCE ANIMATIONS (staggered)
══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  // Stagger children inside reveal containers
  const grids = document.querySelectorAll('.features-grid, .roles-grid, .courses-grid, .suggestion-cards');
  grids.forEach(grid => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const children = entry.target.children;
          Array.from(children).forEach((child, i) => {
            child.style.animationDelay = `${i * 0.08}s`;
            child.style.animation = `fadeUp .55s ${i * 0.08}s cubic-bezier(.4,0,.2,1) both`;
          });
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    obs.observe(grid);
  });

  // Add rainbow hover to skill preset chips
  document.querySelectorAll('.preset-chip').forEach((chip, i) => {
    const colors = ['#6366f1','#a855f7','#ec4899','#06b6d4','#10b981','#f59e0b','#ef4444','#f97316'];
    chip.addEventListener('mouseenter', () => {
      if (!chip.classList.contains('added')) {
        chip.style.borderColor = colors[i % colors.length];
        chip.style.color = colors[i % colors.length];
      }
    });
    chip.addEventListener('mouseleave', () => {
      if (!chip.classList.contains('added')) {
        chip.style.borderColor = '';
        chip.style.color = '';
      }
    });
  });

  // Animate progress bars when visible
  const bars = document.querySelectorAll('.progress-bar-fill[data-target]');
  const barObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const target = e.target.dataset.target;
        e.target.style.width = target + '%';
        barObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  bars.forEach(b => barObs.observe(b));

  // Role card color auras on hover (JS-enhanced)
  const roleColors = ['#6366f1','#a855f7','#06b6d4','#10b981','#f59e0b','#ef4444'];
  document.querySelectorAll('.role-card').forEach((card, i) => {
    const c = roleColors[i] || '#6366f1';
    card.addEventListener('mouseenter', () => {
      card.style.boxShadow = `0 24px 60px ${c}33, 0 0 0 2px ${c}55`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.boxShadow = '';
    });
  });

  // Feature card icon color aura on hover
  const featureColors = ['#6366f1','#a855f7','#06b6d4','#10b981','#f59e0b','#ef4444'];
  document.querySelectorAll('.feature-card').forEach((card, i) => {
    card.addEventListener('mouseenter', () => {
      const icon = card.querySelector('.feature-icon');
      if (icon) icon.style.boxShadow = `0 8px 24px ${featureColors[i % featureColors.length]}44`;
    });
    card.addEventListener('mouseleave', () => {
      const icon = card.querySelector('.feature-icon');
      if (icon) icon.style.boxShadow = '';
    });
  });
});

/* ══════════════════════════════════════════════
   TYPEWRITER EFFECT (optional use with class)
══════════════════════════════════════════════ */
function typewriter(el, text, speed = 60) {
  el.textContent = '';
  let i = 0;
  const type = () => {
    if (i < text.length) {
      el.textContent += text[i++];
      setTimeout(type, speed);
    }
  };
  type();
}

/* ══════════════════════════════════════════════
   SCROLL PROGRESS BAR (top of page)
══════════════════════════════════════════════ */
(function () {
  const bar = document.createElement('div');
  bar.id = 'scrollProgressBar';
  Object.assign(bar.style, {
    position: 'fixed', top: '0', left: '0', height: '3px',
    background: 'linear-gradient(90deg,#6366f1,#a855f7,#ec4899)',
    backgroundSize: '200%',
    zIndex: '99999', width: '0%',
    transition: 'width .1s linear',
    animation: 'gradientMove 3s ease infinite',
    pointerEvents: 'none',
  });
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const total = document.body.scrollHeight - window.innerHeight;
    const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
})();

/* ══════════════════════════════════════════════
   ROLE/SKILL COLOR MAPS (shared data)
══════════════════════════════════════════════ */
const ROLE_COLORS = {
  'Software Developer':    { primary: '#6366f1', gradient: 'linear-gradient(135deg,#6366f1,#818cf8)' },
  'UI/UX Designer':        { primary: '#a855f7', gradient: 'linear-gradient(135deg,#a855f7,#c084fc)' },
  'Cybersecurity Analyst': { primary: '#06b6d4', gradient: 'linear-gradient(135deg,#06b6d4,#0891b2)' },
  'Data Scientist':        { primary: '#10b981', gradient: 'linear-gradient(135deg,#10b981,#059669)' },
  'Cloud Engineer':        { primary: '#f59e0b', gradient: 'linear-gradient(135deg,#f59e0b,#d97706)' },
  'DevOps Engineer':       { primary: '#ef4444', gradient: 'linear-gradient(135deg,#ef4444,#dc2626)' },
};
