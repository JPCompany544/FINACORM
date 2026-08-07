"use client";

import * as React from "react";
import { ShieldCheck, Wallet, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Card, CardContent, FeatureCard, ServiceCard, MetricCard, GlassCard, ProductCard, InfoCard } from "@/components/ui/card";
import { Input, Password, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Checkbox, Switch, OTPInputWrapper, Search, PhoneNumberInput, Combobox, DatePickerPlaceholder } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { TableContainer, Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableSortHeader, TablePagination } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { Spinner, Skeleton } from "@/components/ui/loader";
import { Modal, ConfirmationModal, DeleteModal, SuccessModal, InfoModal, Drawer } from "@/components/ui/modal";
import { Grid, PageWrapper, Breadcrumb } from "@/components/layout/layout-utils";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { HoverLift, HoverScale, ButtonPress } from "@/components/ui/animations";
import { SPACING } from "@/styles/tokens";

type TransactionStatus = "success" | "pending" | "failed";

interface Transaction {
  id: string;
  description: string;
  account: string;
  amount: string;
  status: TransactionStatus;
}

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: "TX-1002", description: "Ledger Settlement Wire", account: "Checking *4829", amount: "$12,450.00", status: "success" },
  { id: "TX-1003", description: "Apex Holdings LLC Dividend", account: "Investment *9021", amount: "$1,890.00", status: "success" },
  { id: "TX-1004", description: "Premium Suite Licensing Fee", account: "Checking *4829", amount: "-$420.00", status: "pending" },
  { id: "TX-1005", description: "Bespoke Metal Card Upgrade", account: "Savings *1029", amount: "-$150.00", status: "failed" },
  { id: "TX-1006", description: "Federal Treasury Bond Interest", account: "Securities *3829", amount: "$35,000.00", status: "success" },
];

