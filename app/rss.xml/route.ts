import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { compareDesc, format, parseISO } from "date-fns"
import { getSiteUrl, siteConfig } from "@/lib/config"
import { remark } from "remark"
import html from "remark-html"

// Function to convert markdown to HTML
async function markdownToHtml(markdown: string) {
  const result = await remark().use(html).process(markdown)
  return result.toString()
}

export async function GET() {
  // Get all posts
  const postsDirectory = path.join(process.cwd(), "posts")
  const filenames = fs.readdirSync(postsDirectory)

  const postsPromises = filenames.map(async (filename) => {
    const filePath = path.join(postsDirectory, filename)
    const fileContents = fs.readFileSync(filePath, "utf8")
    const { data, content } = matter(fileContents)

    // Convert markdown content to HTML
    const contentHtml = await markdownToHtml(content)

    return {
      slug: filename.replace(".md", ""),
      frontmatter: data as {
        title: string
        date: string
        excerpt: string
        tags: string[]
      },
      content: contentHtml,
    }
  })

  const posts = await Promise.all(postsPromises)

  // Sort posts by date
  const sortedPosts = posts.sort((a, b) => {
    return compareDesc(parseISO(a.frontmatter.date), parseISO(b.frontmatter.date))
  })

  // Get the site URL from our config
  const site_url = getSiteUrl()

  const rssItems = sortedPosts
    .map((post) => {
      const postUrl = `${site_url}/posts/${post.slug}`
      const pubDate = format(parseISO(post.frontmatter.date), "EEE, dd MMM yyyy HH:mm:ss xx")

      return `
      <item>
        <title><![CDATA[${post.frontmatter.title}]]></title>
        <link>${postUrl}</link>
        <guid isPermaLink="true">${postUrl}</guid>
        <pubDate>${pubDate}</pubDate>
        <description><![CDATA[${post.frontmatter.excerpt}]]></description>
        <content:encoded><![CDATA[${post.content}]]></content:encoded>
      </item>
    `.trim()
    })
    .join("\n")

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteConfig.name}</title>
    <link>${site_url}</link>
    <description>${siteConfig.description}</description>
    <language>${siteConfig.defaultLanguage}</language>
    <lastBuildDate>${format(new Date(), "EEE, dd MMM yyyy HH:mm:ss xx")}</lastBuildDate>
    <atom:link href="${site_url}/rss.xml" rel="self" type="application/rss+xml"/>
    ${rssItems}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  })
}

