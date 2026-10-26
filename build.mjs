// Static site generator: `node build.mjs` → ./dist  (no dependencies)
import { mkdirSync, writeFileSync, cpSync, rmSync } from 'node:fs';

// ---- Edit these before launch -------------------------------------------
const SITE = {
  name: 'Studio by Tushar',
  url: 'https://studio.tushardhankhar.com',          // production domain
  phone: '+91 99999 99999',
  wa: '919999999999',                         // WhatsApp number, country code first, no "+"
  email: 'studio@tushardhankhar.com',
  city: 'Bengaluru', region: 'Karnataka',
  lat: 12.9716, lng: 77.5946,
};
// --------------------------------------------------------------------------

const waLink = (m) => `https://wa.me/${SITE.wa}?text=${encodeURIComponent(m)}`;
const MARK = `<svg class="mark" viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="12" fill="#123B33"/><path d="M9.5 9.5h21v5.2h-7.9V27h-5.2V14.7H9.5z" fill="#F4EEE0"/><rect x="17.6" y="29.3" width="4.8" height="4.8" rx=".6" transform="rotate(45 20 31.7)" fill="#C9A55C"/></svg>`;
const WA_HELLO = waLink("Hi Tushar! I'd like a free website quote for my business.");
const today = new Date().toISOString().slice(0, 10);

const NAV = [['/', 'Home'], ['/services/', 'Services & Pricing'], ['/demos/', 'Live Demos'], ['/portfolio/', 'Portfolio'], ['/case-studies/', 'Case Studies'], ['/about/', 'About'], ['/contact/', 'Contact']];

const waIcon = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 3.5A11.8 11.8 0 0 0 12 0C5.4 0 .1 5.3.1 11.9c0 2.1.6 4.1 1.6 5.9L0 24l6.4-1.7a11.9 11.9 0 0 0 5.6 1.4c6.6 0 11.9-5.3 11.9-11.9 0-3.2-1.2-6.2-3.4-8.3zM12 21.7a9.9 9.9 0 0 1-5-1.4l-.4-.2-3.8 1 1-3.700-.2-.4a9.800 9.800 0 0 1-1.500-5.200C2.100 6.500 6.600 2 12 2c2.600 0 5.100 1 6.900 2.900a9.700 9.700 0 0 1 2.900 6.900c0 5.400-4.400 9.900-9.800 9.900zm5.400-7.400c-.3-.1-1.800-.9-2-1s-.5-.1-.7.1-.8 1-.9 1.100-.3.2-.6.1a8 8 0 0 1-4-3.500c-.3-.5.3-.5.900-1.600.1-.2.1-.4 0-.5l-.9-2.100c-.2-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.9.4 3.700 3.700 0 0 0-1.100 2.700c0 1.600 1.2 3.200 1.3 3.400s2.300 3.500 5.600 4.900c2.100.9 2.900.9 3.900.8.600-.1 1.800-.7 2-1.400s.3-1.300.2-1.400-.3-.2-.6-.3z"/></svg>`;

const head = ({ title, desc, path, schema = [], og = 'website' }) => `<!doctype html>
<html lang="en-IN" data-wa="${SITE.wa}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${SITE.url}${path}">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta name="theme-color" content="#FBF8F3">
<meta name="geo.region" content="IN-KA"><meta name="geo.placename" content="${SITE.city}">
<meta property="og:type" content="${og}"><meta property="og:site_name" content="${SITE.name}">
<meta property="og:title" content="${title}"><meta property="og:description" content="${desc}">
<meta property="og:url" content="${SITE.url}${path}"><meta property="og:image" content="${SITE.url}/assets/og.svg">
<meta property="og:locale" content="en_IN">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Manrope:wght@600..800&family=Inter:wght@400..600&family=DM+Serif+Display:ital@0;1&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@600..800&family=Inter:wght@400..600&family=DM+Serif+Display:ital@0;1&display=swap">
<link rel="stylesheet" href="/assets/styles.css">
${schema.map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join('\n')}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="hdr"><div class="wrap">
<a class="logo" href="/" aria-label="${SITE.name} home">${MARK}<span class="wm">Studio<em> by Tushar</em></span></a>
<button class="burger" aria-label="Menu" aria-expanded="false" aria-controls="nav"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg></button>
<nav class="nav" id="nav" aria-label="Main">
${NAV.map(([h, l]) => `<a href="${h}"${h === path ? ' aria-current="page"' : ''}>${l}</a>`).join('')}
<a class="btn btn-primary btn-sm" href="${WA_HELLO}" target="_blank" rel="noopener">Free quote</a>
</nav></div></header>
<main id="main">`;

const foot = () => `</main>
<footer><div class="wrap">
<div class="fgrid">
<div><a class="logo" href="/">${MARK}<span class="wm">Studio<em> by Tushar</em></span></a><p style="margin-top:1rem;max-width:34ch">Premium websites for small businesses across India — built fast, ranked well, designed to bring in customers.</p></div>
<div><h4>Services</h4><ul><li><a href="/services/#pricing">Pricing</a></li><li><a href="/services/#estimator">Cost estimator</a></li><li><a href="/demos/">Live demos</a></li><li><a href="/services/#faq">FAQ</a></li></ul></div>
<div><h4>Company</h4><ul><li><a href="/about/">About</a></li><li><a href="/portfolio/">Portfolio</a></li><li><a href="/case-studies/">Case studies</a></li><li><a href="/contact/">Contact</a></li></ul></div>
<div><h4>Talk to us</h4><ul><li><a href="${WA_HELLO}" target="_blank" rel="noopener">WhatsApp us</a></li><li><a href="tel:${SITE.phone.replace(/\s/g, '')}">${SITE.phone}</a></li><li><a href="mailto:${SITE.email}">${SITE.email}</a></li><li>${SITE.city}, ${SITE.region}</li></ul></div>
</div>
<div class="copy"><span>© <span data-year>2026</span> ${SITE.name}. All rights reserved.</span><span>Made in India 🇮🇳 · Serving clients across India</span></div>
</div></footer>
<a class="wa" href="${WA_HELLO}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">${waIcon}</a>
<script src="/assets/main.js" defer></script>
</body></html>`;

