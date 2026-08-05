import { siteConfig } from '@/lib/config'
import { useEffect, useRef, useState } from 'react'
import CONFIG from '../config'
import GalleryCard from './GalleryCard'

/**
 * 首页作品 Gallery：横向滚动展示 config.js 中 AURORA_GALLERY 配置的作品
 * 标题行右侧箭头左右切换；数据驱动，config 中追加条目即自动扩展
 */
const WorksGallery = () => {
  const works = siteConfig('AURORA_GALLERY', [], CONFIG) || []
  const scrollRef = useRef(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(false)

  const updateArrows = () => {
    const el = scrollRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 4)
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }

  useEffect(() => {
    updateArrows()
    window.addEventListener('resize', updateArrows)
    return () => window.removeEventListener('resize', updateArrows)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [works.length])

  if (works.length === 0) return null

  const scrollByCard = dir => {
    const el = scrollRef.current
    if (!el) return
    const card = el.querySelector(':scope > *')
    const step = card ? card.getBoundingClientRect().width + 24 : 344
    el.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  const arrowClass =
    'flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 text-xs text-zinc-500 transition duration-200 hover:border-violet-400 hover:text-violet-500 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-zinc-200 disabled:hover:text-zinc-500 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-violet-400 dark:hover:text-violet-300 dark:disabled:hover:border-zinc-700 dark:disabled:hover:text-zinc-300'

  return (
    <section id='works' className='pb-5'>
      {/* 标题栏：WORKS + 横向修饰线 + 切换箭头 */}
      <div className='mb-8 flex items-center justify-between'>
        <div className='flex flex-1 items-center gap-4'>
          <p className='font-mono text-xs tracking-[0.3em] text-zinc-500 dark:text-zinc-300'>
            WORKS
          </p>
          <div className='h-px flex-1 bg-gradient-to-r from-zinc-200 to-transparent dark:from-zinc-700' />
        </div>
        <div className='ml-4 flex items-center gap-2'>
          <button
            type='button'
            aria-label='向左滚动'
            disabled={!canLeft}
            onClick={() => scrollByCard(-1)}
            className={arrowClass}>
            <i className='fas fa-chevron-left' />
          </button>
          <button
            type='button'
            aria-label='向右滚动'
            disabled={!canRight}
            onClick={() => scrollByCard(1)}
            className={arrowClass}>
            <i className='fas fa-chevron-right' />
          </button>
        </div>
      </div>

      {/* 横向滚动：py-2 为 hover 上移和阴影预留空间，避免被容器裁剪 */}
      <div
        ref={scrollRef}
        onScroll={updateArrows}
        className='aurora-works-scroll flex snap-x snap-mandatory gap-6 overflow-x-auto py-2'>
        {works.map(work => (
          <GalleryCard key={work.title} work={work} />
        ))}
      </div>
    </section>
  )
}

export default WorksGallery
