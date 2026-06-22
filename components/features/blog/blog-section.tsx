import { ArrowUpRight, BookOpenCheck } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { blogPosts } from "@/lib/platform-content";

export function BlogSection() {
  return (
    <div className="grid gap-4">
      <Card className="border-gold/20 bg-black/35">
        <CardHeader>
          <CardTitle>Blog Section</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">Educational posts for smart money, options, and psychology learning.</p>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {blogPosts.map((post) => (
            <article key={post.title} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
              <BookOpenCheck className="size-5 text-gold" />
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge>{post.category}</Badge>
                <Badge variant="outline">{post.readTime}</Badge>
              </div>
              <h2 className="mt-4 text-lg font-bold text-white">{post.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{post.summary}</p>
            </article>
          ))}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-black/35">
        <CardContent className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-bold text-white">Convert YouTube lessons into blog notes.</p>
            <p className="mt-1 text-sm text-muted-foreground">Use the YouTube academy page for current videos and class topics.</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/youtube">
              <ArrowUpRight />
              YouTube Academy
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
