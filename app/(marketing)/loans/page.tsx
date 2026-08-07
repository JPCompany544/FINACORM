import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { Banknote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function LoansPage() {
  return (
    <Section size="md">
      <Container>
        <SectionHeading
          title="Flexible Personal & Mortgage Loans"
          subtitle="Borrow with confidence. Transparent interest rates, custom terms, and instant approval decisions."
          badgeText="Borrowing"
          badgeVariant="new"
        />
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 flex flex-col items-center text-center space-y-4 pt-8">
            <div className="p-3 bg-primary/10 text-primary rounded-full">
              <Banknote className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Personal Financing & Mortgages</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Competitive rates, fixed interest schedules, and flexible payment periods customized to fit your budget. Apply entirely online and receive a quick lending decision in minutes.
            </p>
          </CardContent>
        </Card>
      </Container>
    </Section>
  );
}
