import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import BlogItem from './BlogItem'
import Pagination from './Pagination'

/**
 * 取文章发布年份（无法解析时返回空串）
 */
const getYear = post => {
  const d = post?.date?.start_date || post?.publishDate || post?.createdTime
  const t = new Date(d)
  return Number.isNaN(t.getTime()) ? '' : String(t.getFullYear())
}

/**
 * 分页博客列表：按年份分组，年份变化处插入年份标题
 */
const BlogListPage = props => {
  const { page = 1, posts, postCount } = props
  const { NOTION_CONFIG } = useGlobal()
  const totalPage = Math.ceil(
    postCount / siteConfig('POSTS_PER_PAGE', null, NOTION_CONFIG)
  )

  // 文章按时间倒序，年份天然连续，遇变化即开新组
  const groups = []
  posts?.forEach(post => {
    const year = getYear(post)
    const last = groups[groups.length - 1]
    if (last && last.year === year) {
      last.posts.push(post)
    } else {
      groups.push({ year, posts: [post] })
    }
  })

  return (
    <div className='w-full'>
      <div id='posts-wrapper'>
        {groups.map((group, index) => (
          <section key={group.year || index}>
            {group.year && (
              <div
                className={`flex items-center gap-4 ${index === 0 ? 'pt-1' : 'pt-8'}`}>
                <h2 className='font-mono text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50'>
                  {group.year}
                </h2>
                <span className='h-px flex-1 bg-zinc-200 dark:bg-zinc-800' />
              </div>
            )}
            {group.posts.map(post => (
              <BlogItem key={post.id} post={post} />
            ))}
          </section>
        ))}
      </div>
      <Pagination page={page} totalPage={totalPage} />
    </div>
  )
}

export default BlogListPage
