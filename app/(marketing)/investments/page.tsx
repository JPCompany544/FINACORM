import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function InvestmentsPage() {
  return (
    <Section size="md">
      <Container>
        <SectionHeading
          title="Wealth Management & Investing"
          subtitle="Automate your growth. Expert-led risk portfolios and automated trading solutions tailored to you."
          badgeText="Investments"
          badgeVariant="premium"
        />
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 flex flex-col items-center text-center space-y-4 pt-8">
            <div className="p-3 bg-accent/15 text-accent-foreground rounded-full">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Grow Your Capital</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Explore managed portfolios, direct stock trades, index funds, and bond instruments. Integrate smart algorithms with automatic deposit rules to build a robust wealth engine.
            </p>
          </CardContent>
        </Card>
      </Container>
    </Section>
  );
}
