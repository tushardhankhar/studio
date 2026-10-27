// Static site generator: `node build.mjs` → ./dist  (no dependencies)
import { mkdirSync, writeFileSync, cpSync, rmSync, readFileSync } from 'node:fs';

// ---- Edit these before launch -------------------------------------------
const SITE = {
  name: 'Studio by Tushar',
  url: 'https://studio.tushardhankhar.com',   // production domain
  phone: '+91 96506 90149',                   // shown to visitors
  tel: '+919650690149',                       // used in tel: links and schema
  wa: '919650690149',                         // WhatsApp number, country code first, no "+"
  ga4: '',                                    // Google Analytics 4 ID, e.g. 'G-XXXXXXXXXX' (analytics stays off while empty)
  gsc: '',                                    // Google Search Console HTML-tag verification token (optional)
};
// --------------------------------------------------------------------------

const inr = (n) => '₹' + n.toLocaleString('en-IN');
const waLink = (m) => `https://wa.me/${SITE.wa}?text=${encodeURIComponent(m)}`;
const waA = (msg, label, { cls = 'btn btn-primary', loc = 'page', extra = '' } = {}) =>
  `<a class="${cls}" href="${waLink(msg)}" target="_blank" rel="noopener noreferrer" data-track="whatsapp_click" data-loc="${loc}"${extra}>${label}</a>`;
const Q = "Hi Tushar! I'd like a free website quote for my business.";
const WA_HELLO = waLink(Q);
const today = new Date().toISOString().slice(0, 10);

const MARK = `<svg class="mark" viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="12" fill="#123B33"/><path d="M9.5 9.5h21v5.2h-7.9V27h-5.2V14.7H9.5z" fill="#F4EEE0"/><rect x="17.6" y="29.3" width="4.8" height="4.8" rx=".6" transform="rotate(45 20 31.7)" fill="#C9A55C"/></svg>`;
const waIcon = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 3.5A11.8 11.8 0 0 0 12 0C5.4 0 .1 5.3.1 11.9c0 2.1.6 4.1 1.6 5.9L0 24l6.4-1.7a11.9 11.9 0 0 0 5.6 1.4c6.6 0 11.9-5.3 11.9-11.9 0-3.2-1.2-6.2-3.4-8.3zM12 21.7a9.9 9.9 0 0 1-5-1.4l-.4-.2-3.8 1 1-3.700-.2-.4a9.800 9.800 0 0 1-1.500-5.200C2.100 6.500 6.600 2 12 2c2.600 0 5.100 1 6.900 2.900a9.700 9.700 0 0 1 2.900 6.900c0 5.400-4.400 9.900-9.800 9.900zm5.400-7.400c-.3-.1-1.800-.9-2-1s-.5-.1-.7.1-.8 1-.9 1.100-.3.2-.6.1a8 8 0 0 1-4-3.500c-.3-.5.3-.5.900-1.600.1-.2.1-.4 0-.5l-.9-2.100c-.2-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.9.4 3.700 3.700 0 0 0-1.100 2.700c0 1.600 1.2 3.200 1.3 3.400s2.300 3.500 5.600 4.900c2.100.9 2.900.9 3.900.8.600-.1 1.800-.7 2-1.400s.3-1.300.2-1.400-.3-.2-.6-.3z"/></svg>`;

const NAV = [['/', 'Home'], ['/services/', 'Services & Pricing'], ['/industries/', 'Industries'], ['/demos/', 'Demos'], ['/process/', 'Process'], ['/about/', 'About'], ['/contact/', 'Contact']];

// ---------------------------------------------------------------------------
// Packages: single source of truth for every price on the site
// ---------------------------------------------------------------------------
const PLANS = [
  {
    key: 'starter', name: 'Starter', price: 5000, pages: 3, time: '5–7 working days', revisions: '2 rounds',
    blurb: 'A clean, responsive business website for individuals, freelancers and small businesses.',
    feats: ['Up to 3 pages', 'Mobile-friendly responsive design', 'Contact information & contact form', 'WhatsApp integration', 'Basic on-page SEO'],
  },
  {
    key: 'business', name: 'Business', price: 12000, pages: 6, time: '2–3 weeks', revisions: '3 rounds', pop: true,
    blurb: 'A professional multi-page website with custom design for growing local businesses.',
    feats: ['Up to 6 pages', 'Custom design', 'SEO-friendly structure', 'Enquiry forms & WhatsApp integration', 'Google Maps where relevant', 'Analytics setup'],
  },
  {
    key: 'premium', name: 'Premium', price: 25000, pages: 10, time: '3–5 weeks', revisions: '4 rounds',
    blurb: 'A feature-rich custom website for brands that want more depth and polish.',
    feats: ['Up to 10 pages', 'Advanced UI/UX & animations', 'Blog or CMS where appropriate', 'Advanced on-page SEO', 'Conversion-focused sections', 'Third-party integrations as required'],
  },
];
const planMsg = (p) => `Hi Tushar! I'm interested in the ${p.name} package (starting at ${inr(p.price)}). Could you share a quote for my business?`;
const PRICE_NOTE = 'These are starting prices. The final price depends on scope, functionality, content and integrations, and you always get a written quote before any work starts.';

// ---------------------------------------------------------------------------
// Demos: concept previews (not deployed client sites) — see /demos/<key>/
// ---------------------------------------------------------------------------
const DEMOS = [
  { k: 'restaurant', cat: 'Restaurants', label: 'Restaurant & café', name: 'Spice Trail Kitchen', accent: '#c2410c', ind: 'restaurant-website-design', blurb: 'A filterable menu, a live order total and a table-request form.', feats: ['Menu with category filters', 'Order total that updates as you add dishes', 'Table request form', 'Opening hours and location at the top'] },
  { k: 'clinic', cat: 'Healthcare', label: 'Clinic & healthcare', name: 'CareWell Dental', accent: '#0e7490', ind: 'clinic-website-design', blurb: 'Treatment pages, available slots and an appointment request.', feats: ['Treatment cards with starting prices', 'Selectable appointment slots', 'Appointment request form', 'Clear timings and trust signals'] },
  { k: 'salon', cat: 'Beauty', label: 'Salon & spa', name: 'Glow Up Salon', accent: '#a21caf', ind: 'salon-website-design', blurb: 'A service package picker that totals your selection.', feats: ['Service menu with durations and prices', 'Package picker with a running total', 'Bundle-saving example', 'Booking request form'] },
  { k: 'realestate', cat: 'Real estate', label: 'Real estate', name: 'UrbanNest Homes', accent: '#166534', ind: 'real-estate-website-design', blurb: 'Property listings with BHK and budget filters.', feats: ['BHK filter', 'Budget slider that filters listings', 'Property cards with key details', 'Enquiry buttons'] },
  { k: 'coaching', cat: 'Education', label: 'Coaching & education', name: 'TopScore Academy', accent: '#1d4ed8', ind: 'coaching-website-design', blurb: 'Course catalogue and a demo-class sign-up form.', feats: ['Course and batch cards', 'Demo-class sign-up form', 'Clear fees and schedules', 'Faculty and results sections (real data only)'] },
  { k: 'store', cat: 'E-commerce', label: 'Online store', name: 'Kalaa Handloom', accent: '#b45309', ind: 'ecommerce-website-development', blurb: 'A product catalogue with a cart and a free-shipping meter.', feats: ['Product catalogue', 'Cart that updates live', 'Free-shipping progress message', 'Checkout flow shown as a concept'] },
];
const demoMsg = (d) => `Hi Tushar! I saw the ${d.name} concept demo (${d.label}) on your website and I'd like something similar for my business. Can we talk?`;
const mock = (accent) => `<div class="thumb" style="--c:${accent}" aria-hidden="true"><div class="bw"><div class="bb"><i></i><i></i><i></i></div><div class="bn"><b></b><span></span><span></span><span></span></div><div class="bhero"><u></u><u></u><em></em></div><div class="bcards"><s></s><s></s><s></s></div></div><div class="ph"><b></b><u></u><u></u><s></s></div></div>`;
const demoCard = (d, loc) => `<article class="card work dc rv" data-cat="${d.cat}">${mock(d.accent)}<div class="body"><div class="meta"><span class="pill pill-c">Concept preview</span><span class="pill">${d.cat}</span></div><h3>${d.name}</h3><p>${d.blurb}</p><div class="row"><a class="btn btn-primary btn-sm" href="/demos/${d.k}/" data-track="demo_view" data-loc="${loc}" data-demo="${d.k}">View Demo</a>${waA(demoMsg(d), 'Build Something Similar', { cls: 'btn btn-ghost btn-sm', loc: 'demo-card', extra: ` data-demo="${d.k}"` })}</div></div></article>`;

// Portfolio websites (full sample sites for each industry).
// When one is live, paste its deployed address into `url`: the card switches to "Live" with a View Live Site button.
// Leave `url` empty while it is being built; the card shows as "In progress".
const PORTFOLIO = DEMOS.map((d) => ({ cat: d.cat, title: `${d.label} website`, accent: d.accent, demo: d.k, ind: d.ind, url: '' }));
const pfMsg = (p) => `Hi Tushar! Please let me know when your ${p.title.toLowerCase()} is live. I'm interested in something similar.`;
const pfCard = (p, loc) => `<article class="card work pf dc rv${p.url ? '' : ' pf-wip'}" data-cat="${p.cat}">${mock(p.accent)}<div class="body"><div class="meta"><span class="pill ${p.url ? 'pill-live' : 'pill-wip'}">${p.url ? 'Live' : 'In progress'}</span><span class="pill">${p.cat}</span></div><h3>${p.title}</h3><p>${p.url ? 'A complete, deployed website you can visit.' : 'A full sample website is being built. The link will appear here once it is live.'}</p><div class="row">${p.url ? `<a class="btn btn-primary btn-sm" href="${p.url}" target="_blank" rel="noopener noreferrer" data-track="portfolio_view" data-loc="${loc}" data-demo="${p.demo}">View Live Site</a>` : waA(pfMsg(p), 'Notify me when live', { cls: 'btn btn-primary btn-sm', loc: 'portfolio-wip', extra: ` data-demo="${p.demo}"` })}<a class="btn btn-ghost btn-sm" href="/demos/${p.demo}/">${p.url ? 'See concept demo' : 'Try the concept demo'}</a></div></div></article>`;

