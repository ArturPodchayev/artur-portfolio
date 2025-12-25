import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
};

export default function HeroMotion() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-8 md:p-12">
      {/* glow blobs */}
      <div className="pointer-events-none absolute -top-24 left-24 h-72 w-72 rounded-full bg-purple-500/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-24 h-72 w-72 rounded-full bg-cyan-500/25 blur-3xl" />

      <motion.div
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.08 }}
        className="relative"
      >
        <motion.div variants={fadeUp} className="flex items-center gap-4">
          <img
            src="/hero.jpg"
            alt="Artur"
            className="h-12 w-12 rounded-2xl border border-white/10 object-cover bg-white/5"
            loading="eager"
          />

          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Available for projects • Uzbekistan
          </p>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mt-5 text-4xl font-semibold tracking-tight md:text-6xl"
        >
          Artur <span className="text-zinc-400">Podchaev</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-300 md:text-lg"
        >
          Full-stack developer. I build clean, fast web products — and keep them stable.
        </motion.p>

<motion.div variants={fadeUp} className="mt-8 grid gap-3 md:grid-cols-2">
  <a
    href="#my2025"
    className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition"
  >
    <div className="text-xs text-zinc-400">Live stats</div>
    <div className="mt-1 text-sm font-medium">My 2025 →</div>
  </a>

  <a
    href="#contact"
    className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition"
  >
    <div className="text-xs text-zinc-400">Reach me</div>
    <div className="mt-1 text-sm font-medium">Contact →</div>
  </a>
</motion.div>

      </motion.div>
    </section>
  );
}
