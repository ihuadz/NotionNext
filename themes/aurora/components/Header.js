import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useRouter } from 'next/router'

const NAV_ITEMS = [
  { name: '博客', href: '/page/1', match: /^\/page/ },
  { name: '分类', href: '/category', match: /^\/category/ },
  { name: '搜索', href: '/search', match: /^\/search/, icon: 'fas fa-search' }
]

/**
 * Aurora 顶部导航：左侧昵称回首页，右侧 博客/分类/搜索图标（明暗切换在页脚）
 */
const Header = () => {
  const router = useRouter()
  const path = router?.asPath?.split('?')[0] || ''

  return (
    <header className='sticky top-0 z-40 w-full border-b border-zinc-200/60 dark:border-[#363636]/60 bg-white/70 dark:bg-[#242424]/70 backdrop-blur-md'>
      <div className='mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6'>
        {/* 左：昵称 */}
        <SmartLink
          href='/'
          className='aurora-link text-lg font-bold tracking-wide text-zinc-800 dark:text-zinc-100'>
          {siteConfig('AUTHOR')}
        </SmartLink>

        {/* 右：导航 */}
        <nav className='flex items-center space-x-6 md:space-x-8 text-base font-bold'>
          {NAV_ITEMS.map(item => (
            <SmartLink
              key={item.href}
              href={item.href}
              title={item.name}
              aria-label={item.name}
              className={`aurora-link text-zinc-600 hover:text-zinc-900 dark:text-zinc-200 dark:hover:text-white ${
                item.match.test(path) ? 'active text-zinc-900 dark:text-zinc-50' : ''
              }`}>
              {item.icon ? <i className={`${item.icon} text-sm`} /> : item.name}
            </SmartLink>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Header
