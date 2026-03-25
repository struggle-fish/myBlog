# LangChain 介绍

## 介绍
LangChain 是基于大语言模型的应用开发框架，它本身不是大语言模型，而是提供了一套工具和组件，帮助开发者更高效地将 LLMs 与外部数据、工具（如搜索引擎、数据库、API）结合，构建出更复杂、实用的 AI 应用


LangChain ≠ LLMs

LangChain 之于 LLMs，类似 Spring 之于 Java

LangChain 之于 LLMs，类似 Django、Flask 之于 Python


LangChain中的“Lang”是指language，即⼤语⾔模型，“Chain”即“链”，也就是将⼤模型与外部数据&各种组件连接成链，以此构建AI应⽤程序



## 为什么需要LangChain？


1. LLMs用的好好的，干嘛还需要 LangChain

在大语言模型（LLM）如 ChatGPT、Claude、DeepSeek 等快速发展的今天，开发者不仅希望能“使
用”这些模型，还希望能 将它们灵活集成到自己的应用中 ，实现更强大的对话能力、检索增强生成
（RAG）、工具调用（Tool Calling）、多轮推理等功能。


LangChain 为更方便解决这些问题，而生的。比如：大模型默认不能联网，如果需要联网，用
LangChain

2. 我们可以使用 GPT 或 GLM4 等模型的API进行开发，为何需要LangChain这样的框架？

使用LangChain的好处：
 
- 简化开发难度：更简单、更高效、效果更好
- 学习成本更低：不同模型的API不同，调用方式也有区别，切换模型时学习成本高。使用 LangChain，可以以统一、规范的方式进行调用，有更好的移植性。
- 现成的链式组装：LangChain提供了一些 现成的链式组装 ，用于完成特定的高级任务。让复杂的逻辑变得 结构化、易组合、易扩展


![LOGO](/public/image/langChain/1.png)

3. LangChain 提供了哪些功能呢？

LangChain 是一个帮助你构建 LLM 应用的 全套工具集 。这里涉及到prompt 构建、LLM 接入、记忆管理、工具调用、RAG、智能体开发等模块。


## 使用场景


![LOGO](/public/image/langChain/ScreenShot_2026-03-24_140723_223.png)



LangChain 所在位置

![LOGO](/public/image/langChain/2.png)





















