"use client";

import { useState, useEffect } from "react";
import { Post } from "@/types/Post";

interface NotionPage {

  properties: {
    Name : { title: Array<{ text: {
      content: string;
    } }> };
    Date: { created_time: string };
    Tags: { multi_select: Array<{ name: string }> };
    slug: { rich_text: Array<{ plain_text: string }> };
  };
  cover?: {
    external?: { url: string };
    file?: { url: string };
  };
}

export default function Home() {
  const [posts, setPosts] = useState([] as Post[]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api?action=list")
      .then((res) => res.json())
      .then((data) => {
        const transformedPosts: Post[] = data.results.map(
          (item: NotionPage) => ({
            title: item.properties.Name.title[0].text.content || "",
            date: new Date(
              item.properties.Date.created_time
            ).toLocaleDateString("en-US", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
            tags: item.properties.Tags.multi_select.map(
              (tag: { name: string }) => tag.name
            ),
            image_url: item.cover?.external?.url || item.cover?.file?.url || "",
            slug: item.properties.slug.rich_text[0]?.plain_text || "",
          })
        );
        setPosts(transformedPosts);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-8 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post.slug}
            className="group bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1.5 relative overflow-hidden"
          >
            {/* Image container with gradient overlay */}
            {post.image_url && (
              <div className="relative h-48 mb-4 rounded-xl overflow-hidden">
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 via-blue-800/30 to-pink-900/20" />
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-pink-500/30 text-pink-100 rounded-full text-sm font-semibold backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Date */}
            <p className="text-blue-300 font-mono text-sm mb-2">{post.date}</p>

            {/* Title */}
            <h3 className="text-white text-2xl font-bold mb-4 leading-snug">
              {post.title}
            </h3>

            {/* Read More Button */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-pink-400 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity" />
              <a
                href={`/p/${post.slug}`}
                className="relative inline-block px-6 py-2 bg-white/5 rounded-lg text-white font-semibold hover:bg-white/10 transition-colors border border-white/20"
              >
                Read More →
              </a>
            </div>
          </div>
        ))}
      </div>

      {loading && (
        <div className="text-center text-blue-200/80 mt-8 text-lg font-medium">
          <div className="animate-pulse">Loading articles...</div>
        </div>
      )}
    </div>
  );
}