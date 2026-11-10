import { ScreenStub } from "@/components/ScreenStub";

const Page = () => (
  <ScreenStub
    eyebrow="Shared · anyone can look up"
    title="Decision Log"
    job="Every yes and no — automatic and human — with rule, timestamp, author."
    fidelity="listed"
    bullets={[
      "Filter by gear, resource, mission, person, outcome.",
      "Floor overrides pinned at top with both signatories.",
      "A decision anyone can look up stops being a thing Kai did to someone.",
    ]}
  />
);

export default Page;
