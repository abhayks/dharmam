import Link from 'next/link';

interface NavPost {
  slug: string[];
  title: string;
}

interface Props {
  prev: NavPost | null;
  next: NavPost | null;
  lang: string;
}

export default function PostNavigation({ prev, next, lang }: Props) {
  if (!prev && !next) return null;

  return (
    <nav className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-saffron-text/20 pt-8">
      {/* PREVIOUS POST */}
      {prev ? (
        <Link 
          href={`/${lang}/${prev.slug.join('/')}`}
          className="group flex flex-col items-start p-6 rounded-xl border-2 border-saffron-border/50 
                     bg-white/50 hover:bg-saffron-surface hover:border-saffron-strong 
                     transition-all duration-300 text-left"
        >
          <span className="text-xs font-bold tracking-widest uppercase text-saffron-text-light mb-2 group-hover:text-saffron-strong">
            &larr; Previous
          </span>
          <span className="font-heading font-bold text-lg text-saffron-text group-hover:text-saffron-strong">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div /> /* Empty div to keep Next post on the right if Prev is missing */
      )}

      {/* NEXT POST */}
      {next ? (
        <Link 
          href={`/${lang}/${next.slug.join('/')}`}
          className="group flex flex-col items-end p-6 rounded-xl border-2 border-saffron-border/50 
                     bg-white/50 hover:bg-saffron-surface hover:border-saffron-strong 
                     transition-all duration-300 text-right"
        >
          <span className="text-xs font-bold tracking-widest uppercase text-saffron-text-light mb-2 group-hover:text-saffron-strong">
            Next &rarr;
          </span>
          <span className="font-heading font-bold text-lg text-saffron-text group-hover:text-saffron-strong">
            {next.title}
          </span>
        </Link>
      ) : null}
    </nav>
  );
}