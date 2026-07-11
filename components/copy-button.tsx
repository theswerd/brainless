"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";

export function CopyButton({
  value,
  className,
  label = "Copy",
}: {
  value: string;
  className?: string;
  label?: string;
}) {
  const [copied, setCopied] = React.useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1400);
      }}
      aria-label={label}
      className={className}
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
    </button>
  );
}
