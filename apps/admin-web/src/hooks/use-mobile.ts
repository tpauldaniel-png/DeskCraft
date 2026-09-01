import * as React from "react";

const MOBILE_BREAKPOINT = 768;

const MOBILE_QUERY =
  `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;

export function useIsMobile() {
  const [isMobile, setIsMobile] =
    React.useState(() => {
      if (typeof window === "undefined") {
        return false;
      }

      return window.matchMedia(MOBILE_QUERY).matches;
    });

  React.useEffect(() => {
    const mediaQuery =
      window.matchMedia(MOBILE_QUERY);

    function onChange(
      event: MediaQueryListEvent,
    ) {
      setIsMobile(event.matches);
    }

    mediaQuery.addEventListener(
      "change",
      onChange,
    );

    return () => {
      mediaQuery.removeEventListener(
        "change",
        onChange,
      );
    };
  }, []);

  return isMobile;
}