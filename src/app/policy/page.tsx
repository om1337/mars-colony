import { ScreenStub } from "@/components/ScreenStub";

const PolicyPage = () => {
  return (
    <ScreenStub
      eyebrow="8 · Approve · Ops Lead writes"
      title="Policy Editor"
      job="Set the colony's standing constraints in advance, in language anyone can cite."
      fidelity="medium"
      bullets={[
        "Four rule kinds: reserve floors, draw allowances, duration caps, draw rights",
        "Each rule carries author, date, and the plain-language sentence shown on Blocked",
        "Backtest preview against the last four weeks — auto-approve / block / queue counts",
        "Readable by everyone; only Kai can write",
      ]}
      nextHref="/exception/queue"
      nextLabel="Exception Queue →"
    />
  );
};

export default PolicyPage;
