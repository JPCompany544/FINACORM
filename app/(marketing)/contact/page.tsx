import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { PhoneCall } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ContactPage() {
  return (
    <Section size="md">
      <Container>
        <SectionHeading
          title="Contact Customer Concierge"
          subtitle="Get 24/7 dedicated support from our banking and security experts."
          badgeText="Support"
          badgeVariant="premium"
        />
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 flex flex-col items-center text-center space-y-4 pt-8">
            <div className="p-3 bg-primary/10 text-primary rounded-full">
              <PhoneCall className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Dedicated Concierge Service</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Reach us anytime via email, secure chat in the mobile dashboard, or phone at 1-800-FINACORM. Our customer operations are operating round-the-clock to keep your assets secure.
            </p>
          </CardContent>
        </Card>
      </Container>
    </Section>
  );
}