// Live websites I have built (real, deployed). Screenshots live in assets/portfolio/.
const LIVE = [
  { id: 'jashn', title: 'Join the Jashn', cat: 'Invitation websites', url: 'https://www.jointhejashn.com/', img: '/assets/portfolio/jashn.webp',
    alt: 'Join the Jashn homepage: personal invitation websites for weddings and celebrations, with a phone preview of a live invitation',
    blurb: 'A website I made for personal celebration invitations: a live countdown, RSVP, venue maps and a private WhatsApp link for every family, in English and Hindi.',
    tags: ['Invitations', 'Bilingual', 'WhatsApp sharing'] },
  { id: 'engisafe', title: 'Shivam Weld Safe India', cat: 'Industrial supplier', url: 'https://www.engisafe.in/', img: '/assets/portfolio/engisafe.webp',
    alt: 'engisafe.in homepage: Shivam Weld Safe India, a New Delhi wholesaler of industrial safety equipment and welding supplies',
    blurb: 'A catalogue website for a New Delhi wholesaler of welding and safety equipment: 40 products across 11 categories, with one-tap WhatsApp quote requests.',
    tags: ['Product catalogue', 'Wholesale', 'WhatsApp quotes'] },
  { id: 'tushar', title: 'tushardhankhar.com', cat: 'Personal portfolio', url: 'https://tushardhankhar.com/', img: '/assets/portfolio/tushar.webp',
    alt: 'tushardhankhar.com homepage: the dark, animated personal portfolio of Tushar Dhankhar, a senior software engineer',
    blurb: 'My own portfolio: a dark, animated one-page site that presents my experience, skills and work.',
    tags: ['Personal portfolio', 'Animated', 'Responsive'] },
];
const liveMsg = (s) => `Hi Tushar! I saw ${s.title} in your portfolio and I'd like a similar website for my business. Can we talk?`;
const liveCard = (s, loc) => `<article class="card work pf-live rv"><a class="shot" href="${s.url}" target="_blank" rel="noopener noreferrer" data-track="portfolio_view" data-loc="${loc}" data-site="${s.id}" tabindex="-1" aria-hidden="true"><img src="${s.img}" alt="${s.alt}" width="960" height="600" loading="lazy" decoding="async"></a><div class="body"><div class="meta"><span class="pill pill-live">Live</span><span class="pill">${s.cat}</span></div><h3>${s.title}</h3><p>${s.blurb}</p><div class="meta">${s.tags.map((t) => `<span class="pill">${t}</span>`).join('')}</div><div class="row"><a class="btn btn-primary btn-sm" href="${s.url}" target="_blank" rel="noopener noreferrer" data-track="portfolio_view" data-loc="${loc}" data-site="${s.id}">View Live Site <span aria-hidden="true">↗</span></a>${waA(liveMsg(s), 'Build Something Similar', { cls: 'btn btn-ghost btn-sm', loc: 'portfolio-live', extra: ` data-site="${s.id}"` })}</div></div></article>`;
const liveGrid = (loc) => `<div class="grid g2 live-grid">${LIVE.map((s) => liveCard(s, loc)).join('')}</div>`;

