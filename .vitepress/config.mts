import { defineConfig } from 'vitepress'
import AutoNav from "vite-plugin-vitepress-auto-nav";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "江小鱼Blog",
  description: "碎片记录",
  base: '/myBlog',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '', link: '/' },
      { text: 'Examples', link: '/notes/vue/index' }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  },
  markdown: {
    container: {
      tipLabel: '提示',
      warningLabel: '警告',
      dangerLabel: '危险',
      infoLabel: '信息',
      detailsLabel: '详细信息'
    }
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
