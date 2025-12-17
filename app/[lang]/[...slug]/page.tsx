import { getPostData, getPostPaths, getAdjacentPosts, getFolderItems, type FolderItem } from '@/lib/mdx';
import PostNavigation from '@/components/PostNavigation';
import ShlokaCard from '@/components/ShlokaCard'; // Import the custom component
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface PageProps {
  params: Promise<{
    lang: string;
    slug: string[];
  }>;
}

export async function generateStaticParams({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const paths = getPostPaths(lang);
  return paths.map((slug) => ({ slug }));
}

export default async function Page({ params }: PageProps) {
  const { lang, slug } = await params;

  // 1. Fetch Data
  // Try to find a specific MDX post for this URL
  const post = await getPostData(lang, slug);
  
  // Try to find sub-folders for this URL (in case it's a category like "Vedas")
  const folderItems = getFolderItems(slug, lang);
  
  // Get adjacent posts for navigation (only relevant if it is a post)
  const adjacent = post ? await getAdjacentPosts(lang, slug) : { prev: null, next: null };

  // 2. If neither a Post nor a Folder exists, return 404
  if (!post && folderItems.length === 0) {
    notFound();
  }

  // 3. Determine Title & Description
  // If it's a post, use frontmatter. If it's a folder, use the last part of the slug or the index.mdx title if available
  const title = post?.frontmatter.title || slug[slug.length - 1].replace(/-/g, ' ');
  const description = post?.frontmatter.description;

  // 4. Generate Breadcrumbs
  const breadcrumbs = slug.slice(0, -1).map((item, index) => ({
    label: item.replace(/-/g, ' '),
    href: `/${lang}/${slug.slice(0, index + 1).join('/')}`,
  }));

  // 5. Localize the "Explore" Heading for Folder views
  const isHindi = lang === 'hi';
  const exploreHeading = isHindi 
    ? `${title} का अन्वेषण करें`  // Hindi
    : `Explore ${title}`;         // English

  return (
    <main className="min-h-screen pb-20">
       <div className="mx-auto max-w-3xl px-6 py-12">
          
          {/* --- BREADCRUMBS NAVIGATION --- */}
          <nav className="mb-8 font-heading text-xs tracking-widest text-saffron-text-light uppercase">
             <Link href={`/${lang}`} className="hover:text-saffron-strong">Home</Link>
             {breadcrumbs.map((crumb) => (
               <span key={crumb.href}>
                 <span className="mx-2 text-saffron-border">/</span>
                 <Link href={crumb.href} className="hover:text-saffron-strong">
                   {crumb.label}
                 </Link>
               </span>
             ))}
          </nav>

          {/* --- HEADER SECTION --- */}
          <header className="mb-12 text-center bg-saffron-surface border-2 border-saffron-border rounded-xl p-8 shadow-sm">
            {/* Small Tag showing the Parent Category */}
            <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-widest text-white uppercase bg-saffron-text rounded-sm">
              {slug.length > 1 ? slug[slug.length - 2] : 'Section'}
            </span>
            
            {/* Main Title */}
            <h1 className="text-3xl md:text-5xl font-heading font-black text-saffron-text mb-6 leading-tight capitalize">
              {title}
            </h1>

            {/* Description (if available) */}
            {description && (
              <p className="text-lg text-saffron-text-light italic font-body max-w-xl mx-auto border-t border-saffron-text/10 pt-4">
                &ldquo;{description}&rdquo;
              </p>
            )}
          </header>

          {/* --- BLOG POST CONTENT (MDX) --- */}
          {post && (
            <div className="prose prose-lg prose-stone max-w-none font-body text-saffron-text
              /* Typography Overrides for Saffron Theme */
              prose-headings:font-heading prose-headings:text-saffron-text prose-headings:font-bold
              prose-p:text-saffron-text prose-strong:text-saffron-text
              prose-a:text-saffron-strong prose-a:font-bold prose-a:no-underline hover:prose-a:underline
              prose-li:text-saffron-text prose-li:marker:text-saffron-strong
              /* Blockquote styling */
              prose-blockquote:border-l-4 prose-blockquote:border-saffron-strong 
              prose-blockquote:bg-saffron-surface prose-blockquote:text-saffron-text
              prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic">
              
              {/* Render MDX and pass custom components */}
              <MDXRemote 
                source={post.content} 
                components={{ ShlokaCard }} 
              />
            </div>
          )}

          {/* --- FOLDER ITEMS (Sub-categories / Chapter Grid) --- */}
          {folderItems.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-heading font-bold text-saffron-text mb-6 border-b border-saffron-border pb-2 capitalize">
                {exploreHeading}
              </h2>
              <div className="grid gap-4">
                {folderItems.map((item: FolderItem) => (
                  <Link
                    key={item.slug}
                    href={item.href}
                    className="group relative flex flex-col items-start p-6 rounded-xl border-2 border-saffron-border/60 
                              bg-saffron-surface/50 hover:bg-saffron-surface hover:border-saffron-strong 
                              transition-all duration-300"
                  >
                    <h2 className="text-xl font-heading font-bold text-saffron-text group-hover:text-saffron-strong">
                      {item.title}
                    </h2>
                    
                    {/* Only show description if it exists */}
                    {item.description && (
                      <p className="text-saffron-text-light mt-2 font-body italic text-sm">
                        {item.description}
                      </p>
                    )}

                    <span className="absolute right-6 top-6 text-2xl text-saffron-text/10 group-hover:text-saffron-strong/20">
                      ❧
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* --- POST NAVIGATION (Next / Prev) --- */}
          <PostNavigation prev={adjacent.prev} next={adjacent.next} lang={lang} />
       </div>
    </main>
  );
}