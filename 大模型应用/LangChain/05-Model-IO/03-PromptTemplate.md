# PromptTemplate

Prompt Template 是LangChain中的一个概念，接收用户输入，返回一个传递给LLM的信息（即提示词prompt）。


在应用开发中，固定的提示词限制了模型的灵活性和适用范围。所以，`prompt template` 是一个 **模板化**的字符串 ，
你可以将 **变量插入到模板** 中，从而创建出不同的提示。调用时：

- 以 **字典** 作为输入，其中每个键代表要填充的提示模板中的变量。

- 输出一个 `PromptValue `。这个 PromptValue 可以传递给 LLM 或 ChatModel，并且还可以转换为字符串或消息列表。


## PromptTemplate

LLM提示模板，用于生成字符串提示。它使用 Python 的字符串来模板提示。

PromptTemplate类，用于快速构建 **包含变量** 的提示词模板，并通过 **传入不同的参数值** 生成自定义的提示词。

主要参数介绍：
- template：定义提示词模板的字符串，其中包含 **文本** 和 **变量占位符**（如`{name}`） ；
- input_variables： 列表，指定了模板中使用的变量名称，在调用模板时被替换；
- partial_variables：字典，用于定义模板中一些固定的变量名。这些值不需要再每次调用时被替换。



```py

def ask_ai(question):
    # 模板 f-string 写法
    prompt = f"""
    请你认真回答以下问题：
    {question}
    """
    
    # 传给大模型
    response = llm.invoke(prompt)
    return response.content

```

调用示例：

```py

# ======================
# 1. 导入所有需要的包
# ======================
import os
import dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate

# ======================
# 2. 加载环境变量（你的 .env 配置）
# ======================
dotenv.load_dotenv()  # 自动读取当前文件夹下的 .env 文件

# ======================
# 3. 初始化 AI 模型
# ======================
llm = ChatOpenAI(
    api_key=os.getenv("OPENAI_API_KEY1"),
    base_url=os.getenv("OPENAI_BASE_URL"),
    model=os.getenv("OPENAI_MODEL")
)

# ======================
# 4. 【核心】定义提示词模板
# ======================
prompt = PromptTemplate.from_template("""
你是一个专业的AI助手，请认真回答用户的问题。

用户问题：{question}
""")

# ======================
# 5. 组合链条：模板 → 模型
# ======================
chain = prompt | llm

# ======================
# 6. 调用 AI 并输出结果
# ======================
response = chain.invoke({
    "question": "写一首关于春天的七言绝句"
})

# 打印最终回答
print(response.content)

```


## ChatPromptTemplate

聊天提示模板，用于组合各种角色的消息模板，传入聊天模型。

ChatPromptTemplate是创建 聊天消息列表 的提示模板。它比普通 PromptTemplate 更适合处理多角色、多轮次的对话场景。

特点：

- 支持 `System / Human / AI` 等不同角色的消息模板

- 对话历史维护



```py

import os
import dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

# 加载环境
dotenv.load_dotenv()

# 1. 创建模型
llm = ChatOpenAI(
    api_key=os.getenv("OPENAI_API_KEY1"),
    base_url=os.getenv("OPENAI_BASE_URL"),
    model=os.getenv("OPENAI_MODEL")
)

# 2. 聊天提示模板（核心）
prompt = ChatPromptTemplate.from_messages([
    ("system", "你是一位诗人，只会写七言绝句，语言优美简洁"),
    ("user", "以{topic}为主题写一首诗")
])

# 3. 链式调用：模板 → 模型
chain = prompt | llm

# 4. 运行
res = chain.invoke({"topic": "春天"})
print(res.content)

```



```py

prompt = ChatPromptTemplate.from_messages([
    {"role": "system", "content": "你是一个专业助手"},
    {"role": "user", "content": "{question}"}
])

```


模板调用的几种方式：

- `invoke() `  传入的是字典，返回的是 ChatPromptValue
- `format() ` 传入的是变量的值，返回的是 str
- `format_messages() ` 传入变量的值，返回消息构成的list
- `format_prompt()` 传入的是变量的值，返回的是 ChatPromptValue



## FewShotPromptTemplate

样本提示词模板，通过示例来教模型如何回答


```py

from langchain_core.prompts import FewShotPromptTemplate, PromptTemplate

# ----------------------
# 1. 给 AI 看的例子（最重要）
# ----------------------
examples = [
    {"input": "高兴", "output": "😊"},
    {"input": "生气", "output": "😠"},
    {"input": "哭", "output": "😢"},
]

# ----------------------
# 2. 例子的格式
# ----------------------
example_prompt = PromptTemplate(
    input_variables=["input", "output"],
    template="输入：{input}\n输出：{output}\n"
)

# ----------------------
# 3. FewShot 模板
# ----------------------
few_shot_prompt = FewShotPromptTemplate(
    examples=examples,               # 给的例子
    example_prompt=example_prompt,  # 例子格式
    prefix="请把情绪转换成表情\n",   # 开头说明
    suffix="输入：{question}\n输出：", # 结尾
    input_variables=["question"],   # 最终变量
)

# ----------------------
# 4. 测试生成提示词
# ----------------------
final_prompt = few_shot_prompt.format(question="开心")
print(final_prompt)

```



```py

import os
import dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import FewShotPromptTemplate, PromptTemplate

dotenv.load_dotenv()

# 模型
llm = ChatOpenAI(
    api_key=os.getenv("OPENAI_API_KEY1"),
    base_url=os.getenv("OPENAI_BASE_URL"),
    model=os.getenv("OPENAI_MODEL")
)

# 例子
examples = [
    {"input": "高兴", "output": "😊"},
    {"input": "生气", "output": "😠"},
]

# 例子格式
example_prompt = PromptTemplate(
    input_variables=["input", "output"],
    template="输入：{input}\n输出：{output}"
)

# FewShot 模板
few_shot_prompt = FewShotPromptTemplate(
    examples=examples,
    example_prompt=example_prompt,
    prefix="把情绪转成表情",
    suffix="输入：{question}\n输出：", # 声明在示例后面的提示词模版
    input_variables=["question"]
)

# 链式调用
chain = few_shot_prompt | llm
res = chain.invoke({"question": "难过"})
print(res.content)


```

## XxxMessagePromptTemplate

消息模板词模板，包括：`SystemMessagePromptTemplate、HumanMessagePromptTemplate、AIMessagePromptTemplate、ChatMessagePromptTemplate`等



## PipelinePrompt

管道提示词模板，用于把几个提示词组合在一起使用。







## 自定义模板

允许基于其它模板类来定制自己的提示词模板。
















