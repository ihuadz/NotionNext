import { useGlobal } from '@/lib/global'
import { useEffect, useRef } from 'react'

/**
 * 文章密码锁
 */
const PostLock = ({ validPassword }) => {
  const { locale } = useGlobal()
  const passwordInputRef = useRef(null)

  const submitPassword = () => {
    const p = document.getElementById('password')
    if (!validPassword(p?.value)) {
      const tips = document.getElementById('tips')
      if (tips) {
        tips.innerHTML = `<div class='text-red-500 text-xs mt-2'>${locale.COMMON.PASSWORD_ERROR}</div>`
      }
    }
  }

  useEffect(() => {
    passwordInputRef.current?.focus()
  }, [])

  return (
    <div className='flex h-96 w-full items-center justify-center'>
      <div className='w-72 space-y-4 text-center'>
        <i className='fas fa-lock text-2xl text-zinc-300 dark:text-zinc-600' />
        <div className='text-sm text-zinc-600 dark:text-zinc-200'>
          {locale.COMMON.ARTICLE_LOCK_TIPS}
        </div>
        <div className='flex overflow-hidden rounded-full border border-zinc-200 dark:border-zinc-700'>
          <input
            id='password'
            type='password'
            ref={passwordInputRef}
            onKeyDown={e => {
              if (e.key === 'Enter') submitPassword()
            }}
            className='w-full bg-transparent px-4 py-2 text-sm outline-none dark:text-zinc-100'
          />
          <button
            onClick={submitPassword}
            className='whitespace-nowrap bg-zinc-100 px-4 text-sm text-zinc-600 transition hover:bg-violet-50 hover:text-violet-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:text-violet-300'>
            {locale.COMMON.SUBMIT}
          </button>
        </div>
        <div id='tips' />
      </div>
    </div>
  )
}

export default PostLock
