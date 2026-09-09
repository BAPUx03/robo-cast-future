import logoUrl from "@/assets/modtech-logo.svg";

/**
 * Modtech wordmark rendered as a mask so it always picks up the surrounding
 * text colour — readable on both the dark and the light theme.
 */
export function BrandLogo({ className = "h-8" }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="Modtech Machinery"
      className={`block w-auto shrink-0 bg-current ${className}`}
      style={{
        aspectRatio: "25359 / 15968",
        maskImage: `url(${logoUrl})`,
        WebkitMaskImage: `url(${logoUrl})`,
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
        maskSize: "contain",
        WebkitMaskSize: "contain",
      }}
    />
  );
}
