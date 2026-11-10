import { ScreenStub } from "@/components/ScreenStub";

const ExceptionQueuePage = () => {
  return (
    <ScreenStub
      eyebrow="9 · Approve · Ops Lead decides"
      title="Exception Queue"
      job="Make Monday morning a thirty-minute job — only what policy could not decide."
      fidelity="medium"
      bullets={[
        "Each item: request, tripped rule, reason, competing claims, cost of denial",
        "Approve, deny, or approve-with-modification — typed reason becomes public record",
        "Pattern hint when the same exception recurs (amend policy, stop ruling)",
        "Queue-size trend: a healthy queue shrinks",
      ]}
      nextHref="/decisions"
      nextLabel="Decision Log →"
    />
  );
};

export default ExceptionQueuePage;
