# Maven 介绍



Apache Maven是一个项目管理和构建工具，它基于项目对象模型(Project Object Model , 简称: POM)的概念，
通过一小段描述信息来管理项目的构建、报告和文档。


## Maven 作用

- 方便的依赖管理
- 统一的项目结构
- 标准的项目构建流程

## Maven 模型


- 项目对象模型（Project Object Model）
- 依赖管理模型（Dependency）
- 构建声明周期/阶段（Build lifecycle & phases）


1、构建声明周期/阶段（Build lifecycle & phases）

![LOGO](/public/image/javapublic/5d10ec71-c1f1-4cbf-9111-df10455ad52b.png)

当我们需要编译，Maven提供了一个编译插件供我们使用；当我们需要打包，Maven就提供了一个打包插件供我们使用等。


2、项目对象模型（Project Object Model）
![LOGO](/public/image/javapublic/b516341f-4d76-45a3-8616-542ed5f313cb.png)

以上图中紫色框起来的部分属于项目对象模型，就是将我们自己的项目抽象成一个对象模型，有自己专属的坐标，如下图所示是一个Maven项目：


![LOGO](/public/image/javapublic/ec2c461b-a2be-446c-aea1-751411ee9aaa.png)

::: tip
坐标，就是资源(jar包)的唯一标识，通过坐标可以定位到所需资源(jar包)位置。
坐标的组成部分：
- groupId: 组织名
- arfitactId: 模块名
- Version: 版本号
:::

3、依赖管理模型(Dependency)

![LOGO](/public/image/javapublic/ca7fc8df-7b8d-4255-aa20-0b136f88b3a7.png)

以上图中紫色框起来的部分属于依赖管理模型，是使用坐标来描述当前项目依赖哪些第三方jar包。

![LOGO](/public/image/javapublic/f4f8a4a4-0a40-4b8c-b47a-fbbcc8358d72.png)

<sapn class="marker-text">
之前我们项目中需要jar包时，直接就把jar包复制到项目下的lib目录，
而现在我们只需要在pom.xml中配置依赖的配置文件即可。
</sapn>
而这个依赖对应的jar包其实就在我们本地电脑上的maven仓库中。
如下图，本地的maven仓库中的jar文件：

![LOGO](/public/image/javapublic/WX20250406-145828@2x.png)



## Maven 仓库

仓库：用于存储资源，管理各种jar包

<sapn class="marker-text">
仓库的本质就是一个目录(文件夹)，这个目录被用来存储开发中所有依赖(就是jar包)和插件
</sapn>


Maven仓库分为：
- 本地仓库：自己计算机上的一个目录(用来存储jar包)
- 中央仓库：由Maven团队维护的全球唯一的。https://repo1.maven.org/maven2/
- 远程仓库(私服)：一般由公司团队


![LOGO](/public/image/javapublic/2e6e5c21-0825-48e0-923d-67df9dc2e6ba.png)



当项目中使用坐标引入对应依赖jar包后，
- 首先会查找本地仓库中是否有对应的jar包
    - 如果有，则在项目直接引用
    - 如果没有，则去中央仓库中下载对应的jar包到本地仓库
- 还可以搭建远程仓库(私服)，将来jar包的查找顺序则变为： `本地仓库 --> 远程仓库--> 中央仓库`





