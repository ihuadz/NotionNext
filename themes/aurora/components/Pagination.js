import SmartLink from '@/components/SmartLink'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'

/**
 * 极简分页：上一页 / 页码 / 下一页
 */
const Pagination = ({ page = 1, totalPage = 1 }) => {
  const { locale } = useGlobal()
  const router = useRouter()
  const currentPage = +page
  if (!totalPage || totalPage <= 1) return null

  const showPrev = currentPage > 1
  const showNext = currentPage < totalPage
  const pagePrefix = router.asPath
    .split('?')[0]
    .replace(/\/page\/[1-9]\d*/, '')
    .replace(/\/$/, '')
    .replace('.html', '')

  const btnClass =
    'rounded-full border border-zinc-200 px-4 py-1.5 text-sm font-medium text-zinc-600 transition hover:border-violet-600/50 hover:text-violet-700 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-violet-400/50 dark:hover:text-violet-300'
  const disabledClass =
    'pointer-events-none invisible rounded-full border border-zinc-200 px-4 py-1.5 text-sm font-medium dark:border-zinc-700'

  return (
    <div className='flex items-center justify-between py-10'>
      <SmartLink
        href={{
          pathname: `${pagePrefix}/page/${currentPage - 1}`,
          query: router.query.s ? { s: router.query.s } : {}
        }}
        className={showPrev ? btnClass : disabledClass}>
        ← {locale.PAGINATION.PREV}
      </SmartLink>

      <span className='font-mono text-xs text-zinc-500 dark:text-zinc-300'>
        {currentPage} / {totalPage}
      </span>

      <SmartLink
        href={{
          pathname: `${pagePrefix}/page/${currentPage + 1}`,
          query: router.query.s ? { s: router.query.s } : {}
        }}
        className={showNext ? btnClass : disabledClass}>
        {locale.PAGINATION.NEXT} →
      </SmartLink>
    </div>
  )
}

export default Pagination
