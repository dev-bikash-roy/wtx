export type PlanId = "free" | "basic" | "premium";

export interface Plan {
  id: PlanId;
  name: string;
  price: string;
  priceMonthly: number;
  paddlePriceId: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: "£0",
    priceMonthly: 0,
    paddlePriceId: "",
    description: "Get started with the basics",
    features: [
      "Access to free articles",
      "Breaking news updates",
      "Community access",
      "Newsletter subscription",
    ],
  },
  {
    id: "basic",
    name: "Basic",
    price: "£4.99",
    priceMonthly: 4.99,
    paddlePriceId: process.env.NEXT_PUBLIC_PADDLE_BASIC_PRICE_ID || "",
    description: "Perfect for regular readers",
    features: [
      "Everything in Free",
      "Ad-free reading experience",
      "Access to premium articles",
      "Early access to breaking news",
      "Email digest",
    ],
    highlighted: false,
  },
  {
    id: "premium",
    name: "Premium",
    price: "£9.99",
    priceMonthly: 9.99,
    paddlePriceId: process.env.NEXT_PUBLIC_PADDLE_PREMIUM_PRICE_ID || "",
    description: "For the most dedicated readers",
    features: [
      "Everything in Basic",
      "Exclusive investigative reports",
      "Live event coverage",
      "Priority support",
      "Download articles offline",
      "Cancel anytime",
    ],
    highlighted: true,
  },
];

export const getPlanById = (id: PlanId): Plan =>
  PLANS.find((p) => p.id === id) ?? PLANS[0];
