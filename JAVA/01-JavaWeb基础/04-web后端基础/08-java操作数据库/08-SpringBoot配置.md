# SpringBoot 配置


## 配置对比

一直使用springboot项目创建完毕后自带的`application.properties`进行属性的配置，
而如果在项目中，我们需要配置大量的属性，采用properties配置文件这种 
`key=value` 的配置形式，就会显得配置文件的层级结构不清晰，也比较臃肿。


![LOGO](/public/image/javapublic/5e285f2a-f37a-49a0-9a13-6f55d94e2105.png)




那其实呢，在springboot项目当中是支持多种配置方式的，
除了支持properties配置文件以外，还支持另外一种类型的配置文件，
就是我们接下来要讲解的`yml`格式的配置文件。yml格式配置文件名字为：`application.yaml` ,
`application.yml` 这两个配置文件的后缀名虽然不一样，但是里面配置的内容形式都是一模一样的。
我们可以来对比一下，采用 `application.properties` 和 `application.yml `来配置同一段信息(数据库连接信息)，
两者之间的配置对比：



![LOGO](/public/image/javapublic/3506fc76-57c3-4908-a817-ef764f3b83ad.png)

![LOGO](/public/image/javapublic/48b6f702-4f75-4158-8ad9-5a83467e0b81.png)










## 语法

- 大小写敏感
- 数值前边必须有空格，作为分隔符
- 使用缩进表示层级关系，缩进时，不允许使用Tab键，只能用空格（idea中会自动将Tab转换为空格）
- 缩进的空格数目不重要，只要相同层级的元素左侧对齐即可
- `#`表示注释，从这个字符一直到行尾，都会被解析器忽略



![LOGO](/public/image/javapublic/e26244c3-7052-4389-9bb7-39870203150a.png)


修改`application.properties`名字为：`_application.properties`（名字随便更换，只要加载不到即可）



![LOGO](/public/image/javapublic/67b05400-bee6-453d-bbbf-4444c3310b17.png)


![LOGO](/public/image/javapublic/5802e163-9213-4029-aef5-59cb38b6881a.png)



::: code-group
```yaml [application.yml]
#数据源配置
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/web01
    username: root
    password: root@1234
#mybatis配置
mybatis:
  configuration:
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
```
:::




















