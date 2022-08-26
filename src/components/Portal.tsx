import { h, Fragment, FunctionalComponent } from "preact";
import { createPortal } from "preact/compat";
import { useEffect, useState } from "preact/hooks";

const Portal: FunctionalComponent<{ target: Element | string }> = ({
  children,
  target,
}) => {
  const [portalRoot, setPortalRoot] = useState<Element | null>(null);

  useEffect(() => {
    const root =
      typeof target === "string" ? document.querySelector(target) : target;
    setPortalRoot(root);
  }, [target]);

  if (!portalRoot) return null;

  return createPortal(<Fragment>{children}</Fragment>, portalRoot);
};

export default Portal;
