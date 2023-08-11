import { h, FunctionalComponent } from "preact";
import { useRef, useEffect } from "preact/hooks";

export const useOutsideClick = (callback: () => void) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [callback]);

  return ref;
};

export const ClickAwayListener: FunctionalComponent<{
  onClickAway: () => void;
}> = ({ children, onClickAway }) => {
  const ref = useOutsideClick(onClickAway);
  return <div ref={ref}>{children}</div>;
};
