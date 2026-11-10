import { ScreenStub } from "@/components/ScreenStub";

const Page = () => (
  <ScreenStub
    eyebrow="Earth · 26-week lead time"
    title="In-Transit Pipeline"
    job="Plan against supply that exists but has not arrived."
    fidelity="wireframe"
    bullets={[
      "Every committed order: contents, mass, arrival week.",
      "Ghosts onto the Week Board as future blocks.",
      "Exposure: which consumables cross floor before next shipment.",
      "That exposure number is the one worth waking someone for.",
    ]}
    nextHref="/earth/order"
    nextLabel="Earth Order Builder →"
  />
);

export default Page;
