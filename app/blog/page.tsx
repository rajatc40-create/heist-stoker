import { BlogSection } from "@/components/features/blog/blog-section";
import { AppShell } from "@/components/layout/app-shell";

export default function BlogPage() {
  return (
    <AppShell title="Blog" subtitle="Smart money, options, scanner, and psychology learning notes.">
      <BlogSection />
    </AppShell>
  );
}
