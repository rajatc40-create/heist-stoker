import { NextResponse } from "next/server";
import { brand } from "@/lib/constants";
import { youtubeVideos } from "@/lib/mock-market-data";

export const dynamic = "force-dynamic";

interface YouTubeVideo {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  publishedAt: string;
  topic: string;
}

const CHANNEL_URL = brand.youtubeUrl;

export async function GET() {
  try {
    const channelId = await resolveChannelId();
    const videos = channelId ? await fetchLatestVideos(channelId) : [];

    if (videos.length) {
      return NextResponse.json({
        channelUrl: brand.youtubeUrl,
        videosUrl: brand.youtubeVideosUrl,
        source: "youtube-rss",
        videos
      });
    }
  } catch (error) {
    console.error("YouTube feed unavailable", error);
  }

  return NextResponse.json({
    channelUrl: brand.youtubeUrl,
    videosUrl: brand.youtubeVideosUrl,
    source: "fallback",
    videos: youtubeVideos.map((video) => ({
      ...video,
      url: brand.youtubeVideosUrl,
      thumbnail: "",
      publishedAt: ""
    }))
  });
}

async function resolveChannelId() {
  const response = await fetch(CHANNEL_URL, {
    headers: {
      "user-agent": "Mozilla/5.0 HEIST-STOKER-education-platform"
    },
    next: { revalidate: 60 * 60 }
  });

  if (!response.ok) {
    throw new Error(`Channel page returned ${response.status}`);
  }

  const html = await response.text();
  const patterns = [
    /"channelId":"(UC[^"]+)"/,
    /"externalId":"(UC[^"]+)"/,
    /<meta itemprop="channelId" content="(UC[^"]+)">/
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  return null;
}

async function fetchLatestVideos(channelId: string): Promise<YouTubeVideo[]> {
  const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  const response = await fetch(feedUrl, {
    headers: {
      "user-agent": "Mozilla/5.0 HEIST-STOKER-education-platform"
    },
    next: { revalidate: 60 * 15 }
  });

  if (!response.ok) {
    throw new Error(`Video feed returned ${response.status}`);
  }

  const xml = await response.text();
  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].slice(0, 6);

  return entries
    .map((entry) => {
      const block = entry[1];
      const videoId = readTag(block, "yt:videoId");
      const title = decodeXml(readTag(block, "title"));
      const publishedAt = readTag(block, "published");

      if (!videoId || !title) {
        return null;
      }

      return {
        id: videoId,
        title,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        publishedAt,
        topic: detectTopic(title)
      };
    })
    .filter((video): video is YouTubeVideo => Boolean(video));
}

function readTag(source: string, tag: string) {
  const escapedTag = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = source.match(new RegExp(`<${escapedTag}>([\\s\\S]*?)<\\/${escapedTag}>`));
  return match?.[1]?.trim() ?? "";
}

function decodeXml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function detectTopic(title: string) {
  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes("liquidity")) {
    return "Liquidity";
  }

  if (lowerTitle.includes("rsi")) {
    return "RSI";
  }

  if (lowerTitle.includes("psychology") || lowerTitle.includes("fear") || lowerTitle.includes("fomo")) {
    return "Psychology";
  }

  if (lowerTitle.includes("wave")) {
    return "Wave Theory";
  }

  return "Lesson";
}
