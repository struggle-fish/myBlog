# helloWorld


一个简单的示例


```python

import dotenv
from langchain_openai import ChatOpenAI
import os

dotenv.load_dotenv()  # 加载当前目录下的 .env 文件

# 加载 Kimi 配置（从 .env 读取）
os.environ['OPENAI_API_KEY'] = os.getenv("DASHSCOPE_API_KEY") 
os.environ['OPENAI_BASE_URL'] = os.getenv("DASHSCOPE_BASE_URL") 

# ✅ 关键：模型名必须改成 Kimi 支持的名字！
llm = ChatOpenAI(
    model="moonshot-v1-8k",  # Kimi 模型名
    api_key=os.environ['OPENAI_API_KEY'],
    base_url=os.environ['OPENAI_BASE_URL']
)

# 调用测试
response = llm.invoke("什么是大模型？")
print(response)

```























