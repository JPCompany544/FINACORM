import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <Section size="md">
      <Container>
        <SectionHeading
          title="About Northstar Bank"
          subtitle="Learn about our mission to build a premium, secure, digital-first banking platform."
          badgeText="Our Mission"
          badgeVariant="premium"
        />
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 flex flex-col items-center text-center space-y-4 pt-8">
            <div className="p-3 bg-primary/10 text-primary rounded-full">
              <Info className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Pioneering Digital Banking</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Founded in 2026, Northstar Bank leverages cutting-edge technology to deliver secure, fast, and modern financial services. From personal deposits to investment portfolios, we guide your financial journey with precision.
            </p>
          </CardContent>
        </Card>
      </Container>
    </Section>
  );
}