const crumbs = (items) => ({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map(([n, p], i) => ({ '@type': 'ListItem', position: i + 1, name: n, item: SITE.url + p })) });
const crumbHtml = (name) => `<nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> / ${name}</nav>`;

const org = {
  '@context': 'https://schema.org', '@type': ['ProfessionalService', 'LocalBusiness'], '@id': SITE.url + '/#org',
  name: SITE.name, url: SITE.url, image: SITE.url + '/assets/og.svg', logo: SITE.url + '/assets/favicon.svg',
  telephone: SITE.phone, email: SITE.email, priceRange: '₹₹',
  description: 'Website design and development agency building fast, SEO-ready websites for small businesses in India.',
  address: { '@type': 'PostalAddress', addressLocality: SITE.city, addressRegion: SITE.region, addressCountry: 'IN' },
  geo: { '@type': 'GeoCoordinates', latitude: SITE.lat, longitude: SITE.lng },
  areaServed: { '@type': 'Country', name: 'India' },
  openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '10:00', closes: '19:00' }],
};
const website = { '@context': 'https://schema.org', '@type': 'WebSite', url: SITE.url, name: SITE.name, inLanguage: 'en-IN' };

const FAQS = [
  ['How much does a website cost for a small business in India?', 'Our websites start at ₹14,999 for a fast 5-page Starter site. Most local businesses choose the Growth plan at ₹29,999 which adds SEO, WhatsApp integration and Google Business setup. Use our cost estimator for an instant quote.'],
  ['How long does it take to build my website?', 'Starter sites launch in 7 days, Growth sites in 10–14 days and Premium sites in 3–4 weeks — once we receive your content and logo.'],
  ['Will my website show up on Google?', 'Every plan includes technical SEO: fast loading, mobile-first design, schema markup, sitemap and Search Console setup. Growth and Premium also include local SEO and Google Business Profile optimisation to help you rank in "near me" searches.'],
  ['Can customers contact me on WhatsApp from the website?', 'Yes. Every site includes a floating WhatsApp button and enquiry forms that open a pre-filled WhatsApp chat so leads reach your phone instantly.'],
  ['Do I own the website?', 'Absolutely. You own the domain, the design and the code. No lock-in, ever.'],
  ['Do you offer maintenance and support?', 'Yes — 30 days free support after launch, then optional care plans from ₹999/month covering hosting, backups, security updates and content edits.'],
  ['Can you accept online payments (UPI, cards)?', 'Yes. Our Premium plan and online store add-on integrate Razorpay, UPI and cards, with GST-ready invoices.'],
];
const faqHtml = FAQS.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('');
const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQS.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) };

// NOTE: testimonials, portfolio and case-study figures below are SAMPLE content — replace with real client data before launch.
const TESTI = [
  ['Our enquiries doubled within two months. The WhatsApp button alone brings us 5–6 bookings a week.', 'Priya Nair', 'Owner, sample dental clinic'],
  ['Clean, fast and exactly what a restaurant needs. Customers love the online menu and table booking.', 'Rahul Mehta', 'Founder, sample restaurant'],
  ['They explained everything in simple language and delivered before the deadline. Highly recommended.', 'Sunita Rao', 'Director, sample coaching institute'],
];
const testiHtml = TESTI.map(([q, n, r]) => `<figure class="card rv" style="margin:0"><div class="stars" aria-label="5 out of 5 stars">★★★★★</div><blockquote class="quote" style="margin:0">“${q}”</blockquote><figcaption class="who"><span class="av" aria-hidden="true">${n[0]}</span><span><b>${n}</b><small>${r}</small></span></figcaption></figure>`).join('');

const cta = (h = 'Ready to turn visitors into customers?', p = 'Tell us about your business on WhatsApp. You\'ll get a free, no-obligation quote within a few hours.') =>
  `<section><div class="wrap"><div class="cta rv"><h2>${h}</h2><p>${p}</p><div class="row"><a class="btn btn-primary" href="${WA_HELLO}" target="_blank" rel="noopener">Chat on WhatsApp →</a><a class="btn btn-ghost" href="/demos/">Try live demos</a></div></div></div></section>`;

const pages = {};

