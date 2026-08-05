'use client'

import Comment from '@/components/Comment'
import NotionPage from '@/components/NotionPage'
import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { isBrowser } from '@/lib/utils'
import { Transition } from '@headlessui/react'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import BlogItem from './components/BlogItem'
import BlogListPage from './components/BlogListPage'
import Catalog from './components/Catalog'
import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import PostLock from './components/PostLock'
import PostMeta from './components/PostMeta'
import SearchInput from './components/SearchInput'
import WorksGallery from './components/WorksGallery'
import CONFIG from './config'
import { Style } from './style'

/**
 * 基础布局：吸顶导航 + 居中内容 + 页脚
 * @returns {JSX.Element}
 */
const LayoutBase = props => {
  const { children } = props
  const { onLoading, locale } = useGlobal()

  return (
    <div
      id='theme-aurora'
      className={`${siteConfig('FONT_STYLE')} flex min-h-screen flex-col bg-white text-zinc-700 dark:bg-[#242424] dark:text-zinc-100`}>
      <Style />

      <Header {...props} />

      {/* 主体 */}
      <main className='mx-auto w-full max-w-6xl flex-1 px-6 pb-12'>
        <Transition
          show={!onLoading}
          appear={true}
          enter='transition ease-in-out duration-500 transform'
          enterFrom='opacity-0 translate-y-8'
          enterTo='opacity-100 translate-y-0'
          leave='transition ease-in-out duration-300 transform'
          leaveFrom='opacity-100 translate-y-0'
          leaveTo='opacity-0 -translate-y-8'
          unmount={false}>
          {props.slotTop}
          {children}
        </Transition>
      </main>

      <Footer {...props} />

      {/* 回到顶部 */}
      <div className='fixed bottom-6 right-6 z-10'>
        <div
          title={locale.POST.TOP}
          className='cursor-pointer rounded-full border border-zinc-200 bg-white/80 p-2 text-center text-zinc-400 backdrop-blur transition hover:text-violet-500 dark:border-zinc-700 dark:bg-[#2e2e2e]/80 dark:hover:text-violet-300'
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <i className='fas fa-angle-up px-1' />
        </div>
      </div>
    </div>
  )
}

/**
 * 首页：Hero + 作品 Gallery（不放文章列表）
 */
const LayoutIndex = props => {
  return (
    <>
      <Hero {...props} />
      <WorksGallery {...props} />
    </>
  )
}

/**
 * 文章列表（博客 / 分类 / 标签 / 分页）
 */
const LayoutPostList = props => {
  const { category, tag } = props

  return (
    <div className='mx-auto max-w-3xl pt-10'>
      {/* 列表标题 */}
      <div className='pb-6'>
        {category && (
          <h1 className='text-3xl font-bold text-zinc-900 dark:text-zinc-50'>
            <i className='fas fa-folder-open mr-2 text-violet-500 dark:text-violet-300' />
            {category}
          </h1>
        )}
        {tag && (
          <h1 className='text-3xl font-bold text-zinc-900 dark:text-zinc-50'>
            <span className='text-violet-700 dark:text-violet-300'>#{tag}</span>
          </h1>
        )}
        {!category && !tag && (
          <h1 className='text-3xl font-bold text-zinc-900 dark:text-zinc-50'>
            博客
          </h1>
        )}
      </div>

      <BlogListPage {...props} />
    </div>
  )
}

/**
 * 文章详情页
 */
