"use client";

type DownloadButtonProps = {
  label: string;
  filename: string;
  content: string;
  className?: string;
};

export function DownloadButton({ label, filename, content, className }: DownloadButtonProps) {
  const href = `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`;

  return (
    <a
      href={href}
      download={filename}
      className={className || "button button-secondary"}
    >
      {label}
    </a>
  );
}
