import { useState } from "react";
import { Share2, Facebook, MessageCircle, Link2, Check } from "lucide-react";
import { toast } from "sonner";

export function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";
  const text = `${title} — Electronic Hive`;

  const nativeShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: text, url }); } catch {}
    } else {
      copy();
    }
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true); toast.success("Link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch { toast.error("Could not copy"); }
  };

  const wa = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;
  const fb = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-muted-foreground mr-1">Share:</span>
      <button onClick={nativeShare} aria-label="Share" className="h-9 w-9 flex items-center justify-center rounded-full border border-border hover:bg-accent transition-colors">
        <Share2 className="h-4 w-4" />
      </button>
      <a href={wa} target="_blank" rel="noopener" aria-label="Share on WhatsApp" className="h-9 w-9 flex items-center justify-center rounded-full border border-border hover:bg-accent transition-colors">
        <MessageCircle className="h-4 w-4" />
      </a>
      <a href={fb} target="_blank" rel="noopener" aria-label="Share on Facebook" className="h-9 w-9 flex items-center justify-center rounded-full border border-border hover:bg-accent transition-colors">
        <Facebook className="h-4 w-4" />
      </a>
      <button onClick={copy} aria-label="Copy link" className="h-9 w-9 flex items-center justify-center rounded-full border border-border hover:bg-accent transition-colors">
        {copied ? <Check className="h-4 w-4 text-success" /> : <Link2 className="h-4 w-4" />}
      </button>
    </div>
  );
}
