"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { NotionRenderer } from "@notion-render/client";
import hljsPlugin from "@notion-render/hljs-plugin";
import bookmarkPlugin from "@notion-render/bookmark-plugin";

import Link from "next/link";

import Image from "next/image";

interface PostData {
  id: string;
  title: string;
  date: string;
  tags: string[];
  image_url: string;
  slug: string;
  author: string;
}

interface MorePost {
  title: string;
  date: string;
  excerpt: string;
  image_url: string;
  slug: string;
}

export default function PostPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [post, setPost] = useState<PostData | null>(null);
  const [htmlContent, setHtmlContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        // Fetch main post data
        const postRes = await fetch(`/api?action=getBySlug&slug=${slug}`);
        const postData = await postRes.json();

        // Fetch blocks and render
        const blocksRes = await fetch(
          `/api?action=getBlocks&pageId=${postData.id}`
        );
        const blocks = await blocksRes.json();

        // Initialize renderer
        const renderer = new NotionRenderer();
        renderer.use(hljsPlugin({}));
        renderer.use(bookmarkPlugin(undefined));
        const html = await renderer.render(...blocks);

        setPost(postData);
        setHtmlContent(html);
        console.log(html);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="w-full h-[80vh] flex justify-center items-center">
        Loading...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="w-full h-[80vh] flex justify-center items-center">
        Page not found
      </div>
    );
  }
  return (
    
    <div className="backdrop-blur-md bg-white/30 dark:bg-black/30 rounded-xl shadow-lg p-6 border border-white/20 mx-8">
      <div
        className="prose notion-render"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      ></div>
    </div>
  );
}
