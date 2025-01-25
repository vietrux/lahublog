import { fetchBySlug, fetchPagesBlocks, notion } from "@/lib/notion";
import bookmarkPlugin from "@notion-render/bookmark-plugin";
import { NotionRenderer } from "@notion-render/client";
import hljsPlugin from "@notion-render/hljs-plugin";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const page = await fetchBySlug(Array.isArray(slug) ? slug[0] : slug || "");

  if (!page) return { title: "Not Found" };

  const title = (
    page.properties.Name as { title: Array<{ text: { content: string } }> }
  ).title[0]?.text.content;
  const description =
    (
      page.properties.Description as {
        rich_text: Array<{ plain_text: string }>;
      }
    )?.rich_text[0]?.plain_text || "";
  const publishedTime = (page.properties.Date as { created_time: string })
    .created_time;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug) {
    return <div>Invalid slug</div>;
  }

  const page = await fetchBySlug(slug);
  if (!page) {
    return <div>Not found</div>;
  }

  const blocks = await fetchPagesBlocks(page.id);
  const renderer = new NotionRenderer({
    client: notion,
  });

  renderer.use(hljsPlugin({}));
  renderer.use(bookmarkPlugin(undefined));

  const html = await renderer.render(...blocks);

  const title = (
    page.properties.Name as { title: Array<{ text: { content: string } }> }
  ).title[0]?.text.content;
  const publishedTime = (page.properties.Date as { created_time: string })
    .created_time;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    datePublished: publishedTime,
  };

  return (
    <>
    <div className="p-8 bg-black/10 m-8 rounded-2xl shadow-lg backdrop-blur-sm">
      <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="prose notion-render" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
    </>
  );
}