const LayoutSlug = props => {
  const { post, lock, validPassword, prev, next } = props
  const router = useRouter()
  const showToc = siteConfig('AURORA_ARTICLE_TOC', true, CONFIG)
  const showPrevNext = siteConfig('AURORA_ARTICLE_PREV_NEXT', true, CONFIG)
  const waiting404 = siteConfig('POST_WAITING_TIME_FOR_404') * 1000

  useEffect(() => {
    // 404
    if (!post) {
      setTimeout(() => {
        if (isBrowser) {
          const article = document.querySelector(
            '#article-wrapper #notion-article'
          )
          if (!article) {
            router.push('/404').then(() => {
              console.warn('找不到页面', router.asPath)
            })
          }
        }
      }, waiting404)
    }
  }, [post])

  // 有目录时启用 正文 + 右侧 TOC 双栏栅格，TOC sticky 跟随滚动
  const showCatalog = showToc && post?.toc?.length > 0

  return (
    <>
      {lock ? (
        <PostLock validPassword={validPassword} />
      ) : (
        post && (
          <div
            className={`pt-10 ${
              showCatalog
                ? 'xl:grid xl:grid-cols-[minmax(0,1fr)_13rem] xl:gap-10'
                : ''
            }`}>
            <article className='mx-auto max-w-3xl'>
              <PostMeta post={post} />
              <div id='article-wrapper'>
                <NotionPage post={post} />
              </div>

              {/* 上一篇 / 下一篇 */}
              {showPrevNext && (prev || next) && (
                <nav className='mt-14 flex flex-col gap-3 border-t border-zinc-200/70 pt-8 text-sm sm:flex-row sm:justify-between dark:border-zinc-800/60'>
                  {prev ? (
                    <SmartLink
                      href={prev.href}
                      className='group max-w-full sm:max-w-[48%]'>
                      <span className='block text-xs text-zinc-400 dark:text-zinc-300'>
                        ← 上一篇
                      </span>
                      <span className='aurora-link mt-1 block truncate text-zinc-600 dark:text-zinc-100'>
                        {prev.title}
                      </span>
                    </SmartLink>
                  ) : (
                    <span />
                  )}
                  {next ? (
                    <SmartLink
                      href={next.href}
                      className='group max-w-full text-left sm:max-w-[48%] sm:text-right'>
                      <span className='block text-xs text-zinc-400 dark:text-zinc-300'>
                        下一篇 →
                      </span>
                      <span className='aurora-link mt-1 block truncate text-zinc-600 dark:text-zinc-100'>
                        {next.title}
                      </span>
                    </SmartLink>
                  ) : (
                    <span />
                  )}
                </nav>
              )}

              <Comment frontMatter={post} />
            </article>

            {/* 宽屏右侧目录：sticky 跟随滚动，滚动高亮当前章节 */}
            {showCatalog && (
              <aside className='hidden xl:block'>
                <div className='sticky top-24'>
                  <p className='mb-3 font-mono text-xs tracking-[0.25em] text-zinc-400 dark:text-zinc-300'>
                    TOC
                  </p>
                  <Catalog toc={post.toc} />
                </div>
              </aside>
            )}
          </div>
        )
      )}
    </>
  )
}

/**
 * 模糊匹配：返回命中分数（-1 未命中；0 连续包含，最优；1 子序列模糊命中）
 */
const fuzzyScore = (text, pattern) => {
  if (!text) return -1
  const t = text.toLowerCase()
  if (t.includes(pattern)) return 0
  let ti = 0
  for (let pi = 0; pi < pattern.length; pi++) {
    ti = t.indexOf(pattern[pi], ti)
    if (ti === -1) return -1
    ti++
  }
  return 1
}

/**
 * 在文章列表中做模糊搜索：空格分词，全部词命中才算命中，按分数排序
 */
const fuzzyFilterPosts = (posts, keyword) => {
  const tokens = keyword.trim().toLowerCase().split(/\s+/).filter(Boolean)
  if (tokens.length === 0) return []
  return posts
    .map(post => {
      const hay = [
        post.title,
        post.summary,
        (post.tags || []).join(' '),
        post.category || ''
      ].join(' ')
      let total = 0
      for (const token of tokens) {
        const s = fuzzyScore(hay, token)
        if (s === -1) return null
        total += s
      }
      return { post, score: total }
    })
    .filter(Boolean)
    .sort((a, b) => a.score - b.score)
    .map(r => r.post)
}

/**
 * 搜索页：纯前端即时模糊搜索（数据来自 props.allPages，无网络请求）
 */
const LayoutSearch = props => {
  const { allPages = [], keyword: routeKeyword = '' } = props
  const router = useRouter()
  const [keyword, setKeyword] = useState(routeKeyword || router?.query?.s || '')

  const posts = useMemo(
    () =>
      (allPages || []).filter(
        page => page.type === 'Post' && page.status === 'Published'
      ),
    [allPages]
  )
  const results = useMemo(
    () => fuzzyFilterPosts(posts, keyword),
    [posts, keyword]
  )
  const searching = keyword.trim().length > 0

  return (
    <div className='mx-auto max-w-3xl pt-10'>
      <SearchInput keyword={keyword} onChange={setKeyword} />

      {searching ? (
        <>
          <p className='py-6 text-sm text-zinc-400 dark:text-zinc-300'>
            找到 {results.length} 篇相关文章
          </p>
          <div id='posts-wrapper'>
            {results.map(post => (
              <BlogItem key={post.id} post={post} />
            ))}
          </div>
          {results.length === 0 && (
            <p className='py-16 text-center text-sm text-zinc-400 dark:text-zinc-300'>
              没有匹配的文章，换个关键词试试
            </p>
          )}
        </>
      ) : (
        <p className='py-20 text-center text-sm text-zinc-400 dark:text-zinc-300'>
          输入关键词，实时匹配标题 / 摘要 / 分类 / 标签
        </p>
      )}
    </div>
  )
}

/**
 * 归档页：按月份分组
 */
