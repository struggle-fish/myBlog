# JDBC 介绍

![LOGO](/public/image/javapublic/WX20250613-132413@2x.png)

作为程序开发人员，通常会使用Java程序来完成对数据库的操作。
Java程序操作数据库的技术呢，有很多，而最为底层、最为基础的就是`JDBC`。



`JDBC：（Java DataBase Connectivity）`，
就是使用Java语言操作关系型数据库的一套API。 
`【是操作数据库最为基础、底层的技术】`


但是使用JDBC来操作数据库，会比较繁琐，所以现在在企业项目开发中呢，一般都会使用基于JDBC的封装的高级框架，
比如：`Mybatis、MybatisPlus、Hibernate、SpringDataJPA`。 


## 介绍

`JDBC：（Java DataBase Connectivity）`，
就是使用Java语言操作关系型数据库的一套API。

![LOGO](/public/image/javapublic/1280X1280-jdbc.png)


::: tip **本质：**
- sun公司官方定义的一套操作所有关系型数据库的规范，即接口。
- 各个数据库厂商去实现这套接口，提供数据库驱动jar包。
- 我们可以使用这套接口(JDBC)编程，真正执行的代码是驱动jar包中的实现类。
:::




























