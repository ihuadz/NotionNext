import { siteConfig } from '@/lib/config'
import CONFIG from '../config'
import SocialLinks from './SocialLinks'

/**
 * 首页 Hero：问候语 + 标语 + 自我介绍 + 社交链接
 * 文案均可在 config.js 中配置；极简纯色，依靠排版与留白呈现设计感
 */
const Hero = () => {
  const greeting = siteConfig('AURORA_HERO_GREETING', '', CONFIG)
  const slogan = siteConfig('AURORA_HERO_SLOGAN', '', CONFIG)
  const introConfig = siteConfig('AURORA_HERO_INTRO', [], CONFIG)
  const introList = Array.isArray(introConfig)
    ? introConfig
    : [introConfig].filter(Boolean)
  const showSocial = siteConfig('AURORA_HERO_SOCIAL', true, CONFIG)

  // 渐变只作用于文字；末尾 emoji 拆出来保持原色（background-clip:text 会把 emoji 变成渐变剪影）
  const emojiMatch = greeting.match(
    /(\p{Extended_Pictographic}[\u200d\ufe0f\p{Extended_Pictographic}]*\s*)$/u
  )
  const greetingText = emojiMatch
    ? greeting.slice(0, emojiMatch.index).trimEnd()
    : greeting
  const greetingEmoji = emojiMatch ? emojiMatch[0].trim() : ''

  return (
    <section className='py-20 text-left'>
      {greeting && (
        <h1 className='text-4xl font-bold leading-tight tracking-tight text-zinc-900 md:text-5xl dark:text-zinc-50'>
          <span className='aurora-text-gradient'>{greetingText}</span>
          {greetingEmoji && ` ${greetingEmoji}`}
        </h1>
      )}
      {slogan && (
        <p className='mt-5 text-lg font-bold tracking-wide text-zinc-500 md:text-xl dark:text-zinc-400'>
          {slogan}
        </p>
      )}
      {introList.length > 0 && (
        <div className='mt-6 space-y-3 text-base leading-loose text-zinc-600 dark:text-zinc-200'>
          {introList.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      )}

      {showSocial && <SocialLinks />}
    </section>
  )
}

export default Hero
