import { defineConfig } from 'vitepress'
import AutoSidebar from 'vite-plugin-vitepress-auto-sidebar';
import { nav } from './configs/nav';
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
      AutoSidebar({
        path: '/',
        ignoreList: [
          'node_modules',
          'github',
          'vitepress',
          '.vitepress',
          '.github',
        ],
        collapsed: true,
        titleFromFile: true,
        ignoreIndexItem: true,
        beforeCreateSideBarItems: (fileNames) => {
          /*
          [
            '.DS_Store',
            '01-第一章',
            '02-第二章',
            '03-第三章',
            '04-第四章',
            '05-第五章',
            '目录.md'
          ]
          */
          const sortedFileNames = fileNames.sort((a, b) => {
            // 假设文件名包含章节编号，如 '01-introduction', '02-getting-started'
            const numberPattern = /^(\d+)-/;
            // 使用正则表达式匹配文件名中的数字
            const matchA = a.match(numberPattern);
            const matchB = b.match(numberPattern);

            // 如果匹配成功，则解析数字，否则默认为0
            const numA = matchA ? parseInt(matchA[1], 10) : 0;
            const numB = matchB ? parseInt(matchB[1], 10) : 0;

            // 根据数字进行排序
            return numA - numB;
          });
          return sortedFileNames; // 返回排序后的文件名列表
        }
      })
    ],
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav,
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
    // TODO:暂时去掉搜索，这个功能跟本地重启有点儿冲突
    // search: {
    //   provider: 'local',
    //   options: {
    //     translations: {
    //       button: {
    //         buttonText: '搜索文档'
    //       },
    //       modal: {
    //         displayDetails: '显示详情',
    //         noResultsText: '未找到相关结果',
    //         resetButtonTitle: '清除',
    //         footer: {
    //           closeText: '关闭',
    //           selectText: '选择',
    //           navigateText: '切换'
    //         }
    //       }
    //     }
    //   }
    // }
  },
})
