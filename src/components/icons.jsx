// Lucide's brand/logo icon set doesn't ship in this version — small custom marks instead.

export function GithubMark({ className, strokeWidth }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 2C6.48 2 2 6.58 2 12.2c0 4.49 2.87 8.3 6.84 9.65.5.1.68-.22.68-.5 0-.24-.01-1.04-.01-1.89-2.78.61-3.37-1.21-3.37-1.21-.46-1.18-1.11-1.5-1.11-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.55 2.34 1.1 2.91.84.09-.66.35-1.1.63-1.36-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.73 0 0 .84-.28 2.75 1.05a9.32 9.32 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.42.2 2.47.1 2.73.64.72 1.03 1.63 1.03 2.75 0 3.93-2.35 4.79-4.58 5.05.36.32.68.95.68 1.92 0 1.39-.01 2.51-.01 2.85 0 .28.18.61.69.5A10.02 10.02 0 0 0 22 12.2C22 6.58 17.52 2 12 2Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function LinkedinMark({ className, strokeWidth }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="3" fill="currentColor" opacity="0.001" />
      <path
        d="M6.94 8.5a1.94 1.94 0 1 0 0-3.88 1.94 1.94 0 0 0 0 3.88ZM5.25 10.25h3.38V19H5.25v-8.75ZM11.25 10.25h3.24v1.2h.05c.45-.83 1.55-1.7 3.19-1.7 3.41 0 4.04 2.13 4.04 4.9V19h-3.38v-4.35c0-1.04-.02-2.38-1.47-2.38-1.47 0-1.7 1.13-1.7 2.3V19h-3.37v-8.75Z"
        fill="currentColor"
      />
    </svg>
  );
}
