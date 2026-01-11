const Contact = () => {
  return (
    <section id="contact" className="py-32 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto border-t border-ink/5 dark:border-white/5">
      <div className="flex flex-col items-center text-center">
        <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-black dark:text-white mb-8">
          Let&apos;s build something<br />meaningful.
        </h2>
        <a
          href="mailto:kingsley.aremu@gmail.com"
          className="text-xl md:text-2xl font-light text-ink/60 dark:text-ash/60 hover:text-ink dark:hover:text-white transition-colors border-b border-ink/20 dark:border-white/20 pb-1"
        >
          kingsley.aremu@gmail.com
        </a>
      </div>
    </section>
  );
};

export default Contact;
