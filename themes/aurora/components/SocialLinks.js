import { siteConfig } from '@/lib/config'
import { handleEmailClick } from '@/lib/plugins/mailEncrypt'
import { useRef } from 'react'
import CONFIG from '../config'

/**
 * 社交链接图标组
 * 优先读取 CONTACT_*（环境变量 / Notion 配置中心），未配置时回退到主题 config.js 的 AURORA_*
 */
const SocialLinks = () => {
  const emailRef = useRef(null)
  const links = [
    { key: 'CONTACT_GITHUB', icon: 'fab fa-github', title: 'GitHub', fallback: 'AURORA_GITHUB' },
    { key: 'CONTACT_TWITTER', icon: 'fab fa-twitter', title: 'Twitter' },
    { key: 'CONTACT_TELEGRAM', icon: 'fab fa-telegram', title: 'Telegram' },
    { key: 'CONTACT_BILIBILI', icon: 'fab fa-bilibili', title: 'Bilibili' },
    { key: 'CONTACT_WEIBO', icon: 'fab fa-weibo', title: '微博' },
    { key: 'CONTACT_INSTAGRAM', icon: 'fab fa-instagram', title: 'Instagram' }
  ]
    .map(item => ({
      ...item,
      href: siteConfig(item.key) || (item.fallback ? siteConfig(item.fallback, '', CONFIG) : '')
    }))
    .filter(item => item.href)

  const email = siteConfig('CONTACT_EMAIL') || siteConfig('AURORA_EMAIL', '', CONFIG)
  const enableRss = siteConfig('ENABLE_RSS')

  if (!links.length && !email && !enableRss) return null

  const iconClass =
    'text-lg text-zinc-500 transition duration-200 hover:scale-110 hover:text-violet-500 dark:text-zinc-200 dark:hover:text-violet-300'

  return (
    <div className='mt-8 flex items-center justify-start space-x-5'>
      {links.map(item => (
        <a
          key={item.key}
          href={item.href}
          target='_blank'
          rel='noreferrer'
          title={item.title}
          aria-label={item.title}>
          <i className={`${item.icon} ${iconClass}`} />
        </a>
      ))}
      {email && (
        <a
          onClick={e => handleEmailClick(e, emailRef, email)}
          title='邮箱'
          aria-label='邮箱'
          className='cursor-pointer'
          ref={emailRef}>
          <i className={`fas fa-envelope ${iconClass}`} />
        </a>
      )}
      {enableRss && (
        <a href='/rss/feed.xml' target='_blank' rel='noreferrer' title='RSS' aria-label='RSS'>
          <i className={`fas fa-rss ${iconClass}`} />
        </a>
      )}
    </div>
  )
}

export default SocialLinks
