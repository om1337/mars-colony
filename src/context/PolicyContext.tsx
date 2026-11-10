"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { POLICY_RULES, type PolicyRule } from "@/lib/policy";

type PolicyContextValue = {
  rules: PolicyRule[];
  publishRule: (rule: PolicyRule) => void;
};

const PolicyContext = createContext<PolicyContextValue | null>(null);

export const PolicyProvider = ({ children }: { children: ReactNode }) => {
  const [rules, setRules] = useState<PolicyRule[]>(POLICY_RULES);

  const publishRule = useCallback((rule: PolicyRule) => {
    setRules((prev) => {
      const index = prev.findIndex(
        (item) => item.kind === rule.kind && item.resourceId === rule.resourceId,
      );
      if (index === -1) return [...prev, rule];
      const next = prev.slice();
      next[index] = {
        ...rule,
        id: prev[index].id,
      };
      return next;
    });
  }, []);

  const value = useMemo(() => ({ rules, publishRule }), [rules, publishRule]);

  return (
    <PolicyContext.Provider value={value}>{children}</PolicyContext.Provider>
  );
};

export const usePolicy = (): PolicyContextValue => {
  const ctx = useContext(PolicyContext);
  if (!ctx) throw new Error("usePolicy must be used within PolicyProvider");
  return ctx;
};
