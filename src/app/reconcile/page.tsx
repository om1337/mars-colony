import { ScreenStub } from "@/components/ScreenStub";

const Page = () => (
  <ScreenStub
    eyebrow="Reconcile · crew files, Maya closes"
    title="Return Reconciliation"
    job="True the ledger against what physically happened — burned, returned, recovered."
    fidelity="wireframe"
    bullets={[
      "Opens when a mission closes; pre-filled from plan + Live Burn.",
      "Variance on consumables highlighted; assets back with hours + condition.",
      "Unreconciled missions show as dashed uncertainty on the Week Board.",
      "Does not block planning — it marks numbers as untrustworthy.",
    ]}
    nextHref="/utilization"
    nextLabel="Utilization & Denied Demand →"
  />
);

export default Page;
