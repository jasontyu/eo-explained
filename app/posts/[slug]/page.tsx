import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { format, parseISO } from "date-fns"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { PostContent } from "@/components/post-content"

interface PostPageProps {
  params: {
    slug: string
  }
}

export function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), "posts")
  const filenames = fs.readdirSync(postsDirectory)

  return filenames.map((filename) => ({
    slug: filename.replace(".md", ""),
  }))
}

export default function PostPage({ params }: PostPageProps) {
  const { slug } = params
  const filePath = path.join(process.cwd(), "posts", `${slug}.md`)

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    return notFound()
  }

  // Read and parse the markdown file
  const fileContents = fs.readFileSync(filePath, "utf8")
  const { data, content } = matter(fileContents)
  const frontmatter = data as {
    title: string
    date: string
    tags: string[]
    coverImage?: string
  }

  return (
    <div className="container max-w-3xl py-10">
      <Button variant="ghost" asChild className="mb-6 pl-0 hover:pl-0">
        <Link href="/" className="flex items-center gap-1">
          <ChevronLeft className="h-4 w-4" />
          Back to all posts
        </Link>
      </Button>

      <article>
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{frontmatter.title}</h1>
          <div className="text-sm text-muted-foreground mb-4">
            {format(parseISO(frontmatter.date), "MMMM dd, yyyy")}
          </div>

          {frontmatter.tags && (
            <div className="flex flex-wrap gap-2">
              {frontmatter.tags.map((tag) => (
                <Link href={`/tags/${tag}`} key={tag}>
                  <Badge variant="secondary">{tag}</Badge>
                </Link>
              ))}
            </div>
          )}
        </header>

        {/* No images displayed in post detail */}

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <PostContent content={content} />
        </div>
      </article>
    </div>
  )
}

