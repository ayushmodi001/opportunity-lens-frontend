'use client';

import { useEffect, useState } from 'react';

/**
 * ClientOnly component to prevent hydration mismatches
 * Use this to wrap components that should only render on the client
 */
export function ClientOnly({ children, fallback = null }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return fallback;
  }

  return children;
}

export default ClientOnly;