// ---------------- HOME ----------------
pages['/'] = {
  title: 'Website Design for Small Businesses in India | Studio by Tushar',
  desc: 'Premium, fast, SEO-ready websites for small businesses across India. Plans from ₹14,999 with WhatsApp enquiries, local SEO and 7-day launch. Get a free quote.',
  schema: [org, website, faqSchema],
  body: `
<section class="hero"><div class="wrap">
<div>
<span class="badge"><b></b>Web design for small businesses in India</span>
<h1>I build websites that bring your business <span class="hl">new customers.</span></h1>
<p class="lead">Fast, good-looking and found on Google — with enquiries going straight to your WhatsApp. Live in 7 days, from ₹14,999.</p>
<div class="row"><a class="btn btn-primary" href="${WA_HELLO}" target="_blank" rel="noopener">Get a free quote on WhatsApp →</a><a class="btn btn-ghost" href="/demos/">See live demos</a></div>
<div class="car" role="region" aria-roledescription="carousel" aria-label="What you get"><div class="car-track" tabindex="0"><article class="car-s" aria-roledescription="slide" aria-label="1 of 5"><div class="car-t"><span class="car-n">01</span><h3>Looks premium</h3><p>Custom design built around your brand, not a template everyone else uses.</p><a href="/demos/">See live demos <span aria-hidden="true">→</span></a></div><div class="car-v" aria-hidden="true"><div class="v-p"><b>Aa</b><span><i style="background:#123B33"></i><i style="background:#A8803A"></i><i style="background:#E9DDC3"></i></span></div></div></article><article class="car-s" aria-roledescription="slide" aria-label="2 of 5"><div class="car-t"><span class="car-n">02</span><h3>Found on Google</h3><p>Local SEO, schema markup and fast pages, so you show up for "near me" searches.</p><a href="/services/">What is included <span aria-hidden="true">→</span></a></div><div class="car-v" aria-hidden="true"><div class="v-g"><em>#1</em><small>near you</small><b>★★★★★</b></div></div></article><article class="car-s" aria-roledescription="slide" aria-label="3 of 5"><div class="car-t"><span class="car-n">03</span><h3>Leads on WhatsApp</h3><p>One-tap chat buttons and forms send every enquiry straight to your phone.</p><a href="/contact/">Try the enquiry form <span aria-hidden="true">→</span></a></div><div class="car-v" aria-hidden="true"><div class="v-w"><div>New enquiry</div><small>Book a cleaning ✓✓</small></div></div></article><article class="car-s" aria-roledescription="slide" aria-label="4 of 5"><div class="car-t"><span class="car-n">04</span><h3>Live in 7 days</h3><p>A simple process with clear milestones. No long agency timelines.</p><a href="/#process">See how it works <span aria-hidden="true">→</span></a></div><div class="car-v" aria-hidden="true"><div class="v-d"><span><i></i><i></i><i></i><i></i><i></i><i></i><i class="on"></i></span><small>Day 7 · live</small></div></div></article><article class="car-s" aria-roledescription="slide" aria-label="5 of 5"><div class="car-t"><span class="car-n">05</span><h3>Fixed price, in rupees</h3><p>Plans from ₹14,999. No hidden fees, no lock-in, and you own everything.</p><a href="/services/#pricing">View pricing <span aria-hidden="true">→</span></a></div><div class="car-v" aria-hidden="true"><div class="v-r"><b>₹14,999</b><small>fixed price</small></div></div></article></div><div class="car-ctl"><div class="car-prog" role="tablist" aria-label="Choose slide"><button type="button" aria-label="Go to slide 1"><i></i></button><button type="button" aria-label="Go to slide 2"><i></i></button><button type="button" aria-label="Go to slide 3"><i></i></button><button type="button" aria-label="Go to slide 4"><i></i></button><button type="button" aria-label="Go to slide 5"><i></i></button></div><div class="car-arrows"><button type="button" class="car-prev" aria-label="Previous slide">←</button><button type="button" class="car-next" aria-label="Next slide">→</button></div></div></div>
</div>
<div class="flow">
<p class="flow-h">A new customer's journey <em>(example)</em></p>
<ol class="steps">
<li class="st"><span class="sn">1</span><div class="sb"><h3>They search on Google</h3><p>Local SEO puts you in front of people already looking for you.</p>
<div class="mock gm" aria-hidden="true"><div class="gq"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5F665F" stroke-width="2.4" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>best dental clinic near me</div><div class="gr"><span class="gu">carewelldental.in</span><u>CareWell Dental — Book online in 30 seconds</u><span class="gs"><b>★★★★★</b> 4.9 (312) · Open now · 2 km</span></div></div></div></li>
<li class="st"><span class="sn">2</span><div class="sb"><h3>Your website convinces them</h3><p>A fast, mobile-first site that builds trust and makes the next step obvious.</p>
<div class="mock wm" aria-hidden="true"><div class="fbar2"><i></i><i></i><i></i><span>carewelldental.in</span></div><div class="wbody"><h4>Gentle care. <em>Easy booking.</em></h4><div class="chips"><span>Same-day slots</span><span>4.9 rated</span><span>Open till 8 pm</span></div><div class="wb">Book on WhatsApp</div></div></div></div></li>
<li class="st"><span class="sn">3</span><div class="sb"><h3>They message you on WhatsApp</h3><p>A ready-to-send enquiry lands in your phone. No forms, no missed leads.</p>
<div class="mock cm" aria-hidden="true"><div class="chead"><span class="av2">C</span><b>CareWell Dental</b><small>online</small></div><div class="cbody"><div class="bub">Hi! I'd like to book a cleaning for Saturday.<small>10:42 ✓✓</small></div></div></div></div></li>
</ol>
<p class="flow-r"><b>Result:</b> a booked appointment, with no ad spend.</p>
</div>
</div></section>

<section class="strip"><div class="wrap"><span>Made for</span><b>Restaurants</b><b>Clinics</b><b>Salons</b><b>Real estate</b><b>Coaching</b><b>Local shops</b></div></section>

<section style="padding-bottom:0"><div class="wrap"><div class="stats rv">
<div class="stat"><b>7 days</b><span>Typical launch time</span></div>
<div class="stat"><b>₹14,999</b><span>Starting price, fixed</span></div>
<div class="stat"><b>95+</b><span>Lighthouse score target</span></div>
<div class="stat"><b>100%</b><span>You own the code &amp; domain</span></div>
</div></div></section>

<section><div class="wrap">
<span class="eyebrow">Why Studio by Tushar</span><h2>Everything your business needs to <span class="hl">win online</span></h2>
<p class="lead">A pretty site isn't enough. I build for the one number that matters — new customers.</p>
<div class="grid g3">
<article class="card rv"><div class="ico">⚡</div><h3>Blazing fast</h3><p>Hand-coded, lightweight pages that pass Core Web Vitals — so Google and customers on slow 4G both love you.</p></article>
<article class="card rv"><div class="ico">🔍</div><h3>SEO built in</h3><p>Schema markup, clean metadata, sitemap and local SEO so you show up for "near me" searches in your city.</p></article>
<article class="card rv"><div class="ico">💬</div><h3>WhatsApp-first</h3><p>One-tap chat buttons and forms that drop leads straight into your WhatsApp — the way India does business.</p></article>
<article class="card rv"><div class="ico">📱</div><h3>Mobile-first design</h3><p>Over 75% of your visitors are on phones. I design for thumbs first, then scale up beautifully.</p></article>
<article class="card rv"><div class="ico">🎯</div><h3>Conversion-focused</h3><p>Clear calls to action, trust signals and persuasive copy engineered to get calls, bookings and orders.</p></article>
<article class="card rv"><div class="ico">🤝</div><h3>Simple, honest pricing</h3><p>Fixed prices in ₹, no hidden fees, no lock-in. You own your domain, design and code.</p></article>
</div></div></section>

<section class="alt"><div class="wrap">
<span class="eyebrow">Industries we serve</span><h2>Tailored for <span class="hl">your kind of business</span></h2>
<p class="lead">Don't imagine it — click through working demo sites for restaurants, clinics, salons, real estate, coaching and online stores.</p>
<div class="tiles">
${[['01', 'Restaurants & cafés', 'Menu, ordering and table booking', 'restaurant'], ['02', 'Clinics & doctors', 'Appointment slots and treatment pages', 'clinic'], ['03', 'Salons & spas', 'Service packages with live totals', 'salon'], ['04', 'Real estate', 'Listings with budget and BHK filters', 'realestate'], ['05', 'Coaching & education', 'Course pages and demo-class sign-ups', 'coaching'], ['06', 'Shops & D2C stores', 'Catalogue, cart and UPI checkout', 'store']].map(([n, t, d, k]) => `<a class="tile rv" href="/demos/#${k}"><span class="tn">${n}</span><div><h3>${t}</h3><p>${d}</p></div><span class="go">Try demo →</span></a>`).join('')}
</div></div></section>

<section id="process"><div class="wrap">
<span class="eyebrow">How it works</span><h2>From first chat to <span class="hl">live in 7 days</span></h2>
<div class="grid g4 steps">
<div class="step rv"><h3>Discovery</h3><p>A quick WhatsApp or call to understand your business, customers and goals.</p></div>
<div class="step rv"><h3>Design</h3><p>You approve a design preview before I write a single line of code.</p></div>
<div class="step rv"><h3>Build & SEO</h3><p>I build, optimise speed, add schema and connect WhatsApp, forms and analytics.</p></div>
<div class="step rv"><h3>Launch & grow</h3><p>Go live on your domain with Google indexing and 30 days of free support.</p></div>
</div></div></section>

<section><div class="wrap">
<span class="eyebrow">Pricing</span><h2>Clear prices. <span class="hl">Serious results.</span></h2>
<div class="grid g3">${[['Starter','₹14,999','A fast 5-page site to get you online.',['Mobile-first design','WhatsApp button & form','Basic SEO + sitemap'],0],['Growth','₹29,999','For businesses that want customers from Google.',['Up to 10 pages, custom design','Local SEO + Google Business','Schema markup & analytics'],1],['Premium','₹59,999','A full growth engine for ambitious brands.',['Booking or online store','Blog / CMS you can edit','Advanced SEO & tracking'],0]].map(([n,p,d,f,pop])=>`<article class="card price${pop?' pop':''} rv">${pop?'<span class="pop-tag">Most popular</span>':''}<h3>${n}</h3><div class="amt">${p}</div><p>${d}</p><ul class="ticks">${f.map(x=>`<li>${x}</li>`).join('')}</ul><a class="btn ${pop?'btn-primary':'btn-ghost'}" href="/services/#pricing">View ${n}</a></article>`).join('')}</div>
<p class="hint">Prices exclude GST. Build your own package with the <a href="/services/#estimator" class="hl">cost estimator</a>.</p>
</div></section>

<section class="alt"><div class="wrap">
<span class="eyebrow">My promise</span><h2>What you can <span class="hl">always expect</span></h2>
<div class="grid g4">
<div class="card rv"><span class="tn">01</span><h3>A reply within hours</h3><p>You'll talk to me directly on WhatsApp, not a support queue.</p></div>
<div class="card rv"><span class="tn">02</span><h3>A fixed price</h3><p>The quote you accept is the price you pay. No surprise invoices.</p></div>
<div class="card rv"><span class="tn">03</span><h3>Approval before build</h3><p>You sign off on the design before any development starts.</p></div>
<div class="card rv"><span class="tn">04</span><h3>30 days of support</h3><p>Free fixes and tweaks after launch while you settle in.</p></div>
</div></div></section>

<section><div class="wrap" style="max-width:820px">
<span class="eyebrow">FAQ</span><h2>Questions? <span class="hl">Answered.</span></h2>${faqHtml}</div></section>
${cta()}`,
};

