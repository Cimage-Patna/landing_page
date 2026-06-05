// Reel media is served from S3 (CDN-friendly, keeps heavy video off the app host).
const REELS = "https://cimage-web.s3.ap-south-1.amazonaws.com/public/reels";

export const copy = {
  hero: {
    display: "Mummy, job lag gaya — CIMAGE BCA Admissions 2026",
    headline: "Mummy, job lag gaya, yeh moment yahin se start hota hai",
    // Two-tone rendering: the middle clause sits in the accent colour.
    headlineParts: [
      { text: "Mummy, ", accent: false },
      { text: "job lag gaya, yeh moment ", accent: true },
      { text: "yahin se start hota hai", accent: false },
    ],
    sub: "Industry-focused programs designed to build real careers — not just degrees.",
    cta: "Apply Now",
    counsellorCta: "Talk to Counsellor",
    phone: "7250767676",
  },
  numbers: {
    eyebrow: "The numbers do the talking.",
    sub: "Seventeen-plus years. One pattern.",
    closing: "Consistently high placement rate, batch after batch.",
    items: [
      { value: "13,500+", label: "alumni placed across 17+ years" },
      { value: "₹37 LPA", label: "highest package · BCA" },
      { value: "₹4.5 LPA", label: "average package" },
      { value: "317", label: "selections in TCS, single drive" },
      { value: "130+", label: "ICICI Bank PO offers · ₹4.5 LPA each" },
      { value: "200+", label: "recruiting companies" },
      { value: "50%+", label: "of Bihar's IT placements" },
      { value: "17+", label: "years of placement track record" },
    ],
  },
  recruiters: {
    eyebrow: "Where they get hired.",
    items: [
      // logo = full colour (shown in light theme); logoWhite = monochrome
      // white (shown in dark theme). Swapped via [data-theme] in globals.css.
      { name: "Wipro", logo: "/recruiter-logos/frame-19.webp", logoWhite: "/recruiter-logos/frame-19_w.webp" },
      { name: "HCL", logo: "/recruiter-logos/frame-20.webp", logoWhite: "/recruiter-logos/frame-20_w.webp" },
      { name: "Accenture", logo: "/recruiter-logos/frame-21.webp", logoWhite: "/recruiter-logos/frame-21_w.webp" },
      { name: "Deloitte", logo: "/recruiter-logos/frame-22.webp", logoWhite: "/recruiter-logos/frame-22_w.webp" },
      { name: "Cognizant", logo: "/recruiter-logos/frame-23.webp", logoWhite: "/recruiter-logos/frame-23_w.webp" },
      { name: "Amdocs", logo: "/recruiter-logos/frame-24.webp", logoWhite: "/recruiter-logos/frame-24_w.webp" },
    ],
    extras: ["TCS", "ICICI Bank", "IBM", "Rackspace", "J.P. Morgan", "Ernst & Young", "HSBC", "HDFC", "Coca-Cola"],
  },
  reasons: {
    eyebrow: "Behtar aur Better.",
    display: "Six reasons it works.",
    sub: "Why CIMAGE has been the first IT/Management pick in Bihar for 17+ years.",
    items: [
      {
        title: "Industry-Aligned BCA Curriculum",
        body: "Java, Python, DBMS, Web Dev, Cloud — updated each year against what the IT market is actually testing for.",
        glyph: "01",
        image: "/sumedh.webp",
      },
      {
        title: "IIT Bombay E-Yantra Lab",
        body: "The only BCA college in Bihar with an IIT Bombay-certified robotics & AI lab on campus.",
        glyph: "02",
        image: "/eyantra.jpeg",
      },
      {
        title: "Wipro Centre of Excellence",
        body: "An active MOU with Wipro Ltd. for student training and domain learning. Wipro-signed certification before you graduate.",
        glyph: "03",
        image: "/wipro.webp",
      },
      {
        title: "Dedicated Placement Cell",
        body: "Structured training from year one — aptitude, mock interviews, GD prep, soft skills. The interview is round four, not round one.",
        glyph: "04",
        image: "/placement.webp",
      },
      {
        title: "Only Google for Education Partner in Bihar",
        body: "CIMAGE is the only Google for Education partner in the state — Google's certified tools and Workspace built into everyday teaching, so you train on the same platforms the industry actually runs on.",
        glyph: "05",
        image: "/google-cloud.png",
        imageContain: true,
      },
      {
        title: "Language Lab Support",
        body: "Hindi-medium students get a year of dedicated English-communication training. By placement season, the language gap is closed.",
        glyph: "06",
        image: "/lab.jpeg",
      },
    ],
    closing: "From day one, you're groomed for the offer round — not just the exam round.",
  },
  visitors: {
    eyebrow: "Who's walked through these gates.",
    sub: "Past campus guests, in their own words on the stage.",
    // photo: self-hosted in /public/visitors (sourced from Wikimedia Commons).
    // credit: required attribution — keep it; the licenses (GODL-India, CC-BY,
    // CC-BY-SA, free "Attribution") all mandate crediting the source.
    items: [
      { name: "Dr. A.P.J. Abdul Kalam", role: "Former President of India", photo: "/visitors/abdul-kalam.jpg", credit: "Govt. of India · GODL-India" },
      { name: "Shri Nitish Kumar", role: "Ex-Chief Minister of Bihar", photo: "/visitors/nitish-kumar.jpg", credit: "Govt. of Bihar" },
      { name: "Shri Rajendra Arlekar", role: "Hon. Governor of Bihar", photo: "/visitors/rajendra-arlekar.jpg", credit: "PMO, Govt. of India · GODL-India" },
      { name: "Shri Ramesh Pokhriyal", role: "Former HRD Minister, Govt. of India", photo: "/visitors/ramesh-pokhriyal.jpg", credit: "Ministry of Education · GODL-India" },
      { name: "Shri Ashok Choudhary", role: "Minister, Govt. of Bihar", photo: "/visitors/ashok-choudhary.jpg", credit: "Govt. of Bihar" },
      { name: "Dr. Sanjay Paswan", role: "Former Union Minister", photo: "/visitors/sanjay-paswan.jpg", credit: "Govt. of India · GODL-India" },
      { name: "Shri Shekhar Sen", role: "Theatre Artist", photo: "/visitors/shekhar-sen.jpg", credit: "Niteshukla / Wikimedia · CC BY-SA 4.0" },
      { name: "Sudesh Lehri", role: "Comedian & Actor", photo: "/visitors/sudesh-lehri.jpg", credit: "Bollywood Hungama · CC BY 3.0" },
      { name: "Shri Padamjit Sahrawat", role: "Author & Commentator" },
      { name: "Vice-Chancellor", role: "Patliputra University" },
    ],
  },
  stack: {
    display: "What you'll actually build.",
    sub: "A curriculum tuned to what hiring managers are testing for — not what textbooks last reprinted.",
    pillars: [
      { name: "Java", hint: "OOP · DSA · Spring", logo: "/tech/java.svg" },
      { name: "Python", hint: "Scripting · Data · ML basics", logo: "/tech/python.svg" },
      { name: "DBMS", hint: "SQL · Modeling · Optimization", logo: "/tech/mysql.svg" },
      { name: "Cloud", hint: "AWS · Azure fundamentals", logo: "/tech/cloud.svg" },
      { name: "Web", hint: "HTML · React · APIs", logo: "/tech/react.svg" },
      { name: "AI & Robotics", hint: "E-Yantra · CV · NLP", logo: "/tech/ai.svg" },
    ],
    closing: "Sab kuch hands-on. First semester se.",
  },
  labs: {
    display: "Wipro and IIT Bombay, on campus.",
    sub: "We've signed an MoU with Wipro for the Centre of Excellence, and we're IIT Bombay's Spoken Tutorial Nodal Resource Centre for Patna. Both agreements are below.",
    blocks: [
      {
        title: "E-Yantra · IIT Bombay",
        body: "Robotics teams. Real competition tracks. Certified by an IIT.",
        image: "/collab/Left-Image.webp",
        badge: "IIT Bombay · E-Yantra Certified",
      },
      {
        title: "Wipro Centre of Excellence",
        body: "Industry-graded coursework, signed off by a Wipro panel. The certification sits on your CV before you graduate.",
        image: "/collab/Right-Image.webp",
        badge: "Wipro CoE · Active Partnership",
      },
    ],
  },
  alumni: {
    display: "Where the alumni went.",
    sub: "Patna, Bengaluru, Dubai, London, Zurich. Here are a few of them.",
    closing: "",
    cards: [
      { img: "/alumni-cards/a1.webp", company: "Ernst & Young" },
      { img: "/alumni-cards/a2.webp", company: "Plant Ground Engineering Services" },
      { img: "/alumni-cards/a3.webp", company: "Wipro" },
      { img: "/alumni-cards/a4.webp", company: "J.P. Morgan" },
      { img: "/alumni-cards/a5.webp", company: "Rackspace" },
      { img: "/alumni-cards/a6.webp", company: "Rackspace" },
      { img: "/alumni-cards/a7.webp", company: "TCS" },
      { img: "/alumni-cards/a8.webp", company: "HCL Tech" },
    ],
    pins: [
      { city: "California", country: "USA", companies: ["TK Company"], x: 13, y: 37 },
      { city: "Boston", country: "USA", companies: ["TK Company"], x: 26, y: 34 },
      { city: "London", country: "UK", companies: ["J.P. Morgan", "Rackspace"], x: 47, y: 28 },
      { city: "Zurich", country: "Switzerland", companies: ["Wipro", "TCS"], x: 50, y: 31 },
      { city: "Dubai", country: "UAE", companies: ["Ernst & Young", "Plant Ground Engineering"], x: 59, y: 42 },
    ],
    patna: { x: 69, y: 41 },
  },
  campus: {
    display: "Not just the classroom.",
    sub: "There's National Technology Day, the Ojas Sports Meet, Robo Race, and the Holi Mela that takes over the entire campus.",
    body: "An annual cultural fest the city shows up for. An innovation summit where startups pitch before they have an office. An inter-college sports tournament. A robo race that takes over the atrium. A Holi Mela that takes over campus. A one-day start-up challenge — and sometimes, a real start-up afterwards.",
    events: [
      { name: "National Technology Day", image: "/event/ntd.jpeg", desc: "A campus-wide celebration of innovation, student projects, and tech demos." },
      { name: "Ojas Sports Meet", image: "/event/ojas.jpeg", desc: "An inter-college sports tournament that runs through the year." },
      { name: "Robo Race", image: "/event/robo.jpeg", desc: "A robotics race that takes over the campus atrium." },
      { name: "Industry Oriented Workshop", image: "/event/drone.jpeg", desc: "Hands-on workshops on AI, drones, and emerging tech led by industry experts." },
      { name: "Holi Mela", image: "/event/holi.jpeg", desc: "A Holi celebration that takes over the entire campus." },
      { name: "Cultural Fest", image: "/event/kathak.jpeg", desc: "Music, dance, and performances on the main stage." },
    ],
  },
  trust: {
    display: "What the alumni say.",
    sub: "Five graduates, in their own words.",
    visitorLine: "Past campus visitors include Dr. A.P.J. Abdul Kalam, Shri Nitish Kumar, and the Governor of Bihar.",
    badges: ["AICTE", "NAAC B++", "NIRF", "ISO 9001:2015"],
    testimonials: [
      {
        photo: "/testimonials/t-0.webp",
        meta: "BCA · placed in Dubai",
        quote:
          "Three years of being pushed harder than I thought I could be — and one day I was in Dubai for the offer.",
      },
      {
        photo: "/testimonials/t-3.webp",
        meta: "BCA · placed in the UK",
        quote:
          "First semester se hi projects — Java, DBMS, web. I had a working portfolio before I had a CV.",
      },
      {
        photo: "/testimonials/t-5.webp",
        meta: "BCA · placed in London",
        quote:
          "By the time TCS came to campus, I'd already given mock interviews to seniors who'd been placed there the year before. The real one felt like the fourth round, not the first.",
      },
      {
        photo: "/testimonials/t-2.webp",
        meta: "BCA · Batch 2024",
        quote:
          "Seeing top companies like TCS and Wipro recruiting on campus was a reality, not a brochure line.",
      },
      {
        photo: "/testimonials/t-1.webp",
        meta: "BCA · placed at a Big Four",
        quote:
          "Faculty here aren't lecturing from a textbook — they're former engineers who actually shipped things. That changes how you study.",
      },
    ],
  },
  awards: {
    display: "Recognized where it counts.",
    items: [
      { name: "AICTE Approved", logo: "/badges/aicte.webp" },
      { name: "NAAC B++", logo: "/badges/naac.webp" },
      { name: "ISO 9001:2015", logo: "/badges/iso.svg" },
      { name: "Atal Shresth Sansthan Samman · Govt. of India", logo: "/badges/emblem-india.png" },
      { name: "Shining Stars of Bihar · Hon. Governor", logo: "/badges/affiliation.webp" },
    ],
  },
  about: {
    title: "Bihar's largest IT & Management college,",
    titleAccent: "built for placements.",
    body: "17+ years. 13,500+ alumni placed. The only college with an IIT Bombay E-Yantra Lab and a Wipro Centre of Excellence — where students from across Bihar are trained, certified, and placed at TCS, ICICI Bank, and beyond.",
    cta: "Apply Now",
  },
  apply: {
    display: "Your move.",
    sub: "Batch 2026 fills fast.",
    cta: "Send me a call from admissions",
    successMsg: "Got it. We'll call you within one working day.",
    errorMsg: "Something went wrong. Please call 7250 767 676 or try again.",
    trustLine: "No spam. Counsellor calls within one working day. CIMAGE Tower, Patliputra Industrial Area · 7250 767 676.",
    // Lead-form section
    infoEyebrow: "Admissions Open 2026–27",
    infoTitle: "Bihar's #1 College",
    infoDesc: "For over 17 years, CIMAGE has been the first pick in Bihar. More than 13,500 of our alumni now work at TCS, Wipro, ICICI and beyond, and ours is still the only campus in the state with an IIT Bombay E-Yantra robotics lab.",
    infoPoints: [
      "317 students walked out with TCS offers in a single placement drive.",
      "Highest package so far is ₹37 LPA, with the batch averaging around ₹4.5 LPA.",
      "On campus you get both an IIT Bombay E-Yantra lab and a Wipro Centre of Excellence.",
      "AICTE approved and NAAC accredited.",
    ],
    formHeading: "Request a call - Batch 2026",
    formSub: "Drop your details and a counsellor calls you within one working day.",
    courses: ["BCA", "B.Tech", "MCA", "B.Sc-IT", "MBA", "BBA", "B.Com.(P)"],
  },
  whyChoose: {
    title: "Why Choose ",
    titleAccent: "CIMAGE?",
    items: [
      { icon: "rank", title: "Top-Ranked Institute", body: "Recognized among the leading colleges for IT & Management education." },
      { icon: "lab", title: "Advanced IT Labs", body: "Hands-on learning with updated systems and a practical training environment." },
      { icon: "link", title: "Industry Linked", body: "Programs aligned with industry requirements, including IIT-linked training." },
      { icon: "briefcase", title: "Placement-Focused", body: "Training designed to prepare students for real job roles with industry exposure." },
      { icon: "laptop", title: "Digital Learning", body: "Access to online resources, recorded sessions, and hybrid learning options." },
      { icon: "briefcase", title: "Academic Ecosystem", body: "From classrooms to digital platforms, learning stays consistent everywhere." },
    ],
  },
  programs: {
    title: "Our Programs",
    sub: "Choose the right course across IT, Management, and Commerce — with practical learning and career-focused training.",
    groups: [
      {
        label: "Undergraduate",
        items: [
          { name: "BCA", desc: "Includes add-on courses aligned with industry needs, preparing students for IT roles.", href: "https://cimage.in/courses/bca/", img: "/programs/bca.webp" },
          { name: "BBA", desc: "Designed to develop skills required for business and corporate roles with placement support.", href: "https://cimage.in/courses/bba/", img: "https://cimage.in/wp-content/uploads/2025/07/bba-1024x955.jpg" },
          { name: "B.Sc. (IT)", desc: "Focused on Information Technology, preparing students for careers in the IT industry.", href: "https://cimage.in/courses/bsc/", img: "https://cimage.in/wp-content/uploads/2025/07/bsc-it-1024x955.jpg" },
          { name: "B.Com (P)", desc: "Covers accounting, economics, business law, and taxation with a strong academic foundation.", href: "https://cimage.in/courses/b-comp/", img: "https://cimage.in/wp-content/uploads/2025/07/bcom-1-1024x955.jpg" },
        ],
      },
      {
        label: "Postgraduate",
        items: [
          { name: "MCA", desc: "Advanced program focused on software development and deep technical expertise.", href: "https://cimage.in/courses/mca/", img: "https://cimage.in/wp-content/uploads/2025/07/pgdm-1024x955.jpg" },
          { name: "MBA", desc: "Covers key areas of business administration and management with practical scenario learning.", href: "https://cimage.in/courses/mba/", img: "https://cimage.in/wp-content/uploads/2025/07/pgdm-1024x955.jpg" },
        ],
      },
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    sub: "Sab kuch jo aap admission se pehle jaanna chahte hain.",
    items: [
      { q: "Kya CIMAGE mein admission ke liye entrance exam zaroori hai?", a: "Haan, CIMAGE mein admission ke liye Entrance Exam dena zaruri hai. Iske baad Personal Interview bhi conduct kiya jata hai." },
      { q: "Kya yahan placement support milta hai?", a: "Haan, dedicated placement training milti hai — resume, interviews, aptitude sab cover hota hai." },
      { q: "Kya Hindi medium students yahan adjust kar paate hain?", a: "Bilkul. Teaching aur support system aisa hai ki students gradually comfortable ho jaate hain." },
      { q: "CIMAGE mein kaun-kaun se courses available hain?", a: "IT, Management aur Commerce ke multiple undergraduate aur postgraduate programs available hain." },
      { q: "Kya internships ka support milta hai?", a: "Haan, students ko internships aur practical exposure ke opportunities milte hain during the course." },
      { q: "Kya degree government recognized hai?", a: "Haan, courses recognized universities se affiliated hote hain." },
      { q: "Kya hostel facility available hai?", a: "Hostel aur accommodation support available hai (details counselling mein mil jaayengi)." },
      { q: "Kaunse companies placement ke liye aati hain?", a: "IT, banking aur corporate sector ki multiple companies campus hiring ke liye aati hain." },
    ],
  },
  join: {
    title: "Where Innovation Meets Opportunity",
    sub: "Your Journey Starts at CIMAGE",
    cta: "Join Us",
  },
  reels: {
    title: "Life at CIMAGE, in reels",
    sub: "Tap a story — placements, campus moments, and student journeys.",
    // Real vertical reels — compressed (H.264, faststart) with a poster frame
    // generated from each clip so the story bar loads instantly.
    items: [
      { name: "Campus Moments", cover: `${REELS}/reel-1.jpg`, video: `${REELS}/reel-1.mp4` },
      { name: "Campus Tour", cover: `${REELS}/reel-6.jpg`, video: `${REELS}/reel-6.mp4` },
      { name: "Student Diaries", cover: `${REELS}/reel-3.jpg`, video: `${REELS}/reel-3.mp4` },
      { name: "On Campus", cover: `${REELS}/reel-4.jpg`, video: `${REELS}/reel-4.mp4` },
      { name: "A Day at CIMAGE", cover: `${REELS}/reel-9.jpg`, video: `${REELS}/reel-9.mp4` },
      { name: "Behind the Scenes", cover: `${REELS}/reel-5.jpg`, video: `${REELS}/reel-5.mp4` },
      { name: "Student Voices", cover: `${REELS}/reel-7.jpg`, video: `${REELS}/reel-7.mp4` },
      { name: "Fest Highlights", cover: `${REELS}/reel-8.jpg`, video: `${REELS}/reel-8.mp4` },
      { name: "Life at CIMAGE", cover: `${REELS}/reel-2.jpg`, video: `${REELS}/reel-2.mp4` },
    ],
  },
  footer: {
    brand: "CIMAGE",
    tagline: "Behtar aur Better.",
    blurb: "Bihar's #1 college and Patna's premier institution for industry-ready IT and business education since 2003.",
    address: ["CIMAGE Tower, C, 10-11", "Off Atal Path, Patliputra Industrial Area", "Patna, Bihar 800013"],
    phones: ["7250 767 676", "9835 024 444"],
    email: "info@cimage.in",
    hours: "Mon — Sat · 9:00 AM to 6:00 PM",
    mapsUrl: "https://maps.google.com/?q=CIMAGE+Tower+Patliputra+Industrial+Area+Patna",
    socials: [
      { name: "Facebook", url: "https://facebook.com/cimage" },
      { name: "Instagram", url: "https://instagram.com/cimage_official" },
      { name: "Twitter", url: "https://twitter.com/cimage" },
      { name: "YouTube", url: "https://youtube.com/@cimage" },
      { name: "LinkedIn", url: "https://linkedin.com/school/cimage" },
    ],
    programs: [
      { name: "BCA", full: "Bachelor of Computer Applications", href: "#apply" },
      { name: "MCA", full: "Master of Computer Applications", href: "https://admissions.cimagepatna.com/mca-admission-open/" },
      { name: "B.Sc-IT", full: "Information Technology", href: "#apply" },
      { name: "MBA", full: "Master of Business Administration", href: "#apply" },
      { name: "BBA", full: "Bachelor of Business Administration", href: "#apply" },
      { name: "B.Com (P)", full: "Bachelor of Commerce", href: "#apply" },
    ],
    quickLinks: [
      { name: "Apply Now", href: "#apply" },
      { name: "Placements", href: "#" },
      { name: "Campus Life", href: "#" },
      { name: "Labs & Workshops", href: "#" },
      { name: "Accreditations", href: "#" },
      { name: "Visit Campus", href: "https://maps.google.com/?q=CIMAGE+Tower+Patna" },
    ],
    accreditations: ["AICTE Approved", "NAAC B++", "NIRF Ranked", "AKU Affiliated", "PPU Affiliated", "ISO 9001:2015"],
    copyright: "VIJAYAM Educational Trust",
    developer: "Built with care for Batch 2026.",
  },
};
