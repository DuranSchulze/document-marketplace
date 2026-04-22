"use client";

import { useEffect, useState, useCallback } from "react";

interface ServiceStatus {
  ok: boolean;
  error?: string;
  folderName?: string;
  title?: string;
}

interface StatusResponse {
  drive: ServiceStatus;
  sheets: ServiceStatus;
  checkedAt: string;
}

type FetchState =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "ready"; data: StatusResponse };

type TestResult =
  | { kind: "idle" }
  | { kind: "running" }
  | { kind: "ok"; cell?: string; value?: string }
  | { kind: "error"; message: string };

type EmailTestResult =
  | { kind: "idle" }
  | { kind: "running" }
  | { kind: "ok"; to: string }
  | { kind: "error"; message: string };

export function GoogleStatusBanner() {
  const [state, setState] = useState<FetchState>({ kind: "loading" });
  const [refreshing, setRefreshing] = useState(false);
  const [test, setTest] = useState<TestResult>({ kind: "idle" });
  const [emailTest, setEmailTest] = useState<EmailTestResult>({ kind: "idle" });

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/google-status", {
        credentials: "include",
      });
      if (!res.ok) {
        setState({ kind: "error", message: `HTTP ${res.status}` });
        return;
      }
      const data = (await res.json()) as StatusResponse;
      setState({ kind: "ready", data });
    } catch (err) {
      setState({
        kind: "error",
        message: err instanceof Error ? err.message : "Network error",
      });
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const runTestWrite = useCallback(async () => {
    setTest({ kind: "running" });
    try {
      const res = await fetch("/api/admin/sheets-test-write", {
        method: "POST",
        credentials: "include",
      });
      const data = (await res.json()) as {
        ok: boolean;
        error?: string;
        cell?: string;
        value?: string;
      };
      if (data.ok) {
        setTest({ kind: "ok", cell: data.cell, value: data.value });
      } else {
        setTest({ kind: "error", message: data.error ?? `HTTP ${res.status}` });
      }
    } catch (err) {
      setTest({
        kind: "error",
        message: err instanceof Error ? err.message : "Network error",
      });
    }
  }, []);

  const runTestEmail = useCallback(async () => {
    const to = window.prompt("Send test email to:", "");
    if (to === null) return; // cancelled
    setEmailTest({ kind: "running" });
    try {
      const url = to.trim()
        ? `/api/admin/email-test?to=${encodeURIComponent(to.trim())}`
        : "/api/admin/email-test";
      const res = await fetch(url, { method: "POST", credentials: "include" });
      const data = (await res.json()) as {
        ok: boolean;
        to?: string;
        error?: string;
      };
      if (data.ok) {
        setEmailTest({ kind: "ok", to: data.to ?? to.trim() });
      } else {
        setEmailTest({
          kind: "error",
          message: data.error ?? `HTTP ${res.status}`,
        });
      }
    } catch (err) {
      setEmailTest({
        kind: "error",
        message: err instanceof Error ? err.message : "Network error",
      });
    }
  }, []);

  if (state.kind === "loading") {
    return (
      <div className="mb-4 rounded-md border border-[rgba(23,58,64,0.08)] bg-white px-3 py-1.5 text-xs text-[var(--sea-ink-soft)]">
        Checking Google…
      </div>
    );
  }

  if (state.kind === "error") {
    return (
      <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs text-red-700">
        Google status error: {state.message}
      </div>
    );
  }

  const { drive, sheets } = state.data;
  const bothOk = drive.ok && sheets.ok;
  const noneOk = !drive.ok && !sheets.ok;

  const tone = bothOk
    ? {
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        text: "text-emerald-800",
      }
    : noneOk
      ? { bg: "bg-red-50", border: "border-red-200", text: "text-red-800" }
      : {
          bg: "bg-amber-50",
          border: "border-amber-200",
          text: "text-amber-900",
        };

  return (
    <div
      className={`mb-4 rounded-md border ${tone.border} ${tone.bg} ${tone.text} px-3 py-1.5 text-xs`}
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <Pill
          label="Drive"
          status={drive}
          detail={drive.ok ? drive.folderName : drive.error}
        />
        <Pill
          label="Sheets"
          status={sheets}
          detail={sheets.ok ? sheets.title : sheets.error}
        />

        <div className="ml-auto flex items-center gap-3">
          {test.kind === "ok" && (
            <span
              className="text-emerald-700"
              title={`Wrote "${test.value}" to ${test.cell}`}
            >
              ✓ wrote to {test.cell}
            </span>
          )}
          {test.kind === "error" && (
            <span
              className="text-red-700 truncate max-w-[20rem]"
              title={test.message}
            >
              ✗ {test.message}
            </span>
          )}

          {emailTest.kind === "ok" && (
            <span
              className="text-emerald-700"
              title={`Sent to ${emailTest.to}`}
            >
              ✓ emailed {emailTest.to}
            </span>
          )}
          {emailTest.kind === "error" && (
            <span
              className="text-red-700 truncate max-w-[20rem]"
              title={emailTest.message}
            >
              ✗ {emailTest.message}
            </span>
          )}

          <button
            type="button"
            onClick={runTestWrite}
            disabled={!sheets.ok || test.kind === "running"}
            className="rounded border border-current/30 px-2 py-0.5 font-medium hover:bg-black/5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {test.kind === "running" ? "Writing…" : "Test write"}
          </button>

          <button
            type="button"
            onClick={runTestEmail}
            disabled={emailTest.kind === "running"}
            className="rounded border border-current/30 px-2 py-0.5 font-medium hover:bg-black/5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {emailTest.kind === "running" ? "Sending…" : "Test email"}
          </button>

          <button
            type="button"
            onClick={() => {
              setRefreshing(true);
              void load();
            }}
            disabled={refreshing}
            className="underline underline-offset-2 disabled:opacity-50"
          >
            {refreshing ? "…" : "Refresh"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Pill({
  label,
  status,
  detail,
}: {
  label: string;
  status: ServiceStatus;
  detail?: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 min-w-0">
      <span
        className={`inline-block h-1.5 w-1.5 rounded-full ${status.ok ? "bg-emerald-500" : "bg-red-500"}`}
        aria-hidden
      />
      <span className="font-semibold">{label}</span>
      <span className="truncate max-w-[16rem] opacity-80" title={detail}>
        {status.ok ? (detail ?? "ok") : (detail ?? "not connected")}
      </span>
    </span>
  );
}
