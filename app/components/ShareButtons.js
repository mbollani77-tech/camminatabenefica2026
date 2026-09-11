'use client';

import { useState } from 'react';

const SHARE_TEXT =
  'Cammina con noi alla Camminata Benefica di Sabbio Chiese, il 4 ottobre 2026! Iscriviti qui:';

function getPageUrl() {
  return typeof window !== 'undefined' ? window.location.href : '';
}

function openSharePopup(url) {
  window.open(url, '_blank', 'noopener,noreferrer,width=600,height=520');
}

export default function ShareButtons() {
  const [copied, setCopied] = useState(false);

  function shareFacebook() {
    const url = getPageUrl();
    openSharePopup(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
  }

  function shareX() {
    const url = getPageUrl();
    openSharePopup(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(SHARE_TEXT)}`
    );
  }

  function shareWhatsApp() {
    const url = getPageUrl();
    openSharePopup(`https://wa.me/?text=${encodeURIComponent(`${SHARE_TEXT} ${url}`)}`);
  }

  async function shareInstagram() {
    const url = getPageUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      // clipboard non disponibile: nessuna azione
    }
  }

  return (
    <div className="share-row">
      <span className="share-label">Condividi</span>

      <button type="button" onClick={shareFacebook} aria-label="Condividi su Facebook" className="share-btn">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
          <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94Z" />
        </svg>
      </button>

      <button type="button" onClick={shareX} aria-label="Condividi su X" className="share-btn">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
          <path d="M18.9 2H22l-7.6 8.68L23.3 22h-6.9l-5.4-7.06L4.7 22H1.6l8.1-9.26L1 2h7.1l4.9 6.46L18.9 2Zm-1.2 18h1.9L7.4 3.9H5.4L17.7 20Z" />
        </svg>
      </button>

      <button type="button" onClick={shareWhatsApp} aria-label="Condividi su WhatsApp" className="share-btn">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.85.5 3.58 1.36 5.07L2 22l5.2-1.45a9.86 9.86 0 0 0 4.84 1.27h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.5 2 12.04 2Zm5.87 14.02c-.25.7-1.45 1.34-2 1.42-.51.08-1.16.11-1.87-.12-.43-.14-.98-.32-1.7-.63-2.98-1.29-4.93-4.28-5.08-4.48-.15-.2-1.22-1.62-1.22-3.09 0-1.47.77-2.19 1.05-2.49.27-.3.6-.37.8-.37.2 0 .4 0 .57.01.18.01.43-.07.67.51.25.6.85 2.07.92 2.22.07.15.12.32.02.52-.1.2-.15.32-.3.5-.15.17-.31.39-.44.52-.15.15-.3.31-.13.6.17.3.76 1.25 1.63 2.02 1.12.99 2.06 1.3 2.36 1.45.3.15.47.12.65-.08.17-.2.74-.86.94-1.15.2-.3.4-.25.67-.15.28.1 1.75.82 2.05.97.3.15.5.22.57.35.08.13.08.72-.17 1.42Z" />
        </svg>
      </button>

      <button type="button" onClick={shareInstagram} aria-label="Copia link per Instagram" className="share-btn">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
          <path d="M12 2.2c2.7 0 3 .01 4.12.06 1.11.05 1.87.23 2.53.48.68.27 1.26.62 1.83 1.19.57.57.92 1.15 1.19 1.83.25.66.43 1.42.48 2.53.05 1.12.06 1.42.06 4.12s-.01 3-.06 4.12c-.05 1.11-.23 1.87-.48 2.53a5.06 5.06 0 0 1-1.19 1.83c-.57.57-1.15.92-1.83 1.19-.66.25-1.42.43-2.53.48-1.12.05-1.42.06-4.12.06s-3-.01-4.12-.06c-1.11-.05-1.87-.23-2.53-.48a5.06 5.06 0 0 1-1.83-1.19 5.06 5.06 0 0 1-1.19-1.83c-.25-.66-.43-1.42-.48-2.53C2.01 15 2 14.7 2 12s.01-3 .06-4.12c.05-1.11.23-1.87.48-2.53.27-.68.62-1.26 1.19-1.83A5.06 5.06 0 0 1 5.56 2.33c.66-.25 1.42-.43 2.53-.48C9.2 1.8 9.5 1.79 12 1.79Zm0 1.98c-2.65 0-2.96.01-4.01.06-.97.04-1.5.2-1.85.34-.47.18-.8.4-1.15.75-.35.35-.57.68-.75 1.15-.14.35-.3.88-.34 1.85-.05 1.05-.06 1.36-.06 4.01s.01 2.96.06 4.01c.04.97.2 1.5.34 1.85.18.47.4.8.75 1.15.35.35.68.57 1.15.75.35.14.88.3 1.85.34 1.05.05 1.36.06 4.01.06s2.96-.01 4.01-.06c.97-.04 1.5-.2 1.85-.34.47-.18.8-.4 1.15-.75.35-.35.57-.68.75-1.15.14-.35.3-.88.34-1.85.05-1.05.06-1.36.06-4.01s-.01-2.96-.06-4.01c-.04-.97-.2-1.5-.34-1.85a2.9 2.9 0 0 0-.75-1.15 2.9 2.9 0 0 0-1.15-.75c-.35-.14-.88-.3-1.85-.34-1.05-.05-1.36-.06-4.01-.06ZM12 6.87A5.13 5.13 0 1 1 6.87 12 5.13 5.13 0 0 1 12 6.87Zm0 1.98A3.15 3.15 0 1 0 15.15 12 3.15 3.15 0 0 0 12 8.85Zm5.34-2.15a1.2 1.2 0 1 1-1.2-1.2 1.2 1.2 0 0 1 1.2 1.2Z" />
        </svg>
      </button>

      {copied && <span className="share-copied">Link copiato! Incollalo su Instagram.</span>}
    </div>
  );
}
