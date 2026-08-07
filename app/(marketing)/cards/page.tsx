import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { CreditCard } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function CardsPage() {
  return (
    <Section size="md">
      <Container>
        <SectionHeading
          title="Premium Credit Cards"
          subtitle="Experience unlimited cash back and metal card benefits with low interest rates."
          badgeText="Credit Cards"
          badgeVariant="premium"
        />
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 flex flex-col items-center text-center space-y-4 pt-8">
            <div className="p-3 bg-primary/10 text-primary rounded-full">
              <CreditCard className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Northstar Horizon Credit Card</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Earn flat 2.5% cash back on all purchases, enjoy zero foreign transaction fees, and access airport lounges with our metal concierge card options.
            </p>
          </CardContent>
        </Card>
      </Container>
    </Section>
  );
}
