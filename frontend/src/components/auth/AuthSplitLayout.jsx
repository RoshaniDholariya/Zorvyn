import { useEffect } from "react";
import animationUrl from "@/assets/Animation.json?url";

const DOTLOTTIE_SRC =
  "https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs";

export default function AuthSplitLayout({
  badgeIcon,
  eyebrow,
  title,
  description,
  children,
  footer,
}) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (customElements.get("dotlottie-player")) return;

    const script = document.createElement("script");
    script.type = "module";
    script.src = DOTLOTTIE_SRC;
    script.async = true;
    document.head.appendChild(script);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(1200px_circle_at_0%_0%,rgba(56,189,248,0.10),transparent_55%),radial-gradient(1000px_circle_at_100%_100%,rgba(59,130,246,0.10),transparent_55%)] px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-3xl border border-black/10 bg-white/90 shadow-lg backdrop-blur md:grid-cols-2">
        <section className="relative hidden min-h-130 bg-linear-to-br from-blue-900 via-blue-800 to-blue-700 p-8 text-white md:flex md:flex-col md:justify-between">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-100/90">
              Secure Access
            </p>
            <h2 className="text-3xl font-bold leading-tight">
              Track income and expenses with clarity.
            </h2>
            <p className="max-w-md text-sm text-blue-100/85">
              Finance Workspace keeps your categories, records, and analytics in one
              organized dashboard.
            </p>
          </div>

          <div className="relative rounded-2xl">
            <dotlottie-player
              src={animationUrl}
              background="transparent"
              speed="1"
              style={{ width: "100%", height: "390px" }}
              loop
              autoplay
            />
          </div>
        </section>

        <section className="grid min-h-130 content-center p-5 sm:p-8">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 p-2 md:hidden">
              <dotlottie-player
                src={animationUrl}
                background="transparent"
                speed="1"
                style={{ width: "100%", height: "180px" }}
                loop
                autoplay
              />
            </div>

            <div className="mb-6 flex items-center justify-between">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-100 text-blue-700">
                {badgeIcon}
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
                {eyebrow}
              </p>
            </div>

            <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
            <p className="mt-2 text-sm text-slate-600">{description}</p>

            <div className="mt-6">{children}</div>
            <div className="mt-5">{footer}</div>
          </div>
        </section>
      </div>
    </div>
  );
}