// ---------------------------------------------------------------------------
// Industry pages: original content per page
// ---------------------------------------------------------------------------
const IND = [
  {
    slug: 'restaurant-website-design', demo: 'restaurant', name: 'Restaurants & cafés', short: 'Restaurants & cafés', pkg: 'business',
    h1: 'Restaurant website design for <span class="hl">more bookings and direct orders</span>',
    title: 'Restaurant & Café Website Design in India | Studio by Tushar',
    desc: 'Mobile-friendly restaurant and café websites with a clear menu, location, WhatsApp table requests and local SEO foundations. Packages from ₹5,000.',
    intro: ['When someone searches for somewhere to eat, they decide quickly. They want to see the menu, check the opening hours, find the location and reach you with one tap. If your website makes them pinch, zoom and hunt for a phone number, they move on to the next result.', 'A good restaurant website does four jobs well: it makes the food look appealing, shows the menu clearly, makes you easy to find and contact, and gives regulars a simple way to book or reorder.'],
    needs: [['A menu that is easy to scan', 'Categories, short descriptions and clear prices, readable on a phone without downloading a PDF.'], ['Photos that sell the food', 'A small set of well-cropped images beats a slow, heavy gallery, so pages stay fast on mobile data.'], ['Location, hours and directions', 'Address, opening hours and a Google Maps link on the first screen, so people can find you in seconds.'], ['Easy booking and ordering', 'A WhatsApp table request works for most places. Full online ordering with payments is a custom-quoted add-on.']],
    pages: ['Home', 'Menu', 'About and gallery', 'Contact and reservations'],
    feats: ['Menu filtered by category', 'Table request that opens WhatsApp with the details filled in', 'Google Maps and opening hours', 'Banners for festivals and offers that are easy to update', 'Online ordering with payments (custom quote)'],
    seo: 'People search for things like "restaurants near me", "best biryani in [your area]" or "cafe with outdoor seating". Your menu content, headings and Google Business details should reflect how customers actually search. I set up the on-page foundations; where you rank also depends on competition, reviews and time, and cannot be guaranteed.',
    faqs: [['Can customers order food directly from the website?', 'Online ordering with payment is scoped as a custom project. Many restaurants start with a menu plus WhatsApp ordering and table requests, which is well within the Business package.'], ['Do I need professional food photos?', 'Good photos make a real difference. You can supply your own, or I can use licensed stock images as a placeholder. Photography itself is not included.'], ['Can I update the menu myself?', 'Menu changes are handled by me as small edits during the support period. A CMS option is available in the Premium package where it makes sense.']],
  },
  {
    slug: 'clinic-website-design', demo: 'clinic', name: 'Clinics & doctors', short: 'Clinics & healthcare', pkg: 'business',
    h1: 'Website design for clinics and doctors that <span class="hl">patients trust</span>',
    title: 'Clinic & Doctor Website Design in India | Studio by Tushar',
    desc: 'Clear, trustworthy websites for clinics, dentists and doctors: treatment pages, timings, appointment requests via WhatsApp and local SEO foundations. From ₹5,000.',
    intro: ['Patients search when something is bothering them, and they choose the clinic that looks trustworthy and is easy to reach. Credentials, treatments, timings and a clear way to book matter more than clever design.', 'Healthcare websites also need care: clear, accurate and respectful of patient privacy. I keep the content factual, avoid exaggerated claims and never add medical promises that you cannot stand behind.'],
    needs: [['Trust at first glance', 'Doctor profiles, qualifications and registration details that you choose to share, clinic photos and honest descriptions of treatments.'], ['Treatments explained simply', 'A clear page for each main treatment or specialty, so patients and Google understand what you offer.'], ['Easy appointment requests', 'Timings, location and an appointment request that reaches your phone by WhatsApp or call.'], ['Privacy-minded forms', 'Forms ask only for what is needed. Sensitive medical details do not belong in a contact form.']],
    pages: ['Home', 'Doctors and about', 'Treatments (one page each)', 'Contact and location'],
    feats: ['Treatment pages with plain-language descriptions', 'Appointment request via WhatsApp or call', 'Clinic timings and Google Maps', 'FAQ section for common patient questions', 'Real-time slot booking (custom quote)'],
    seo: 'Typical searches include "dentist near me", "skin specialist in [area]" and "[treatment] cost". Treatment pages with clear, original content help match them. Healthcare advertising has rules, so I keep claims factual, and Google rankings cannot be guaranteed.',
    faqs: [['Can patients book slots online?', 'An appointment request form that opens WhatsApp is part of the Business package. Real-time slot booking with calendar sync is a custom-quoted feature.'], ['Can you add patient reviews?', 'Only genuine reviews that you have permission to publish. I can link to your Google reviews or add ones with written consent.'], ['Who writes the medical content?', 'You provide or approve all medical information. I help with structure and plain-language wording, but you remain responsible for its accuracy.']],
  },
  {
    slug: 'salon-website-design', demo: 'salon', name: 'Salons, spas & beauty', short: 'Salons & beauty', pkg: 'business',
    h1: 'Salon and spa website design that <span class="hl">fills your appointment book</span>',
    title: 'Salon, Spa & Beauty Website Design in India | Studio by Tushar',
    desc: 'Stylish, mobile-first websites for salons, spas and beauty studios: service menus, galleries and one-tap WhatsApp booking requests. Packages from ₹5,000.',
    intro: ['Beauty is a visual business, and most clients check Instagram and Google before they book. A website gives your salon a home base that you control, with services, prices and booking in one place.', 'The goal is simple: show your work, make services and prices clear, and make booking a single tap.'],
    needs: [['A look that matches your brand', 'Colours, type and imagery that feel like your salon rather than a generic template.'], ['Service and price lists', 'Menus by category, with durations and starting prices that you control.'], ['A gallery that loads quickly', 'Style and before-and-after images, optimised so the page stays fast on mobile.'], ['One-tap booking requests', 'A WhatsApp button with the chosen service pre-filled, so enquiries arrive ready to confirm.']],
    pages: ['Home', 'Services and prices', 'Gallery', 'Team', 'Contact and booking'],
    feats: ['Service menu with categories', 'Package picker that totals the selection', 'Image gallery', 'WhatsApp booking request with the service pre-filled', 'Gift cards or memberships (custom quote)'],
    seo: 'People search for "salon near me", "bridal makeup in [area]" or "hair spa". Service pages, location details and a tidy Google Business profile help you appear for them. Rankings depend on competition and reviews and cannot be guaranteed.',
    faqs: [['Can I show my Instagram feed?', 'Linking to your Instagram is simple. Embedding a live feed adds third-party scripts that can slow the page, so I usually recommend a curated gallery plus a link.'], ['Can clients pay online?', 'Online payments and prepaid packages are scoped as custom work. A WhatsApp booking request is part of the standard packages.'], ['How do I keep prices up to date?', 'Price changes are quick edits during the support period, and afterwards through a maintenance option or, in Premium, a CMS where appropriate.']],
  },
  {
    slug: 'real-estate-website-design', demo: 'realestate', name: 'Real estate', short: 'Real estate', pkg: 'business',
    h1: 'Real estate website design that <span class="hl">brings you direct enquiries</span>',
    title: 'Real Estate Website Design in India | Studio by Tushar',
    desc: 'Websites for property agents and builders: filterable listings, clear property details, maps and WhatsApp enquiries. Packages from ₹5,000, custom quotes for portals.',
    intro: ['Property buyers compare many listings before they call anyone. A professional website helps an agent or developer stand apart from portal listings, collect direct enquiries and build a reputation that does not depend on a third-party platform.', 'What matters is clarity: what the property is, where it is, what it costs and how to see it.'],
    needs: [['Listings that are easy to filter', 'Budget, BHK, location and status filters so visitors find relevant properties quickly.'], ['Details buyers can trust', 'Clear pricing, area and location information with honest descriptions. Registration numbers, where applicable, shown clearly.'], ['Lead capture without friction', 'Enquiry buttons that send the property name straight to your WhatsApp.'], ['Maps and neighbourhood context', 'Embedded maps and nearby landmarks help buyers judge a location quickly.']],
    pages: ['Home', 'Listings or projects', 'Property detail pages', 'About', 'Contact'],
    feats: ['Listing cards filtered by BHK and budget', 'Property enquiry via WhatsApp', 'Google Maps embeds', 'Brochure download links', 'Property admin or CMS (custom quote)'],
    seo: 'Searches look like "2 BHK flats in [area]", "plots near [landmark]" or "real estate agent in [city]". Real estate is competitive and the big portals dominate, so a website works best as a brand and direct-enquiry channel that complements them. No ranking is guaranteed.',
    faqs: [['Can I add or remove listings myself?', 'With the Premium package a CMS can be set up where appropriate. Otherwise I update listings for you as small edits.'], ['Can you connect it to a CRM?', 'Integrations with CRMs or lead tools are possible and quoted individually, depending on the tool.'], ['Will you show RERA details?', 'If you share your registration numbers I will display them clearly. You remain responsible for the legal accuracy of your listings.']],
  },
  {
    slug: 'coaching-website-design', demo: 'coaching', name: 'Coaching & education', short: 'Coaching & education', pkg: 'business',
    h1: 'Website design for coaching classes and tutors that <span class="hl">earns parents\' trust</span>',
    title: 'Coaching Class Website Design in India | Studio by Tushar',
    desc: 'Websites for coaching centres, tutors and schools: course and batch pages, faculty profiles and demo-class sign-ups through WhatsApp. Packages from ₹5,000.',
    intro: ['Parents and students research coaching centres carefully. They look for results, faculty, batch timings and fees, usually on a phone in the evening.', 'A good website answers those questions plainly and makes it easy to book a demo class or call.'],
    needs: [['Clear course and batch pages', 'Subjects, levels, schedules and fees organised so parents can compare quickly.'], ['Faculty and credibility', 'Teacher profiles and genuine achievements. I only publish results that you can document.'], ['A demo-class sign-up', 'A short form or WhatsApp button that captures the student, class and preferred time.'], ['Content that educates', 'A blog or resources section, available in the Premium package, helps attract search traffic over time.']],
    pages: ['Home', 'Courses and batches', 'Faculty', 'Results and testimonials (real only)', 'Contact and demo class'],
    feats: ['Course and batch cards', 'Demo-class sign-up form', 'Fee and schedule tables', 'Faculty profiles', 'Student portal or online fee payment (custom quote)'],
    seo: 'Typical searches are "IIT JEE coaching in [city]", "spoken English classes near me" or "maths tuition for class 10". Separate pages for each course help match them. As always, ranking depends on competition and cannot be guaranteed.',
    faqs: [['Can I list student results?', 'Yes, if the results are accurate and you have permission to publish names or photos. I do not add made-up statistics.'], ['Can students pay fees online?', 'Online fee payment needs a payment gateway and is scoped as custom work.'], ['Can you add a student login or portal?', 'Logins, dashboards and portals are custom projects, quoted after we discuss the requirements.']],
  },
  {
    slug: 'ecommerce-website-development', demo: 'store', name: 'Online stores & D2C brands', short: 'E-commerce', pkg: null,
    h1: 'E-commerce website development for <span class="hl">small brands and local sellers</span>',
    title: 'E-commerce Website Development in India | Studio by Tushar',
    desc: 'Online store development for small brands: product catalogue, cart, UPI and card payments through a gateway, and SEO-ready product pages. Custom quotes.',
    intro: ['Selling online takes more than a product page. Shoppers need clear photos, honest delivery information and a checkout that works on a phone. Store owners need to manage products, orders and payments without technical help.', 'Because every store differs in catalogue size, payment methods, shipping and integrations, e-commerce projects are quoted individually rather than at a fixed package price.'],
    needs: [['A catalogue that is easy to browse', 'Categories, filters and search so customers can find products quickly.'], ['A checkout customers trust', 'Clear totals, delivery details and familiar payment options such as UPI and cards, through a payment gateway.'], ['Order and stock management', 'A way for you to add products, update stock and see orders without developer help.'], ['Delivery, returns and policies', 'Clear shipping, returns and privacy pages, which buyers and payment providers expect.']],
    pages: ['Home', 'Category pages', 'Product pages', 'Cart and checkout', 'Policies and contact'],
    feats: ['Product catalogue with categories', 'Cart and checkout flow', 'UPI and card payments through a gateway (gateway fees apply)', 'Shipping and COD options where supported', 'SEO-friendly product page structure'],
    seo: 'Shoppers search for specific products and for phrases such as "buy [product] online in India". Unique product descriptions, clean URLs and fast pages give your products the best chance. Ranking cannot be guaranteed, and competition for popular products is strong.',
    faqs: [['How much does an online store cost?', 'There is no fixed price. The cost depends on the number of products, the platform, payment and shipping integrations and design needs. You receive a written quote after a short discussion.'], ['Which platform will you use?', 'I recommend an approach after understanding your needs. It might be a hosted store platform or a custom build, depending on budget, catalogue size and growth plans.'], ['Are payment gateway charges included?', 'No. Payment gateways such as Razorpay charge their own transaction fees, billed to you directly by the provider.']],
  },
];

// ---------------------------------------------------------------------------
// Shared layout
// ---------------------------------------------------------------------------
const OG_IMG = SITE.url + '/assets/og.png';
const FONTS = 'https://fonts.googleapis.com/css2?family=Manrope:wght@600..800&family=Inter:wght@400..600&family=DM+Serif+Display:ital@0;1&display=swap';

