// GradientBackground — "Jade Sky", made with the 21st.dev Gradient
// Builder and exported as live CSS (the builder's own Copy-CSS background,
// plus its soften-blur and grain passes). Zero dependencies: one <div> that
// fills its parent. Drop it behind your content:
// <div className="relative h-96"><GradientBackground className="absolute inset-0" /></div>
// Remix the source recipe (colors, mode, finish) in the editor:
// https://21st.dev/community/gradients/editor?from=85ea2692-591f-4b2b-928f-de88da3d1a88
export function GradientBackground({
  className,
  dark = false,
}: {
  className?: string;
  dark?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        position: "relative",
        overflow: "hidden",
        width: "100%",
        height: "100%",
        containerType: "size",
      }}
    >
      <div
        style={{
          position: "absolute",
        inset: "-0.8cqmin",
        filter: "blur(0.4cqmin)",
        backgroundColor: dark ? "#0C1416" : "#CFE9F0",
        backgroundImage: dark
          ? "radial-gradient(circle at 65.34% 44.62%, rgba(45, 212, 191, 0.32) 0%, rgba(45, 212, 191, 0) 34.1%), radial-gradient(circle at 28.07% 74.48%, rgba(16, 185, 129, 0.26) 0%, rgba(16, 185, 129, 0) 45.65%), radial-gradient(circle at 52.42% 19.94%, rgba(52, 211, 153, 0.28) 0%, rgba(52, 211, 153, 0) 57.55%), radial-gradient(circle at 80.31% 84.47%, rgba(20, 184, 166, 0.22) 0%, rgba(20, 184, 166, 0) 69.1%)"
          : "radial-gradient(circle at 65.34% 44.62%, rgba(238, 246, 227, 1) 0%, rgba(238, 246, 227, 0) 34.1%), radial-gradient(circle at 28.07% 74.48%, rgba(183, 217, 142, 1) 0%, rgba(183, 217, 142, 0) 45.65%), radial-gradient(circle at 52.42% 19.94%, rgba(127, 191, 154, 1) 0%, rgba(127, 191, 154, 0) 57.55%), radial-gradient(circle at 80.31% 84.47%, rgba(207, 233, 240, 1) 0%, rgba(207, 233, 240, 0) 69.1%)",
        }}
      />
    </div>
  )
}
