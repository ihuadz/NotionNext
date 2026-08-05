import { useEffect, useRef } from 'react'

/**
 * 即时搜索输入框：受控组件，输入即回调 onChange（不跳转路由）
 * 注意：不要在这里拦截 IME composition 事件——若 compositionend 因输入法异常未触发，
 * 拦截标志会永久卡住，表现为"搜索一次后无法再输入"
 */
const SearchInput = ({ keyword = '', onChange, placeholder = '搜索文章' }) => {
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <section className='flex w-full items-center rounded-full border border-zinc-200 bg-[#fafaf9] px-4 transition focus-within:border-violet-600/50 dark:border-zinc-700 dark:bg-[#2e2e2e] dark:focus-within:border-violet-400/50'>
      <i className='fas fa-search mr-3 text-[13px] text-zinc-400' />
      <input
        ref={inputRef}
        type='text'
        value={keyword}
        placeholder={placeholder}
        autoComplete='off'
        spellCheck='false'
        className='w-full bg-transparent py-2.5 text-sm text-zinc-800 outline-none placeholder:text-zinc-400 dark:text-zinc-100 dark:placeholder:text-zinc-400'
        onChange={e => onChange?.(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Escape') onChange?.('')
        }}
      />
      {keyword && (
        <i
          className='fas fa-times cursor-pointer text-zinc-400 transition hover:text-zinc-600 dark:hover:text-zinc-200'
          onClick={() => onChange?.('')}
        />
      )}
    </section>
  )
}

export default SearchInput
