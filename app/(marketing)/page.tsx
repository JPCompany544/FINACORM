import * as React from "react";
import { PageWrapper } from "@/components/layout/layout-utils";
import { Hero } from "@/components/marketing/hero";
import { BankingProducts } from "@/components/marketing/banking-products";
import { WhyNorthstar } from "@/components/marketing/why-northstar";
import { MobileShowcase } from "@/components/marketing/mobile-showcase";
import { Security } from "@/components/marketing/security";
import { CallToAction } from "@/components/marketing/call-to-action";

export default function MarketingHomePage() {
  return (
    <PageWrapper>
      <Hero />
      <BankingProducts />
      <WhyNorthstar />
      <MobileShowcase />
      <Security />
      <CallToAction />
    </PageWrapper>
  );
}
