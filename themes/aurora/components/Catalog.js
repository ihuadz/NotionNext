import throttle from 'lodash.throttle'
import { uuidToId } from 'notion-utils'
import { useEffect, useRef, useState } from 'react'

// 当前章节判定线：吸顶导航高度 + 少量余量，标题越过此线即视为已读
const HEADER_OFFSET = 96

/**
 * 文章目录（TOC）：桌面宽屏右侧展示，滚动时高亮当前章节
 * 页面顶部（无标题越过判定线）默认高亮第一个；
 * 挂载后多次复算，覆盖浏览器恢复滚动位置但不触发 scroll 事件的情况
 */
const Catalog = ({ toc }) => {
  const tRef = useRef(null)
  const [activeSection, setActiveSection] = useState(null)

  useEffect(() => {
    const spy = throttle(
      () => {
        const sections = document.getElementsByClassName('notion-h')
        let currentId = null
        // 最后一个越过判定线的标题即当前章节
        for (let i = 0; i < sections.length; i++) {
          const section = sections[i]
          if (!(section instanceof Element)) continue
          const id = section.getAttribute('data-id')
          if (!id) continue
          if (section.getBoundingClientRect().top - HEADER_OFFSET <= 0) {
            currentId = id
          } else {
            break
          }
        }
        // 页面顶部默认高亮第一个标题
        if (!currentId) {
          for (let i = 0; i < sections.length; i++) {
            const id = sections[i]?.getAttribute?.('data-id')
            if (id) {
              currentId = id
              break
            }
          }
        }
        setActiveSection(prev => (prev === currentId ? prev : currentId))

        // 高亮项保持在目录容器可视区中部
        if (currentId && tRef.current) {
          const anchors = Array.from(tRef.current.querySelectorAll('a'))
          const index = anchors.findIndex(
            a => a.getAttribute('href') === `#${currentId}`
          )
          if (index >= 0) {
            const top = index * 28 - tRef.current.clientHeight / 2
            tRef.current.scrollTo({ top, behavior: 'smooth' })
          }
        }
      },
      100,
      { leading: true, trailing: true }
    )

    window.addEventListener('scroll', spy, { passive: true })
    // 初始高亮；延迟复算以覆盖进入动画与浏览器恢复滚动位置的时机
    spy()
    const timers = [300, 800].map(ms => setTimeout(() => spy(), ms))
    return () => {
      window.removeEventListener('scroll', spy)
      timers.forEach(clearTimeout)
    }
  }, [toc])

  if (!toc || toc.length < 1) {
    return <></>
  }

  return (
    <div
      className='max-h-[70vh] overflow-y-auto overscroll-none border-l border-zinc-200/70 pl-4 dark:border-zinc-800'
      ref={tRef}>
      <nav className='space-y-2 text-xs leading-5'>
        {toc.map(tocItem => {
          const id = uuidToId(tocItem.id)
          const active = activeSection === id
          return (
            <a
              key={id}
              href={`#${id}`}
              style={{ marginLeft: tocItem.indentLevel * 12 }}
              className={`block truncate transition ${
                active
                  ? 'font-medium text-violet-600 dark:text-violet-300'
                  : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-300 dark:hover:text-zinc-100'
              }`}>
              {tocItem.text}
            </a>
          )
        })}
      </nav>
    </div>
  )
}

export default Catalog
