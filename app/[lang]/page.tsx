import Link from "next/link";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function Home({ params }: PageProps) {
  const { lang } = await params;
  const currentLang = (lang === 'hi' ? 'hi' : 'en');
  
  const content = {
    en: {
      title: "Sanatana Dharma",
      subtitle: "The Eternal Truth",
      categories: [
        { title: "Shruti", desc: "The Vedas & Upanishads (That which is Heard)", slug: "shruti" },
        { title: "Smriti", desc: "Puranas & Itihasa (That which is Remembered)", slug: "smriti" },
        { title: "Siddhanta", desc: "Philosophy & Conclusions", slug: "siddhanta" },
      ]
    },
    hi: {
      title: "सनातन धर्म",
      subtitle: "शाश्वत सत्य की खोज",
      categories: [
        { title: "श्रुति", desc: "वेद और उपनिषद (जो सुना गया)", slug: "shruti" },
        { title: "स्मृति", desc: "पुराण और इतिहास (जो याद रखा गया)", slug: "smriti" },
        { title: "सिद्धांत", desc: "दार्शनिक निष्कर्ष और तत्व ज्ञान", slug: "siddhanta" },
      ]
    }
  };

  const t = content[currentLang];

  return (
    <main className="flex min-h-[90vh] flex-col items-center justify-center p-6 text-center relative">
      
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-saffron-strong/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-xl w-full z-10">
        {/* Header Section */}
        <h1 className="text-6xl font-heading font-black text-saffron-text mb-2 drop-shadow-sm">
          {t.title}
        </h1>
        <div className="h-1 w-24 bg-saffron-strong mx-auto mb-4 rounded-full"></div>
        <p className="text-xl text-saffron-text-light mb-12 font-body italic">
          {t.subtitle}
        </p>

        {/* Categories Grid */}
        <div className="grid w-full gap-5">
          {t.categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${currentLang}/${cat.slug}`}
              className="group relative flex flex-col items-start text-left 
                         rounded-xl border-2 border-saffron-border 
                         bg-saffron-surface p-6 shadow-md 
                         hover:shadow-xl hover:scale-[1.02] hover:bg-[#FFDAB9] 
                         transition-all duration-300"
            >
              <div className="flex w-full justify-between items-center border-b border-saffron-text/10 pb-2 mb-3">
                <h2 className="text-2xl font-heading font-bold text-saffron-text group-hover:text-saffron-strong transition-colors">
                  {cat.title}
                </h2>
                <span className="text-saffron-text/30 text-2xl group-hover:text-saffron-strong">
                  ॐ
                </span>
              </div>
              <p className="text-saffron-text-light font-body text-lg leading-relaxed">
                {cat.desc}
              </p>
            </Link>
          ))}
        </div>

       
      </div>
    </main>
  );
}