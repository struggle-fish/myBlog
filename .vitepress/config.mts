import { defineConfig } from 'vitepress'
import AutoNav from "vite-plugin-vitepress-auto-nav";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "江小鱼的博客",
  description: "博客介绍",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/notes/vue/index' }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  },

  vite: {
    plugins:  [
      AutoNav({
        compareFn: (a, b) => {
          // 按最新提交时间(没有提交记录时为本地文件修改时间)升序排列
          return (b.options.lastCommitTime || b.options.modifyTime) - (a.options.lastCommitTime || a.options.modifyTime)
        },
      }),
    ],
  }
})
