"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function SuccessPageContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [polling, setPolling] = useState(true);
  const hasTriggeredDownloadRef = useRef(false);

  useEffect(() => {
    if (!orderId) {
      setPolling(false);
      return;
    }

    let attempts = 0;
    let stopped = false;

    const applyOrder = (order: {
      status: string;
      downloadUrl: string | null;
    }) => {
      if (order.status === "paid" && order.downloadUrl) {
        setDownloadUrl(order.downloadUrl);
        setPolling(false);
        stopped = true;
        clearInterval(interval);
        return true;
      }
      return false;
    };

    const checkOrder = async () => {
      if (stopped) return;
      attempts++;
      try {
        // Ask the server to verify with Xendit and finalize (mark paid +
        // send email + write to Sheets) if needed. Idempotent. The webhook
        // remains the primary path — this is just a fallback so the buyer
        // isn't stuck on "Preparing…" if the webhook is delayed.
        const res = await fetch(`/api/orders/${orderId}/finalize`, {
          method: "POST",
        });
        if (res.ok) {
          const order: { status: string; downloadUrl: string | null } =
            await res.json();
          if (applyOrder(order)) return;
        } else {
          // Finalize couldn't verify with Xendit yet — fall back to a
          // plain read so we still pick up a webhook-finalized order.
          const fallback = await fetch(`/api/orders/${orderId}`);
          if (fallback.ok) {
            const order: { status: string; downloadUrl: string | null } =
              await fallback.json();
            if (applyOrder(order)) return;
          }
        }
      } catch {
        /* ignore */
      }

      if (attempts >= 12) {
        setPolling(false);
        stopped = true;
        clearInterval(interval);
      }
    };

    void checkOrder();
    const interval = setInterval(checkOrder, 5000);

    return () => {
      stopped = true;
      clearInterval(interval);
    };
  }, [orderId]);

  useEffect(() => {
    if (!downloadUrl || hasTriggeredDownloadRef.current) return;

    hasTriggeredDownloadRef.current = true;

    // Programmatic anchor click is more reliable than a hidden iframe:
    // /api/download/[token] returns a 302 to a Google Drive URL, and most
    // browsers won't follow a top-level redirect inside a sandboxed iframe
    // for download purposes. An <a> click navigates the same way the user
    // clicking the visible button would.
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.rel = "noopener";
    // target=_blank prevents the success page from being replaced by the
    // Drive viewer, so the user keeps the manual "Download Now" fallback.
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, [downloadUrl]);

  return (
    <main className="page-wrap px-4 pb-16 pt-20">
      <div className="max-w-lg mx-auto text-center">
        <div className="island-shell rounded-2xl p-10">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-[var(--sea-ink)] mb-3">
            Payment Successful!
          </h1>
          <p className="text-[var(--sea-ink-soft)] mb-6">
            Thank you for your purchase. A download link has been sent to your
            email address.
          </p>

          {polling && !downloadUrl && (
            <div className="flex items-center justify-center gap-2 text-sm text-[var(--sea-ink-soft)] mb-6">
              <svg
                className="animate-spin w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Preparing your download link…
            </div>
          )}

          {downloadUrl && (
            <div className="mb-4">
              <p className="text-sm text-[var(--sea-ink-soft)] mb-4">
                Your download should start automatically. If it does not, use
                the button below.
              </p>
              <a
                href={downloadUrl}
                className="inline-block rounded-full bg-[var(--lagoon-deep)] px-8 py-3 text-sm font-semibold text-white no-underline transition hover:-translate-y-0.5 hover:opacity-90"
              >
                Download Now
              </a>
            </div>
          )}

          {!polling && !downloadUrl && (
            <p className="text-sm text-[var(--sea-ink-soft)] mb-6">
              Your download link will be emailed shortly. Please check your
              inbox.
            </p>
          )}

          <Link
            href="/"
            className="block text-sm text-[var(--lagoon-deep)] hover:underline mt-4"
          >
            Back to marketplace
          </Link>
        </div>
      </div>
    </main>
  );
}
