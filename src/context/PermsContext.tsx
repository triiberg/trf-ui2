import React, { createContext, useContext, useMemo } from 'react';
import { parsePerms, canRead, canManipulate, isLookup, type ServiceKey } from '../lib/permissions';

interface PermsContextValue {
  perms: bigint;
  can: (service: ServiceKey, action?: 'read' | 'manipulate') => boolean;
  needsLookup: (service: ServiceKey) => boolean;
}

const PermsContext = createContext<PermsContextValue>({
  perms: 0n,
  can: () => false,
  needsLookup: () => false,
});

export function PermsProvider({ token, children }: { token: string; children: React.ReactNode }) {
  const value = useMemo<PermsContextValue>(() => {
    const perms = parsePerms(token);
    return {
      perms,
      can: (service, action = 'read') =>
        action === 'manipulate' ? canManipulate(perms, service) : canRead(perms, service),
      needsLookup: (service) => isLookup(perms, service),
    };
  }, [token]);

  return <PermsContext.Provider value={value}>{children}</PermsContext.Provider>;
}

export function usePerms() {
  return useContext(PermsContext);
}