// ---------------- SERVICES ----------------
const plan = (name, price, blurb, feats, pop) => `<article class="card price${pop ? ' pop' : ''} rv">${pop ? '<span class="pop-tag">Most popular</span>' : ''}<h3>${name}</h3><div class="amt">${price}<small> one-time</small></div><p>${blurb}</p><ul class="ticks">${feats.map((f) => `<li>${f}</li>`).join('')}</ul><a class="btn ${pop ? 'btn-primary' : 'btn-ghost'}" data-wa-msg="Hi! I'm interested in the ${name} plan (${price}). Can we talk?" href="${WA_HELLO}" target="_blank" rel="noopener">Choose ${name}</a></article>`;
const EST = [
  ['Base website (up to 5 pages, responsive)', 14999, true], ['Extra pages (3 more)', 4500], ['Local SEO + Google Business Profile', 8000], ['WhatsApp lead forms & chat button', 2500],
  ['Online booking / appointment system', 9000], ['Online store (up to 50 products, UPI/cards)', 24000], ['Blog / CMS setup', 6000], ['Logo & brand kit', 5000], ['Professional copywriting (5 pages)', 6000],
];
pages['/services/'] = {
  title: 'Website Design Services & Pricing in India | From ₹14,999',
  desc: 'Transparent website design pricing for Indian small businesses. Starter ₹14,999, Growth ₹29,999, Premium ₹59,999. SEO, WhatsApp integration and 7-day launch included.',
  schema: [crumbs([['Home', '/'], ['Services', '/services/']]), faqSchema, ...[['Starter website', 14999], ['Growth website', 29999], ['Premium website', 59999]].map(([n, p]) => ({ '@context': 'https://schema.org', '@type': 'Service', name: n, provider: { '@id': SITE.url + '/#org' }, areaServed: 'IN', offers: { '@type': 'Offer', price: p, priceCurrency: 'INR' } }))],
  body: `
<section class="page-hero hero"><div class="wrap" style="grid-template-columns:1fr"><div>${crumbHtml('Services & Pricing')}<span class="eyebrow">Services & pricing</span><h1>Simple pricing for <span class="hl">websites that earn.</span></h1><p class="lead">Fixed prices in rupees. No hidden charges. Pick a plan or build your own with the estimator below.</p></div></div></section>
<section id="pricing" style="padding-top:2rem"><div class="wrap"><div class="grid g3">
${plan('Starter', '₹14,999', 'Perfect for getting online quickly.', ['Up to 5 pages', 'Mobile-first responsive design', 'WhatsApp button & contact form', 'Basic on-page SEO + sitemap', 'Free SSL & 1-year hosting help', '7-day delivery'])}
${plan('Growth', '₹29,999', 'For local businesses that want customers from Google.', ['Up to 10 pages, custom design', 'Local SEO + Google Business Profile', 'Schema markup & Search Console', 'WhatsApp lead capture & analytics', 'Speed optimised (Core Web Vitals)', 'Testimonials, gallery & maps', '10–14 day delivery'], true)}
${plan('Premium', '₹59,999', 'A full growth engine for ambitious brands.', ['Unlimited pages, bespoke design', 'Online booking or store with UPI/cards', 'Blog + CMS you can edit', 'Advanced SEO content strategy', 'Conversion tracking & A/B-ready', 'Priority support for 90 days', '3–4 week delivery'])}
</div>
<p class="hint">All prices exclude GST. Domain registration charged at cost. Care plans from ₹999/month.</p></div></section>

<section class="alt" id="estimator"><div class="wrap"><span class="eyebrow">Cost estimator</span><h2>Build your own <span class="hl">package</span></h2><p class="lead">Select what you need and get an instant estimate. Send it to us on WhatsApp to lock it in.</p>
<div class="calc" style="margin-top:2rem"><div id="calc">${EST.map(([l, p, locked]) => `<label class="opt"><input type="checkbox" data-price="${p}" data-label="${l}"${locked ? ' checked disabled' : ''}><span>${l}</span><em>₹${p.toLocaleString('en-IN')}</em></label>`).join('')}</div>
<aside class="card total"><span class="eyebrow">Your estimate</span><div class="amt" id="calc-total">₹14,999</div><p>excluding GST</p><a class="btn btn-primary" id="calc-wa" href="${WA_HELLO}" target="_blank" rel="noopener" style="width:100%;justify-content:center">Send on WhatsApp</a></aside></div></div></section>

<section><div class="wrap"><span class="eyebrow">What we do</span><h2>Services <span class="hl">beyond the website</span></h2><div class="grid g3">
${[['🎨', 'Website design & development', 'Custom, premium design coded for speed — no bloated templates.'], ['📈', 'SEO & local SEO', 'Rank for the searches that bring buyers in your city.'], ['📍', 'Google Business Profile', 'Set up and optimise your listing for Maps and "near me".'], ['🛒', 'E-commerce', 'Sell online with UPI, cards, COD and GST-ready invoices.'], ['✍️', 'Copywriting', 'Persuasive website copy in English or Hinglish that converts.'], ['🛠️', 'Care & maintenance', 'Hosting, backups, security updates and unlimited small edits.']].map(([i, t, d]) => `<article class="card rv"><div class="ico">${i}</div><h3>${t}</h3><p>${d}</p></article>`).join('')}
</div></div></section>
<section id="faq"><div class="wrap" style="max-width:820px"><span class="eyebrow">FAQ</span><h2>Pricing & process <span class="hl">questions</span></h2>${faqHtml}</div></section>
${cta()}`,
};