const head = ({ title, desc, path, schema = [], og = 'website' }) => `<!doctype html>
<html lang="en-IN" data-wa="${SITE.wa}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${SITE.url}${path}">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta name="author" content="Tushar Dhankhar">
<meta name="theme-color" content="#FBF8F3">
${SITE.gsc ? `<meta name="google-site-verification" content="${SITE.gsc}">\n` : ''}<meta property="og:type" content="${og}"><meta property="og:site_name" content="${SITE.name}">
<meta property="og:title" content="${title}"><meta property="og:description" content="${desc}">
<meta property="og:url" content="${SITE.url}${path}"><meta property="og:image" content="${OG_IMG}">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Studio by Tushar: websites for small businesses in India">
<meta property="og:locale" content="en_IN">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${title}"><meta name="twitter:description" content="${desc}"><meta name="twitter:image" content="${OG_IMG}">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="${FONTS}">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/assets/styles.css">
${schema.map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join('\n')}
${SITE.ga4 ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${SITE.ga4}"></script>\n<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${SITE.ga4}');</script>` : ''}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="hdr"><div class="wrap">
<a class="logo" href="/" aria-label="${SITE.name} home">${MARK}<span class="wm">Studio<em> by Tushar</em></span></a>
<button class="burger" aria-label="Menu" aria-expanded="false" aria-controls="nav"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg></button>
<nav class="nav" id="nav" aria-label="Main">
${NAV.map(([h, l]) => `<a href="${h}"${h === path ? ' aria-current="page"' : ''}>${l}</a>`).join('')}
${waA(Q, 'Free quote', { cls: 'btn btn-primary btn-sm', loc: 'header' })}
</nav></div></header>
<main id="main">`;

const foot = () => `</main>
<footer><div class="wrap">
<div class="fgrid">
<div><a class="logo" href="/">${MARK}<span class="wm">Studio<em> by Tushar</em></span></a><p style="margin-top:1rem;max-width:34ch">A remote-friendly website studio building professional, mobile-friendly websites for small businesses across India.</p></div>
<div><h4>Services</h4><ul><li><a href="/services/#pricing">Pricing</a></li><li><a href="/services/#estimator">Cost estimator</a></li><li><a href="/process/">How it works</a></li><li><a href="/services/#faq">FAQ</a></li></ul></div>
<div><h4>Industries</h4><ul>${IND.map((i) => `<li><a href="/${i.slug}/">${i.short}</a></li>`).join('')}</ul></div>
<div><h4>Studio</h4><ul><li><a href="/demos/">Demo gallery</a></li><li><a href="/portfolio/">Portfolio</a></li><li><a href="/about/">About</a></li><li><a href="/contact/">Contact</a></li><li><a href="/privacy/">Privacy</a></li></ul></div>
<div><h4>Talk to me</h4><ul><li>${waA(Q, 'WhatsApp', { cls: 'flink', loc: 'footer' })}</li><li><a href="tel:${SITE.tel}" data-track="phone_click" data-loc="footer">${SITE.phone}</a></li></ul></div>
</div>
<div class="copy"><span>© <span data-year>2026</span> ${SITE.name}. All rights reserved.</span><span>Serving clients across India</span></div>
</div></footer>
<a class="wa" href="${WA_HELLO}" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" data-track="whatsapp_click" data-loc="floating">${waIcon}</a>
<script src="/assets/main.js" defer></script>
</body></html>`;

const crumbs = (items) => ({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map(([n, p], i) => ({ '@type': 'ListItem', position: i + 1, name: n, item: SITE.url + p })) });
const crumbHtml = (...trail) => `<nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a>${trail.map(([n, p]) => ` / ${p ? `<a href="${p}">${n}</a>` : n}`).join('')}</nav>`;

const org = {
  '@context': 'https://schema.org', '@type': 'ProfessionalService', '@id': SITE.url + '/#org',
  name: SITE.name, url: SITE.url, image: OG_IMG, logo: SITE.url + '/assets/favicon.svg',
  telephone: SITE.tel,
  description: 'A remote-friendly website design and development studio building professional, mobile-friendly websites for small businesses across India.',
  areaServed: { '@type': 'Country', name: 'India' },
  founder: { '@type': 'Person', name: 'Tushar Dhankhar' },
  contactPoint: { '@type': 'ContactPoint', telephone: SITE.tel, contactType: 'sales', areaServed: 'IN' },
};
const website = { '@context': 'https://schema.org', '@type': 'WebSite', url: SITE.url, name: SITE.name, inLanguage: 'en-IN' };
const serviceLd = (name, price, desc) => ({
  '@context': 'https://schema.org', '@type': 'Service', name, description: desc,
  provider: { '@id': SITE.url + '/#org' }, areaServed: { '@type': 'Country', name: 'India' },
  ...(price ? { offers: { '@type': 'Offer', price: String(price), priceCurrency: 'INR', description: 'Starting price. Final price depends on scope.', priceSpecification: { '@type': 'PriceSpecification', priceCurrency: 'INR', minPrice: price } } } : {}),
});
const faqLd = (list) => ({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: list.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) });
const faqHtml = (list) => list.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('');

const FAQS = [
  ['How much does a website cost for a small business in India?', `Packages start at ${inr(5000)} (Starter, up to 3 pages), ${inr(12000)} (Business, up to 6 pages) and ${inr(25000)} (Premium, up to 10 pages). These are starting prices. The final cost depends on scope, functionality, content and integrations, and you get a written quote before any work begins.`],
  ['How long does it take to build my website?', 'Typically 5–7 working days for Starter, 2–3 weeks for Business and 3–5 weeks for Premium, counted from when I receive your content (text, logo, photos) and your feedback. Late content or feedback extends the timeline.'],
  ['Will my website show up on Google?', 'Every package follows on-page SEO best practice: fast mobile pages, clean structure, titles, descriptions and a sitemap. Where you rank depends on competition, content, reviews and time, so nobody can honestly guarantee a position. I focus on giving your site the strongest foundation.'],
  ['Can customers contact me on WhatsApp from the website?', 'Yes. Every package includes WhatsApp integration: a chat button and enquiry options that open a WhatsApp message with the details filled in, so enquiries reach your phone directly.'],
  ['Who owns the website?', 'You do. Once the project is paid in full you own the design and code. The domain is registered in your name, and I hand over files and account access.'],
  ['What happens after launch? Do you offer maintenance?', 'Every project includes 30 days of post-launch support for fixing issues in the delivered work. After that you can choose pay-as-you-go updates or a monthly care plan, quoted according to your site.'],
  ['Can you build online stores, booking systems or dashboards?', 'Yes, but not at a fixed package price. E-commerce, payment gateways, booking systems, logins and dashboards are scoped individually and quoted separately. Payment gateway fees are charged by the provider.'],
  ['What do domain and hosting cost?', 'The domain is billed at cost through the registrar in your name (typically around ₹700–1,500 per year, depending on the extension). Starter and Business sites are static and can run on free-tier hosting. Sites that need paid hosting or a CMS back end are charged at cost and listed in your quote.'],
];

const cta = (h = 'Ready to turn visitors into enquiries?', p = 'Tell me about your business on WhatsApp and I\'ll send a free, no-obligation quote.') =>
  `<section><div class="wrap"><div class="cta rv"><h2>${h}</h2><p>${p}</p><div class="row">${waA(Q, 'Get a Free Quote →', { loc: 'cta' })}<a class="btn btn-ghost" href="/demos/">Explore Website Demos</a></div></div></div></section>`;

const pageHero = (trail, eyebrow, h1, lead) => `<section class="page-hero hero"><div class="wrap" style="grid-template-columns:1fr"><div>${crumbHtml(...trail)}<span class="eyebrow">${eyebrow}</span><h1>${h1}</h1><p class="lead">${lead}</p></div></div></section>`;

const planCard = (p, loc) => `<article class="card price${p.pop ? ' pop' : ''} rv">${p.pop ? '<span class="pop-tag">Most popular</span>' : ''}<h3>${p.name}</h3><div class="from">Starting at</div><div class="amt">${inr(p.price)}<small> onwards</small></div><p>${p.blurb}</p><ul class="ticks">${p.feats.map((f) => `<li>${f}</li>`).join('')}</ul><p class="pmeta">Typical delivery: ${p.time}</p>${waA(planMsg(p), `Enquire about ${p.name}`, { cls: `btn ${p.pop ? 'btn-primary' : 'btn-ghost'}`, loc, extra: ` data-package="${p.name}"` })}</article>`;

const pages = {};

// ---------------- HOME ----------------
const ic = (d) => `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const SLIDES = [
  ['Looks premium', 'Custom design built around your brand, not a template everyone else uses.', '/demos/', 'See the demos', '<div class="v-p"><b>Aa</b><span><i style="background:#123B33"></i><i style="background:#A8803A"></i><i style="background:#E9DDC3"></i></span></div>'],
  ['Built for Google search', 'Clean structure, fast mobile pages and on-page SEO, so search engines can understand your business.', '/services/#included', 'What is included', '<div class="v-g"><em>SEO</em><small>ready pages</small></div>'],
  ['Enquiries on WhatsApp', 'A chat button and enquiry options that send details straight to your phone.', '/contact/', 'Try the enquiry form', '<div class="v-w"><div>New enquiry</div><small>Book a cleaning ✓✓</small></div>'],
  ['Clear timelines', 'Starter sites take about 5–7 working days once I have your content. Bigger projects are planned in milestones.', '/process/', 'See how it works', '<div class="v-d"><span><i></i><i></i><i></i><i></i><i></i><i></i><i class="on"></i></span><small>Starter · ~1 week</small></div>'],
  ['Starting at ₹5,000', 'Three packages with clear inclusions. Final price depends on scope, and you get a written quote first.', '/services/#pricing', 'View pricing', `<div class="v-r"><b>${inr(5000)}</b><small>starting price</small></div>`],
];
const carousel = `<div class="car" role="region" aria-roledescription="carousel" aria-label="What you get"><div class="car-track" tabindex="0">${SLIDES.map(([t, d, l, c, v], i) => `<article class="car-s" aria-roledescription="slide" aria-label="${i + 1} of ${SLIDES.length}"><div class="car-t"><span class="car-n">0${i + 1}</span><h3>${t}</h3><p>${d}</p><a href="${l}">${c} <span aria-hidden="true">→</span></a></div><div class="car-v" aria-hidden="true">${v}</div></article>`).join('')}</div><div class="car-ctl"><div class="car-prog" role="tablist" aria-label="Choose slide">${SLIDES.map((_, i) => `<button type="button" aria-label="Go to slide ${i + 1}"><i></i></button>`).join('')}</div><div class="car-arrows"><button type="button" class="car-prev" aria-label="Previous slide">←</button><button type="button" class="car-next" aria-label="Next slide">→</button></div></div></div>`;

// Home, second section: websites I have built (swipe strip on mobile).
const homeWork = `<section id="work"><div class="wrap">
<span class="eyebrow">Portfolio</span><h2>Websites I've <span class="hl">built</span></h2>
<p class="lead">Live websites you can visit right now. Client work will be added only with permission.</p>
<div class="grid g2 live-grid rail" aria-label="Websites I've built">${LIVE.map((s) => liveCard(s, 'home')).join('')}</div>
<div class="center" style="margin-top:2rem"><a class="btn btn-ghost" href="/portfolio/">See the full portfolio →</a></div>
</div></section>`;

// PARKED: the concept-demos section that used to be the home page's second section.
// To bring it back, put ${homeDemos} in the home body (for example right after ${homeWork}).
// eslint-disable-next-line no-unused-vars
const homeDemos = `<section id="demos"><div class="wrap">
<span class="eyebrow">Website demos</span><h2>See it <span class="hl">before you commit</span></h2>
<p class="lead">Six interactive concept previews for different industries. Click, filter and try them on your phone. They are fictional businesses built to show what is possible.</p>
<div class="grid g3 rail" aria-label="Demo websites">${DEMOS.map((d) => demoCard(d, 'home')).join('')}</div>
<div class="center" style="margin-top:2rem"><a class="btn btn-ghost" href="/demos/">Browse the full demo gallery →</a></div>
</div></section>`;

