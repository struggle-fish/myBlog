import { defineConfig } from 'vitepress'
import AutoNav from "vite-plugin-vitepress-auto-nav";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "江小鱼Blog",
  description: "个人前端技术文档碎片记录",
  base: '/myBlog/',
  // 忽略解析部分md文件（默认忽略node_modules），仅打包后生效，被忽略的文件不影响被其他文件导入
  srcExclude: [
    "**/(README).md",
    "(.vitepress|public|images|.guthub|components|snippets)/**/*.md",
  ],
  lastUpdated: true,
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
      AutoNav({}),
    ],
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '前端积累', link: '/前端积累/index' },
      { text: '前端算法', link: '/前端算法/vue/index' },
      { text: '源码学习', link: '/源码学习/index' },
    ],
  
    socialLinks: [
      { icon: 'github', link: 'https://github.com/struggle-fish/myBlog' }
    ],
    outline: "deep",
    outlineTitle: "目录",
    docFooter: {
      prev: "上一篇",
      next: "下一篇",
    },
    lastUpdatedText: "更新时间",
    externalLinkIcon: true,
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档'
          },
          modal: {
            displayDetails: '显示详情',
            noResultsText: '未找到相关结果',
            resetButtonTitle: '清除',
            footer: {
              closeText: '关闭',
              selectText: '选择',
              navigateText: '切换'
            }
          }
        }
      }
    }
  },
})