// ---------------- DEMOS ----------------
pages['/demos/'] = {
  title: 'Interactive Demo Websites for Restaurants, Clinics, Salons & More',
  desc: 'Try fully interactive demo websites built for Indian small businesses: restaurant menus, clinic booking, salon packages, property filters, coaching enquiries and online stores.',
  schema: [crumbs([['Home', '/'], ['Live Demos', '/demos/']])],
  body: `
<section class="page-hero hero"><div class="wrap" style="grid-template-columns:1fr"><div>${crumbHtml('Live Demos')}<span class="eyebrow">Interactive demos</span><h1>Don't imagine it. <span class="hl">Try it.</span></h1><p class="lead">Six working demo sites for different industries. Click, filter, book and order — exactly what your customers would do.</p></div></div></section>
<section style="padding-top:1rem"><div class="wrap">
<div class="row" style="justify-content:space-between;align-items:center"><div class="chips" id="demo-tabs" role="tablist" aria-label="Choose an industry demo" style="margin:0"></div>
<div class="row"><button class="chip" data-device="desktop" aria-pressed="true">🖥️ Desktop</button><button class="chip" data-device="mobile" aria-pressed="false">📱 Mobile</button></div></div>
<div class="stage" style="margin-top:1.2rem"><div class="frame" id="demo-frame"><div class="fbar"><i></i><i></i><i></i><span id="demo-url">https://</span></div><div class="dsite" id="demo-body" aria-live="polite"></div></div></div>
<p class="hint">Demo businesses are fictional. Your website will use your branding, photos and content.</p>
<div class="center" style="margin-top:2rem"><a class="btn btn-primary" href="${WA_HELLO}" target="_blank" rel="noopener">I want one like this →</a></div>
</div></section>
<script src="/assets/demos.js" defer></script>
${cta('Want a demo built for your business?', 'Send us your business name and we\'ll share a custom preview — free, no obligation.')}`,
};

