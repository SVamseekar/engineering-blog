import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { getAllPostMeta } from "@/lib/content/load";
import { postsToSearchDocs } from "@/lib/search/index";
import { websiteJsonLd } from "@/lib/seo/jsonld";

export default function PubLayout({ children }: { children: React.ReactNode }) {
  const posts = getAllPostMeta();
  const docs = postsToSearchDocs(posts);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
      />
      <SiteHeader searchDocs={docs} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
