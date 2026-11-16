import { JourneyStage, ServiceItem, Project, Testimonial, BlogPost } from '../types';

export const JOURNEY_STAGES: JourneyStage[] = [
  {
    id: 0,
    number: "01",
    title: "The Idea",
    subtitle: "From initial concept to dining blueprint",
    tagline: "Every restaurant starts as a sketch on paper.",
    cykServices: ["Conceptualization", "Recipe Development"],
    description: "We help define your restaurant's core proposition, dining format, cuisine direction, and flavor architecture before a single rupee is spent on construction.",
    proofProject: {
      name: "Ndori Strabe",
      type: "European-themed Cafe",
      caption: "Conceptualization and interior design for an authentic European bistro concept in Gurugram.",
      image: "https://www.conceptyourkitchen.com/wp-content/uploads/2023/07/Conceptualization-image.jpg"
    },
    clientQuote: {
      text: "Cyk's conceptualization services transformed Ndori Strabe into a captivating European-themed cafe. Their outstanding interior design and delectable food creations perfectly captured our vision, creating an enchanting experience for our customers",
      author: "Mr. Prateek Nagar",
      brand: "Ndori Strabe"
    },
    stampIcon: "Lightbulb",
    deliverables: [
      "Concept Proposition & Brand Persona",
      "Dining Format Definition (Dine-in, QSR, Cafe, Kiosk)",
      "Initial Culinary Direction & Menu Framework"
    ],
    source: "PRD Section 5 & live site /conceptualization/"
  },
  {
    id: 1,
    number: "02",
    title: "The Numbers",
    subtitle: "Restaurant financial modeling & feasibility",
    tagline: "Crafting profit-making plans for your food business.",
    cykServices: ["Restaurant Financial Planning"],
    description: "We create custom financial projections to evaluate project viability: detailed capital expenditure schedules, operating expense estimates, and food cost targets.",
    proofProject: {
      name: "WalkN'oodles",
      type: "Pan-Asian QSR",
      caption: "Financial model and operating cost structure for a high-volume DIY healthy noodle bar.",
      image: "https://www.conceptyourkitchen.com/wp-content/uploads/2023/07/Restaurant-Financial-planning-image.jpg"
    },
    stampIcon: "Calculator",
    deliverables: [
      "Itemized Capital Expenditure (Capex) Budget",
      "Operating Expense (Opex) & Labor Cost Projections",
      "Target Food & Beverage Cost Benchmarks"
    ],
    source: "PRD Section 5 & live site /restaurant-financial-planning/"
  },
  {
    id: 2,
    number: "03",
    title: "The Place",
    subtitle: "Strategic location mapping & property leasing",
    tagline: "Finding the right location that propels your brand forward.",
    cykServices: ["Location Mapping Strategies", "Property Leasing"],
    description: "We identify high-potential catchments and negotiate commercial lease terms with leading developers across high-streets and commercial centers.",
    proofProject: {
      name: "The Fat Tiger",
      type: "Pan-Asian QSR",
      caption: "Strategic leasing and prime retail placement driving high customer footfall.",
      image: "https://www.conceptyourkitchen.com/wp-content/uploads/2025/10/Untitled-design-16.jpg"
    },
    clientQuote: {
      text: "CYK's leasing consultants provided us with perfect locations that perfectly complement our vision and drive and grow our business forward. Highly recommended!",
      author: "Mr. Saurabh Vij",
      brand: "The Fat Tiger"
    },
    stampIcon: "MapPin",
    deliverables: [
      "Micro-Market Demographic & Footfall Analysis",
      "Commercial Lease Negotiations & LOI Structuring",
      "Site MEP Feasibility & Technical Due Diligence"
    ],
    source: "PRD Section 5 & live site /location-mapping-strategies/ and /property-leasing/"
  },
  {
    id: 3,
    number: "04",
    title: "The Menu & Kitchen",
    subtitle: "Culinary engineering & commercial kitchen setup",
    tagline: "Ergonomic kitchen design paired with tested recipes.",
    cykServices: ["Menu Planning & Engineering", "Kitchen Setup & Equipment"],
    description: "From recipe standardization and ingredient yield to commercial kitchen equipment planning and MEP layout design that optimizes staff workflows.",
    proofProject: {
      name: "Momo Mami & Nagari",
      type: "Backend Operations",
      caption: "Kitchen layout planning and central commissary workflow optimization.",
      image: "https://www.conceptyourkitchen.com/wp-content/uploads/2023/07/Kitchen-planning-image.jpg"
    },
    stampIcon: "Utensils",
    deliverables: [
      "Standardized Recipe Formulation Cards",
      "Commercial Kitchen MEP & Equipment Drawings",
      "Ingredient Costing & Menu Item Classification"
    ],
    source: "PRD Section 5 & live site /menu-planning-engineering/"
  },
  {
    id: 4,
    number: "05",
    title: "The Brand & Space",
    subtitle: "Atmospheric interior planning, branding & uniforms",
    tagline: "Spaces and identities that capture the essence of your dining concept.",
    cykServices: ["Branding & Designing", "Interior Planning", "Uniform Designing"],
    description: "We shape every visual and tactile customer touchpoint: interior layouts, furniture and lighting curation, logo identity, packaging, and staff uniforms.",
    proofProject: {
      name: "The Wok Bar & Hit A Pint",
      type: "Brewery & Asian Street Bar",
      caption: "Brand identity, packaging design, and interior ambiance engineering.",
      image: "https://www.conceptyourkitchen.com/wp-content/uploads/2023/07/Interior-planning-image.jpg"
    },
    clientQuote: {
      text: "The innovative vision of CYK brought our brand, The Wok Bar, to life with outstanding interior design and delectable food offerings. CYK's expertise and creativity truly elevated our establishment.",
      author: "Mr. Shivam Sharma",
      brand: "The Wok Bar"
    },
    stampIcon: "Palette",
    deliverables: [
      "Brand Identity & Logo Architecture",
      "Interior Spatial Planning & 3D Renderings",
      "Staff Uniform Specifications & Packaging Artwork"
    ],
    source: "PRD Section 5 & live site /brand-building/"
  },
  {
    id: 5,
    number: "06",
    title: "The Team",
    subtitle: "Chef hiring, culinary grooming & service training",
    tagline: "Building capable kitchen and service teams for operational consistency.",
    cykServices: ["Hiring & Trainings"],
    description: "We recruit qualified Head Chefs, sous chefs, bartenders, and service captains, conducting structured pre-launch training drills and SOP orientation.",
    proofProject: {
      name: "The Switch",
      type: "Bar & Restaurant",
      caption: "FOH & BOH team recruitment, kitchen workflow structuring, and service SOP training.",
      image: "https://www.conceptyourkitchen.com/wp-content/uploads/2023/07/Chef-hiring-image.jpg"
    },
    stampIcon: "ChefHat",
    deliverables: [
      "Executive Chef & Service Captain Recruitment",
      "Front-of-House & Back-of-House Operating SOPs",
      "Pre-Opening Kitchen Service & Plating Drills"
    ],
    source: "PRD Section 5 & live site /hiring-trainings/"
  },
  {
    id: 6,
    number: "07",
    title: "The Launch",
    subtitle: "Restaurant marketing & public relations",
    tagline: "Generating buzz and footfall from day one.",
    cykServices: ["Restaurant Marketing", "Public Relations"],
    description: "Targeted digital marketing campaigns, media relations, food writer tastings, and opening week promotional strategy to build local patronage.",
    proofProject: {
      name: "My Bar Headquarters",
      type: "Bar & Restaurant",
      caption: "Pre-launch promotion and grand opening campaign execution.",
      image: "https://www.conceptyourkitchen.com/wp-content/uploads/2023/07/Restaurant-marketing-image.jpg"
    },
    stampIcon: "Megaphone",
    deliverables: [
      "Opening Campaign & Launch Event Strategy",
      "Local Radius Social Media Marketing Setup",
      "Hospitality PR & Media Outreach"
    ],
    source: "PRD Section 5 & live site homepage services"
  },
  {
    id: 7,
    number: "08",
    title: "The Expansion",
    subtitle: "Brand expansion, franchising & multi-unit leasing",
    tagline: "Helping established food businesses reach their true position.",
    cykServices: ["Brand Expansion", "Franchise Consulting", "Property Leasing"],
    description: "When your primary location succeeds, we help create scalable franchise documentation, identify expansion real estate, and structure licensee networks.",
    proofProject: {
      name: "Twisting Scoops & House of Candy",
      type: "Retail & Parlor Expansion",
      caption: "National franchise strategy and leasing assistance across retail destinations.",
      image: "https://www.conceptyourkitchen.com/wp-content/uploads/2023/07/Brand-Expansion.jpg"
    },
    clientQuote: {
      text: "With CYK’s franchising and leasing assistance Twisting Scoops, successfully expanded its presence nationally and internationally delighting even more food enthusiasts. Highly recommended!",
      author: "Mr. Kunwar Juneja",
      brand: "Twisting Scoops"
    },
    stampIcon: "Store",
    deliverables: [
      "Franchise Model Structuring & Operational Standards",
      "Multi-Unit Site Selection & Landlord Negotiations",
      "Franchise Partner Evaluation Framework"
    ],
    source: "PRD Section 5 & live site homepage services"
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    author: "Mr. Rajeev",
    brand: "Baskin Robbins",
    stageNumber: 7,
    quote: "Thanks to CYK, we now have a stronger presence, reaching more ice cream enthusiasts than ever before. A heartfelt recommendation!",
    source: "https://www.conceptyourkitchen.com/ (What our clients say)"
  },
  {
    id: "t2",
    author: "Mr. Amarpreet Singh",
    brand: "Gianis",
    stageNumber: 2,
    quote: "With a deep understanding of the food and beverage industry, CYK understood our audience thoroughly and provided locations that propelled Giannis to new heights.",
    source: "https://www.conceptyourkitchen.com/ (What our clients say)"
  },
  {
    id: "t3",
    author: "Mr. Siddharth Chaudhary",
    brand: "Hit A Pint",
    stageNumber: 4,
    quote: "CYK brilliantly crafted the ambiance of Hit a Pint, capturing the essence of our brewery and restaurant. Their impeccable sense of interior craft and mouthwatering culinary creations have left a lasting impression on our patrons",
    source: "https://www.conceptyourkitchen.com/ (What our clients say)"
  },
  {
    id: "t4",
    author: "Mr. Bhrigu Dutt",
    brand: "Chai Garam",
    stageNumber: 2,
    quote: "CYK's exceptional guidance has enabled Chai Garam to reach new markets and establish a more substantial presence.",
    source: "https://www.conceptyourkitchen.com/ (What our clients say)"
  },
  {
    id: "t5",
    author: "Mr. Prateek Nagar",
    brand: "Ndori Strabe",
    stageNumber: 0,
    quote: "Cyk's conceptualization services transformed Ndori Strabe into a captivating European-themed cafe. Their outstanding interior design and delectable food creations perfectly captured our vision, creating an enchanting experience for our customers",
    source: "https://www.conceptyourkitchen.com/ (What our clients say)"
  },
  {
    id: "t6",
    author: "Mr. Saurabh Vij",
    brand: "The Fat Tiger",
    stageNumber: 2,
    quote: "CYK's leasing consultants provided us with perfect locations that perfectly complement our vision and drive and grow our business forward. Highly recommended!",
    source: "https://www.conceptyourkitchen.com/ (What our clients say)"
  },
  {
    id: "t7",
    author: "Mr. Vikas Shukla",
    brand: "House of Candy",
    stageNumber: 7,
    quote: "CYK's guidance for our brand expansion was crucial in securing prime locations for our candy stores, resulting in increased foot traffic and revenue.",
    source: "https://www.conceptyourkitchen.com/ (What our clients say)"
  },
  {
    id: "t8",
    author: "Mr. Mausam Desai",
    brand: "Schmitten luxury chocolates",
    stageNumber: 7,
    quote: "Our brand expansion was a resounding success CYK's expert leasing services helped our business to grab a wider customer base.",
    source: "https://www.conceptyourkitchen.com/ (What our clients say)"
  },
  {
    id: "t9",
    author: "Mr. Kunwar Juneja",
    brand: "Twisting Scoops",
    stageNumber: 7,
    quote: "With CYK’s franchising and leasing assistance Twisting Scoops, successfully expanded its presence nationally and internationally delighting even more food enthusiasts. Highly recommended!",
    source: "https://www.conceptyourkitchen.com/ (What our clients say)"
  },
  {
    id: "t10",
    author: "Mr. Shivam Sharma",
    brand: "The Wok Bar",
    stageNumber: 4,
    quote: "The innovative vision of CYK brought our brand, The Wok Bar, to life with outstanding interior design and delectable food offerings. CYK's expertise and creativity truly elevated our establishment.",
    source: "https://www.conceptyourkitchen.com/ (What our clients say)"
  },
  {
    id: "t11",
    author: "Mr. Rohan Chug",
    brand: "The Belgian Fries",
    stageNumber: 7,
    quote: "CYK's strategic guidance enabled us to deliver authentic Belgian flavors to a wider audience, resulting in increased customer satisfaction and business growth they broadened our horizons at different valuable locations.",
    source: "https://www.conceptyourkitchen.com/ (What our clients say)"
  }
];