// ---------------- PORTFOLIO ----------------
const ACC = { 'Spice Trail Kitchen': '#c2410c', 'CareWell Dental': '#0e7490', 'Glow Up Salon': '#a21caf', 'UrbanNest Homes': '#166534', 'TopScore Academy': '#1d4ed8', 'Kalaa Handloom': '#b45309' };
const WORKS = [
  ['🍽️', 'Spice Trail Kitchen', 'Restaurant', 'Menu, table booking & online ordering', 'linear-gradient(135deg,#c2410c,#7c2d12)'],
  ['🦷', 'CareWell Dental', 'Healthcare', 'Appointment booking & treatment pages', 'linear-gradient(135deg,#0e7490,#164e63)'],
  ['💇', 'Glow Up Salon', 'Beauty', 'Package builder & gallery', 'linear-gradient(135deg,#a21caf,#701a75)'],
  ['🏠', 'UrbanNest Homes', 'Real estate', 'Property filters & lead capture', 'linear-gradient(135deg,#166534,#14532d)'],
  ['🎓', 'TopScore Academy', 'Education', 'Course catalogue & demo-class funnel', 'linear-gradient(135deg,#1d4ed8,#1e3a8a)'],
  ['🛍️', 'Kalaa Handloom', 'E-commerce', 'UPI checkout & catalogue', 'linear-gradient(135deg,#b45309,#78350f)'],
];
pages['/portfolio/'] = {
  title: 'Website Design Portfolio | Small Business Websites in India',
  desc: 'Browse our portfolio of premium small-business websites for restaurants, clinics, salons, real estate, coaching and e-commerce brands across India.',
  schema: [crumbs([['Home', '/'], ['Portfolio', '/portfolio/']])],
  body: `
<section class="page-hero hero"><div class="wrap" style="grid-template-columns:1fr"><div>${crumbHtml('Portfolio')}<span class="eyebrow">Portfolio</span><h1>Websites we're <span class="hl">proud of.</span></h1><p class="lead">A selection of recent work across industries — each built to rank, load fast and convert.</p></div></div></section>
<section style="padding-top:1rem"><div class="wrap"><div class="grid g3">
${WORKS.map(([i, n, c, d, g]) => `<article class="card work rv"><div class="thumb" style="--c:${ACC[n]}" aria-hidden="true"><div class="bw"><div class="bb"><i></i><i></i><i></i></div><div class="bn"><b></b><span></span><span></span><span></span></div><div class="bhero"><u></u><u></u><em></em></div><div class="bcards"><s></s><s></s><s></s></div></div></div><div class="body"><div class="meta"><span class="pill">${c}</span><span class="pill">Mobile-first</span><span class="pill">SEO</span></div><h3>${n}</h3><p>${d}</p><a class="hl" href="/demos/#${['restaurant', 'clinic', 'salon', 'realestate', 'coaching', 'store'][WORKS.findIndex((w) => w[1] === n)]}">View live demo →</a></div></article>`).join('')}
</div></div></section>
${cta()}`,
};

