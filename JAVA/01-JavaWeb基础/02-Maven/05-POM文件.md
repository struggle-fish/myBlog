# pom 文件

POM (Project Object Model) ：指的是项目对象模型，用来描述当前的maven项目。


## pom 文件
- 使用pom.xml文件来描述当前项目。 pom.xml文件如下：


```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <!-- POM模型版本 -->
    <modelVersion>4.0.0</modelVersion>

    <!-- 当前项目坐标 -->
    <groupId>com.itheima</groupId>
    <artifactId>maven-project01</artifactId>
    <version>1.0-SNAPSHOT</version>

    <!-- 项目的JDK版本及编码 -->
    <properties>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

</project>

```

pom文件详解：
- `<project>` ：pom文件的根标签，表示当前maven项目
- `<modelVersion>`：声明项目描述遵循哪一个POM模型版本
    - 虽然模型本身的版本很少改变，但它仍然是必不可少的。目前POM模型版本是4.0.0
- 坐标 ：
    - `<groupId> <artifactId> <version>`
    - 定位项目在本地仓库中的位置，由以上三个标签组成一个坐标
- `<maven.compiler.source>` ：编译JDK的版本
- `<maven.compiler.target>` ：运行JDK的版本
- `<project.build.sourceEncoding>` : 设置项目的字符集



## Maven 坐标

什么是坐标？
- Maven中的坐标是资源(jar)的唯一标识 , 通过该坐标可以唯一定位资源位置
- 使用坐标来定义项目或引入项目中需要的依赖


Maven坐标主要组成：
- groupId：定义当前Maven项目隶属组织名称（通常是域名反写，例如：com.itheima）
- artifactId：定义当前Maven项目名称（通常是模块名称，例如 order-service、goods-service）
- version：定义当前项目版本号
    - SNAPSHOT: 功能不稳定、尚处于开发中的版本，即快照版本
    - RELEASE: 功能趋于稳定、当前更新停止，可以用于发行的版本

如下图就是使用坐标表示一个项目：
![LOGO](/public/image/javapublic/9d661cef-d1d1-498b-81b6-2f7e9da6015c.png)


## 导入 Maven 项目

在IDEA中导入Maven项目，有两种方式。
- 方式一：File -> Project Structure -> Modules -> Import Module -> 选择maven项目的pom.xml。
![LOGO](/public/image/javapublic/9f8e5b3f-af84-46a1-a042-0ab14c8b2d79.png)



- 方式二：Maven面板 -> +（Add Maven Projects） -> 选择maven项目的pom.xml。
![LOGO](/public/image/javapublic/d0785af6-fbf2-4cf2-ac8f-ce8a04c6b67e.png)
