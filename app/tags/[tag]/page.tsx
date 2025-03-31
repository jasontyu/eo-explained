import fs from "fs"
import path from "path"
import matter from "gray-matter"
import Link from "next/link"
import { compareDesc, format, parseISO } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { getTagDescription } from "@/lib/tag-descriptions"

interface TagPageProps {
  params: {
    tag: string
  }
}

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

export function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), "posts")
  const filenames = fs.readdirSync(postsDirectory)

  const allTags = new Set<string>()

  filenames.forEach((filename) => {
    const filePath = path.join(postsDirectory, filename)
    const fileContents = fs.readFileSync(filePath, "utf8")
    const { data } = matter(fileContents)

    if (data.tags && Array.isArray(data.tags)) {
      data.tags.forEach((tag: string) => allTags.add(tag))
    }
  })

  return Array.from(allTags).map((tag) => ({
    tag,
  }))
}

export default function TagPage({ params }: TagPageProps) {
  const { tag } = params

  // Get all posts
  const postsDirectory = path.join(process.cwd(), "posts")
  const filenames = fs.readdirSync(postsDirectory)

  const allPosts: Post[] = filenames.map((filename) => {
    const filePath = path.join(postsDirectory, filename)
    const fileContents = fs.readFileSync(filePath, "utf8")
    const { data, content } = matter(fileContents)

    return {
      slug: filename.replace(".md", ""),
      frontmatter: data as Post["frontmatter"],
    }
  })

  // Filter posts by tag
  const posts = allPosts.filter((post) => post.frontmatter.tags && post.frontmatter.tags.includes(tag))

  // Sort posts by date
  const sortedPosts = posts.sort((a, b) => {
    return compareDesc(parseISO(a.frontmatter.date), parseISO(b.frontmatter.date))
  })

  // Get the tag description
  const tagDescription = getTagDescription(tag)

  return (
    <div className="container max-w-4xl py-10">
      <Button variant="ghost" asChild className="mb-6 pl-0 hover:pl-0">
        <Link href="/" className="flex items-center gap-1">
          <ChevronLeft className="h-4 w-4" />
          Back to all posts
        </Link>
      </Button>

      <header className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Posts tagged with "{tag}"</h1>
        <p className="text-muted-foreground mb-4">
          {posts.length} post{posts.length !== 1 ? "s" : ""}
        </p>
        <div className="bg-muted/50 p-4 rounded-lg border border-border">
          <p className="text-muted-foreground">{tagDescription}</p>
        </div>
      </header>

      <div className="space-y-10">
        {sortedPosts.map((post) => (
          <article key={post.slug} className="border-b pb-8 last:border-0">
            <Link href={`/posts/${post.slug}`}>
              {post.frontmatter.coverImage && (
                <div className="mb-4 overflow-hidden rounded-lg">
                  <img
                    src={post.frontmatter.coverImage || "/placeholder.svg"}
                    alt={post.frontmatter.title}
                    className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
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

