"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, BookOpenCheck, Play, Radio, RefreshCcw, ShieldCheck, Youtube } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientTime } from "@/components/ui/client-time";
import { brand } from "@/lib/constants";
import { youtubeVideos } from "@/lib/mock-market-data";

interface YouTubeVideo {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  publishedAt?: string;
  duration?: string;
  views?: string;
  topic: string;
}

interface YouTubeFeedResponse {
  channelUrl: string;
  videosUrl: string;
  source: "youtube-rss" | "fallback";
  videos: YouTubeVideo[];
}

const lessonTracks = ["Liquidity sweep", "RSI confirmation", "Risk planning", "Trade psychology"];

const fallbackVideos: YouTubeVideo[] = youtubeVideos.map((video) => ({
  ...video,
  url: brand.youtubeVideosUrl,
  thumbnail: "",
  publishedAt: ""
}));

export function YouTubeChannel() {
  const [videos, setVideos] = useState<YouTubeVideo[]>(fallbackVideos);
  const [source, setSource] = useState<YouTubeFeedResponse["source"]>("fallback");
  const [isLoading, setIsLoading] = useState(true);
  const featuredVideo = videos[0];
  const videoEmbedUrl = useMemo(
    () => (source === "youtube-rss" && featuredVideo ? `https://www.youtube.com/embed/${featuredVideo.id}` : ""),
    [featuredVideo, source]
  );

  useEffect(() => {
    let cancelled = false;

    async function loadVideos() {
      setIsLoading(true);

      try {
        const response = await fetch("/api/youtube/videos", { cache: "no-store" });

        if (!response.ok) {
          throw new Error(`YouTube feed returned ${response.status}`);
        }

        const payload = (await response.json()) as YouTubeFeedResponse;

        if (!cancelled) {
          setVideos(payload.videos.length ? payload.videos : fallbackVideos);
          setSource(payload.source);
        }
      } catch {
        if (!cancelled) {
          setVideos(fallbackVideos);
          setSource("fallback");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadVideos();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="grid gap-4">
      <section className="relative overflow-hidden rounded-lg border border-white/10 bg-[#080a0d] p-6 shadow-glow md:p-8">
        <div className="absolute inset-0 market-grid bg-market-grid opacity-30" />
        <div className="relative grid gap-6 lg:grid-cols-[1fr_440px] lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="bearish">
                <Youtube className="mr-1 size-3" />
                YouTube Learning Desk
              </Badge>
              <Badge variant="outline">{brand.youtubeHandle}</Badge>
              <Badge variant={source === "youtube-rss" ? "bullish" : "outline"}>
                {isLoading ? "Loading videos" : source === "youtube-rss" ? "Latest videos loaded" : "Channel link ready"}
              </Badge>
            </div>
            <h1 className="mt-5 text-4xl font-black tracking-normal md:text-6xl">
              <span className="brand-word-primary">HEIST</span>{" "}
              <span className="brand-word-accent">STOKER</span>
            </h1>
            <p className="mt-3 text-lg font-semibold text-gold">{brand.tagline}</p>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/68 md:text-base">
              Connect your YouTube lessons with scanner practice, paper trades, and daily journal review.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {lessonTracks.map((track) => (
                <span
                  key={track}
                  className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white/72"
                >
                  {track}
                </span>
              ))}
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild>
                <a href={brand.youtubeUrl} target="_blank" rel="noreferrer">
                  <Youtube />
                  Open Channel
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href={brand.youtubeVideosUrl} target="_blank" rel="noreferrer">
                  <ArrowUpRight />
                  All Videos
                </a>
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-black/55 p-4">
            <div className="overflow-hidden rounded-md border border-red-500/25 bg-red-500/10">
              {videoEmbedUrl ? (
                <iframe
                  className="aspect-video w-full"
                  src={videoEmbedUrl}
                  title={featuredVideo?.title ?? "HEIST STOKER YouTube video"}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <a
                  href={brand.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="grid aspect-video place-items-center"
                >
                  <div className="grid size-16 place-items-center rounded-full bg-red-500 text-white">
                    <Play className="size-7 fill-current" />
                  </div>
                </a>
              )}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-md border border-white/10 bg-white/[0.03] p-3">
                <BookOpenCheck className="size-4 text-gold" />
                <p className="mt-2 text-sm font-bold text-white">Structured Lessons</p>
              </div>
              <div className="rounded-md border border-white/10 bg-white/[0.03] p-3">
                <ShieldCheck className="size-4 text-bullish" />
                <p className="mt-2 text-sm font-bold text-white">Paper First</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">Latest Channel Videos</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {source === "youtube-rss" ? "Pulled from your YouTube channel feed." : "Open your channel to view current uploads."}
          </p>
        </div>
        <Button asChild variant="outline">
          <a href={brand.youtubeVideosUrl} target="_blank" rel="noreferrer">
            <RefreshCcw />
            View on YouTube
          </a>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {videos.map((video) => (
          <a key={video.id} href={video.url || brand.youtubeVideosUrl} target="_blank" rel="noreferrer">
            <Card className="h-full overflow-hidden border-white/10 bg-black/35 transition-colors hover:border-red-500/35 hover:bg-red-500/10">
              <div className="relative grid aspect-video place-items-center bg-gradient-to-br from-red-500/20 via-black to-gold/15">
                {video.thumbnail ? (
                  <div
                    aria-label={video.title}
                    className="h-full w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${video.thumbnail})` }}
                  />
                ) : (
                  <div className="grid size-14 place-items-center rounded-full border border-red-500/50 bg-black/70 text-red-400">
                    <Play className="size-6 fill-current" />
                  </div>
                )}
                <div className="absolute inset-0 grid place-items-center bg-black/20 opacity-0 transition-opacity hover:opacity-100">
                  <div className="grid size-12 place-items-center rounded-full bg-red-500 text-white">
                    <Play className="size-5 fill-current" />
                  </div>
                </div>
              </div>
              <CardHeader>
                <CardTitle>{video.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
                <span>
                  {video.publishedAt ? <ClientTime value={video.publishedAt} format="date" /> : video.duration ?? "YouTube"}
                </span>
                <span>{video.views ? `${video.views} views` : brand.youtubeHandle}</span>
                <Badge variant="secondary">
                  <Radio className="mr-1 size-3" />
                  {video.topic}
                </Badge>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
}
