'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { blogPosts } from '@/lib/content';
import { ArrowLeft, Clock, Calendar, Share2, Tag, ShieldCheck } from "@/components/icons";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = use(params);
  const post = blogPosts.find((p) => p.slug === resolvedParams.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="py-16 md:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Back button */}
      <Link
        href="/blog"
        className="inline-flex items-center space-x-2 text-xs font-semibold text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to all articles</span>
      </Link>

      {/* Header */}
      <header className="mb-10 space-y-4">
        <div className="flex items-center space-x-3">
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            {post.category}
          </span>
          <div className="flex items-center space-x-1.5 text-xs text-zinc-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{post.readTime}</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight">
          {post.title}
        </h1>

        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {post.summary}
        </p>

        {/* Author Info */}
        <div className="flex items-center space-x-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h4 className="font-bold text-sm text-zinc-900 dark:text-white">
              {post.author.name}
            </h4>
            <p className="text-xs text-zinc-500">{post.author.role} • {post.date}</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="prose dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed space-y-6 text-zinc-700 dark:text-zinc-300">
        <div className="whitespace-pre-line font-sans">
          {post.content}
        </div>
      </div>

      {/* Footer Share & CTA */}
      <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2 text-xs text-zinc-500">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Written by Shipra Core Engineering</span>
        </div>

        <Link
          href="/dashboard/upload"
          className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-500/20"
        >
          Try Shipra Free Today
        </Link>
      </div>
    </article>
  );
}
