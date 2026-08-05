import BeiAnSite from '@/components/BeiAnSite'
import DarkModeButton from '@/components/DarkModeButton'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

/**
 * Aurora 页脚：左侧 © 起始年 - 当前年 署名；右侧语言切换占位 + 明暗切换
 */
const Footer = () => {
  const since = parseInt(siteConfig('AURORA_FOOTER_SINCE', 2024, CONFIG))
  const name = siteConfig('AURORA_FOOTER_NAME', '', CONFIG)
  const currentYear = new Date().getFullYear()
  const dateText = currentYear > since ? `${since} - ${currentYear}` : `${since}`

  return (
    <footer className='mt-auto w-full border-t border-zinc-200/60 dark:border-zinc-800/60'>
      <div className='mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-8 text-sm text-zinc-500 dark:text-zinc-300'>
        {/* 左：版权 */}
        <div className='flex flex-col gap-1'>
          <span className='whitespace-nowrap'>
            © {dateText} {name}
          </span>
          <BeiAnSite />
        </div>

        {/* 右：语言切换占位（后期接入多语言） + 明暗切换 */}
        <div className='flex items-center gap-4'>
          <span
            title='语言切换（即将上线）'
            className='flex cursor-not-allowed select-none items-center gap-1.5 text-zinc-400 dark:text-zinc-500'>
            <i className='fas fa-globe text-xs' />
            <span>中文</span>
          </span>
          <DarkModeButton />
        </div>
      </div>
    </footer>
  )
}

export default Footer
