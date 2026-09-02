/**
 * Aurora 主题配置文件
 * 暗色优先的极简个人主页主题：首页 = Hero + 作品 Gallery，导航仅 博客/分类/搜索
 */
const CONFIG = {
  // ---------- 首页 Hero ----------
  AURORA_HERO_GREETING: 'Hi, there! 👋', // 大标题问候语，留空则不显示
  AURORA_HERO_SLOGAN: '别在迷失自我的道路上越走越远', // 标语（teal 点缀色一行），留空则不显示
  AURORA_HERO_INTRO: [
    '你好，我是珩宇！是一个会一点前端的后端开发者，热爱编程，喜欢将工作生活中遇到的问题记录下来。',
    '这里是我分享个人见解、经验和技术教程的地方，希望和你一起进步…💯'
  ], // 自我介绍段落（数组，每个元素一段），留空数组则不显示
  AURORA_HERO_SOCIAL: true, // 是否显示社交图标

  // ---------- 社交链接 ----------
  // 优先读取环境变量 NEXT_PUBLIC_CONTACT_GITHUB / NEXT_PUBLIC_CONTACT_EMAIL，未配置时使用这里的默认值
  AURORA_GITHUB: 'https://github.com/ihuadz', // GitHub 主页，留空则不显示
  AURORA_EMAIL: 'ihuadz@outlook.com', // 邮箱，留空则不显示

  // ---------- 页脚 ----------
  AURORA_FOOTER_SINCE: 2024, // 版权起始年份（当前年份更大时显示为 2024 - 20xx）
  AURORA_FOOTER_NAME: 'ihuadz', // 版权署名，最终效果：© 2024 - 20xx ihuadz

  // ---------- 首页作品 Gallery ----------
  // 在这里维护你的作品列表：title 标题 / image 缩略图（外链或 public 下路径）/ link 跳转地址
  // 未上线的作品：link 留空并设置 comingSoon: true，卡片会显示"待上线"，点击弹提示
  AURORA_GALLERY: [
    {
      title: 'PigMatrix',
      image: 'https://files.seeusercontent.com/2026/08/04/Hmr7/pigmatrix.jpg',
      link: 'https://pigmatrix.kiz.ac.cn/'
    },
    {
      title: 'DeepCellSeek',
      image:
        'https://files.seeusercontent.com/2026/08/04/s3pJ/deepcellseek.jpg',
      link: 'https://deepcellseek.kiz.ac.cn/'
    },
    {
      title: 'PICA',
      image: 'https://files.seeusercontent.com/2026/08/04/7plH/pica.jpg',
      link: 'https://pica.kiz.ac.cn/'
    },
    {
      title: 'SyngDB',
      image: 'https://files.seeusercontent.com/2026/08/04/w5uY/SyngDB.jpg',
      link: 'https://syngdb.data.scsio.ac.cn/'
    }
  ],

  // ---------- 文章页 ----------
  AURORA_ARTICLE_TOC: true, // 桌面端（xl 以上）文章页右侧显示跟随滚动的目录
  AURORA_ARTICLE_PREV_NEXT: true, // 文章底部显示上一篇/下一篇

  // ---------- 配色 ----------
  AURORA_ACCENT: '#7c3aed', // 点缀色（明亮 violet-600），用于悬停下划线、选中色等小面积强调
  AURORA_ACCENT_DARK: '#a78bfa', // 点缀色（暗黑 violet-400）

  // ---------- 首页大标题渐变（135°：indigo → 深品红，可改成任意颜色数组） ----------
  AURORA_TITLE_GRADIENT: ['#4C1D95', '#EC53B0'], // 明亮模式
  AURORA_TITLE_GRADIENT_DARK: ['#4C1D95', '#EC53B0'], // 暗黑模式：同色相提亮，保证深底对比度

  // ---------- 调色板（映射 conf/themeColorPalette 机制，可在 Notion 配置中心用同名 key 覆盖） ----------
  AURORA_COLOR_PRIMARY: '#7c3aed', // 主色 violet-600
  AURORA_COLOR_PRIMARY_DARK: '#a78bfa', // 主色（暗黑）violet-400
  AURORA_COLOR_BG: '#ffffff', // 页面背景：纯白（沿用原卡片色，更柔和干净）
  AURORA_COLOR_BG_DARK: '#242424', // 页面背景（暗黑）：沿用原卡片深灰
  AURORA_COLOR_CARD: '#fafaf9', // 卡片背景：暖白，与白底形成微弱层次
  AURORA_COLOR_CARD_DARK: '#2e2e2e', // 卡片背景（暗黑）：比页面略亮的实体色
  AURORA_COLOR_TEXT: '#3f3f46', // 主文字 zinc-700
  AURORA_COLOR_TEXT_DARK: '#f4f4f5', // 主文字（暗黑）zinc-100
  AURORA_COLOR_TEXT_SECONDARY: '#71717a', // 次级文字 zinc-500
  AURORA_COLOR_TEXT_SECONDARY_DARK: '#d4d4d8', // 次级文字（暗黑）zinc-300
  AURORA_COLOR_BORDER: '#e4e4e7', // 边框 zinc-200
  AURORA_COLOR_BORDER_DARK: '#363636' // 边框（暗黑）：中性灰
}
export default CONFIG
