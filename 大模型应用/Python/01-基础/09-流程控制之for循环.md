# 流程控制之for循环

## 基本语法

for 循环是 Python 中 最常用、最优雅 的循环，主要用来遍历可迭代对象。

每次循环，变量会自动拿到对象里的一个值

循环完所有内容自动结束，不会死循环

```py

for 变量 in 可迭代对象:
    # 循环体
    print(变量)

```

最常见的几种可迭代对象：

- 列表 list
- 元组 tuple
- 字符串 str
- 字典 dict
- 集合 set
- range() 对象
- 文件对象等


## 基础示例


```py

# 1. 遍历列表
fruits = ["苹果", "香蕉", "橙子", "葡萄"]
for fruit in fruits:
    print(f"我喜欢吃 {fruit}")

# 2. 遍历字符串
for char in "慢半拍":
    print(char)

# 3. 遍历 range（最常用！）
for i in range(5):          # 0,1,2,3,4
    print(i)

for i in range(1, 11):      # 1 到 10
    print(i)

for i in range(0, 100, 10): # 步长为10：0,10,20,...,90
    print(i)

```


## 带索引遍历 —— enumerate()

```py

names = ["张三", "李四", "王五", "赵六"]

for index, name in enumerate(names, start=1):   # start=1 从1开始编号
    print(f"{index}. {name}")


'''

1. 张三
2. 李四
3. 王五
4. 赵六

'''
```


## 同时遍历多个列表 zip()


```py

names = ["小明", "小红", "小刚"]
ages = [18, 20, 19]
scores = [95, 88, 92]

for name, age, score in zip(names, ages, scores):
    print(f"{name} 今年 {age} 岁，本次考试 {score} 分")

```

## 遍历字典

```py

person = {"name": "慢半拍", "age": 25, "city": "新加坡", "hobby": "学习"}

# 最推荐的 3 种方式：
for key in person:                    # 遍历 key
    print(key, person[key])

for key, value in person.items():     # 同时获取 key 和 value（最常用）
    print(f"{key}: {value}")

for value in person.values():         # 只遍历 value
    print(value)

```

## break、continue、else


```py

for i in range(10):
    if i == 5:
        break           # 直接跳出整个 for 循环
    if i % 2 == 0:
        continue        # 跳过本次循环，进入下一次
    print(i)
else:
    print("正常结束才会执行 else")   # 被 break 打断则 else 不执行


```


## 列表推导式

```py

# 普通 for 循环
squares = []
for i in range(10):
    squares.append(i**2)

# 列表推导式（一行搞定，推荐！）
squares = [i**2 for i in range(10)]

# 带条件的列表推导式
even_squares = [i**2 for i in range(10) if i % 2 == 0]

```
