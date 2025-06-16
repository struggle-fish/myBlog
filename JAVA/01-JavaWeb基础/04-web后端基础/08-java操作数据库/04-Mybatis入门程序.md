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



