// ---------------- CASE STUDIES ----------------
const CASES = [
  ['Dental clinic, Bengaluru', 'From 4 to 30+ online bookings a month', 'The clinic relied on walk-ins and word of mouth, with a slow, outdated site that didn\'t appear on Google Maps.', 'A new mobile-first site with treatment pages, one-tap WhatsApp booking, Google Business optimisation and local schema.', [['+640%', 'Organic traffic'], ['30+', 'Bookings / month'], ['0.9s', 'Load time']]],
  ['Restaurant, Pune', 'Direct orders up 3×, less aggregator dependence', 'Heavy commissions on food apps were eating 25–30% of margins.', 'An online menu, WhatsApp ordering, table reservation and local SEO focused on "best biryani near me" style searches.', [['3×', 'Direct orders'], ['−18%', 'Commission costs'], ['#2', 'Local pack rank']]],
  ['Coaching institute, Jaipur', 'Free demo-class signups tripled', 'Enquiries came only from pamphlets and referrals; the old site wasn\'t mobile friendly.', 'A conversion-focused landing structure with course pages, demo-class funnel and WhatsApp follow-up automation.', [['3.4×', 'Enquiries'], ['62%', 'Mobile conversions'], ['96', 'Lighthouse score']]],
];
pages['/case-studies/'] = {
  title: 'Case Studies: Websites That Grew Small Businesses in India',
  desc: 'Real-style results: how our websites increased bookings, orders and enquiries for clinics, restaurants and coaching institutes across India.',
  schema: [crumbs([['Home', '/'], ['Case Studies', '/case-studies/']])],
  body: `
<section class="page-hero hero"><div class="wrap" style="grid-template-columns:1fr"><div>${crumbHtml('Case Studies')}<span class="eyebrow">Case studies</span><h1>Results that <span class="hl">pay for themselves.</span></h1><p class="lead">Websites are an investment. Here's how a better one changes the numbers.</p></div></div></section>
<section style="padding-top:1rem"><div class="wrap" style="display:grid;gap:1.5rem">
${CASES.map(([c, h, p, s, k]) => `<article class="card case rv"><div><span class="eyebrow">${c}</span><h2 style="font-size:1.6rem">${h}</h2><div class="kpis">${k.map(([a, b]) => `<div><b>${a}</b><span>${b}</span></div>`).join('')}</div></div><div><h3>The challenge</h3><p>${p}</p><h3>Our solution</h3><p>${s}</p><a class="btn btn-ghost btn-sm" href="${WA_HELLO}" target="_blank" rel="noopener">Get similar results →</a></div></article>`).join('')}
</div></section>
<section><div class="wrap"><span class="eyebrow">Testimonials</span><h2>In their <span class="hl">own words</span></h2><div class="grid g3">${testiHtml}</div></div></section>
${cta()}`,
};

// ---------------- ABOUT ----------------
pages['/about/'] = {
  title: `About Tushar Dhankhar | ${SITE.name} — Web Designer for Small Businesses in India`,
  desc: 'Hi, I\'m Tushar. I design and build fast, SEO-ready websites for small businesses across India — and you work with me directly, start to finish.',
  schema: [org, { '@context': 'https://schema.org', '@type': 'Person', name: 'Tushar Dhankhar', url: SITE.url + '/about/', jobTitle: 'Web designer and developer', worksFor: { '@id': SITE.url + '/#org' }, knowsAbout: ['Web design', 'SEO', 'Local SEO', 'WhatsApp marketing'] }, crumbs([['Home', '/'], ['About', '/about/']])],
  body: `
<section class="page-hero hero"><div class="wrap" style="grid-template-columns:1.2fr .8fr">
<div>${crumbHtml('About')}<span class="eyebrow">About me</span><h1>Hi, I'm Tushar. I help small businesses <span class="hl">look as good as they are.</span></h1><p class="lead">I design and build websites for local businesses across India — and you'll deal with me directly, from the first WhatsApp message to launch day and beyond.</p>
<div class="row"><a class="btn btn-primary" href="${WA_HELLO}" target="_blank" rel="noopener">Message me on WhatsApp →</a><a class="btn btn-ghost" href="/portfolio/">See my work</a></div></div>
<!-- Replace .portrait with <img src="/assets/tushar.jpg" alt="Tushar Dhankhar" width="480" height="560"> when you have a photo -->
<div class="portrait" role="img" aria-label="Tushar Dhankhar"><span>T</span><small>Tushar Dhankhar<br>Founder, ${SITE.name}</small></div>
</div></section>

<section style="padding-top:1rem"><div class="wrap" style="display:grid;grid-template-columns:1fr 1fr;gap:3rem;align-items:start" id="story">
<div class="rv"><span class="eyebrow">Why I do this</span><h2>Good businesses deserve <span class="hl">a good first impression</span></h2></div>
<div class="rv"><p>Most small businesses in India are brilliant at what they do — and invisible online. Their website is slow, dated or missing, and customers who search on their phones end up at a competitor.</p><p>Big agencies charge enterprise prices. DIY builders produce something generic that never shows up on Google. I started ${SITE.name} to sit in the middle: premium design, serious SEO and WhatsApp-first enquiries, at a price a local business can justify.</p><p>I keep the studio small on purpose. That means you never get passed between account managers — you talk to the person actually building your site.</p></div>
</div></section>
<style>@media(max-width:860px){#story{grid-template-columns:1fr!important;gap:1rem!important}.page-hero .wrap{grid-template-columns:1fr!important}}</style>

<section class="alt"><div class="wrap"><span class="eyebrow">How I work</span><h2>Four things you can <span class="hl">count on</span></h2><div class="grid g4">
<div class="card rv"><div class="ico"></div><h3>Straight talk</h3><p>Plain language, fixed prices in rupees and no surprise invoices.</p></div>
<div class="card rv"><div class="ico"></div><h3>You approve first</h3><p>You see and sign off on the design before I start building.</p></div>
<div class="card rv"><div class="ico"></div><h3>Built to be found</h3><p>Speed, schema and local SEO are part of every build, not an upsell.</p></div>
<div class="card rv"><div class="ico"></div><h3>Yours to keep</h3><p>You own your domain, design and code. No lock-in, ever.</p></div>
</div></div></section>

<section><div class="wrap"><span class="eyebrow">Working together</span><h2>What happens <span class="hl">after you message me</span></h2><div class="grid g3 steps">
<div class="step rv"><h3>A short conversation</h3><p>We chat on WhatsApp or a quick call about your business, customers and goals.</p></div>
<div class="step rv"><h3>A clear proposal</h3><p>You get a fixed quote and timeline within a day — no pressure, no obligation.</p></div>
<div class="step rv"><h3>Design, build, launch</h3><p>Preview, feedback, launch. Then 30 days of free support while you settle in.</p></div>
</div></div></section>
${cta('Let\'s talk about your business', 'Tell me what you do and who your customers are. I\'ll reply personally with ideas and a free quote.')}`,
};

