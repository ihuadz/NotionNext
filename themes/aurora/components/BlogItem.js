import NotionIcon from '@/components/NotionIcon'
import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'

/**
 * 博客列表单条：日期 + 标题 + 摘要 + 分类/标签（纯文字极简）
 */
const BlogItem = ({ post }) => {
  if (!post) return null
  const date = post.date?.start_date || post.createdTime

  return (
    <article className='group border-b border-zinc-200/70 py-5 dark:border-zinc-800/60'>
      {/* 标题 */}
      <h2 className='mt-1'>
        <SmartLink
          href={post?.href}
          className='aurora-link text-lg font-semibold text-zinc-800 md:text-lg dark:text-zinc-100'>
          {siteConfig('POST_TITLE_ICON') && <NotionIcon icon={post.pageIcon} />}
          {post?.title}
        </SmartLink>
      </h2>

      {/* 摘要 / 搜索结果 */}
      {!post.results && post?.summary && (
        <p className='mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-200'>
          {post.summary}
        </p>
      )}
      {post.results && (
        <p className='mt-2 line-clamp-3 text-sm leading-relaxed text-zinc-500 dark:text-zinc-200'>
          {post.results.map((r, index) => (
            <span key={index}>{r}</span>
          ))}
        </p>
      )}

      {/* 分类与标签 */}
      <div className='mt-3 flex flex-wrap items-center gap-2 text-xs font-medium'>
        {/* 日期 */}
        <time className='font-mono text-xs font-medium tracking-wider text-zinc-400 dark:text-zinc-300'>
          {date}
        </time>
        {post?.category && (
          <SmartLink
            href={`/category/${post.category}`}
            className='rounded-full bg-zinc-100 px-2.5 py-0.5 text-zinc-500 transition hover:bg-violet-50 hover:text-violet-600 dark:bg-zinc-800/80 dark:text-zinc-200 dark:hover:bg-violet-900/30 dark:hover:text-violet-300'>
            {post.category}
          </SmartLink>
        )}
        {post?.tags?.map(tag => (
          <SmartLink
            key={tag}
            href={`/tag/${encodeURIComponent(tag)}`}
            className='text-zinc-400 transition hover:text-violet-500 dark:text-zinc-300 dark:hover:text-violet-300'>
            #{tag}
          </SmartLink>
        ))}
      </div>
    </article>
  )
}

export default BlogItem
