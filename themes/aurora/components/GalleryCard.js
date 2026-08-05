import LazyImage from '@/components/LazyImage'
import { useEffect, useRef, useState } from 'react'

/**
 * 作品卡片：纯缩略图，hover 时显示遮罩与标题，点击跳外链
 * comingSoon 的作品不可跳转，点击弹出"待上线"提示
 */
const GalleryCard = ({ work }) => {
  const { title, image, link, comingSoon } = work
  const [showTip, setShowTip] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const handleComingSoon = () => {
    clearTimeout(timerRef.current)
    setShowTip(true)
    timerRef.current = setTimeout(() => setShowTip(false), 2000)
  }

  const inner = (
    <>
      <div className='relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800'>
        <LazyImage
          src={image}
          alt={title}
          className='h-full w-full object-cover transition duration-500 group-hover:scale-105'
        />
        {/* hover 渐变遮罩 + 标题（仅悬停时出现，不占用卡片布局） */}
        <div className='pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/30 to-transparent p-5 opacity-0 transition duration-300 group-hover:opacity-100'>
          <h3 className='aurora-works-title text-xl text-white'>
            {title}
          </h3>
        </div>
        {comingSoon && (
          <span className='absolute right-3 top-3 rounded-full bg-black/55 px-2.5 py-0.5 text-xs text-white backdrop-blur-sm'>
            待上线
          </span>
        )}
      </div>

      {showTip && (
        <div className='absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-zinc-900/90 px-4 py-2 text-xs text-white shadow-lg dark:bg-white/90 dark:text-zinc-900'>
          待上线，敬请期待 🚀
        </div>
      )}
    </>
  )

  const cardClass =
    'group relative block w-[280px] shrink-0 snap-start overflow-hidden rounded-2xl border border-zinc-200/80 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/10 sm:w-[320px] dark:border-zinc-700/60 dark:hover:border-zinc-500/60'

  if (comingSoon || !link) {
    return (
      <div
        role='button'
        aria-label={`${title}（待上线）`}
        onClick={handleComingSoon}
        className={`${cardClass} cursor-pointer`}>
        {inner}
      </div>
    )
  }

  return (
    <a href={link} target='_blank' rel='noreferrer' aria-label={title} className={cardClass}>
      {inner}
    </a>
  )
}

export default GalleryCard
