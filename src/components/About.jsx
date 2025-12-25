export default function About() {
  return (
    <section id="about" className="mt-14">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <div className="grid gap-8 md:grid-cols-[1.35fr_1fr] md:items-start">
          {/* TEXT */}
          <div>
            <h2 className="text-2xl font-semibold">About</h2>

            <p className="mt-4 text-zinc-300 leading-relaxed">
              I’m Artur — a full-stack developer who cares about the real outcome.
              Not just “features”, but systems that actually work: fast, clean, and stable.
            </p>

            <p className="mt-4 text-zinc-300 leading-relaxed">
              I like turning messy ideas into something simple to use.
              Landing pages that convert, dashboards that make decisions easier,
              automation that saves hours, and backend logic that doesn’t break the moment
              something goes slightly wrong.
            </p>

            <p className="mt-4 text-zinc-300 leading-relaxed">
              I’m big on consistency. I train problem-solving daily (LeetCode + algorithms),
              so under pressure I don’t panic — I break things down, choose trade-offs,
              and ship.
            </p>

            <p className="mt-4 text-zinc-300 leading-relaxed">
              Visually I’m into minimal UI: strong typography, calm layouts, and motion that
              supports the story. If something can be simpler — I’ll simplify it.
            </p>

            <p className="mt-4 text-zinc-300 leading-relaxed">
              If you need someone who can move fast without making a mess — we’ll work well together.
            </p>
          </div>

          {/* PHOTOS (no captions) */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-3">
            <div className="grid gap-3">
              {/* big */}
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <img
                  src="/about-3.jpg"
                  alt="Artur"
                  className="h-[220px] w-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* two small */}
              <div className="grid grid-cols-2 gap-3">
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                  <img
                    src="/about-2.jpg"
                    alt="Artur"
                    className="h-[140px] w-full object-cover"
                    loading="lazy"
                  />
                </div>

                <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                  <img
                    src="/about-1.jpg"
                    alt="Artur"
                    className="h-[140px] w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
