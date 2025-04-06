# IDEA 集成 Maven

要想在IDEA中使用Maven进行项目构建，就需要在IDEA中集成Maven，那么就需要在IDEA中配置与maven的关联。

## 全局设置 Maven

全局设置：

- 进入IDEA的欢迎页面

选择 IDEA中 `File  =>  close project => Customize => All settings`


![LOGO](/public/image/javapublic/16943186-64ce-4f04-aad0-c444a4e4d11b.gif)


![LOGO](/public/image/javapublic/f4f69767-b010-4237-8233-df7474c0ad17.png)

- 打开 `All settings `, 选择 `Build,Execution,Deployment  =>  Build Tools  =>  Maven`


![LOGO](/public/image/javapublic/6d39ac15-3d5a-431b-af4c-5ce577838312.png)


- 配置工程的编译版本

![LOGO](/public/image/javapublic/e226fac3-5b26-4537-b6ec-29c3c79c1181.png)

这里所设置的maven的环境信息，并未指定任何一个project，此时设置的信息就属于全局配置信息。 
以后，我们再创建project，默认就是使用我们全局配置的信息。


## 创建项目

1. 创建一个空项目，命名为 web-project01

![LOGO](/public/image/javapublic/e834f42d-b1ae-4171-8fc0-a7370c40e67c.png)

2. 创建好项目之后，进入项目中，要设置JDK的版本号。选择小齿轮，选择 `Project Structure`

![LOGO](/public/image/javapublic/1e210a86-581d-4c17-bacb-72bf2afba50a.png)

3. 创建模块，选择Java语言，选择Maven。 填写模块的基本信息

![LOGO](/public/image/javapublic/e72440d3-dff2-4e71-b254-a75c89fc0b43.png)
![LOGO](/public/image/javapublic/e8c20a26-66cf-4a63-9eb4-f90cef8e9d02.png)

4. 在maven项目中，创建HelloWorld类，并运行

![LOGO](/public/image/javapublic/a86e7bf6-1b7c-46ae-92d6-5cbffc4d6651.png)

```md 
Maven项目的目录结构:
maven-project01
|---  src  (源代码目录和测试代码目录)
    |---  main (源代码目录)
        |--- java (源代码java文件目录)
        |--- resources (源代码配置文件目录)
    |---  test (测试代码目录)
        |--- java (测试代码java目录)
        |--- resources (测试代码配置文件目录)
    |--- target (编译、打包生成文件存放目录)
```