const LayoutArchive = props => {
  const { archivePosts } = props

  return (
    <div className='mx-auto max-w-3xl pt-10'>
      <h1 className='pb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-50'>
        归档
      </h1>
      {Object.keys(archivePosts || {}).map(archiveTitle => (
        <div key={archiveTitle} className='pb-8'>
          <h2
            id={archiveTitle}
            className='border-l-2 border-violet-400 pl-3 text-lg font-semibold text-zinc-800 dark:border-violet-500 dark:text-zinc-100'>
            {archiveTitle}
          </h2>
          <ul className='mt-3 space-y-2 pl-4'>
            {archivePosts[archiveTitle].map(post => (
              <li
                key={post.id}
                id={post?.publishDay}
                className='flex items-baseline gap-3 text-sm'>
                <span className='shrink-0 font-mono text-xs text-zinc-400 dark:text-zinc-300'>
                  {post?.publishDay}
                </span>
                <SmartLink
                  href={post?.href}
                  className='aurora-link truncate text-zinc-600 dark:text-zinc-100'>
                  {post.title}
                </SmartLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

/**
 * 分类索引页：分类卡片 + 下方标签云
 */
const LayoutCategoryIndex = props => {
  const { categoryOptions, tagOptions } = props

  return (
    <div className='mx-auto max-w-3xl pt-10'>
      <h1 className='pb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-50'>
        分类
      </h1>
      <div className='grid gap-4 sm:grid-cols-3'>
        {categoryOptions?.map(category => (
          <SmartLink
            key={category.name}
            href={`/category/${category.name}`}
            className='group flex items-center justify-between rounded-xl border border-zinc-200/80 px-5 py-4 transition hover:-translate-y-0.5 hover:border-violet-400/60 dark:border-zinc-800 dark:hover:border-violet-500/50'>
            <span className='text-zinc-700 dark:text-zinc-100'>
              <i className='fas fa-folder-open mr-2 text-xs text-violet-500 dark:text-violet-300' />
              {category.name}
            </span>
            <span className='font-mono text-xs text-zinc-400 dark:text-zinc-300'>
              {category.count}
            </span>
          </SmartLink>
        ))}
      </div>

      {/* 标签 */}
      {tagOptions?.length > 0 && (
        <div className='mt-10 border-t border-zinc-200/70 pt-10 dark:border-zinc-800/60'>
          <h2 className='pb-6 text-3xl font-bold text-zinc-900 dark:text-zinc-50'>
            标签
          </h2>
          <div className='flex flex-wrap gap-3'>
            {tagOptions.map(tag => (
              <SmartLink
                key={tag.name}
                href={`/tag/${encodeURIComponent(tag.name)}`}
                className='rounded-full border border-zinc-200 px-3.5 py-1 text-sm text-zinc-500 transition hover:border-violet-400 hover:text-violet-600 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-violet-500 dark:hover:text-violet-300'>
                #{tag.name}
                {tag.count ? ` (${tag.count})` : ''}
              </SmartLink>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * 标签索引页
 */
const LayoutTagIndex = props => {
  const { tagOptions } = props

  return (
    <div className='mx-auto max-w-3xl pt-10'>
      <h1 className='pb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-50'>
        标签
      </h1>
      <div className='flex flex-wrap gap-3'>
        {tagOptions?.map(tag => (
          <SmartLink
            key={tag.name}
            href={`/tag/${encodeURIComponent(tag.name)}`}
            className='rounded-full border border-zinc-200 px-3.5 py-1 text-sm text-zinc-500 transition hover:border-violet-400 hover:text-violet-600 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-violet-500 dark:hover:text-violet-300'>
            #{tag.name}
            {tag.count ? ` (${tag.count})` : ''}
          </SmartLink>
        ))}
      </div>
    </div>
  )
}

/**
 * 404 页
 */
const Layout404 = props => {
  const router = useRouter()
  useEffect(() => {
    // 延时3秒如果加载失败就返回首页
    setTimeout(() => {
      const article = isBrowser && document.getElementById('article-wrapper')
      if (!article) {
        router.push('/')
      }
    }, 3000)
  }, [])

  return (
    <div className='flex h-[70vh] flex-col items-center justify-center text-center'>
      <p className='text-7xl font-bold text-zinc-300 dark:text-zinc-600'>404</p>
      <p className='mt-4 text-sm text-zinc-400 dark:text-zinc-300'>
        页面无法加载，即将返回首页
      </p>
      <SmartLink
        href='/'
        className='mt-6 rounded-full border border-zinc-200 px-5 py-2 text-sm text-zinc-600 transition hover:border-violet-400 hover:text-violet-600 dark:border-zinc-700 dark:text-zinc-100 dark:hover:border-violet-500 dark:hover:text-violet-300'>
        返回首页
      </SmartLink>
    </div>
  )
}

export {
  Layout404,
  LayoutArchive,
  LayoutBase,
  LayoutCategoryIndex,
  LayoutIndex,
  LayoutPostList,
  LayoutSearch,
  LayoutSlug,
  LayoutTagIndex,
  CONFIG as THEME_CONFIG
}
