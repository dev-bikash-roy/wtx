import PricingClient from "./PricingClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Membership Plans | WTX News",
  description: "Choose a membership plan to unlock premium content.",
};

export default function PricingPage() {
  return <PricingClient />;
}