// ---------------- CONTACT ----------------
pages['/contact/'] = {
  title: 'Contact Us | Get a Free Website Quote in India',
  desc: 'Get a free website quote. Chat with us on WhatsApp, call, or send an enquiry. We reply within a few hours, Monday to Saturday.',
  schema: [org, crumbs([['Home', '/'], ['Contact', '/contact/']]), { '@context': 'https://schema.org', '@type': 'ContactPage', url: SITE.url + '/contact/', name: 'Contact ' + SITE.name }],
  body: `
<section class="page-hero hero"><div class="wrap" style="grid-template-columns:1fr"><div>${crumbHtml('Contact')}<span class="eyebrow">Contact</span><h1>Let's build your <span class="hl">next customer magnet.</span></h1><p class="lead">Share a few details and we'll WhatsApp you a free quote — usually within a few hours.</p></div></div></section>
<section style="padding-top:1rem"><div class="wrap" style="display:grid;grid-template-columns:1.2fr .8fr;gap:2.5rem;align-items:start" id="contact-grid">
<form class="lead-form card" id="lead-form" novalidate="false">
<label>Your name<input name="name" required autocomplete="name"></label>
<label>Business name<input name="business" required autocomplete="organization"></label>
<label>Mobile / WhatsApp<input name="phone" type="tel" required autocomplete="tel" inputmode="tel" pattern="[0-9+ ]{10,15}"></label>
<label>What do you need?<select name="type"><option>New business website</option><option>Website redesign</option><option>Online store</option><option>SEO / Google Business</option><option>Not sure — need advice</option></select></label>
<label>Budget<select name="budget"><option>Under ₹15,000</option><option selected>₹15,000 – ₹30,000</option><option>₹30,000 – ₹60,000</option><option>₹60,000+</option></select></label>
<label>Anything else? (optional)<textarea name="message"></textarea></label>
<input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
<button class="btn btn-primary" type="submit">Send enquiry on WhatsApp →</button>
<p class="form-note" id="form-status" role="status">Your details open in a pre-filled WhatsApp message — we never share your number.</p>
</form>
<aside style="display:grid;gap:1rem">
<a class="card" style="text-decoration:none" href="${WA_HELLO}" target="_blank" rel="noopener"><div class="ico">💬</div><h3>WhatsApp (fastest)</h3><p class="hl">${SITE.phone}</p></a>
<a class="card" style="text-decoration:none" href="tel:${SITE.phone.replace(/\s/g, '')}"><div class="ico">📞</div><h3>Call us</h3><p>${SITE.phone}<br>Mon–Sat, 10 AM – 7 PM IST</p></a>
<a class="card" style="text-decoration:none" href="mailto:${SITE.email}"><div class="ico">✉️</div><h3>Email</h3><p>${SITE.email}</p></a>
<div class="card"><div class="ico">📍</div><h3>Based in ${SITE.city}</h3><p>Serving clients across India — Mumbai, Delhi, Pune, Hyderabad, Chennai, Jaipur and beyond.</p></div>
</aside></div></section>
<style>@media(max-width:860px){#contact-grid{grid-template-columns:1fr!important}}</style>`,
};

// ---------------- 404 ----------------
pages['/404.html'] = {
  title: 'Page not found | Studio by Tushar', desc: 'The page you were looking for could not be found.', noindex: true, schema: [],
  body: `<section class="hero"><div class="wrap" style="grid-template-columns:1fr;text-align:center"><div><span class="eyebrow">404</span><h1>This page took a <span class="hl">day off.</span></h1><p class="lead" style="margin-inline:auto">Let's get you back on track.</p><div class="row" style="justify-content:center"><a class="btn btn-primary" href="/">Go home</a><a class="btn btn-ghost" href="${WA_HELLO}">WhatsApp us</a></div></div></div></section>`,
};

// ---------------- Write output ----------------
const strip = (t) => t.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, (c) => ('★✓–'.includes(c) || c==='✓') ? c : '').replace(/ {2,}/g,' ');
rmSync('dist', { recursive: true, force: true });
mkdirSync('dist', { recursive: true });
cpSync('assets', 'dist/assets', { recursive: true });
import { readFileSync } from 'node:fs';
writeFileSync('dist/assets/demos.js', strip(readFileSync('assets/demos.js','utf8')));
for (const [path, p] of Object.entries(pages)) {
  let html = strip(head({ ...p, path }) + p.body + foot());
  if (p.noindex) html = html.replace('content="index,follow,max-image-preview:large"', 'content="noindex"');
  const out = path === '/404.html' ? 'dist/404.html' : `dist${path}index.html`;
  mkdirSync(out.replace(/\/[^/]+$/, ''), { recursive: true });
  writeFileSync(out, html);
}
const urls = Object.keys(pages).filter((p) => p !== '/404.html');
writeFileSync('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `<url><loc>${SITE.url}${u}</loc><lastmod>${today}</lastmod><priority>${u === '/' ? '1.0' : '0.8'}</priority></url>`).join('\n')}\n</urlset>\n`);
writeFileSync('dist/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE.url}/sitemap.xml\n`);
console.log('Built', urls.length, 'pages →', 'dist/');
