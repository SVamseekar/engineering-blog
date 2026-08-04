import {
  getAllPostMeta,
  getAllCategories,
  getAllTopics,
  getEditorsPicks,
  getFeaturedPost,
  loadSeriesDefs,
  getSeriesPosts,
} from "@/lib/content/load";
import {
  Hero,
  FeaturedArticle,
  EditorsPicks,
  LatestArticles,
  ChannelVideosSection,
  PopularSeries,
  CategoriesSection,
  TopicsSection,
  NewsletterSection,
  ProjectsSection,
} from "@/components/home/HomeSections";

export default function HomePage() {
  const posts = getAllPostMeta();
  const featured = getFeaturedPost();
  const picks = getEditorsPicks(4);
  const latest = posts.filter((p) => p.slug !== featured?.slug).slice(0, 6);
  const series = loadSeriesDefs();
  const counts: Record<string, number> = {};
  for (const s of series) {
    counts[s.id] = getSeriesPosts(s.id).length;
  }

  return (
    <>
      <Hero />
      <FeaturedArticle post={featured} />
      <ChannelVideosSection />
      <EditorsPicks posts={picks} />
      <LatestArticles posts={latest} />
      <PopularSeries series={series} counts={counts} />
      <CategoriesSection items={getAllCategories()} />
      <TopicsSection items={getAllTopics()} />
      <NewsletterSection />
      <ProjectsSection />
    </>
  );
}
