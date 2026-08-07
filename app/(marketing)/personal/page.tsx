import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { Landmark } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function PersonalPage() {
  return (
    <Section size="md">
      <Container>
        <SectionHeading
          title="Personal Deposit Accounts"
          subtitle="Interest-bearing checking and high-yield savings accounts designed to grow your assets."
          badgeText="Checking & Savings"
          badgeVariant="success"
        />
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 flex flex-col items-center text-center space-y-4 pt-8">
            <div className="p-3 bg-success/10 text-success rounded-full">
              <Landmark className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Checking & High-Yield Savings</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Earn a premium 5.25% APY on deposits with zero monthly maintenance fees. Our FDIC-insured checking and savings accounts integrate seamlessly with our digital banking tools.
            </p>
          </CardContent>
        </Card>
      </Container>
    </Section>
  );
}
