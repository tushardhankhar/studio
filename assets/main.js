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

  // Analytics: sends to GA4 when configured, otherwise to dataLayer only.
  // These are click/interaction events, not confirmed leads.
  var track = function (name, params) {
    try {
      if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
      else { window.dataLayer = window.dataLayer || []; window.dataLayer.push(Object.assign({ event: name }, params || {})); }
    } catch (e) { /* never block the page */ }
  };
  document.addEventListener('click', function (ev) {
    var a = ev.target.closest && ev.target.closest('[data-track]');
    if (!a) return;
    var p = { location: a.dataset.loc || 'page' };
    if (a.dataset.package) p.package = a.dataset.package;
    if (a.dataset.demo) p.demo = a.dataset.demo;
    track(a.dataset.track, p);
    if (a.dataset.demo && a.dataset.track === 'whatsapp_click') track('demo_enquiry_click', { demo: a.dataset.demo });
  });

  // Price estimator: package price is a starting price; add-ons are quoted separately
  var calc = $('#calc');
  if (calc) {
    var fmt = function (n) { return '\u20B9' + n.toLocaleString('en-IN'); };
    var out = $('#calc-total'), note = $('#calc-note'), link = $('#calc-wa');
    var update = function () {
      var pk = $('input[name="pkg"]:checked', calc);
      var extras = $$('input[name="addon"]:checked', calc).map(function (i) { return i.dataset.label; });
      var price = +pk.dataset.price, name = pk.dataset.label.replace(' package', '');
      out.textContent = fmt(price) + '+';
      note.textContent = extras.length
        ? 'Starting price for the ' + name + ' package, plus ' + extras.length + ' extra' + (extras.length > 1 ? 's' : '') + ' quoted after scope review.'
        : 'Starting price for the ' + name + ' package. Final price depends on scope.';
      link.href = wa('Hi Tushar! I used your estimator. I\'m interested in the ' + name + ' package (starting at ' + fmt(price) + ')' +
        (extras.length ? ' with: ' + extras.join(', ') : '') + '. Could you share a quote for my business?');
      link.dataset.package = name;
      return { package: name, extras: extras.length };
    };
    calc.addEventListener('change', function () { track('estimator_interaction', update()); });
    update();
  }

  // Demo gallery filters
  var fbar = $('#demo-filters');
  if (fbar) {
    fbar.addEventListener('click', function (ev) {
      var b = ev.target.closest('[data-fcat]'); if (!b) return;
      $$('[data-fcat]', fbar).forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
      $$('#demo-grid .dc').forEach(function (c) { c.hidden = b.dataset.fcat !== 'All' && c.dataset.cat !== b.dataset.fcat; });
      $$('.rail').forEach(function (r) { if (r._refresh) r._refresh(); });
      track('demo_filter', { category: b.dataset.fcat });
    });
  }

  // Mobile rails: swipeable strips with dots (or labelled tabs) synced to scroll position
  var rtReduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  $$('.rail').forEach(function (r) {
    var tabs = r.dataset.tabs ? r.dataset.tabs.split(';').map(function (t) { return t.split('|'); }) : null;
    var ctl = document.createElement('div'), btns = [];
    ctl.className = tabs ? 'rail-tabs' : 'rail-dots';
    if (tabs) { ctl.setAttribute('role', 'group'); ctl.setAttribute('aria-label', r.getAttribute('aria-label') + ' selector'); r.parentNode.insertBefore(ctl, r); }
    else r.parentNode.insertBefore(ctl, r.nextSibling);
    r.setAttribute('role', 'region'); r.setAttribute('tabindex', '0');
    var items = function () { return Array.prototype.filter.call(r.children, function (c) { return !c.hidden; }); };
    var center = function (it, smooth) { r.scrollTo({ left: it.offsetLeft + it.offsetWidth / 2 - r.clientWidth / 2, behavior: smooth && !rtReduce ? 'smooth' : 'auto' }); };
    var sync = function () {
      var its = items(), mid = r.scrollLeft + r.clientWidth / 2, best = 0, bd = 1e9;
      its.forEach(function (it, i) { var d = Math.abs(it.offsetLeft + it.offsetWidth / 2 - mid); if (d < bd) { bd = d; best = i; } });
      btns.forEach(function (b, i) { b.setAttribute('aria-current', i === best); });
    };
    var build = function () {
      var its = items(); ctl.innerHTML = '';
      btns = its.map(function (it, i) {
        var b = document.createElement('button'); b.type = 'button';
        if (tabs && tabs[i]) b.innerHTML = tabs[i][0] + '<small>' + tabs[i][1] + '</small>';
        else b.setAttribute('aria-label', 'Go to item ' + (i + 1) + ' of ' + its.length);
        b.addEventListener('click', function () { center(it, true); });
        ctl.appendChild(b); return b;
      });
      sync();
    };
    var t; r.addEventListener('scroll', function () { clearTimeout(t); t = setTimeout(sync, 50); }, { passive: true });
    window.addEventListener('resize', sync);
    r._refresh = function () { r.scrollLeft = 0; build(); };
    build();
    if (r.dataset.start && r.scrollWidth > r.clientWidth) { center(items()[+r.dataset.start], false); sync(); }
  });

  // Contact form -> pre-filled WhatsApp message (no backend). Fires after validation only.
  var form = $('#lead-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.website.value) return; // honeypot
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var f = new FormData(form);
      var msg = 'Hi Tushar! I\'m ' + f.get('name') + ' from ' + f.get('business') + '.\nPhone: ' + f.get('phone') +
        '\nI need: ' + f.get('type') + '\nPackage: ' + f.get('package') + '\n\n' + (f.get('message') || '');
      $('#form-status').textContent = 'Opening WhatsApp. Press send there to deliver your enquiry. If nothing opens, tap the WhatsApp number on this page.';
      track('quote_form_submit', { package: f.get('package'), type: f.get('type') });
      window.open(wa(msg), '_blank', 'noopener');
    });
  }

  // Hero carousel
  var car = $('.car');
  if (car) {
    var tr = $('.car-track', car), sl = $$('.car-s', car), seg = $$('.car-prog button', car), cur = 0, playing = false;
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var mark = function (i) {
      cur = i; seg.forEach(function (d, k) { d.setAttribute('aria-selected', k === i); });
      car.classList.remove('playing'); void car.offsetWidth; if (playing) car.classList.add('playing');
    };
    var go = function (i) {
      i = (i + sl.length) % sl.length;
      tr.scrollTo({ left: sl[i].offsetLeft - tr.offsetLeft, behavior: reduce ? 'auto' : 'smooth' }); mark(i);
    };
    var stop = function () { playing = false; car.classList.remove('playing'); };
    var play = function () { if (reduce) return; playing = true; mark(cur); };
    var t; tr.addEventListener('scroll', function () {
      clearTimeout(t); t = setTimeout(function () {
        var x = tr.scrollLeft + tr.offsetLeft, best = 0;
        sl.forEach(function (s, k) { if (Math.abs(s.offsetLeft - x) < Math.abs(sl[best].offsetLeft - x)) best = k; });
        if (best !== cur) mark(best);
      }, 80);
    }, { passive: true });
    seg.forEach(function (d, k) {
      d.addEventListener('click', function () { stop(); go(k); });
      $('i', d).addEventListener('animationend', function () { if (playing) go(cur + 1); });
    });
    $('.car-prev', car).addEventListener('click', function () { stop(); go(cur - 1); });
    $('.car-next', car).addEventListener('click', function () { stop(); go(cur + 1); });
    tr.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); stop(); go(cur + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); stop(); go(cur - 1); }
    });
    ['mouseenter', 'focusin', 'touchstart'].forEach(function (ev) { car.addEventListener(ev, stop, { passive: true }); });
    mark(0); play();
  }

  // Header shadow on scroll
  var hdr = $('.hdr');
  if (hdr) { var st = function () { hdr.classList.toggle('scrolled', window.scrollY > 8); }; st(); window.addEventListener('scroll', st, { passive: true }); }

  // Home, mobile only: show the demos before the customer-journey card
  var jflow = $('.hero .flow'), jdemos = $('#work');
  if (jflow && jdemos && window.matchMedia) {
    var jhome = jflow.parentNode, jhold = document.createElement('section'), mq = matchMedia('(max-width: 760px)');
    jhold.className = 'flow-sec'; jhold.innerHTML = '<div class="wrap"></div>';
    var place = function () {
      if (mq.matches) { jdemos.parentNode.insertBefore(jhold, jdemos.nextSibling); $('.wrap', jhold).appendChild(jflow); }
      else { jhome.appendChild(jflow); if (jhold.parentNode) jhold.parentNode.removeChild(jhold); }
    };
    place();
    if (mq.addEventListener) mq.addEventListener('change', place); else mq.addListener(place);
  }

  // Floating WhatsApp button: stays out of the way until the visitor scrolls
  var fab = $('.wa');
  if (fab) {
    var vis = function () { fab.classList.toggle('wa-hide', window.scrollY < 320); };
    vis(); window.addEventListener('scroll', vis, { passive: true });
  }

  // Footer year
  $$('[data-year]').forEach(function (e) { e.textContent = new Date().getFullYear(); });
})();