export const FEATURED_PROJECTS: Project[] = [
  {
    id: "the-switch",
    name: "The Switch",
    category: "Bar & Restaurant",
    stageTags: ["Concept", "Location", "Backend Ops"],
    city: "ROF Portico, Sector 43, Gurgaon",
    isFlagship: true,
    brief: "The Switch, located at ROF Portico, Sector 43, Gurgaon, is a dynamic rooftop bar and restaurant offering a blend of open-air seating, cozy indoor spaces, and cabana-style privacy. By day, it operates as a relaxed café, and by night transforms into an energetic nightlife destination.",
    whatCYKDid: [
      "Conceptualization & Brand Story: Defined the AM-to-PM experience for seamless day-to-night transitions.",
      "Name Identification: Created the distinct identity, The Switch.",
      "Menu Planning & Development: Curated multicuisine offerings with unique highlights for both café and bar experiences.",
      "Hiring & Training: Built and trained FOH & BOH teams for operational excellence.",
      "Operational Excellence (FOH & BOH): Developed SOPs, conducted audits, and structured workflows.",
      "Design Guidance & Experience Building: Shaped a versatile environment transitioning from daytime relaxation to nighttime energy."
    ],
    outcome: "Delivers a well-rounded rooftop dining experience combining food, drinks, and ambiance with operational efficiency.",
    image: "https://www.conceptyourkitchen.com/wp-content/uploads/2025/10/Untitled-design-27.jpg",
    source: "https://www.conceptyourkitchen.com/our-projects/the-switch/"
  },
  {
    id: "walkn-oodles",
    name: "WalkN'oodles",
    category: "QSR",
    stageTags: ["Concept", "Menu/R&D", "Backend Ops"],
    city: "Indirapuram, Ghaziabad",
    isFlagship: true,
    brief: "Walknoodles, located in Indirapuram, Ghaziabad, is a Pan-Asian healthy noodle bar with no maida, no palm oil, and no added sugar, offering a distinctive DIY noodle bowl experience.",
    whatCYKDid: [
      "Concept Development & Brand Positioning: Created a healthy-eating concept blending wellness and personalization.",
      "Menu Planning & Engineering: Curated recipes and bowl options aligned with nutrition and taste.",
      "Operational Consultancy (FOH & BOH): Structured kitchen workflows and inventory management.",
      "Hiring & Training: Built and trained FOH & BOH teams for consistent service.",
      "SOPs & Process Implementation: Standardized operating protocols for daily operations."
    ],
    outcome: "Established as a go-to destination for personalized, wholesome, and flavorful meals in the healthy eating segment.",
    image: "https://www.conceptyourkitchen.com/wp-content/uploads/2025/10/Untitled-design-28.jpg",
    source: "https://www.conceptyourkitchen.com/our-projects/walknoodles/"
  },
  {
    id: "the-inclusive-palate",
    name: "The Inclusive P(a)late",
    category: "Bakery",
    stageTags: ["Concept", "Menu/R&D"],
    city: "Gurgaon",
    isFlagship: true,
    brief: "An intimate bakery café in Gurgaon where artisanal breads, handcrafted pastries, and coffee come together, featuring in-house sourdough and boulangerie classics.",
    whatCYKDid: [
      "Conceptualization & Positioning: Designed a café concept celebrating artisanal breads and coffee culture.",
      "Menu Planning & Development: Curated boulangerie-style offerings including sourdough and focaccia.",
      "Operational Consultancy: Structured workflows to maintain quality and service consistency.",
      "Team Building: Built a skilled team trained in customer service and café-style operations."
    ],
    outcome: "Delivers a soulful café experience balancing artisanal quality with operational consistency.",
    image: "https://www.conceptyourkitchen.com/wp-content/uploads/2025/10/Untitled-design-22.jpg",
    source: "https://www.conceptyourkitchen.com/our-projects/the-inclusive-palate/"
  },
  {
    id: "my-bar-hq-defence-colony",
    name: "My Bar Headquarters, Defence Colony",
    category: "Bar & Restaurant",
    stageTags: ["Backend Ops", "Location"],
    city: "Defence Colony, New Delhi",
    isFlagship: true,
    brief: "A vibrant restro-bar bringing together casual dining, innovative cocktails, and energetic nightlife, designed for a youthful and dynamic crowd in South Delhi.",
    whatCYKDid: [
      "FOH Management: Trained staff and established service SOPs for smooth guest experiences.",
      "Backend Operations: Streamlined kitchen workflows and implemented quality checks.",
      "Staff Hiring & Training: Managed end-to-end hiring for chefs, bartenders, and service captains.",
      "Operational Audits: Conducted performance audits to control costs and uphold service quality."
    ],
    outcome: "Balances entertainment, affordability, and operational efficiency in a high-volume nightlife venue.",
    image: "https://www.conceptyourkitchen.com/wp-content/uploads/2025/10/Untitled-design-26.jpg",
    source: "https://www.conceptyourkitchen.com/our-projects/my-bar-headquarters-defence-colony/"
  },
  {
    id: "my-bar-bareilly",
    name: "My Bar Headquarters, Bareilly",
    category: "Bar & Restaurant",
    stageTags: ["Location", "Backend Ops", "Brand Expansion"],
    city: "Bareilly, Uttar Pradesh",
    brief: "Expanding the prominent restro-bar format into Bareilly with complete operational and kitchen setup.",
    whatCYKDid: [
      "Kitchen MEP planning and bar station design.",
      "Local chef and floor staff recruitment.",
      "Backend inventory and service standardization."
    ],
    image: "https://www.conceptyourkitchen.com/wp-content/uploads/2025/10/Untitled-design-23.jpg",
    source: "https://www.conceptyourkitchen.com/our-projects/my-bar-bareilly/"
  },
  {
    id: "my-bar-meerut",
    name: "My Bar Headquarters, Meerut",
    category: "Bar & Restaurant",
    stageTags: ["Location", "Backend Ops", "Brand Expansion"],
    city: "Meerut, Uttar Pradesh",
    brief: "Execution of regional bar & restaurant expansion in Western Uttar Pradesh.",
    whatCYKDid: [
      "Site layout and kitchen capacity planning.",
      "Staff onboarding and service orientation.",
      "Pre-opening operational audit."
    ],
    image: "https://www.conceptyourkitchen.com/wp-content/uploads/2025/10/Untitled-design-19.jpg",
    source: "https://www.conceptyourkitchen.com/our-projects/my-bar-headquarters-meerut/"
  }
];

