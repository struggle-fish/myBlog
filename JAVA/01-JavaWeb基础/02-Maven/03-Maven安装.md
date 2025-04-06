# Maven 安装

## 下载压缩包
Maven 下载地址： https://maven.apache.org/download.cgi

Maven安装配置步骤：
1. 解压安装
2. 配置仓库
3. 配置阿里云私服
4. 配置Maven环境变量

把下载下来的压缩包解压，目录结构如下：

![LOGO](/public/image/javapublic/WX20250406-152757@2x.png)

- bin目录 ： 存放的是可执行命令。（mvn 命令重点关注）
- conf目录 ：存放Maven的配置文件。（settings.xml配置文件后期需要修改）
- lib目录 ：存放Maven依赖的jar包。（Maven也是使用java开发的，所以它也依赖其他的jar包）



## 配置本地仓库

在当前目录下创建一个新的目录，即本地仓库，用来存放jar包

![LOGO](/public/image/javapublic/WX20250406-153139@2x.png)

- 进入到conf目录下修改settings.xml配置文件
1. 打开`settings.xml`文件，定位到53行
2. 复制`<localRepository>`标签，粘贴到注释的外面（55行）
3. 复制之前新建的用来存储jar包的路径，替换掉`<localRepository>`标签体内容 


![LOGO](/public/image/javapublic/WX20250406-153500@2x.png)

- 配置阿里云私服

由于中央仓库在国外，所以下载jar包速度可能比较慢，而阿里公司提供了一个远程仓库，里面基本也都有开源项目的jar包。
进入到conf目录下修改`settings.xml`配置文件：
1. 打开`settings.xml`文件，定位到160行左右
2. 在`<mirrors>`标签下为其添加子标签`<mirror>`，内容如下：

```xml
<mirror>
    <id>alimaven</id>
    <name>aliyun maven</name>
    <url>http://maven.aliyun.com/nexus/content/groups/public/</url>
    <mirrorOf>central</mirrorOf>
</mirror>
```

![LOGO](/public/image/javapublic/WX20250406-153740@2x.png)

- 配置环境变量

环境变量配置好后执行`mvn -v`命令，查看Maven版本，如果看到版本信息，则说明Maven安装成功。
其中默认的本地仓库地址是 `/Users/本机用户名/.m2`

![LOGO](/public/image/javapublic/WX20250406-154144@2x.png)










