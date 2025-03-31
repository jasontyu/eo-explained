import fs from "fs"
import path from "path"
import matter from "gray-matter"
import Link from "next/link"
import { compareDesc, format, parseISO } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Rss } from "lucide-react"
import { siteConfig } from "@/lib/config"

interface Post {
  slug: string
  frontmatter: {
    title: string
    date: string
    excerpt: string
    tags: string[]
    coverImage?: string
  }
}

export default function Home() {
  // Get all posts
  const postsDirectory = path.join(process.cwd(), "posts")
  const filenames = fs.readdirSync(postsDirectory)

  const posts: Post[] = filenames.map((filename) => {
    const filePath = path.join(postsDirectory, filename)
    const fileContents = fs.readFileSync(filePath, "utf8")
    const { data, content } = matter(fileContents)

    return {
      slug: filename.replace(".md", ""),
      frontmatter: data as Post["frontmatter"],
    }
  })

  // Sort posts by date
  const sortedPosts = posts.sort((a, b) => {
    return compareDesc(parseISO(a.frontmatter.date), parseISO(b.frontmatter.date))
  })

  // Get all unique tags and count posts for each tag
  const tagCounts: Record<string, number> = {}

  posts.forEach((post) => {
    if (post.frontmatter.tags) {
      post.frontmatter.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })
    }
  })

  const allTags = Object.keys(tagCounts).sort()

  return (
    <div className="container max-w-4xl py-10">
      <header className="mb-10">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-4xl font-bold">{siteConfig.name}</h1>
          <Link
            href="/rss.xml"
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Rss className="h-4 w-4" />
            <span className="text-sm">RSS</span>
          </Link>
        </div>
        <p className="text-muted-foreground text-lg">{siteConfig.description}</p>
      </header>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Browse by tag</h2>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <Link href={`/tags/${tag}`} key={tag}>
              <Badge variant="outline" className="hover:bg-secondary transition-colors">
                <span>{tag}</span>
                <span className="ml-1.5 text-xs px-1.5 py-0.5 bg-muted rounded-full">{tagCounts[tag]}</span>
              </Badge>
            </Link>
          ))}
        </div>
      </div>

      <div className="space-y-10">
        {sortedPosts.map((post) => (
          <article key={post.slug} className="border-b pb-8 last:border-0">
            <Link href={`/posts/${post.slug}`}>
              <h2 className="text-2xl font-bold mb-2 hover:text-primary transition-colors">{post.frontmatter.title}</h2>
            </Link>
            <div className="text-sm text-muted-foreground mb-3">
              {format(parseISO(post.frontmatter.date), "MMMM dd, yyyy")}
            </div>
            <p className="text-muted-foreground mb-4">{post.frontmatter.excerpt}</p>
            <div className="flex flex-wrap gap-2">
              {post.frontmatter.tags?.map((tag) => (
                <Link href={`/tags/${tag}`} key={tag}>
                  <Badge variant="secondary" className="hover:bg-secondary/80 transition-colors">
                    {tag}
                  </Badge>
                </Link>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

