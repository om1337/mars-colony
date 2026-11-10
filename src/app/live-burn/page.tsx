import { ScreenStub } from "@/components/ScreenStub";

const Page = () => (
  <ScreenStub
    eyebrow="Execute · mid-mission"
    title="Live Burn"
    job="Stop a mid-mission overspend from becoming next week's surprise."
    fidelity="listed"
    bullets={[
      "Planned vs actual for consumables; coarse crew input on purpose.",
      "Overspend updates the ledger immediately.",
      "Later claims re-evaluate the same day — fuel failure fix.",
    ]}
  />
);

export default Page;
