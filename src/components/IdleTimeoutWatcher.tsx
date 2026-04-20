import { useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { authClient } from "#/lib/auth-client";

/** Sign the admin out after this many ms of inactivity. */
const IDLE_LIMIT_MS = 30 * 60 * 1000; // 30 minutes

/** How often to check whether the idle limit has been crossed. */
const CHECK_INTERVAL_MS = 60 * 1000; // 1 minute

/** Throttle activity events so we only touch the ref at most every N ms. */
const ACTIVITY_THROTTLE_MS = 30 * 1000; // 30 seconds

const ACTIVITY_EVENTS: Array<keyof WindowEventMap> = [
  "mousemove",
  "mousedown",
  "keydown",
  "scroll",
  "touchstart",
  "click",
];

/**
 * Client-only watcher. Mount once inside the admin layout. Signs the user
 * out + redirects to /admin/login?reason=idle after IDLE_LIMIT_MS of no
 * activity. Uses a ref + throttled listeners to keep overhead tiny.
 */
export function IdleTimeoutWatcher() {
  const navigate = useNavigate();
  const lastActivityRef = useRef<number>(Date.now());
  const signedOutRef = useRef(false);

  useEffect(() => {
    let lastMark = 0;
    const markActivity = () => {
      const now = Date.now();
      if (now - lastMark < ACTIVITY_THROTTLE_MS) return;
      lastMark = now;
      lastActivityRef.current = now;
    };

    ACTIVITY_EVENTS.forEach((evt) => {
      window.addEventListener(evt, markActivity, { passive: true });
    });

    const interval = window.setInterval(async () => {
      if (signedOutRef.current) return;
      const idleFor = Date.now() - lastActivityRef.current;
      if (idleFor >= IDLE_LIMIT_MS) {
        signedOutRef.current = true;
        try {
          await authClient.signOut();
        } catch {
          // ignore — we still redirect below
        }
        navigate({ to: "/admin/login", search: { reason: "idle" } });
      }
    }, CHECK_INTERVAL_MS);

    return () => {
      ACTIVITY_EVENTS.forEach((evt) => {
        window.removeEventListener(evt, markActivity);
      });
      window.clearInterval(interval);
    };
  }, [navigate]);

  return null;
}
