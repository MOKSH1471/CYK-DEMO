export interface JourneyStage {
  id: number;
  number: string; // "01" through "08"
  title: string;
  subtitle: string;
  tagline: string;
  cykServices: string[];
  description: string;
  proofProject: {
    name: string;
    type: string;
    caption: string;
    image: string;
  };
  clientQuote?: {
    text: string;
    author: string;
    brand: string;
  };
  stampIcon: string;
  deliverables: string[];
  source: string;
}

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  stageNumber: number;
  stageName: string;
  category: string;
  shortDesc: string;
  fullDesc: string;
  deliverables: string[];
  duration?: string;
  whyCYK?: string;
  source: string;
}

export interface Project {
  id: string;
  name: string;
  category: 'QSR' | 'Bar & Restaurant' | 'Cafe' | 'Bakery' | 'Dessert Parlor' | 'Brewery & Restaurant' | 'Hotel' | 'Food Court' | 'Institutional / Cafeteria';
  stageTags: ('Concept' | 'Location' | 'Menu/R&D' | 'Backend Ops' | 'Brand Expansion')[];
  city: string;
  isFlagship?: boolean;
  brief: string;
  whatCYKDid: string[];
  outcome?: string;
  testimonialQuote?: string;
  quoteAuthor?: string;
  image: string;
  source: string;
}

export interface Testimonial {
  id: string;
  author: string;
  designation?: string;
  brand: string;
  stageNumber: number;
  quote: string;
  source: string;
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  excerpt: string;
  author: string;
  authorRole: string;
  source: string;
}

export interface EnquiryState {
  currentStage: string;
  businessType: string;
  stagesNeeded: number[];
  city: string;
  budgetRange: string;
  targetTimeline: string;
  fullName: string;
  phone: string;
  email: string;
  notes: string;
}