export const SERVICES_LIST: ServiceItem[] = [
  {
    id: "conceptualization",
    slug: "conceptualization",
    title: "Conceptualization",
    stageNumber: 0,
    stageName: "The Idea",
    category: "Concept Strategy",
    shortDesc: "Transforming raw food ideas into viable culinary concepts.",
    fullDesc: "We assist in defining the format, positioning, and overall dining proposition to build a distinct brand identity before launching into real estate and buildout.",
    deliverables: ["Concept Proposal & Target Demographic Profile", "Dining Style & Service Workflow Blueprint", "Initial Market Gap & Positioning Assessment"],
    source: "https://www.conceptyourkitchen.com/conceptualization/"
  },
  {
    id: "recipe-development",
    slug: "recipe-development",
    title: "Recipe Development",
    stageNumber: 0,
    stageName: "The Idea",
    category: "Culinary R&D",
    shortDesc: "Recipe trials and standardized culinary cards.",
    fullDesc: "Culinary testing to standardize taste profiles, ingredient yield, and repeatable plating guidelines for commercial kitchen consistency.",
    deliverables: ["Standardized Recipe Cards with Ingredient Quantities", "Ingredient Yield & Cost Estimates", "Plating & Presentation Guidelines"],
    source: "PRD Section 5 & live site audit"
  },
  {
    id: "restaurant-financial-planning",
    slug: "restaurant-financial-planning",
    title: "Restaurant Financial Planning",
    stageNumber: 1,
    stageName: "The Numbers",
    category: "Financial Planning",
    shortDesc: "Custom financial models and feasibility forecasting.",
    fullDesc: "Structuring capital budgets and operating expense forecasts to evaluate project feasibility and set working capital targets.",
    deliverables: ["Itemized Capex Budget Breakdown", "Estimated P&L & Operating Ratios", "Food Cost & Break-Even Targets"],
    source: "https://www.conceptyourkitchen.com/restaurant-financial-planning/"
  },
  {
    id: "location-mapping-strategies",
    slug: "location-mapping-strategies",
    title: "Location Mapping Strategies",
    stageNumber: 2,
    stageName: "The Place",
    category: "Site Selection",
    shortDesc: "Micro-market footfall analysis and catchment audits.",
    fullDesc: "On-ground catchment studies, competitor density checks, and pedestrian footfall evaluations to select high-potential retail locations.",
    deliverables: ["Micro-Market Catchment Dossier", "Footfall & Density Analysis", "Location Suitability Assessment"],
    source: "https://www.conceptyourkitchen.com/location-mapping-strategies/"
  },
  {
    id: "property-leasing",
    slug: "property-leasing",
    title: "Property Leasing",
    stageNumber: 2,
    stageName: "The Place",
    category: "Leasing",
    shortDesc: "Commercial lease negotiation and LOI structuring.",
    fullDesc: "Representing food brands in discussions with landlords and mall operators to negotiate favorable rent terms, fitout periods, and lease structures.",
    deliverables: ["Commercial Term Sheet & LOI Coordination", "Rental Rate Benchmarking", "Fitout Period & Deposit Negotiation"],
    source: "https://www.conceptyourkitchen.com/property-leasing/"
  },
  {
    id: "menu-planning-engineering",
    slug: "menu-planning-engineering",
    title: "Menu Planning & Engineering",
    stageNumber: 3,
    stageName: "The Menu & Kitchen",
    category: "Menu Operations",
    shortDesc: "Menu structure, pricing architecture, and ingredient optimization.",
    fullDesc: "Designing menus that balance guest appeal with inventory cross-utilization and kitchen prep efficiency.",
    deliverables: ["Menu Architecture & Category Mix", "Ingredient Cross-Utilization Analysis", "Item Costing & Contribution Margins"],
    source: "https://www.conceptyourkitchen.com/menu-planning-engineering/"
  },
  {
    id: "kitchen-setup-equipment",
    slug: "kitchen-setup-equipment",
    title: "Kitchen Setup & Equipment",
    stageNumber: 3,
    stageName: "The Menu & Kitchen",
    category: "Kitchen Architecture",
    shortDesc: "Commercial kitchen MEP drawings and equipment layout.",
    fullDesc: "Designing practical kitchen layouts covering prep zones, cooklines, exhaust ductwork, and dishwashing areas for smooth kitchen operations.",
    deliverables: ["Kitchen MEP & Station Layout Plans", "Commercial Equipment Specifications", "Exhaust & Utility Coordination"],
    source: "PRD Section 5 & live site audit"
  },
  {
    id: "branding-designing",
    slug: "branding-designing",
    title: "Brand Building & Design",
    stageNumber: 4,
    stageName: "The Brand & Space",
    category: "Brand Identity",
    shortDesc: "Logo development, visual identity, and packaging collateral.",
    fullDesc: "Creating distinctive visual branding including logos, typography, menus, packaging, and brand guidelines.",
    deliverables: ["Brand Identity & Logo Guidelines", "Packaging & Takeaway Box Artwork", "Dine-In Menu Design & Signage Layouts"],
    source: "https://www.conceptyourkitchen.com/brand-building/"
  },
  {
    id: "interior-planning",
    slug: "interior-planning",
    title: "Interior Planning",
    stageNumber: 4,
    stageName: "The Brand & Space",
    category: "Space Design",
    shortDesc: "Spatial layout, seating plans, and ambiance guidance.",
    fullDesc: "Planning dining room seating arrangements, lighting ambiance, and material palettes to craft welcoming customer environments.",
    deliverables: ["Spatial Layout & Seating Plans", "Ambiance & Material Moodboards", "Contractor Layout Drawings"],
    source: "PRD Section 5 & live site audit"
  },
  {
    id: "uniform-designing",
    slug: "uniform-designing",
    title: "Uniform Designing",
    stageNumber: 4,
    stageName: "The Brand & Space",
    category: "Staff Attire",
    shortDesc: "Functional and branded staff uniform designs.",
    fullDesc: "Designing durable, comfortable, and presentable attire for chefs, floor staff, and service teams matching the restaurant identity.",
    deliverables: ["Uniform Design Specifications", "Fabric & Color Guidelines", "Vendor Fabrication Specifications"],
    source: "PRD Section 5 & live site audit"
  },
  {
    id: "hiring-trainings",
    slug: "hiring-trainings",
    title: "Hiring & Trainings",
    stageNumber: 5,
    stageName: "The Team",
    category: "Human Resources",
    shortDesc: "Culinary staff recruitment and service training SOPs.",
    fullDesc: "Recruiting kitchen and floor staff, followed by hands-on training sessions covering food handling, customer service, and operating procedures.",
    deliverables: ["Candidate Sourcing & Culinary Trials", "Front-of-House Customer Service Training", "Operational SOPs & Checklists"],
    source: "https://www.conceptyourkitchen.com/hiring-trainings/"
  },
  {
    id: "restaurant-marketing",
    slug: "restaurant-marketing",
    title: "Restaurant Marketing",
    stageNumber: 6,
    stageName: "The Launch",
    category: "Marketing",
    shortDesc: "Opening campaigns and local promotional outreach.",
    fullDesc: "Coordinating launch promotions, digital marketing channels, and localized social media outreach to introduce the venue to the community.",
    deliverables: ["Pre-Opening Promotional Roadmap", "Local Social Media Channel Setup", "Launch Tasting Event Coordination"],
    source: "PRD Section 5 & live site audit"
  },
  {
    id: "brand-expansion",
    slug: "brand-expansion",
    title: "Brand Expansion & Franchising",
    stageNumber: 7,
    stageName: "The Expansion",
    category: "Franchise Consulting",
    shortDesc: "Multi-unit growth strategy and franchise expansion.",
    fullDesc: "Assisting established restaurants and food brands in developing franchise operational standards, selecting expansion locations, and evaluating prospective franchisees.",
    deliverables: ["Franchise Operational Guidelines", "Expansion Site Selection Criteria", "Franchisee Evaluation Standards"],
    source: "PRD Section 5 & live site audit"
  }
];

