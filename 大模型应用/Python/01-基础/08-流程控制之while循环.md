# 流程控制之while循环



![LOGO](/public/image/python/ScreenShot_2026-04-14_110155_628.png)

while 是 条件循环：只要条件为 True，就一直重复执行代码块。

## 基本语法


```py

while 条件:
    # 循环体（要重复执行的代码）
    ...

```

基础循环

```py

i = 1
while i <= 5:
    print(f"第 {i} 次打印")
    i = i + 1          # 千万不要忘记这一步！否则会死循环

print("循环结束")

```


## break

```py
while True:     # 永真循环
  cmd = input("请输入命令（输入 q 退出）：").strip()
  
  if cmd.lower() == 'q':
    print("程序退出")
    break        # 立即跳出整个 while 循环
  
  print(f"你输入了：{cmd}")

```



## continue

```py

i = 0
while i < 10:
    i += 1
    if i % 2 == 0:      # 跳过偶数
        continue        # 直接进入下一次循环，不执行下面的 print
    print(i)            # 只打印奇数

```


## else

Python 特色，不常用但要知道

```py

i = 1
while i <= 5:
    print(i)
    i += 1
else:
    print("正常结束时才会执行 else")   # 如果是被 break 跳出的，则 else 不执行

```









## 总结

- while 条件: 满足就一直循环
- 必须设置变量更新（i += 1），避免死循环
- break：彻底结束循环
- continue：跳过当前一次，继续下一轮
- while + else：仅正常结束触发

![LOGO](/public/image/python/ScreenShot_2026-04-14_111849_660.png)



## 一个例子

```py

# 1. 菜单选择系统
while True:
    print("\n=== 学生管理系统 ===")
    print("1. 添加学生")
    print("2. 查看学生")
    print("3. 删除学生")
    print("q. 退出系统")
    
    choice = input("请选择功能：").strip()
    
    if choice == '1':
        # 添加学生代码...
        pass
    elif choice == '2':
        # 查看学生代码...
        pass
    elif choice == 'q' or choice == 'Q':
        print("感谢使用，再见！")
        break
    else:
        print("输入错误，请重新输入！")

```


九九乘法表:

```py [九九乘法表]

# 定义行数：i 代表行
i = 1
while i <= 9:
    # 定义列数：j 代表列，每行 j <= i
    j = 1
    while j <= i:
        # \t 制表符，自动对齐
        print(f"{j}*{i}={i*j}\t", end="")
        j += 1
    # 每行结束换行
    print()
    i += 1

```