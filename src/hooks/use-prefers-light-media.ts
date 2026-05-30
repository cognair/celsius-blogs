import * as React from "react";

/**
 * Returns true when we should serve lightweight media:
 * - User opted into Save-Data
 * - Slow effective connection (2g/3g)
 * - prefers-reduced-data
 *
 * Defaults to false (rich media) on first render to avoid hydration mismatch,
 * then updates after mount.
 */
export function usePrefersLightMedia(): boolean {
  const [light, setLight] = React.useState(false);

  React.useEffect(() => {
    const check = () => {
      // @ts-expect-error - non-standard but widely supported on Chromium/Android
      const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      const saveData = !!conn?.saveData;
      const slow = conn?.effectiveType ? /^(slow-2g|2g|3g)$/.test(conn.effectiveType) : false;
      const reducedData =
        typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-reduced-data: reduce)").matches;
      setLight(saveData || slow || reducedData);
    };
    check();
    // @ts-expect-error - non-standard
    const conn = navigator.connection;
    conn?.addEventListener?.("change", check);
    return () => conn?.removeEventListener?.("change", check);
  }, []);

  return light;
}
