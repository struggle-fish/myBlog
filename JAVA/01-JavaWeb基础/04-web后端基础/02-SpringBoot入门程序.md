# Spring Boot 入门程序


## Spring全家桶

Spring家族旗下这么多的技术，最基础、最核心的是 SpringFramework。
其他的spring家族的技术，都是基于SpringFramework的，
SpringFramework中提供很多实用功能，
如：依赖注入、事务管理、web开发支持、数据访问、消息服务等等。


![LOGO](/public/image/javapublic/e08f5770-de71-425c-8687-7f11b881c00a.png)


而如果我们在项目中，直接基于SpringFramework进行开发，存在两个问题：

- 配置繁琐
- 入门难度大

![LOGO](/public/image/javapublic/WX20250416-103703@2x.png)

所以基于此呢，spring官方推荐我们从另外一个项目开始学习，那就是目前最火爆的SpringBoot。 
通过springboot就可以快速的帮我们构建应用程序，所以springboot呢，最大的特点有两个 ：

- 简化配置
- 快速开发


![LOGO](/public/image/javapublic/WX20250416-104205@2x.png)

## 快速开始


基于SpringBoot的方式开发一个web应用，浏览器发起请求`/hello`后，
给浏览器返回字符串` "Hello xxx ~"`。

![LOGO](/public/image/javapublic/5ef9dbad-2ae9-42af-9ca0-6bd458237d89.png)


1). 创建SpringBoot工程（需要联网）
基于Spring官方骨架，创建SpringBoot工程

![LOGO](/public/image/javapublic/079be202-4027-4aef-8075-abbb62e3533f.png)


![LOGO](/public/image/javapublic/0281a43f-9732-4f98-a03d-06d5c5cfa05d.png)

点击Create之后，就会联网创建这个SpringBoot工程，创建好之后，结构如下：

![LOGO](/public/image/javapublic/4f3dcd97-9c99-4b9c-b5e3-c6d20aeb4d23.png)


2). 定义HelloController类，添加方法hello，并添加注解
请求处理类，一般都是 xxxController 结尾，

![LOGO](/public/image/javapublic/WX20250416-142956.png)

HelloController中的内容，具体如下：

```java
package com.example.springbootwebquickstart;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController // 标识是一个请求处理类
public class HelloController {

    @RequestMapping("/hello")
    public String hello(String name) {
        System.out.println("hello, " + name);
        return "Hello" + name + '~'
    }
}

```

3). 运行测试

运行SpringBoot自动生成的引导类 (标识有`@SpringBootApplication`注解的类)

![LOGO](/public/image/javapublic/9e21ebbc-24af-4f08-88bd-3ac16bc79110.png)


打开浏览器，输入 `http://localhost:8080/hello?name=hahah`





## 运行分析

在入门程序中，我们发现，我们只需要一个main方法就可以将web应用启动起来了，
然后就可以打开浏览器访问了。

1). 为什么一个main方法就可以将Web应用启动了？

![LOGO](/public/image/javapublic/f95eb6d3-7f5d-4d6b-a33c-404d5aea9586.png)

因为我们在创建springboot项目的时候，选择了web开发的起步依赖 `spring-boot-starter-web`。
而spring-boot-starter-web依赖，又依赖了`spring-boot-starter-tomcat`，
**由于maven的依赖传递特性**，
那么在我们创建的springboot项目中也就已经有了tomcat的依赖，
这个其实就是springboot中内嵌的`tomcat`。 



![LOGO](/public/image/javapublic/9656f962-e153-4e1f-bd5e-b0fe450873e6.png)

而我们运行引导类中的main方法，其实启动的就是springboot中内嵌的Tomcat服务器。 而我们所开发的项目，
也会自动的部署在该tomcat服务器中，并占用8080端口号 。 

![LOGO](/public/image/javapublic/c26e030d-67b2-4f8f-b45c-da9d83e61b4b.png)

::: tip 起步依赖

- 一种为开发者提供简化配置和集成的机制，使得构建Spring应用程序更加轻松。起步依赖本质上是一组预定义的依赖项集合，它们一起提供了在特定场景下开发Spring应用所需的所有库和配置。
    - spring-boot-starter-web：包含了web应用开发所需要的常见依赖。
    - spring-boot-starter-test：包含了单元测试所需要的常见依赖。
- 官方提供的starter：https://docs.spring.io/spring-boot/docs/3.1.3/reference/htmlsingle/#using.build-systems.starters
:::












