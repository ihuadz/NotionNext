import NotionIcon from '@/components/NotionIcon'
import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'

/**
 * 文章页头部：标题 + 日期/分类/标签/最后编辑
 */
const PostMeta = ({ post }) => {
  const { locale } = useGlobal()
  if (!post) return null

  return (
    <header className='mb-3 pb-3 border-b border-zinc-100/70 dark:border-zinc-500/60'>
      <h1 className='text-2xl font-bold leading-snug text-zinc-900 md:text-3xl dark:text-zinc-50'>
        {siteConfig('POST_TITLE_ICON') && <NotionIcon icon={post.pageIcon} />}
        {post.title}
      </h1>

      <div className='mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-400 dark:text-zinc-300'>
        {post?.publishDay && (
          <time className='font-mono text-xs font-medium tracking-wider'>
            {locale.COMMON.POST_TIME}: {post.publishDay}
          </time>
        )}
        {post?.type !== 'Page' && post?.wordCount && (
          <span>
            {locale.COMMON.WORD_COUNT}: {post.wordCount}
          </span>
        )}
        {post?.type !== 'Page' && post?.readTime && (
          <span>
            {locale.COMMON.READ_TIME}: {post.readTime} {locale.COMMON.MINUTE}
          </span>
        )}
        {post?.type !== 'Page' && post?.lastEditedDay && (
          <span>
            {locale.COMMON.LAST_EDITED_TIME}: {post.lastEditedDay}
          </span>
        )}
      </div>

      {post?.tags?.length > 0 && (
        <div className='mt-3 flex flex-wrap gap-2 text-xs font-medium'>
          {post?.category && (
            <SmartLink
              href={`/category/${post.category}`}
              className='rounded-full bg-zinc-100 px-2.5 py-0.5 text-zinc-500 transition hover:text-violet-600 dark:bg-zinc-500/80 dark:text-zinc-200 dark:hover:text-violet-300'>
              {post.category}
            </SmartLink>
          )}
          {post.tags.map(tag => (
            <SmartLink
              key={tag}
              href={`/tag/${encodeURIComponent(tag)}`}
              className='text-zinc-400 transition  py-0.5 hover:text-violet-500 dark:text-zinc-300 dark:hover:text-violet-300'>
              #{tag}
            </SmartLink>
          ))}
        </div>
      )}
    </header>
  )
}

export default PostMeta
