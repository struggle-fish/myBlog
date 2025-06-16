# JDBC 入门程序

![LOGO](/public/image/javapublic/WX20250613-133640@2x.png)


## 需求
需求：基于JDBC实现用户登录功能。

本质：其本质呢，其实就是基于JDBC程序，执行如下select语句，并将查询的结果输出到控制台。SQL语句：

```sql
select * from user 
where username = 'linchong' and password = '123456';
```

## 准备工作

1). 创建一个maven项目

![LOGO](/public/image/javapublic/a57f5245-ae16-47c0-b37d-2e872ea8a688.png)

2). 创建一个数据库 web，并在该数据库中创建user表

```sql
create table user(
    id int unsigned primary key auto_increment comment 'ID,主键',
    username varchar(20) comment '用户名',
    password varchar(32) comment '密码',
    name varchar(10) comment '姓名',
    age tinyint unsigned comment '年龄'
) comment '用户表';

insert into user(id, username, password, name, age) values (1, 'daqiao', '123456', '大乔', 22),
                                                           (2, 'xiaoqiao', '123456', '小乔', 18),
                                                           (3, 'diaochan', '123456', '貂蝉', 24),
                                                           (4, 'lvbu', '123456', '吕布', 28),
                                                           (5, 'zhaoyun', '12345678', '赵云', 27);
```

## 代码实现

1). 在 pom.xml 文件中引入依赖
```xml

<dependencies>
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
        <version>8.0.33</version>
    </dependency>

    <dependency>
        <groupId>org.junit.jupiter</groupId>
        <artifactId>junit-jupiter</artifactId>
        <version>5.9.3</version>
        <scope>test</scope>
    </dependency>

    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <version>1.18.30</version>
    </dependency>
</dependencies> 
```



2). 在 `src/main/test/java` 目录下编写测试类，定义测试方法


::: code-group

```java [入门例子]
package com.example.jdbcdemo;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

import org.junit.Test;

public class JDBCTest {

    @Test
    public void testUpdate() throws ClassNotFoundException, SQLException {
        System.out.println("Hello World!");

        // 1. 注册驱动
        Class.forName("com.mysql.jdbc.Driver");

        // 2. 获取连接
        Connection connection = DriverManager.getConnection(
                "jdbc:mysql://localhost:3306/web01",
                "root",
                "1234"
            );

        // 3. 获取SQL语句执行对象

        Statement statement = connection.createStatement();

        // 4. 执行SQL语句
        int i = statement.executeUpdate(
            "update user set age = 25 where id = 1"
        );

        System.out.println("记录数：" + i);

        // 5. 释放资源
        statement.close();
    }
}


```

```java [查询例子]
public class JDBCTest {

    /**
     * 编写JDBC程序, 查询数据
     */
    @ParameterizedTest
    @CsvSource({"daqiao,123456"})
    public void testJdbc(String _username, String _password) throws Exception {
        // 获取连接
        Connection conn = DriverManager.getConnection(
                "jdbc:mysql://localhost:3306/web01",
                "root",
                "1234"
            );
        // 创建预编译的PreparedStatement对象
        PreparedStatement pstmt = conn.prepareStatement(
            "SELECT * FROM user WHERE username = ? AND password = ?"
        );
        // 设置参数
        pstmt.setString(1, _username); // 第一个问号对应的参数
        pstmt.setString(2, _password); // 第二个问号对应的参数
        // 执行查询
        ResultSet rs = pstmt.executeQuery();
        // 处理结果集
        while (rs.next()) {
            int id = rs.getInt("id");
            String uName = rs.getString("username");
            String pwd = rs.getString("password");
            String name = rs.getString("name");
            int age = rs.getInt("age");

            System.out.println(
                "ID: " + id + ", 
                Username: " + uName + ",
                 Password: " + pwd + ", 
                 Name: " + name + ", 
                 Age: " + age
             );
        }
        // 关闭资源
        rs.close();
        pstmt.close();
        conn.close();
    }

}

```
:::

![LOGO](/public/image/javapublic/WX20250613-172303@2x.png)

:::tip 📢

1. JDBC 程序执行DML语句? DQL语句?
- DML语句：` int rowsAffected = statement.executeUpdate();`
- DQL语句：` ResultSet resultSet = statement.executeQuery();`

2. DQL 语句执行完毕后结果集`ResultSet`如何处理?

- `resultSet.next()`：移动到下一行
- `resultSet.getXxx("")`：获取字段数据

:::



## 预编译SQL

在编写SQL语句的时候，有两种风格：

- 静态SQL（参数硬编码）
- 预编译SQL（参数动态传递）


::: code-group

```java [静态SQL]
// 静态SQL 参数值是写死的。
conn.prepareStatement(
    "SELECT * FROM user WHERE username = 
    'daqiao' AND password = '123456'"
);
ResultSet resultSet = pstmt.executeQuery();
```
```java [预编译SQL]
// 预编译SQL
// 使用 ？ 进行占位，然后再指定每一个占位符对应的值是多少
conn.prepareStatement(
    "SELECT * FROM user WHERE username = ? AND password = ?"
);
pstmt.setString(1, "daqiao");
pstmt.setString(2, "123456");
ResultSet resultSet = pstmt.executeQuery();
```
:::


那这种预编译的SQL，也是在项目开发中推荐使用的SQL语句。主要的作用有两个：
- 防止SQL注入
- 性能更高


![LOGO](/public/image/javapublic/2ab996b7-37b0-4e16-9ea8-b37b698f6714.png)





































