// PARKED: the home page "What I build" section. To bring it back, put ${homeBuild} in the home body
// (it used to sit between the "Made for" strip and the pricing section).
// eslint-disable-next-line no-unused-vars
const homeBuild = `<section class="alt"><div class="wrap">
<span class="eyebrow">What I build</span><h2>Everything your business needs to <span class="hl">be found and contacted</span></h2>
<p class="lead">A website that looks good is only the start. I build for the things that bring in enquiries.</p>
<div class="grid g3">
<article class="card rv"><div class="ico"></div><h3>Design and development</h3><p>Custom, mobile-first pages coded for speed, without bloated templates.</p></article>
<article class="card rv"><div class="ico"></div><h3>On-page SEO</h3><p>Titles, headings, structure, sitemap and structured data so search engines understand your business.</p></article>
<article class="card rv"><div class="ico"></div><h3>WhatsApp enquiries</h3><p>Click-to-chat buttons and forms that open a message with the details already filled in.</p></article>
<article class="card rv"><div class="ico"></div><h3>Industry-specific sites</h3><p>Restaurants, clinics, salons, real estate, coaching and stores each need different pages. <a href="/industries/" class="hl">See industries</a>.</p></article>
<article class="card rv"><div class="ico"></div><h3>Online stores</h3><p>E-commerce with UPI and card payments through a gateway, quoted individually. <a href="/ecommerce-website-development/" class="hl">Learn more</a>.</p></article>
<article class="card rv"><div class="ico"></div><h3>Care and maintenance</h3><p>30 days of post-launch support, then optional pay-as-you-go or monthly care.</p></article>
</div></div></section>`;

pages['/'] = {
  title: 'Website Design for Small Businesses in India | Studio by Tushar',
  desc: 'Professional, mobile-friendly websites for small businesses across India. Packages from ₹5,000 with WhatsApp enquiries and SEO-ready pages. Get a free quote.',
  schema: [org, website],
  body: `
<section class="hero"><div class="wrap">
<div>
<span class="badge"><b></b>We build websites for small businesses in India</span>
<h1>Beautiful Websites That Help Small Businesses <span class="hl">Grow</span></h1>
<p class="lead">Professional, mobile-friendly websites designed to build trust, showcase your services, and turn visitors into enquiries. Starting at ${inr(5000)}.</p>
<div class="row">${waA(Q, 'Get a Free Quote →', { loc: 'hero' })}<a class="btn btn-ghost" href="/demos/">Explore Website Demos</a></div>
${carousel}
</div>
<div class="flow">
<p class="flow-h">A new customer's journey <em>(example)</em></p>
<ol class="jr">
<li class="st"><span class="sn">1</span><div class="sb"><h3>They search on Google</h3><p>Good on-page SEO helps people who are already looking for you to find you.</p>
<div class="mock gm" aria-hidden="true"><div class="gq"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5F665F" stroke-width="2.4" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>best dental clinic near me</div><div class="gr"><span class="gu">example-dental.in</span><u>Example Dental: Book online</u><span class="gs"><b>★★★★★</b> Highly rated · Open now · 2 km</span></div></div></div></li>
<li class="st"><span class="sn">2</span><div class="sb"><h3>Your website builds trust</h3><p>A fast, mobile-first site that explains what you do and makes the next step obvious.</p>
<div class="mock wmk" aria-hidden="true"><div class="fbar2"><i></i><i></i><i></i><span>example-dental.in</span></div><div class="wbody"><h4>Gentle care. <em>Easy booking.</em></h4><div class="chips"><span>Online booking</span><span>Clear prices</span><span>Open till 8 pm</span></div><div class="wb">Book on WhatsApp</div></div></div></div></li>
<li class="st"><span class="sn">3</span><div class="sb"><h3>They message you on WhatsApp</h3><p>A ready-to-send enquiry lands on your phone. No forms to check, fewer missed leads.</p>
<div class="mock cm" aria-hidden="true"><div class="chead"><span class="av2">E</span><b>Example Dental</b><small>online</small></div><div class="cbody"><div class="bub">Hi! I'd like to book a cleaning for Saturday.<small>10:42 ✓✓</small></div></div></div></div></li>
</ol>
<p class="flow-r"><b>The goal:</b> more enquiries from people already looking for what you offer.</p>
</div>
</div></section>

${homeWork}

<section class="strip"><div class="wrap"><span>Made for</span>${IND.map((i) => `<a href="/${i.slug}/">${i.short}</a>`).join('')}</div></section>

<section id="pricing"><div class="wrap">
<span class="eyebrow">Pricing</span><h2>Clear packages. <span class="hl">Clear starting prices.</span></h2>
<div class="grid g3 rail" data-start="1" data-tabs="Starter|₹5,000;Business|₹12,000;Premium|₹25,000" aria-label="Website packages">${PLANS.map((p) => planCard(p, 'home-pricing')).join('')}</div>
<p class="hint">${PRICE_NOTE} Online stores, booking systems and dashboards are quoted separately. <a href="/services/#estimator" class="hl">Try the estimator</a> or see <a href="/services/#included" class="hl">what is included and what costs extra</a>.</p>
</div></section>

<section class="alt" id="process"><div class="wrap">
<span class="eyebrow">How it works</span><h2>Simple steps, <span class="hl">no surprises</span></h2>
<div class="grid g4 steps">
<div class="step rv"><h3>Discuss</h3><p>A short WhatsApp chat or call about your business and goals. You deal with me directly.</p></div>
<div class="step rv"><h3>Quote</h3><p>Scope, timeline and price are agreed in writing before any work starts.</p></div>
<div class="step rv"><h3>Design and build</h3><p>You review the design and request revisions before the final build.</p></div>
<div class="step rv"><h3>Launch and own</h3><p>30 days of support after launch. Once paid in full, the design and code are yours.</p></div>
</div>
<div class="center" style="margin-top:2rem"><a class="btn btn-ghost" href="/process/">See the full process →</a></div>
</div></section>

<section><div class="wrap">
<div class="card note-c rv"><div><span class="eyebrow">More on the way</span><h2 style="font-size:1.6rem">Industry sample websites are in progress.</h2><p>I'm building a complete sample website for each industry. Each one will be linked on the portfolio page once it is live. Until then, the concept demos show what is possible.</p></div><div class="row"><a class="btn btn-primary" href="/portfolio/">See the portfolio</a><a class="btn btn-ghost" href="/demos/">Try concept demos</a></div></div>
</div></section>

<section><div class="wrap" style="max-width:820px">
<span class="eyebrow">FAQ</span><h2>Questions? <span class="hl">Answered.</span></h2>${faqHtml(FAQS.slice(0, 6))}<p class="hint"><a href="/services/#faq" class="hl">More questions about pricing, hosting and maintenance</a></p></div></section>
${cta()}`,
};

// ---------------- SERVICES ----------------
const ROWS = [
  ['Pages', ...PLANS.map((p) => `Up to ${p.pages}`)],
  ['Design', 'Clean, responsive', 'Custom design', 'Advanced UI/UX'],
  ['Mobile-friendly', 'Yes', 'Yes', 'Yes'],
  ['WhatsApp integration', 'Yes', 'Yes', 'Yes'],
  ['Contact / enquiry forms', 'Contact form', 'Enquiry forms', 'Enquiry forms'],
  ['On-page SEO', 'Basic', 'SEO-friendly structure', 'Advanced'],
  ['Google Maps', '–', 'Where relevant', 'Where relevant'],
  ['Analytics setup', '–', 'Yes', 'Yes'],
  ['Animations', '–', '–', 'Yes'],
  ['Blog or CMS', '–', '–', 'Where appropriate'],
  ['Third-party integrations', '–', '–', 'As required'],
  ['Typical delivery', ...PLANS.map((p) => p.time)],
  ['Revision rounds', ...PLANS.map((p) => p.revisions)],
  ['Post-launch support', '30 days', '30 days', '30 days'],
];
const EXTRAS_TOP = [['Extra pages', 'Pages beyond your package limit'], ['Content and copywriting', 'Writing, editing and translation'], ['Logo and branding', 'Logo design or brand refresh'], ['Photography and licensed media', 'Photos, videos and stock licences'], ['Paid tools and plugins', 'Third-party subscriptions, if needed'], ['Extra revisions', 'Changes beyond the included rounds, or scope changes']];
const CUSTOM = ['E-commerce and online stores', 'Booking and appointment systems', 'Payment gateway integration', 'Logins, member areas and dashboards', 'Custom features and complex integrations'];
const ADDONS = ['Extra pages', 'Blog or CMS', 'Online booking system', 'Online store and payments', 'Logo and branding', 'Content and copywriting', 'Maintenance plan'];

