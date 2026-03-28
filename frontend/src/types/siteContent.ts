export interface HighlightItem {
  id: string;
  title: string;
  description: string;
}

export interface HomeHero {
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
}

export interface HomepageContent {
  hero: HomeHero;
  highlights: HighlightItem[];
  featuredSectionTitle: string;
  catalogSectionTitle: string;
}

export interface CheckoutContent {
  title: string;
  subtitle: string;
  notice: string;
  supportEmail: string;
  shippingLabel: string;
  shippingCost: number;
  taxRate: number;
  allowOrderNotes: boolean;
}

export interface SiteContent {
  homepage: HomepageContent;
  checkout: CheckoutContent;
}