export default function DesignSystemPreview() {
  // Input states
  const [textVal, setTextVal] = React.useState("");
  const [searchVal, setSearchVal] = React.useState("");
  const [comboVal, setComboVal] = React.useState("");
  const [phoneVal, setPhoneVal] = React.useState("");
  const [otpVal, setOtpVal] = React.useState("");

  // Modal open states
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = React.useState(false);
  const [isInfoOpen, setIsInfoOpen] = React.useState(false);
  const [isLargeOpen, setIsLargeOpen] = React.useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  // Table sorting & pagination
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc" | null>(null);
  const [tablePage, setTablePage] = React.useState(1);
  const [tableSize, setTableSize] = React.useState(5);

  const sortedTransactions = React.useMemo(() => {
    if (!sortDirection) return INITIAL_TRANSACTIONS;
    return [...INITIAL_TRANSACTIONS].sort((a, b) => {
      const amountA = parseFloat(a.amount.replace(/[$,-]/g, ""));
      const amountB = parseFloat(b.amount.replace(/[$,-]/g, ""));
      return sortDirection === "asc" ? amountA - amountB : amountB - amountA;
    });
  }, [sortDirection]);

  return (
    <PageWrapper>
      {/* Hero Banner */}
      <div className="bg-primary/5 py-12 border-b border-border/40 select-none">
        <Container>
          <Breadcrumb items={[{ label: "Core Foundation" }, { label: "Design System Showcase" }]} />
          <div className="mt-4 space-y-2.5 max-w-2xl">
            <h1 className="text-display-l text-foreground font-extrabold tracking-tight">
              Design System Showcase
            </h1>
            <p className="text-sm font-semibold text-text-secondary leading-relaxed">
              Every reusable atom, variant, shadow overlay, and animation token powering Northstar Bank.
            </p>
          </div>
        </Container>
      </div>

      <Container className="py-12 space-y-16">

        {/* ── TYPOGRAPHY ────────────────────────────── */}
        <Section id="typography" className="space-y-6">
          <SectionHeading title="Typography" subtitle="Proportional scale rendered with Manrope configurations." badgeText="Style Guide" align="left" />
          <Card>
            <CardContent className="p-6 space-y-4 pt-6">
              {[
                { name: "Display XL", cls: "text-display-xl", label: "Display Extra Large (60px)" },
                { name: "Display L",  cls: "text-display-l",  label: "Display Large (48px)" },
                { name: "Heading XL", cls: "text-heading-xl", label: "Heading Extra Large (36px)" },
                { name: "Heading L",  cls: "text-heading-l",  label: "Heading Large (30px)" },
                { name: "Heading M",  cls: "text-heading-m",  label: "Heading Medium (24px)" },
                { name: "Heading S",  cls: "text-heading-s",  label: "Heading Small (20px)" },
                { name: "Body Large", cls: "text-body-large text-text-secondary", label: "Body Large (18px)" },
                { name: "Body",       cls: "text-body text-text-secondary",       label: "Body (16px)" },
                { name: "Body Small", cls: "text-body-small text-text-secondary", label: "Body Small (14px)" },
                { name: "Caption",    cls: "text-caption text-muted-foreground",  label: "Caption (12px)" },
                { name: "Labels",     cls: "text-label text-text-secondary",      label: "FORM LABEL UPPERCASE" },
              ].map(({ name, cls, label }) => (
                <div key={name} className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-divider pb-3 last:border-0 last:pb-0">
                  <span className="text-xs text-muted-foreground font-semibold w-24 shrink-0">{name}</span>
                  <span className={cls}>{label}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </Section>

        {/* ── SPACING ───────────────────────────────── */}
        <Section id="spacing" className="space-y-6">
          <SectionHeading title="Spacing Grid" subtitle="Calculated spacing values maintaining layout rhythm." badgeText="Layout" align="left" />
          <Card>
            <CardContent className="p-6 space-y-3 pt-6">
              {Object.entries(SPACING).map(([key, val]) => (
                <div key={key} className="flex items-center gap-4 text-xs font-semibold">
                  <span className="w-10 text-muted-foreground text-right shrink-0">{key}px</span>
                  <div className="h-5 bg-primary/10 rounded-sm min-w-[4px]" style={{ width: val }} />
                  <span className="text-text-secondary">{val}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </Section>

        {/* ── BUTTONS & BADGES ─────────────────────── */}
        <Section id="buttons-badges" className="space-y-6">
          <SectionHeading title="Buttons & Badges" subtitle="Interactive triggers and status indicators." badgeText="Elements" align="left" />
          <Grid cols={1} colsLaptop={2} gap={6}>
            <Card>
              <CardContent className="p-6 space-y-6 pt-6">
                <h4 className="text-heading-s font-bold text-foreground">Button Variants</h4>
                <div className="flex flex-wrap gap-2.5">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="text">Text Link</Button>
                  <Button variant="success">Success</Button>
                  <Button variant="danger">Danger</Button>
                </div>
                <div className="border-t border-divider pt-4 space-y-2">
                  <h5 className="text-xs font-bold text-text-secondary uppercase tracking-wider">States</h5>
                  <div className="flex flex-wrap gap-2.5">
                    <Button variant="primary" isLoading>Loading…</Button>
                    <Button variant="primary" disabled>Disabled</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-6 pt-6">
                <h4 className="text-heading-s font-bold text-foreground">Badge Indicators</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="success">Success</Badge>
                  <Badge variant="pending">Pending</Badge>
                  <Badge variant="failed">Failed</Badge>
                  <Badge variant="new">New Release</Badge>
                  <Badge variant="premium">Premium Metal</Badge>
                  <Badge variant="verified">Verified Client</Badge>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Section>

        {/* ── INPUTS & FORMS ───────────────────────── */}
        <Section id="forms" className="space-y-6">
          <SectionHeading title="Inputs & Form Fields" subtitle="Accessible form controls with full validation states." badgeText="Forms" align="left" />
          <Card>
            <CardContent className="p-6 pt-6">
              <Grid cols={1} colsTablet={2} colsLaptop={3} gap={6}>
                <Input
                  label="Full Name"
                  id="fullname"
                  placeholder="e.g. Sterling Archer"
                  value={textVal}
                  onChange={(e) => setTextVal(e.target.value)}
                  helperText="Provide your full registered tax ID name."
                />
                <Password
                  label="Client Passphrase"
                  id="clientpass"
                  placeholder="Enter secure password"
                />
                <Combobox
                  label="Designated Account Origin"
                  id="acc-origin"
                  options={[
                    { value: "us", label: "United States (Federal Registry)" },
                    { value: "gb", label: "United Kingdom (City of London)" },
                    { value: "ch", label: "Switzerland (Zurich Cantonal)" },
                  ]}
                  value={comboVal}
                  onChange={setComboVal}
                  placeholder="Choose banking jurisdiction…"
                />
                <PhoneNumberInput
                  label="Callback Number"
                  id="call-back"
                  value={phoneVal}
                  onChange={setPhoneVal}
                  helperText="Select dial country prefix code."
                />
                <OTPInputWrapper
                  label="Multi-Factor Validation"
                  value={otpVal}
                  onChange={setOtpVal}
                  helperText="Verify access using the 6-digit SMS token."
                />
                <DatePickerPlaceholder
                  label="Scheduled Transfer Date"
                  id="scheduled-date"
                />
                <Search
                  label="Search Ledger Records"
                  id="ledger-search"
                  placeholder="Type term…"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  onClear={() => setSearchVal("")}
                />
                <Textarea
                  label="Corporate Transfer Memo"
                  id="transfer-memo"
                  placeholder="Describe ledger purposes…"
                />
                {/* Validation States Column */}
                <div className="space-y-4 p-4 border border-dashed border-border rounded-custom-md bg-muted/5 flex flex-col justify-center">
                  <h5 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">State Demos</h5>
                  <Input label="Disabled" disabled placeholder="Readonly field…" />
                  <Input label="Error State" error="Declined: Insufficient reserves." placeholder="Amount…" />
                  <Input label="Success State" success="Verified Routing ID." placeholder="Routing Code…" />
                  <div className="flex items-center gap-6 pt-2">
                    <Checkbox label="Remember device" id="rem-device" />
                    <Switch label="SMS Alerts" id="sms-alerts" />
                  </div>
                </div>
              </Grid>
            </CardContent>
          </Card>
        </Section>

        {/* ── CARDS ────────────────────────────────── */}
        <Section id="cards" className="space-y-6">
          <SectionHeading title="Cards Suite" subtitle="Visual content panels representing all card variants." badgeText="Containers" align="left" />
          <Grid cols={1} colsTablet={2} colsLaptop={3} gap={6}>
            <MetricCard
              label="Settled Vault Reserves"
              value="$2,492,000"
              change={12.4}
              changeLabel="vs last month"
              icon={Wallet}
            />
            <ProductCard
              name="Bespoke Titanium Checking"
              badge="Private Wealth"
              description="Treasury account with custom APY rates, zero international wire fees, and dedicated service."
              price="0.85% APY"
              priceSub="yield rate"
              onSelect={() => {}}
              ctaText="Apply Now"
            />
            <ServiceCard
              title="International Wire Clearing"
              description="Wire transfers completed instantly."
              features={[
                "Sub-second ledger clearing",
                "Automated SWIFT matching",
                "Custom FX swap optimization",
              ]}
              ctaText="Review wire tariffs"
              onCtaClick={() => {}}
            />
            <GlassCard className="flex flex-col justify-between min-h-[12rem]">
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-widest font-extrabold text-primary">Glassmorphism</span>
                <h4 className="text-base font-bold text-foreground">Translucent Container</h4>
                <p className="text-xs text-text-secondary leading-normal">
                  Overlay panels with backdrop-blur, matching dark mode.
                </p>
              </div>
            </GlassCard>
            <FeatureCard
              title="Cryptographic Security"
              description="Ledgers backed by multi-factor hardware security key signatures."
              icon={ShieldCheck}
            />
            <InfoCard
              title="System Operational Notice"
              description="Clearing bridges undergo routine ledger checks at 04:00 UTC."
              variant="info"
            />
          </Grid>
        </Section>

        {/* ── ALERTS ───────────────────────────────── */}
        <Section id="alerts" className="space-y-6">
          <SectionHeading title="Alerts & Notices" subtitle="System messages with dismissal support." badgeText="Feedback" align="left" />
          <Card>
            <CardContent className="p-6 space-y-4 pt-6">
              <Alert variant="info"    title="Vault Clearance Scheduled"  description="Your international wire is queueing for next batch clearing." dismissible />
              <Alert variant="success" title="Settlement Approved"         description="Funds cleared and credited to Checking *4829." />
              <Alert variant="warning" title="Authorization Needed"        description="Swiss transactions require double-signature approvals." />
              <Alert variant="error"   title="Ledger Verification Failed"  description="Declined: Crypto-signature mismatch on wire payload." />
            </CardContent>
          </Card>
        </Section>

        {/* ── MODALS & DRAWERS ─────────────────────── */}
        <Section id="modals" className="space-y-6">
          <SectionHeading title="Modals & Overlay Drawers" subtitle="Dynamic dialog components triggered via state." badgeText="Overlays" align="left" />
          <Card>
            <CardContent className="p-6 pt-6 flex flex-wrap gap-3 justify-center">
              <Button onClick={() => setIsConfirmOpen(true)}  variant="outline">Confirmation Dialog</Button>
              <Button onClick={() => setIsDeleteOpen(true)}   variant="danger">Delete Alert</Button>
              <Button onClick={() => setIsSuccessOpen(true)}  variant="success">Success Overlay</Button>
              <Button onClick={() => setIsInfoOpen(true)}     variant="secondary">Info Acknowledge</Button>
              <Button onClick={() => setIsLargeOpen(true)}    variant="primary">Large Modal</Button>
              <Button onClick={() => setIsDrawerOpen(true)}   variant="outline">Side Drawer</Button>
            </CardContent>
          </Card>

          <ConfirmationModal
            isOpen={isConfirmOpen}
            onClose={() => setIsConfirmOpen(false)}
            title="Confirm Account Transfer"
            message="Wire $10,000.00 from your Checking account to Swiss cantonal holdings?"
            onConfirm={() => {}}
            confirmText="Initiate Transfer"
          />
          <DeleteModal
            isOpen={isDeleteOpen}
            onClose={() => setIsDeleteOpen(false)}
            title="Remove Vault Beneficiary"
            message="Permanently erase routing links for:"
            itemName="Apex Securities Ltd."
            onDelete={() => {}}
          />
          <SuccessModal
            isOpen={isSuccessOpen}
            onClose={() => setIsSuccessOpen(false)}
            message="Ledger entry logged. Wire receipt sent."
          />
          <InfoModal
            isOpen={isInfoOpen}
            onClose={() => setIsInfoOpen(false)}
            message="FDIC insurance covers checking/saving balances up to $250,000 per tax account."
          />
          <Modal isOpen={isLargeOpen} onClose={() => setIsLargeOpen(false)} title="Tax Filing Agreement" size="xl">
            <div className="space-y-4 text-xs font-semibold text-text-secondary leading-relaxed">
              <p>Federal regulatory bodies dictate double verification on international transfers from corporations.</p>
              <p>By accepting, you certify the beneficiary is fully credentialed under local jurisdiction bylaws.</p>
              <div className="flex justify-end gap-2.5 pt-4 border-t border-border/40 mt-4">
                <Button variant="outline" size="sm" onClick={() => setIsLargeOpen(false)}>Close</Button>
                <Button variant="primary" size="sm" onClick={() => setIsLargeOpen(false)}>Accept Agreement</Button>
              </div>
            </div>
          </Modal>
          <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Audit Trail Filter">
            <div className="space-y-6">
              <p className="text-xs text-text-secondary font-semibold">Configure filter conditions for ledger updates.</p>
              <div className="space-y-4">
                <Input label="Audit User Name" placeholder="e.g. system-bot" />
                <DatePickerPlaceholder label="Starting Date" />
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All events" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="success">Success logs</SelectItem>
                    <SelectItem value="warning">Warn logs</SelectItem>
                    <SelectItem value="error">Error events</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2.5 pt-6 border-t border-border/40">
                <Button variant="outline" size="sm" className="flex-1 justify-center" onClick={() => setIsDrawerOpen(false)}>Clear</Button>
                <Button variant="primary" size="sm" className="flex-1 justify-center" onClick={() => setIsDrawerOpen(false)}>Apply Filters</Button>
              </div>
            </div>
          </Drawer>
        </Section>

        {/* ── DATA TABLE ───────────────────────────── */}
        <Section id="data-table" className="space-y-6">
          <SectionHeading title="Data Table" subtitle="Responsive ledger table with sorting and pagination." badgeText="Ledger" align="left" />
          <div className="space-y-0">
            <TableContainer>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference ID</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>
                      <TableSortHeader direction={sortDirection} onSort={setSortDirection}>
                        Amount
                      </TableSortHeader>
                    </TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedTransactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="text-primary font-bold">{tx.id}</TableCell>
                      <TableCell>{tx.description}</TableCell>
                      <TableCell>{tx.account}</TableCell>
                      <TableCell className={cn(tx.amount.startsWith("-") ? "text-error" : "text-success")}>
                        {tx.amount}
                      </TableCell>
                      <TableCell>
                        <Badge variant={tx.status as BadgeProps["variant"]}>
                          {tx.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              currentPage={tablePage}
              totalPages={3}
              onPageChange={setTablePage}
              pageSize={tableSize}
              onPageSizeChange={setTableSize}
              totalItems={15}
            />
          </div>
        </Section>

        {/* ── EMPTY STATES & LOADERS ───────────────── */}
        <Section id="empty-loaders" className="space-y-6">
          <SectionHeading title="Empty States & Loaders" subtitle="Graceful fallbacks during processing queries." badgeText="Auxiliary" align="left" />
          <Grid cols={1} colsLaptop={2} gap={6}>
            <Card>
              <CardContent className="p-6 pt-6">
                <h4 className="text-heading-s font-bold text-foreground mb-4">Empty State</h4>
                <EmptyState type="transactions" onAction={() => {}} />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 space-y-6 pt-6">
                <h4 className="text-heading-s font-bold text-foreground mb-4">Spinners & Skeletons</h4>
                <div className="flex items-center gap-6">
                  {(["sm", "md", "lg"] as const).map((s) => (
                    <div key={s} className="flex items-center gap-2">
                      <Spinner size={s} />
                      <span className="text-xs font-semibold text-text-secondary">{s}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-3 pt-4 border-t border-divider">
                  <h5 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Skeleton Placeholders</h5>
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-10 w-full rounded-custom-md" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Section>

        {/* ── ANIMATIONS ───────────────────────────── */}
        <Section id="animations" className="space-y-6">
          <SectionHeading title="Framer Motion Presets" subtitle="Demonstration of animated card behaviors." badgeText="Motion" align="left" />
          <Grid cols={1} colsTablet={3} gap={6}>
            {[
              { Wrapper: HoverLift,  color: "bg-primary/10 text-primary",  label: "Hover Lift",  desc: "Moves up 4px on hover." },
              { Wrapper: HoverScale, color: "bg-accent/10 text-accent",     label: "Hover Scale", desc: "Scales to 1.02 on hover." },
              { Wrapper: ButtonPress, color: "bg-muted/10 text-muted-foreground", label: "Button Press", desc: "Shrinks to 0.97 on tap." },
            ].map(({ Wrapper, color, label, desc }) => (
              <Wrapper key={label}>
                <Card className="h-full cursor-pointer">
                  <CardContent className="p-6 space-y-3 pt-6 text-center">
                    <div className={cn("mx-auto w-9 h-9 rounded-full flex items-center justify-center", color)}>
                      <Play className="h-4 w-4" />
                    </div>
                    <h4 className="text-sm font-bold text-foreground">{label}</h4>
                    <p className="text-xs text-text-secondary leading-normal">{desc}</p>
                  </CardContent>
                </Card>
              </Wrapper>
            ))}
          </Grid>
        </Section>

      </Container>
    </PageWrapper>
  );
}