pages['/services/'] = {
  title: 'Website Design Pricing in India | Packages from ₹5,000',
  desc: 'Starter ₹5,000, Business ₹12,000 and Premium ₹25,000 onwards. See what is included, what costs extra, timelines, revisions and maintenance options.',
  schema: [org, crumbs([['Home', '/'], ['Services & Pricing', '/services/']]), faqLd(FAQS), ...PLANS.map((p) => serviceLd(`${p.name} website package`, p.price, p.blurb))],
  body: `
${pageHero([['Services & Pricing']], 'Services & pricing', 'Website packages with <span class="hl">clear starting prices</span>', `Three packages from ${inr(5000)}. ${PRICE_NOTE}`)}
<section id="pricing" style="padding-top:2rem"><div class="wrap"><div class="grid g3 rail" data-start="1" data-tabs="Starter|₹5,000;Business|₹12,000;Premium|₹25,000" aria-label="Website packages">${PLANS.map((p) => planCard(p, 'services-pricing')).join('')}</div>
<p class="hint">Prices exclude GST where applicable. Need something bigger? See <a href="#custom" class="hl">custom quotes</a>.</p></div></section>

<section id="portfolio-sites"><div class="wrap"><span class="eyebrow">Portfolio</span><h2>Websites to <span class="hl">explore</span></h2>
<p class="lead">Live websites I have built, plus concept websites for fictional businesses that show what each package can look like. Full sample sites for each industry are in progress.</p>
${liveGrid('services')}
<h3 style="margin-top:3rem">Concept websites</h3>
<div class="grid g3 rail" aria-label="Portfolio websites">${DEMOS.map((d) => demoCard(d, 'services-portfolio')).join('')}</div>
<div class="center" style="margin-top:2rem"><a class="btn btn-ghost" href="/portfolio/">See the full portfolio →</a></div></div></section>

<section class="alt" id="included"><div class="wrap"><span class="eyebrow">What's included</span><h2>Compare the <span class="hl">packages</span></h2>
<div class="tbl rv"><table><thead><tr><th scope="col">Feature</th>${PLANS.map((p) => `<th scope="col">${p.name}<small>${inr(p.price)}+</small></th>`).join('')}</tr></thead><tbody>${ROWS.map(([a, ...b]) => `<tr><th scope="row">${a}</th>${b.map((x) => `<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
<p class="hint">A revision round means one consolidated set of feedback on the design or content. Timelines count from when I receive your content and feedback.</p>
<div class="grid g2" style="margin-top:2rem">
<article class="card rv"><h3>What costs extra</h3><p>These are not part of the package prices. They are quoted with your project when you need them.</p><ul class="ticks">${EXTRAS_TOP.map(([t, d]) => `<li><b>${t}:</b> ${d}</li>`).join('')}<li><b>GST:</b> added where applicable</li></ul></article>
<article class="card rv" id="custom"><h3>Custom quote only</h3><p>These need proper scoping, so I do not offer them at a fixed package price.</p><ul class="ticks">${CUSTOM.map((t) => `<li>${t}</li>`).join('')}</ul>${waA('Hi Tushar! I need a custom quote for a website with advanced features (store, booking or dashboard).', 'Ask for a custom quote', { cls: 'btn btn-ghost', loc: 'services-custom' })}</article>
</div></div></section>

<section><div class="wrap"><span class="eyebrow">Domain, hosting & care</span><h2>No <span class="hl">surprises</span> after launch</h2><div class="grid g3">
<article class="card rv"><h3>Domain</h3><p>Billed at cost through the registrar, registered in your name (typically around ₹700–1,500 per year, depending on the extension). You can renew it yourself.</p></article>
<article class="card rv"><h3>Hosting</h3><p>Starter and Business sites are static and can run on free-tier hosting within the provider's fair-use limits. Premium sites that need paid hosting or a CMS back end are charged at cost and listed in your quote.</p></article>
<article class="card rv"><h3>Maintenance</h3><p>30 days of post-launch support for fixing issues in the delivered work, included. After that: pay-as-you-go updates, or a monthly care plan covering updates, backups and monitoring, quoted by site size.</p></article>
</div></div></section>

<section class="alt" id="estimator"><div class="wrap"><span class="eyebrow">Cost estimator</span><h2>Start with a <span class="hl">package</span></h2><p class="lead">Choose a package and any extras. You'll see the starting price, and add-ons are priced after I review your scope. Send it on WhatsApp for a written quote.</p>
<div class="calc" style="margin-top:2rem"><div id="calc">
<fieldset class="opts"><legend>1. Choose a package</legend>${PLANS.map((p, i) => `<label class="opt"><input type="radio" name="pkg" value="${p.key}" data-price="${p.price}" data-label="${p.name} package"${i === 1 ? ' checked' : ''}><span>${p.name} <small>(up to ${p.pages} pages)</small></span><em>${inr(p.price)}+</em></label>`).join('')}</fieldset>
<fieldset class="opts"><legend>2. Add extras (priced after scope review)</legend>${ADDONS.map((a) => `<label class="opt"><input type="checkbox" name="addon" data-label="${a}"><span>${a}</span><em>Quoted</em></label>`).join('')}</fieldset>
</div>
<aside class="card total"><span class="eyebrow">Starting estimate</span><div class="amt" id="calc-total">${inr(12000)}</div><p id="calc-note">Starting price for the Business package. Final price depends on scope.</p>${waA(planMsg(PLANS[1]), 'Send estimate on WhatsApp', { cls: 'btn btn-primary', loc: 'estimator', extra: ' id="calc-wa" style="width:100%;justify-content:center"' })}</aside></div></div></section>

<section id="faq"><div class="wrap" style="max-width:820px"><span class="eyebrow">FAQ</span><h2>Pricing & process <span class="hl">questions</span></h2>${faqHtml(FAQS)}</div></section>
${cta()}`,
};

// ---------------- PROCESS ----------------
pages['/process/'] = {
  title: 'Website Design Process, Ownership & Support | Studio by Tushar',
  desc: 'From first chat to launch: the milestones, communication, website ownership, post-launch support and maintenance options for every Studio by Tushar project.',
  schema: [org, crumbs([['Home', '/'], ['Process', '/process/']])],
  body: `
${pageHero([['Process']], 'Process', 'A simple process with <span class="hl">clear milestones</span>', 'Every project follows the same steps, so you always know what has happened, what comes next and what I need from you.')}
<section style="padding-top:1rem"><div class="wrap"><div class="grid g3 steps">
<div class="step rv"><h3>Discovery</h3><p>We talk about your business, customers and goals on WhatsApp or a call. <b>Milestone:</b> I understand what the site must do.</p></div>
<div class="step rv"><h3>Written quote</h3><p>You receive scope, package, timeline, extras and price in writing. <b>Milestone:</b> you approve the quote and the project starts.</p></div>
<div class="step rv"><h3>Content and design</h3><p>You share your logo, text and photos. I prepare a design preview. <b>Milestone:</b> you approve the look and feel.</p></div>
<div class="step rv"><h3>Build</h3><p>I build the pages, forms, WhatsApp links and SEO foundations. <b>Milestone:</b> a working preview link.</p></div>
<div class="step rv"><h3>Review and revisions</h3><p>You test the site on your phone and send consolidated feedback, within the revision rounds of your package. <b>Milestone:</b> final approval.</p></div>
<div class="step rv"><h3>Launch and support</h3><p>The site goes live on your domain, and 30 days of post-launch support begin. <b>Milestone:</b> handover.</p></div>
</div></div></section>

<section class="alt"><div class="wrap"><div class="grid g2">
<article class="card rv"><h3>Communication</h3><p>WhatsApp is the main channel, with calls when they help. I share progress at each milestone and a preview link before launch. Clear, consolidated feedback keeps projects on schedule.</p></article>
<article class="card rv"><h3>What I need from you</h3><p>Your logo, business details, text and photos (or I can help shape the text, which is a quoted extra), plus timely feedback. Timelines count from when I receive your content.</p></article>
<article class="card rv"><h3>Website ownership</h3><p>Once the project is paid in full, you own the design and code. The domain is registered in your name, and I hand over files and account access, with no lock-in.</p></article>
<article class="card rv"><h3>Payment terms</h3><p>Payment milestones are written into your quote before the project starts, so you always know what is due and when.</p></article>
</div></div></section>

<section><div class="wrap"><span class="eyebrow">After launch</span><h2>Support and <span class="hl">maintenance options</span></h2><div class="grid g3">
<article class="card rv"><h3>30 days of support</h3><p>Included with every project: I fix issues in the delivered work, such as broken links, layout bugs or form problems.</p></article>
<article class="card rv"><h3>Pay as you go</h3><p>Need a new section, a price change or an extra page? Small updates are quoted per request.</p></article>
<article class="card rv"><h3>Monthly care plan</h3><p>Ongoing updates, backups and monitoring, quoted according to the size of your site. Ask for details in your quote.</p></article>
</div></div></section>
${cta()}`,
};

// ---------------- DEMOS GALLERY ----------------
pages['/demos/'] = {
  title: 'Website Demo Gallery for Small Businesses | Studio by Tushar',
  desc: 'Browse interactive concept demos for restaurants, clinics, salons, real estate, coaching and online stores, then ask for something similar for your business.',
  schema: [org, crumbs([['Home', '/'], ['Demos', '/demos/']]), { '@context': 'https://schema.org', '@type': 'ItemList', name: 'Website concept demos', itemListElement: DEMOS.map((d, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE.url}/demos/${d.k}/`, name: `${d.label} website concept` })) }],
  body: `
${pageHero([['Demos']], 'Demo gallery', 'Try a website for <span class="hl">your kind of business</span>', 'These are interactive concept previews of fictional businesses, not live client websites. They show the structure and features I can build for your industry.')}
<section style="padding-top:1rem"><div class="wrap">
<div class="chips" id="demo-filters" role="group" aria-label="Filter demos by industry"><button type="button" class="chip" data-fcat="All" aria-pressed="true">All</button>${DEMOS.map((d) => `<button type="button" class="chip" data-fcat="${d.cat}" aria-pressed="false">${d.cat}</button>`).join('')}</div>
<div class="grid g3 rail" id="demo-grid" aria-label="Demo websites" style="margin-top:1rem">${DEMOS.map((d) => demoCard(d, 'gallery')).join('')}</div>
<p class="hint">Every demo is a concept preview of a fictional business. Your website would use your own brand, photos and content.</p>
</div></section>
${cta('Want a preview built for your business?', 'Tell me what you do and who your customers are. I\'ll suggest the right package and send a free quote.')}`,
};

// ---------------- DEMO PAGES ----------------
for (const d of DEMOS) {
  pages[`/demos/${d.k}/`] = {
    title: `${d.label} Website Concept Demo | Studio by Tushar`,
    desc: `Interactive concept preview of a ${d.label.toLowerCase()} website: ${d.blurb[0].toLowerCase()}${d.blurb.slice(1)} Fictional business, not a live site.`,
    schema: [org, crumbs([['Home', '/'], ['Demos', '/demos/'], [d.label, `/demos/${d.k}/`]])],
    body: `
<section class="page-hero hero"><div class="wrap" style="grid-template-columns:1fr"><div>${crumbHtml(['Demos', '/demos/'], [d.label])}<span class="eyebrow">Concept preview</span><h1>${d.label} <span class="hl">website demo</span></h1><p class="lead">${d.name} is a fictional business. This is a concept preview built to show what your site could look like. It is not a live website, and nothing you enter is sent anywhere.</p></div></div></section>
<section style="padding-top:1rem"><div class="wrap">
<div class="row" style="justify-content:space-between;align-items:center"><div class="chips" aria-label="Other concept demos" style="margin:0">${DEMOS.map((x) => `<a class="chip" href="/demos/${x.k}/"${x.k === d.k ? ' aria-current="page" aria-selected="true"' : ''}>${x.cat}</a>`).join('')}</div>
<div class="row"><button type="button" class="chip" data-device="desktop" aria-pressed="true">Desktop</button><button type="button" class="chip" data-device="mobile" aria-pressed="false">Mobile</button></div></div>
<div class="stage" style="margin-top:1.2rem"><div class="frame" id="demo-frame" data-demo="${d.k}"><div class="fbar"><i></i><i></i><i></i><span id="demo-url">Concept preview</span></div><div class="dsite" id="demo-body" aria-live="polite"></div></div></div>
<p class="hint">Concept preview of a fictional business. Prices, names and offers shown are examples only.</p>
<div class="grid g2" style="margin-top:2rem">
<article class="card rv"><h3>What this concept shows</h3><ul class="ticks">${d.feats.map((f) => `<li>${f}</li>`).join('')}</ul></article>
<article class="card rv"><h3>Want something similar?</h3><p>I can build a ${d.label.toLowerCase()} website with your branding, photos and content. Packages start at ${inr(5000)}; features like these are scoped in your written quote.</p><div class="row">${waA(demoMsg(d), 'Build Something Similar', { loc: 'demo-page', extra: ` data-demo="${d.k}"` })}<a class="btn btn-ghost" href="/${d.ind}/">${d.cat} websites</a></div></article>
</div></div></section>
<noscript><section><div class="wrap"><p class="hint">This concept preview needs JavaScript. You can still <a href="${waLink(demoMsg(d))}">ask for something similar on WhatsApp</a>.</p></div></section></noscript>
<script src="/assets/demos.js" defer></script>
${cta()}`,
  };
}

// ---------------- INDUSTRIES ----------------
pages['/industries/'] = {
  title: 'Industry Website Design for Local Businesses | Studio by Tushar',
  desc: 'Website design for restaurants, clinics, salons, real estate, coaching centres and online stores in India. See what each industry needs and what it costs.',
  schema: [org, crumbs([['Home', '/'], ['Industries', '/industries/']])],
  body: `
${pageHero([['Industries']], 'Industries', 'Websites shaped around <span class="hl">how your customers decide</span>', 'A restaurant, a clinic and a coaching centre need different pages and different calls to action. Pick your industry to see what I would build.')}
<section style="padding-top:1rem"><div class="wrap"><div class="tiles">${IND.map((i, n) => `<a class="tile rv" href="/${i.slug}/"><span class="tn">0${n + 1}</span><div><h3>${i.name}</h3><p>${i.pages.slice(0, 4).join(' · ')}</p></div><span class="go">Learn more →</span></a>`).join('')}</div></div></section>
${cta()}`,
};
for (const I of IND) {
  const plan = PLANS.find((p) => p.key === I.pkg);
  const d = DEMOS.find((x) => x.k === I.demo);
  pages[`/${I.slug}/`] = {
    title: I.title, desc: I.desc,
    schema: [org, crumbs([['Home', '/'], ['Industries', '/industries/'], [I.short, `/${I.slug}/`]]), serviceLd(`${I.short} website design`, plan ? plan.price : null, I.desc), faqLd(I.faqs)],
    body: `
<section class="page-hero hero"><div class="wrap" style="grid-template-columns:1fr"><div>${crumbHtml(['Industries', '/industries/'], [I.short])}<span class="eyebrow">${I.name}</span><h1>${I.h1}</h1><p class="lead">${I.intro[0]}</p>
<div class="row">${waA(`Hi Tushar! I'd like a quote for a ${I.short.toLowerCase()} website.`, 'Get a Free Quote →', { loc: 'industry-hero' })}<a class="btn btn-ghost" href="/demos/${d.k}/">See the concept demo</a></div></div></div></section>
<section style="padding-top:1rem"><div class="wrap" style="max-width:820px"><p>${I.intro[1]}</p></div></section>
<section class="alt"><div class="wrap"><span class="eyebrow">What your customers need</span><h2>Four things a ${I.short.toLowerCase()} website <span class="hl">must get right</span></h2><div class="grid g2">${I.needs.map(([t, p], n) => `<article class="card rv"><span class="tn">0${n + 1}</span><h3>${t}</h3><p>${p}</p></article>`).join('')}</div></div></section>
<section><div class="wrap"><div class="grid g2">
<article class="card rv"><h3>Pages I would build</h3><ul class="ticks">${I.pages.map((p) => `<li>${p}</li>`).join('')}</ul></article>
<article class="card rv"><h3>Useful features</h3><ul class="ticks">${I.feats.map((p) => `<li>${p}</li>`).join('')}</ul></article>
</div></div></section>
<section class="alt"><div class="wrap" style="max-width:820px"><span class="eyebrow">Search visibility</span><h2>Getting <span class="hl">found</span></h2><p>${I.seo}</p></div></section>
<section><div class="wrap"><div class="card note-c rv"><div><span class="eyebrow">Pricing</span><h2 style="font-size:1.6rem">${plan ? `Most ${I.short.toLowerCase()} sites fit the ${plan.name} package` : 'Quoted individually'}</h2><p>${plan ? `${plan.name} starts at ${inr(plan.price)} and covers up to ${plan.pages} pages. ${PRICE_NOTE}` : 'Online stores depend on catalogue size, payments, shipping and integrations, so I send a written quote after a short discussion.'}</p></div><div class="row">${waA(plan ? planMsg(plan) : 'Hi Tushar! I need a quote for an online store.', plan ? `Enquire about ${plan.name}` : 'Ask for a custom quote', { loc: 'industry-pricing' })}<a class="btn btn-ghost" href="/services/#pricing">All packages</a></div></div></div></section>
<section class="alt"><div class="wrap" style="max-width:820px"><span class="eyebrow">FAQ</span><h2>${I.short} website <span class="hl">questions</span></h2>${faqHtml(I.faqs)}</div></section>
<section><div class="wrap"><p class="hint">Also see: ${IND.filter((x) => x !== I).map((x) => `<a href="/${x.slug}/" class="hl">${x.short}</a>`).join(' · ')}</p></div></section>
${cta()}`,
  };
}

// ---------------- PORTFOLIO ----------------
pages['/portfolio/'] = {
  title: 'Portfolio: Live Websites & Concept Projects | Studio by Tushar',
  desc: 'See live websites built by Tushar, plus concept projects and sample sites in progress. Client work is shown only with permission.',
  schema: [org, crumbs([['Home', '/'], ['Portfolio', '/portfolio/']])],
  body: `
${pageHero([['Portfolio']], 'Portfolio', 'Honest work, <span class="hl">clearly labelled</span>', 'Two websites I have built are live below. Client projects will be added only with permission, and full sample websites for each industry are in progress.')}
<section style="padding-top:1rem"><div class="wrap">
<span class="eyebrow">Live websites</span><h2>Websites I've <span class="hl">built</span></h2>
${liveGrid('portfolio')}
<div class="card note-c rv" style="margin-top:3rem"><div><span class="eyebrow">Client projects</span><h2 style="font-size:1.6rem">Coming soon</h2><p>Client work will be added here with the owner's permission, with real links. I will never show made-up clients, reviews or results.</p></div>${waA(Q, 'Become the first case study', { loc: 'portfolio' })}</div>
<span class="eyebrow" style="margin-top:3rem">Portfolio websites</span><h2>Full sample websites, <span class="hl">in progress</span></h2>
<p class="lead">I'm building a complete, deployed sample website for each industry below. Each will be linked here as soon as it is live. Until then you can try the concept demos.</p>
<div class="grid g3 rail" aria-label="Portfolio websites">${PORTFOLIO.map((p) => pfCard(p, 'portfolio')).join('')}</div>
<span class="eyebrow" style="margin-top:3.5rem">Concept demos</span><h2>Interactive <span class="hl">concept previews</span></h2>
<div class="grid g3 rail" aria-label="Concept demos">${DEMOS.map((d) => demoCard(d, 'portfolio')).join('')}</div>
</div></section>
${cta()}`,
};

// ---------------- ABOUT ----------------
pages['/about/'] = {
  title: `About Tushar Dhankhar | ${SITE.name}`,
  desc: 'Hi, I\'m Tushar. I design and build mobile-friendly websites for small businesses across India, and you work with me directly from first message to launch.',
  schema: [org, { '@context': 'https://schema.org', '@type': 'Person', name: 'Tushar Dhankhar', url: SITE.url + '/about/', jobTitle: 'Web designer and developer', worksFor: { '@id': SITE.url + '/#org' } }, crumbs([['Home', '/'], ['About', '/about/']])],
  body: `
<section class="page-hero hero"><div class="wrap" style="grid-template-columns:1.2fr .8fr">
<div>${crumbHtml(['About'])}<span class="eyebrow">About me</span><h1>Hi, I'm Tushar. I help small businesses <span class="hl">look as good as they are.</span></h1><p class="lead">I design and build websites for small businesses across India, working remotely. You'll deal with me directly, from the first WhatsApp message to launch day and beyond.</p>
<div class="row">${waA(Q, 'Message me on WhatsApp →', { loc: 'about' })}<a class="btn btn-ghost" href="/demos/">See concept demos</a></div></div>
<div class="portrait" role="img" aria-label="Tushar Dhankhar"><span>T</span><small>Tushar Dhankhar<br>Founder, ${SITE.name}</small></div>
</div></section>

<section style="padding-top:1rem"><div class="wrap" style="display:grid;grid-template-columns:1fr 1fr;gap:3rem;align-items:start" id="story">
<div class="rv"><span class="eyebrow">Why I do this</span><h2>Good businesses deserve <span class="hl">a good first impression</span></h2></div>
<div class="rv"><p>Many small businesses in India are excellent at what they do but hard to find online. Their website is slow, dated or missing, and customers who search on their phones end up elsewhere.</p><p>I started ${SITE.name} to offer professional design, sensible SEO foundations and WhatsApp-first enquiries at prices a small business can justify.</p><p>I keep the studio small on purpose, so you talk to the person actually building your site. I work remotely with clients across India.</p></div>
</div></section>
<style>@media(max-width:860px){#story{grid-template-columns:1fr!important;gap:1rem!important}.page-hero .wrap{grid-template-columns:1fr!important}}</style>

<section class="alt"><div class="wrap"><span class="eyebrow">How I work</span><h2>Four things you can <span class="hl">count on</span></h2><div class="grid g4">
<div class="card rv"><div class="ico"></div><h3>Straight talk</h3><p>Plain language, written quotes in rupees and no surprise invoices.</p></div>
<div class="card rv"><div class="ico"></div><h3>You approve first</h3><p>You review the design and give feedback before the final build.</p></div>
<div class="card rv"><div class="ico"></div><h3>Built to be found</h3><p>Speed, structure and on-page SEO are part of every build, not an upsell.</p></div>
<div class="card rv"><div class="ico"></div><h3>Yours to keep</h3><p>Once paid in full, you own the design and code. The domain is in your name.</p></div>
</div></div></section>
<section><div class="wrap"><div class="card note-c rv"><div><span class="eyebrow">Next step</span><h2 style="font-size:1.6rem">See how a project runs</h2><p>Milestones, communication, ownership and support are all laid out in the process page.</p></div><a class="btn btn-ghost" href="/process/">View the process</a></div></div></section>
${cta('Let\'s talk about your business', 'Tell me what you do and who your customers are. I\'ll reply personally with ideas and a free quote.')}`,
};

// ---------------- CONTACT ----------------
pages['/contact/'] = {
  title: 'Contact | Get a Free Website Quote in India | Studio by Tushar',
  desc: 'Get a free website quote. Message Tushar on WhatsApp, call, or send an enquiry. A remote-friendly studio serving small businesses across India.',
  schema: [org, crumbs([['Home', '/'], ['Contact', '/contact/']]), { '@context': 'https://schema.org', '@type': 'ContactPage', url: SITE.url + '/contact/', name: 'Contact ' + SITE.name }],
  body: `
${pageHero([['Contact']], 'Contact', 'Let\'s plan your <span class="hl">website</span>', 'Share a few details and your enquiry opens in WhatsApp, ready to send. I\'ll reply with a free, no-obligation quote.')}
<section style="padding-top:1rem"><div class="wrap" style="display:grid;grid-template-columns:1.2fr .8fr;gap:2.5rem;align-items:start" id="contact-grid">
<form class="lead-form card" id="lead-form">
<label>Your name<input name="name" required autocomplete="name"></label>
<label>Business name<input name="business" required autocomplete="organization"></label>
<label>Mobile / WhatsApp number<input name="phone" type="tel" required autocomplete="tel" inputmode="tel" pattern="[0-9+ ]{10,15}" title="Enter a phone number, e.g. 98765 43210"></label>
<label>What do you need?<select name="type"><option>New business website</option><option>Website redesign</option><option>Online store (custom quote)</option><option>Not sure, need advice</option></select></label>
<label>Package you're considering<select name="package"><option>Starter (from ${inr(5000)})</option><option selected>Business (from ${inr(12000)})</option><option>Premium (from ${inr(25000)})</option><option>Custom / not sure</option></select></label>
<label>Anything else? (optional)<textarea name="message"></textarea></label>
<input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
<button class="btn btn-primary" type="submit">Send enquiry on WhatsApp →</button>
<p class="form-note" id="form-status" role="status">Your details open in a pre-filled WhatsApp message. You still need to press send there.</p>
</form>
<aside style="display:grid;gap:1rem">
<a class="card" style="text-decoration:none" href="${WA_HELLO}" target="_blank" rel="noopener noreferrer" data-track="whatsapp_click" data-loc="contact-card"><div class="ico"></div><h3>WhatsApp (fastest)</h3><p class="hl">${SITE.phone}</p></a>
<a class="card" style="text-decoration:none" href="tel:${SITE.tel}" data-track="phone_click" data-loc="contact-card"><div class="ico"></div><h3>Call</h3><p>${SITE.phone}</p></a>
<div class="card"><div class="ico"></div><h3>Remote-friendly studio</h3><p>I work with small businesses across India by WhatsApp, phone and video call.</p></div>
</aside></div></section>
<style>@media(max-width:860px){#contact-grid{grid-template-columns:1fr!important}}</style>`,
};

// ---------------- PRIVACY ----------------
pages['/privacy/'] = {
  title: 'Privacy | Studio by Tushar',
  desc: 'How Studio by Tushar handles enquiries, WhatsApp messages and website analytics.',
  schema: [crumbs([['Home', '/'], ['Privacy', '/privacy/']])],
  body: `
${pageHero([['Privacy']], 'Privacy', 'How this site handles <span class="hl">your data</span>', 'A short, plain-language summary.')}
<section style="padding-top:1rem"><div class="wrap" style="max-width:760px">
<h2 style="font-size:1.4rem">Enquiries</h2><p>The contact form does not store your details on this site. It prepares a message that opens in WhatsApp, and nothing is sent until you press send there. Messages you send are handled through WhatsApp under its own terms and privacy policy.</p>
<h2 style="font-size:1.4rem;margin-top:2rem">Analytics</h2><p>This site may use Google Analytics to understand which pages and buttons are used, such as clicks on WhatsApp links. Analytics measures clicks and page views. It does not tell me who you are. Click events are not treated as confirmed enquiries.</p>
<h2 style="font-size:1.4rem;margin-top:2rem">Fonts</h2><p>Fonts are loaded from Google Fonts, which may receive your IP address when they load.</p>
<h2 style="font-size:1.4rem;margin-top:2rem">Questions</h2><p>To ask about your data, message ${SITE.phone} on WhatsApp.</p>
</div></section>`,
};

// ---------------- 404 ----------------
pages['/404.html'] = {
  title: 'Page not found | Studio by Tushar', desc: 'The page you were looking for could not be found.', noindex: true, schema: [],
  body: `<section class="hero"><div class="wrap" style="grid-template-columns:1fr;text-align:center"><div><span class="eyebrow" style="justify-content:center">404</span><h1>This page <span class="hl">moved or doesn't exist.</span></h1><p class="lead" style="margin-inline:auto">Let's get you back on track.</p><div class="row" style="justify-content:center"><a class="btn btn-primary" href="/">Go home</a><a class="btn btn-ghost" href="/services/">Pricing</a><a class="btn btn-ghost" href="/demos/">Demos</a></div></div></div></section>`,
};

// ---------------- Write output ----------------
const strip = (t) => t.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, (c) => ('★✓'.includes(c) ? c : '')).replace(/ {2,}/g, ' ');
rmSync('dist', { recursive: true, force: true });
mkdirSync('dist', { recursive: true });
cpSync('assets', 'dist/assets', { recursive: true });
writeFileSync('dist/assets/demos.js', strip(readFileSync('assets/demos.js', 'utf8')));
for (const [path, p] of Object.entries(pages)) {
  let html = strip(head({ ...p, path }) + p.body + foot());
  if (p.noindex) html = html.replace('content="index,follow,max-image-preview:large"', 'content="noindex"').replace(/<link rel="canonical"[^>]*>\n/, '');
  const out = path === '/404.html' ? 'dist/404.html' : `dist${path}index.html`;
  mkdirSync(out.replace(/\/[^/]+$/, ''), { recursive: true });
  writeFileSync(out, html);
}
const urls = Object.keys(pages).filter((p) => p !== '/404.html');
const prio = (u) => (u === '/' ? '1.0' : ['/services/', '/demos/'].includes(u) ? '0.9' : '0.7');
writeFileSync('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `<url><loc>${SITE.url}${u}</loc><lastmod>${today}</lastmod><priority>${prio(u)}</priority></url>`).join('\n')}\n</urlset>\n`);
writeFileSync('dist/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE.url}/sitemap.xml\n`);
console.log('Built', urls.length, 'pages →', 'dist/');
