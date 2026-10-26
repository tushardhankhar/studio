(function () {
  var stage = document.getElementById('demo-frame');
  if (!stage) return;
  var url = document.getElementById('demo-url');
  var inr = function (n) { return '₹' + n.toLocaleString('en-IN'); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var nav = function (name, sub) { return '<div class="dnav"><span><b>' + name + '</b></span><small>' + sub + '</small></div>'; };
  var hero = function (h, p, cta) { return '<div class="dhero"><h1>' + h + '</h1><p>' + p + '</p><button class="dbtn" data-scroll>' + cta + '</button></div>'; };

  var demos = {
    restaurant: {
      label: 'Restaurant', url: 'spicetrail-kitchen.in', accent: '#c2410c',
      html: function () {
        var items = [
          ['Starters', '🥟', 'Paneer Tikka', 'Smoky charred cottage cheese', 289],
          ['Starters', '🍢', 'Chicken Malai Tikka', 'Creamy, mild and tender', 329],
          ['Mains', '🍛', 'Butter Chicken', 'Slow-cooked in tomato butter gravy', 389],
          ['Mains', '🥘', 'Dal Makhani', 'Overnight black lentils', 289],
          ['Desserts', '🍮', 'Gulab Jamun', 'Warm with rabdi', 149],
          ['Desserts', '🍨', 'Kulfi Falooda', 'House-made pistachio kulfi', 179]];
        return nav('Spice Trail', 'Open till 11 PM') +
          hero('Slow-cooked flavours,<br>served with love.', 'Browse the menu, build your order and reserve a table in seconds.', 'Reserve a table') +
          '<div class="dbody"><h2>Our menu</h2><div class="dtabs">' +
          ['All', 'Starters', 'Mains', 'Desserts'].map(function (t, i) { return '<button class="dtab" data-filter="' + t + '" aria-pressed="' + (i === 0) + '">' + t + '</button>'; }).join('') +
          '</div><div class="dgrid">' + items.map(function (i) {
            return '<div class="dcard" data-cat="' + i[0] + '"><div class="th">' + i[1] + '</div><h3>' + i[2] + '</h3><p>' + i[3] + '</p><span class="pr">' + inr(i[4]) + '</span><button class="dbtn alt" data-add="' + i[4] + '">Add to order</button></div>';
          }).join('') + '</div>' +
          '<h2 id="reserve" style="margin-top:2rem">Reserve a table</h2><form class="dform" data-confirm="Table request received! We\'ll confirm on WhatsApp shortly."><input placeholder="Your name" required aria-label="Name"><select aria-label="Guests"><option>2 guests</option><option>4 guests</option><option>6+ guests</option></select><input type="time" value="20:00" aria-label="Time"><button class="dbtn">Request table</button></form><div class="dnote" hidden></div></div>' +
          '<div class="dbar"><span>Order: <b data-count>0</b> items</span><b data-total>' + inr(0) + '</b></div>';
      }
    },
    clinic: {
      label: 'Clinic', url: 'carewell-dental.in', accent: '#0e7490',
      html: function () {
        var svc = [['🦷', 'Teeth cleaning', 'Gentle scaling and polish', 799], ['😁', 'Teeth whitening', 'Up to 8 shades brighter', 3999], ['🛡️', 'Root canal', 'Single-sitting, pain-free', 4500], ['📐', 'Braces & aligners', 'Free consultation', 0]];
        return nav('CareWell Dental', 'Mon–Sat · 9 AM – 8 PM') +
          hero('Healthy smiles,<br>zero anxiety.', 'Book online in 30 seconds. Instant confirmation, no phone tag.', 'Book appointment') +
          '<div class="dbody"><h2>Treatments</h2><div class="dgrid">' + svc.map(function (s) {
            return '<div class="dcard"><div class="th">' + s[0] + '</div><h3>' + s[1] + '</h3><p>' + s[2] + '</p><span class="pr">' + (s[3] ? 'From ' + inr(s[3]) : 'Free consult') + '</span></div>';
          }).join('') + '</div><h2 id="reserve" style="margin-top:2rem">Pick a slot</h2><div class="slots" data-slots>' +
          ['10:00 AM', '11:30 AM', '1:00 PM', '4:00 PM', '5:30 PM', '7:00 PM'].map(function (t) { return '<button class="dtab" aria-pressed="false">' + t + '</button>'; }).join('') +
          '</div><form class="dform" style="margin-top:1rem" data-confirm="Appointment requested for your selected slot. Reminder will arrive on WhatsApp."><input placeholder="Patient name" required aria-label="Patient name"><input type="tel" placeholder="Mobile number" required aria-label="Mobile"><button class="dbtn">Confirm booking</button></form><div class="dnote" hidden></div></div>';
      }
    },
    salon: {
      label: 'Salon & Spa', url: 'glowup-salon.in', accent: '#a21caf',
      html: function () {
        var s = [['💇', 'Haircut & styling', 499], ['🎨', 'Global hair colour', 2499], ['💅', 'Gel manicure', 899], ['🧖', 'Hydra facial', 1999], ['💆', 'Head massage', 399]];
        return nav('Glow Up', 'Walk-ins welcome') + hero('Look good.<br>Feel unstoppable.', 'Tick the services you want — your total updates instantly.', 'Choose services') +
          '<div class="dbody"><h2 id="reserve">Build your package</h2>' + s.map(function (x) {
            return '<label class="dcard" style="flex-direction:row;align-items:center;gap:.8rem;margin-bottom:.6rem;cursor:pointer"><input type="checkbox" data-sum="' + x[2] + '" style="width:20px;height:20px;accent-color:var(--da)"><span style="font-size:1.5rem">' + x[0] + '</span><span style="flex:1"><b>' + x[1] + '</b></span><span class="pr">' + inr(x[2]) + '</span></label>';
          }).join('') + '<p class="dnote" style="font-weight:600">Bundle 3+ services and save 10% (applied automatically).</p><div class="dnote" hidden></div></div>' +
          '<div class="dbar"><span>Total <small data-disc></small></span><b data-total>' + inr(0) + '</b></div>';
      }
    },
    realestate: {
      label: 'Real Estate', url: 'urbannest-homes.in', accent: '#166534',
      html: function () {
        var p = [['🏢', '2 BHK · Whitefield', 2, 8500000], ['🏙️', '3 BHK · Koramangala', 3, 17500000], ['🏡', '2 BHK · Hebbal', 2, 9200000], ['🌆', '3 BHK · HSR Layout', 3, 14000000], ['🏘️', '1 BHK · Electronic City', 1, 4200000], ['🏰', '4 BHK Villa · Sarjapur', 4, 31000000]];
        return nav('UrbanNest', 'RERA registered') + hero('Find a home<br>you\'ll love.', 'Filter by bedrooms and budget — enquire in one tap.', 'Browse homes') +
          '<div class="dbody"><h2 id="reserve">Featured listings</h2><div class="dtabs">' +
          ['Any', '1', '2', '3', '4'].map(function (b, i) { return '<button class="dtab" data-bhk="' + b + '" aria-pressed="' + (i === 0) + '">' + (b === 'Any' ? 'Any BHK' : b + ' BHK') + '</button>'; }).join('') +
          '</div><label style="display:block;font-weight:600;margin-bottom:1rem">Max budget: <b data-bud>₹3.5 Cr</b><input type="range" min="40" max="350" step="10" value="350" data-budget style="width:100%;accent-color:var(--da)"></label>' +
          '<div class="dgrid">' + p.map(function (x) {
            return '<div class="dcard" data-bhk="' + x[2] + '" data-price="' + x[3] + '"><div class="th">' + x[0] + '</div><h3>' + x[1] + '</h3><span class="pr">₹' + (x[3] / 10000000).toFixed(2) + ' Cr</span><button class="dbtn alt" data-enq>Enquire</button></div>';
          }).join('') + '</div><div class="dnote" hidden></div></div>';
      }
    },
    coaching: {
      label: 'Coaching', url: 'topscore-academy.in', accent: '#1d4ed8',
      html: function () {
        var c = [['📐', 'JEE Foundation', 'Class 9–10 · Weekend batch', 24999], ['🧬', 'NEET Crash Course', '60 days · Daily doubt-solving', 18999], ['🗣️', 'Spoken English', 'Beginner to fluent · 8 weeks', 4999]];
        return nav('TopScore Academy', '4.9★ from 800+ students') + hero('Your rank,<br>our mission.', 'Expert faculty, small batches. Book a free demo class today.', 'Book free demo') +
          '<div class="dbody"><h2>Popular courses</h2><div class="dgrid">' + c.map(function (x) {
            return '<div class="dcard"><div class="th">' + x[0] + '</div><h3>' + x[1] + '</h3><p>' + x[2] + '</p><span class="pr">' + inr(x[3]) + '</span></div>';
          }).join('') + '</div><h2 id="reserve" style="margin-top:2rem">Free demo class</h2><form class="dform" data-confirm="You\'re in! Our counsellor will call you within 2 hours."><input placeholder="Student name" required aria-label="Student name"><select aria-label="Course"><option>JEE Foundation</option><option>NEET Crash Course</option><option>Spoken English</option></select><input type="tel" placeholder="Parent\'s mobile" required aria-label="Mobile"><button class="dbtn">Reserve my seat</button></form><div class="dnote" hidden></div></div>';
      }
    },
    store: {
      label: 'Online Store', url: 'kalaa-handloom.in', accent: '#b45309',
      html: function () {
        var p = [['🧣', 'Pashmina Shawl', 3499], ['👜', 'Jute Tote Bag', 599], ['🪔', 'Brass Diya Set', 799], ['🧵', 'Block-print Kurta', 1499], ['🏺', 'Terracotta Vase', 449], ['👘', 'Chanderi Saree', 4299]];
        return nav('Kalaa Handloom', 'Free shipping over ₹999') + hero('Handmade India,<br>delivered.', 'Add items, watch the cart update, pay via UPI at checkout.', 'Shop now') +
          '<div class="dbody"><h2 id="reserve">Best sellers</h2><div class="dgrid">' + p.map(function (x) {
            return '<div class="dcard"><div class="th">' + x[0] + '</div><h3>' + x[1] + '</h3><span class="pr">' + inr(x[2]) + '</span><button class="dbtn alt" data-add="' + x[2] + '">Add to cart</button></div>';
          }).join('') + '</div><div class="dnote" hidden></div></div>' +
          '<div class="dbar"><span>Cart: <b data-count>0</b> items · <small data-ship>Add ₹999 for free shipping</small></span><b data-total>' + inr(0) + '</b></div>';
      }
    }
  };

  var frame = document.getElementById('demo-frame'), body = document.getElementById('demo-body');
  var current = 'restaurant';

  function show(key) {
    current = key; var d = demos[key];
    body.innerHTML = d.html(); frame.style.setProperty('--da', d.accent); url.textContent = 'Concept preview · fictional business';
  }

  document.querySelectorAll('[data-device]').forEach(function (b) {
    b.addEventListener('click', function () {
      frame.classList.toggle('mobile', b.dataset.device === 'mobile');
      document.querySelectorAll('[data-device]').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
    });
  });

  // Delegated interactions inside the demo site
  var note = function (t) { var n = body.querySelector('.dnote[hidden]') || body.querySelector('.dnote:last-of-type'); if (n) { n.hidden = false; n.textContent = t; } };
  var state = { count: 0, total: 0 };
  function render() {
    var c = body.querySelector('[data-count]'), t = body.querySelector('[data-total]'), s = body.querySelector('[data-ship]');
    if (c) c.textContent = state.count; if (t) t.textContent = inr(state.total);
    if (s) s.textContent = state.total >= 999 ? 'Free shipping unlocked 🎉' : 'Add ' + inr(999 - state.total) + ' for free shipping';
  }
  body.addEventListener('click', function (e) {
    var t = e.target;
    if (t.matches('[data-scroll]')) { var r = body.querySelector('#reserve'); if (r) r.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    if (t.matches('[data-add]')) { state.count++; state.total += +t.dataset.add; render(); t.textContent = 'Added ✓'; }
    if (t.matches('[data-filter]')) {
      $$('[data-filter]', body).forEach(function (b) { b.setAttribute('aria-pressed', b === t); });
      $$('.dcard[data-cat]', body).forEach(function (c) { c.hidden = t.dataset.filter !== 'All' && c.dataset.cat !== t.dataset.filter; });
    }
    if (t.closest('[data-slots]') && t.matches('.dtab')) { $$('.dtab', t.parentNode).forEach(function (b) { b.setAttribute('aria-pressed', b === t); }); }
    if (t.matches('[data-bhk].dtab')) { bhk = t.dataset.bhk; $$('[data-bhk].dtab', body).forEach(function (b) { b.setAttribute('aria-pressed', b === t); }); filterHomes(); }
    if (t.matches('[data-enq]')) note('Enquiry received in this concept preview. Nothing was sent.');
  });
  var bhk = 'Any';
  function filterHomes() {
    var max = body.querySelector('[data-budget]'); if (!max) return;
    var lim = +max.value * 100000; body.querySelector('[data-bud]').textContent = '₹' + (max.value / 100).toFixed(2) + ' Cr';
    $$('.dcard[data-bhk]', body).forEach(function (c) { c.hidden = !((bhk === 'Any' || c.dataset.bhk === bhk) && +c.dataset.price <= lim); });
  }
  body.addEventListener('input', function (e) {
    if (e.target.matches('[data-budget]')) filterHomes();
    if (e.target.matches('[data-sum]')) {
      var picks = $$('[data-sum]:checked', body), sum = picks.reduce(function (a, i) { return a + +i.dataset.sum; }, 0), d = picks.length >= 3 ? .1 : 0;
      body.querySelector('[data-total]').textContent = inr(Math.round(sum * (1 - d)));
      body.querySelector('[data-disc]').textContent = d ? '(10% bundle saving applied)' : '';
    }
  });
  body.addEventListener('submit', function (e) {
    e.preventDefault(); var n = body.querySelector('.dnote'); n.hidden = false; n.textContent = e.target.dataset.confirm + ' (Concept preview: nothing was sent.)'; e.target.reset();
  });

  var origShow = show;
  show = function (k) { state = { count: 0, total: 0 }; bhk = 'Any'; origShow(k); };
  show(demos[frame.dataset.demo] ? frame.dataset.demo : 'restaurant');
})();
