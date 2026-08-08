import { cn } from "@/lib/utils";

// RadialGlowBackground — a soft emerald glow for Dark Mode. Renders only the
// glow overlay itself; the page's base background color is owned by the
// shared layout, so this sits on top of it (fixed inset-0 wrapper in App).
export function RadialGlowBackground({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("absolute inset-0", className)}
      style={{
        backgroundImage:
          "radial-gradient(circle 500px at 50% 300px, rgba(16,185,129,0.35), transparent)",
      }}
    />
  );
}
