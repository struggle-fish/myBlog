# Mybatis 入门程序


## 需求
需求：使用Mybatis查询所有用户数据 。



## 准备工作

1). 创建springboot工程，并导入 mybatis的起步依赖、mysql的驱动包、lombok。

![LOGO](/public/image/javapublic/f09f50df-83bb-49ab-953d-021b7f835e6f.png)



![LOGO](/public/image/javapublic/6eeb79bc-95be-4a4f-ad99-0fdef98f4678.png)


项目工程创建完成后，自动在pom.xml文件中，导入Mybatis依赖和MySQL驱动依赖。如下所示：

![LOGO](/public/image/javapublic/da689ba6-d2c1-4c51-9a68-59dec6cfaa60.png)

2). 数据准备：创建用户表user，并创建对应的实体类User。

```java
// 实体类
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private Integer id; //ID
    private String username; //用户名
    private String password; //密码
    private String name; //姓名
    private Integer age; //年龄
}


```

![LOGO](/public/image/javapublic/WX20250616-235251.png)

3). 配置Mybatis

在 `application.properties` 中配置数据库的连接信息。

```java 
#数据库访问的url地址
spring.datasource.url=jdbc:mysql://localhost:3306/web
#数据库驱动类类名
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
#访问数据库-用户名
spring.datasource.username=root
#访问数据库-密码
spring.datasource.password=root@1234

```


4). 编写Mybatis程序：编写Mybatis的持久层接口，定义SQL语句（注解）

在创建出来的springboot工程中，在引导类所在包下，在创建一个包 mapper 。在 mapper 包下创建一个接口 UserMapper ，这是一个持久层接口（Mybatis的持久层接口规范一般都叫 XxxMapper）。
UserMapper接口的内容如下：

```java 

import com.itheima.pojo.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import java.util.List;

@Mapper
public interface UserMapper {
    /**
     * 查询全部
     */
    @Select("select * from user")
    public List<User> findAll();
}

```

:::tip 注解说明：
- @Mapper注解：表示是mybatis中的Mapper接口
  程序运行时，框架会自动生成接口的实现类对象(代理对象)，并给交Spring的IOC容器管理
- @Select注解：代表的就是select查询，用于书写select查询语句
:::


5). 单元测试

在创建出来的SpringBoot工程中，在src下的test目录下，
已经自动帮我们创建好了测试类 ，
并且在测试类上已经添加了注解 `@SpringBootTest`，
代表该测试类已经与SpringBoot整合。
该测试类在运行时，会自动通过引导类加载Spring的环境（IOC容器）。
我们要测试那个bean对象，就可以直接通过`@Autowired`注解直接将其注入进行，
然后就可以测试了。 

```java 
@SpringBootTest
class SpringbootMybatisQuickstartApplicationTests {

    @Autowired
    private UserMapper userMapper;

    @Test
    public void testFindAll(){
        List<User> userList = userMapper.findAll();
        for (User user : userList) {
            System.out.println(user);
        }
    }
}

```

![LOGO](/public/image/javapublic/2638253c-56a7-4806-b284-e2f8aa10cb24.png)

**注意：测试类所在包，需要与引导类所在包相同。**

## 辅助配置

- **配置SQL提示**
默认我们在UserMapper接口上加的 `@Select` 注解中编写SQL语句是没有提示的。
如果想让idea给我们提示对应的SQL语句，
我们需要在IDEA中配置与MySQL数据库的链接。 

默认我们在UserMapper接口上的 @Select 
注解中编写SQL语句是没有提示的。如果想让idea给出提示，可以做如下配置：

如果没有生效,尝试使用 `alt + enter` 快捷键。

![LOGO](/public/image/javapublic/2a3de822-f4c5-4ad8-ba43-306030840449.png)


配置完成之后，发现SQL语句中的关键字有提示了，但还存在不识别表名(列名)的情况：

![LOGO](/public/image/javapublic/05a083ad-3b2a-484e-bd91-8549a33b921a.png)

- 产生原因：Idea和数据库没有建立连接，不识别表信息
- 解决方案：在Idea中配置MySQL数据库连接

按照如下方如下方式，来配置当前IDEA关联的MySQL数据库（必须要指定连接的是哪个数据库）。


![LOGO](/public/image/javapublic/31f6bb97-14d7-427c-9784-c105eae9723c.png)
![LOGO](/public/image/javapublic/6d686c89-1427-4efc-8ca1-53a979e2f94f.png)


:::tip

注意：该配置的目的，仅仅是为了在编写SQL语句时，
有语法提示（写错了会报错），不会影响运行，即使不配置也是可以的。
:::


- **配置Mybatis日志输出**


默认情况下，在Mybatis中，SQL语句执行时，我们并看不到SQL语句的执行日志。 
在`application.properties`加入如下配置，即可查看日志： 


```java 
#mybatis的配置
mybatis.configuration.log-impl=org.apache.ibatis.logging.stdout.StdOutImpl
```


## JDBC VS  Mybatis


JDBC程序的缺点：
- url、username、password 等相关参数全部硬编码在java代码中。
- 查询结果的解析、封装比较繁琐。
- 每一次操作数据库之前，先获取连接，操作完毕之后，关闭连接。 频繁的获取连接、释放连接造成资源浪费。


分析了JDBC的缺点之后，我们再来看一下在mybatis中，是如何解决这些问题的：
- 数据库连接四要素(驱动、链接、用户名、密码)，都配置在springboot默认的配置文件` application.properties`中
- 查询结果的解析及封装，由mybatis自动完成映射封装，我们无需关注
- 在mybatis中使用了`数据库连接池技术`，从而避免了频繁的创建连接、销毁连接而带来的资源浪费。

![LOGO](/public/image/javapublic/8089f516-844f-4110-8298-908334c20bd8.png)







