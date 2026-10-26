(function () {
  var WA = document.documentElement.dataset.wa;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var wa = function (msg) { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg); };

  // Mobile nav
  var burger = $('.burger'), nav = $('.nav');
  if (burger) {
    burger.addEventListener('click', function () {
      var o = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', o);
    });
    $$('.nav a').forEach(function (a) { a.addEventListener('click', function () { nav.classList.remove('open'); burger.setAttribute('aria-expanded', false); }); });
  }

  // Reveal on scroll
  var rv = $$('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: .12 });
    rv.forEach(function (el) { io.observe(el); });
  } else rv.forEach(function (el) { el.classList.add('in'); });

  // Count-up stats
  $$('[data-count]').forEach(function (el) {
    var end = +el.dataset.count, suf = el.dataset.suffix || '', done = false;
    var run = function () {
      if (done) return; done = true;
      var t0 = performance.now();
      (function tick(t) {
        var p = Math.min((t - t0) / 1200, 1);
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suf;
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    };
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es, o) { if (es[0].isIntersecting) { run(); o.disconnect(); } }).observe(el);
    } else el.textContent = end + suf;
  });

  // Plan enquiry buttons
  $$('[data-wa-msg]').forEach(function (a) { a.href = wa(a.dataset.waMsg); });

  // Price estimator
  var calc = $('#calc');
  if (calc) {
    var fmt = function (n) { return '₹' + n.toLocaleString('en-IN'); };
    var out = $('#calc-total'), link = $('#calc-wa');
    var update = function () {
      var total = 0, picks = [];
      $$('input', calc).forEach(function (i) {
        if (i.checked) { total += +i.dataset.price; picks.push(i.dataset.label); }
      });
      out.textContent = fmt(total);
      link.href = wa('Hi! I used your estimator. I need: ' + picks.join(', ') + '. Estimated budget ' + fmt(total) + '. Can we discuss?');
    };
    calc.addEventListener('change', update); update();
  }

  // Contact form → WhatsApp (works without a backend) with mailto fallback
  var form = $('#lead-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.website.value) return; // honeypot
      var f = new FormData(form);
      var msg = 'Hi! I\'m ' + f.get('name') + ' (' + f.get('business') + ').\nPhone: ' + f.get('phone') +
        '\nI need: ' + f.get('type') + '\nBudget: ' + f.get('budget') + '\n\n' + (f.get('message') || '');
      $('#form-status').textContent = 'Opening WhatsApp… if nothing happens, tap the green button or email us.';
      window.open(wa(msg), '_blank', 'noopener');
    });
  }

  // Header shadow on scroll
  var hdr = $('.hdr');
  if (hdr) { var st = function () { hdr.classList.toggle('scrolled', window.scrollY > 8); }; st(); window.addEventListener('scroll', st, { passive: true }); }

  // Footer year
  $$('[data-year]').forEach(function (e) { e.textContent = new Date().getFullYear(); });
})();
