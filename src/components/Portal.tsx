import { portalRootId } from "@defaults";
import { h, Fragment, FunctionalComponent } from "preact";
import { createPortal } from "preact/compat";
import { useEffect, useLayoutEffect, useRef } from "preact/hooks";

const Portal: FunctionalComponent = ({ children }) => {
  const node = useRef();
  const portalRoot = useRef<Element | null>(null);

  useEffect(() => {
    portalRoot.current = document.querySelector(`#${portalRootId}`);
  }, []);

  useLayoutEffect(() => {
    if (node.current && portalRoot.current) {
      portalRoot.current.appendChild(node.current);
    }
  }, [node]);

  if (!portalRoot.current) return null;

  return (
    <Fragment ref={node}>
      {createPortal(<div>{children}</div>, portalRoot.current)}
    </Fragment>
  );
};

export default Portal;
