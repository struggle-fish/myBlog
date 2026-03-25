# LangChain 核心组件


如果要组织一个AI应用，开发者一般需要什么？

- 第1，提示词模板的构建，不仅仅只包含用户输入。
- 第2，模型调用与返回，参数设置，返回内容的格式化输出。
- 第3，知识库查询，这里会包含文档加载，切割，以及转化为词嵌入（Embedding）向量。
- 第4，其他第三方工具调用，一般包含天气查询、Google搜索、一些自定义的接口能力调用。
- 第5，记忆获取，每一个对话都有上下文，在开启对话之前总得获取到之前的上下文吧？


## 概述

LangChain的核心组件涉及六大模块，这六大模块提供了一个全面且强大的框架，使开发者能够创建复杂、高效且用户友好的基于大模型的应用。


![LOGO](/public/image/langChain/13.png)


### Model I/O


这个模块使⽤最多，也最简单

Model I/O：标准化各个大模型的输入和输出，包含输入模版，模型本身和格式化输出。

以下是使用语言模型从输入到输出的基本流程。


![LOGO](/public/image/langChain/14.png)

**Format(格式化)** ：即指代Prompts Template，通过模板管理大模型的输入。将原始数据格式化成
模型可以处理的形式，插入到一个模板问题中，然后送入模型进行处理。

**Predict(预测)** ：即指代Models，使用通用接口调用不同的大语言模型。接受被送进来的问题，然
后基于这个问题进行预测或生成回答。

**Parse(生成)** ：即指代Output Parser 部分，用来从模型的推理中提取信息，并按照预先设定好的
模版来规范化输出。比如，格式化成一个结构化的JSON对象。


### Chains


Chain："链条"，用于将多个模块串联起来组成一个完整的流程，是 LangChain 框架中最重要的模块。

例如，一个 Chain 可能包括一个 Prompt 模板、一个语言模型和一个输出解析器，它们一起工作以处理
用户输入、生成响应并处理输出。


常见的Chain类型：

- LLMChain ：最基础的模型调用链 
- SequentialChain ：多个链串联执行 
- RouterChain ：自动分析用户的需求，引导到最适合的链
- RetrievalQA ：结合向量数据库进行问答的链

### Memory


Memory：记忆模块，用于保存对话历史或上下文信息，以便在后续对话中使用。

常见的 Memory 类型：

- ConversationBufferMemory ：保存完整的对话历史
- ConversationSummaryMemory ：保存对话内容的精简摘要（适合长对话） 
- ConversationSummaryBufferMemory ：混合型记忆机制，兼具上面两个类型的特点
- VectorStoreRetrieverMemory ：保存对话历史存储在向量数据库中

### Agents


Agents，对应着智能体，是 LangChain 的高阶能力，它可以自主选择工具并规划执行步骤。


Agent 的关键组成：

- AgentType ：定义决策逻辑的工作流模式
- Tool ：是一些内置的功能模块，如API调用、搜索引擎、文本处理、数据查询等工具。Agents通过这些工具来执行特定的功能。
- AgentExecutor ：用来运行智能体并执行其决策的工具，负责协调智能体的决策和实际的工具执行。


### Retrieval

Retrieval：对应着RAG，检索外部数据，然后在执行生成步骤时将其传递到 LLM。步骤包括文档加载、切割、Embedding等

![LOGO](/public/image/langChain/15.png)

- Source ：数据源，即大模型可以识别的多种类型的数据：视频、图片、文本、代码、文档等。
- Load ：负责将来自不同数据源的非结构化数据，加载为文档(Document)对象
- Transform ：负责对加载的文档进行转换和处理，比如将文本拆分为具有语义意义的小块。
- Embed ：将文本编码为向量的能力。一种用于嵌入文档，另一种用于嵌入查询
- Store ：将向量化后的数据进行存储
- Retrieve ：从大规模文本库中检索和查询相关的文本段落


### Callbacks

Callbacks：回调机制，允许连接到 LLM 应用程序的各个阶段，
可以监控和分析LangChain的运行情况，比如日志记录、监控、流传输等，以优化性能。



## 小结

- Model I/O模块：使用最多，也最简单
- Chains 模块： 最重要的模块
- Retrieval模块、Agents模块：大模型的主要落地场景

在这个基础上，其它组件要么是它们的辅助，要么只是完成常规应用程序的任务。

- 辅助：⽐如，向量数据库的分块和嵌⼊，⽤于追踪、观测的Callbacks
- 任务：⽐如，Tools，Memory

![LOGO](/public/image/langChain/16.png)





































































