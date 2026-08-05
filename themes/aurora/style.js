/* eslint-disable react/no-unknown-property */
import CONFIG from './config'
import { themeConsoleStyle } from '@/lib/themeConsoleStyle'

/**
 * Aurora 主题样式（仅对本主题生效，不支持 tailwind 的 @apply 语法）
 * 大标题渐变与点缀色均在 config.js 中配置（AURORA_TITLE_GRADIENT(_DARK)、AURORA_ACCENT(_DARK)）
 */
const Style = () => {
  const accent = CONFIG.AURORA_ACCENT || '#7c3aed'
  const accentDark = CONFIG.AURORA_ACCENT_DARK || '#a78bfa'
  // 渐变缺省时回退到内置极光色，避免 transparent 文字不可见
  const grad = (
    CONFIG.AURORA_TITLE_GRADIENT?.length
      ? CONFIG.AURORA_TITLE_GRADIENT
      : ['#059669', '#0891b2', '#7c3aed']
  ).join(', ')
  const gradDark = (
    CONFIG.AURORA_TITLE_GRADIENT_DARK?.length
      ? CONFIG.AURORA_TITLE_GRADIENT_DARK
      : ['#6ee7b7', '#67e8f9', '#a78bfa']
  ).join(', ')

  return (
    <style jsx global>{`
      #theme-aurora .aurora-works-title {
        font-style: italic;
        letter-spacing: 0.02em;
      }

      /* ---------- 主题变量：点缀色按明暗模式切换 ---------- */
      #theme-aurora {
        --aurora-accent: ${accent};
      }
      .dark #theme-aurora {
        --aurora-accent: ${accentDark};
      }

      /* ---------- 文字渲染 ---------- */
      #theme-aurora {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      /* ---------- 选中色 ---------- */
      #theme-aurora ::selection {
        background: color-mix(in srgb, var(--aurora-accent) 25%, transparent);
        color: inherit;
      }

      /* ---------- 链接悬停下划线（单一柔和点缀色） ---------- */
      #theme-aurora .aurora-link {
        position: relative;
      }
      #theme-aurora .aurora-link::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: -3px;
        width: 100%;
        height: 1px;
        background: color-mix(in srgb, var(--aurora-accent) 55%, transparent);
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.25s ease;
      }
      #theme-aurora .aurora-link:hover::after,
      #theme-aurora .aurora-link.active::after {
        transform: scaleX(1);
      }

      /* ---------- 首页大标题极光渐变 ---------- */
      #theme-aurora .aurora-text-gradient {
        background-image: linear-gradient(135deg, ${grad});
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        -webkit-text-fill-color: transparent;
      }
      .dark #theme-aurora .aurora-text-gradient {
        background-image: linear-gradient(135deg, ${gradDark});
      }

      /* ---------- 回弹区底色与页面一致；滚动条占位稳定，避免无滚动条页面切换时布局抖动 ---------- */
      html {
        background-color: #ffffff;
        scrollbar-gutter: stable;
      }
      html.dark {
        background-color: #242424;
      }

      /* ---------- 作品横向滚动：隐藏滚动条 ---------- */
      #theme-aurora .aurora-works-scroll {
        scrollbar-width: none;
        -ms-overflow-style: none;
      }
      #theme-aurora .aurora-works-scroll::-webkit-scrollbar {
        display: none;
      }

      /* ---------- 滚动条 ---------- */
      #theme-aurora ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      #theme-aurora ::-webkit-scrollbar-thumb {
        background: rgba(130, 138, 150, 0.3);
        border-radius: 9999px;
      }
      #theme-aurora ::-webkit-scrollbar-track {
        background: transparent;
      }

      /* ---------- Notion 正文细节 ---------- */
      #theme-aurora .notion-h1,
      #theme-aurora .notion-h2,
      #theme-aurora .notion-h3 {
        scroll-margin-top: 5rem;
      }

      ${themeConsoleStyle('aurora', CONFIG)}
    `}</style>
  )
}

export { Style }
