"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ROLES, type Role, type RoleId } from "@/lib/roles";

type RoleContextValue = {
  role: Role;
  roleId: RoleId;
  setRoleId: (id: RoleId) => void;
};

const RoleContext = createContext<RoleContextValue | null>(null);

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [roleId, setRoleIdState] = useState<RoleId>("commander");

  const setRoleId = useCallback((id: RoleId) => {
    setRoleIdState(id);
  }, []);

  const value = useMemo(() => {
    const role = ROLES.find((r) => r.id === roleId) ?? ROLES[0];
    return { role, roleId, setRoleId };
  }, [roleId, setRoleId]);

  return (
    <RoleContext.Provider value={value}>{children}</RoleContext.Provider>
  );
};

export const useRole = (): RoleContextValue => {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
};