export const HORECA_POSTS: BlogPost[] = [
  {
    id: "post-1",
    title: "Is Visual Elegance Enough for Modernist Diners?",
    category: "Dining Trends",
    readTime: "5 min read",
    date: "September 26, 2026",
    excerpt: "Exploring whether aesthetic interior design and plating alone can sustain long-term customer loyalty in modern dining establishments.",
    author: "CYK Hospitalities",
    authorRole: "Consultancy Insights",
    source: "https://www.conceptyourkitchen.com/ (HoReCa Talks section)"
  },
  {
    id: "post-2",
    title: "Franchisee Peace of Mind Is the Real Product a Franchisor Must Sell",
    category: "Franchising",
    readTime: "6 min read",
    date: "September 26, 2026",
    excerpt: "Why operational consistency, structured supply chains, and transparent support are the true foundations of successful restaurant franchising.",
    author: "CYK Hospitalities",
    authorRole: "Consultancy Insights",
    source: "https://www.conceptyourkitchen.com/ (HoReCa Talks section)"
  }
];

// Confirmed cities only (Delhi NCR, Bareilly, Meerut, Agra)
export const CONFIRMED_CITIES = [
  { name: "Gurugram / Delhi NCR", status: "Primary HQ & Outlets" },
  { name: "Bareilly", status: "Operating Outlets" },
  { name: "Meerut", status: "Operating Outlets" },
  { name: "Agra", status: "Operating Outlets" }
];

export const CLIENT_LOGOS = [
  { name: "The Fat Tiger", category: "QSR" },
  { name: "Gianis", category: "Dessert & Ice Cream" },
  { name: "Baskin Robbins", category: "Ice Cream" },
  { name: "House of Candy", category: "Retail Confectionery" },
  { name: "Twisting Scoops", category: "Ice Cream" },
  { name: "Schmitten", category: "Chocolates" },
  { name: "The Belgian Fries", category: "QSR" },
  { name: "WalkN'oodles", category: "QSR" },
  { name: "Chai Garam", category: "Tea & Snacks" },
  { name: "The Wok Bar", category: "Asian Street Eats" },
  { name: "Hit A Pint", category: "Brewery & Bar" },
  { name: "Sky Jumper", category: "Food Court" }
];
