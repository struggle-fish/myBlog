# SQL语句

结构化查询语言。一门操作关系型数据库的编程语言，定义操作所有关系型数据库的统一标准。
SQL语句根据其功能被分为四大类：`DDL、DML、DQL、DCL` 。

- DDL (Data Definition Language)  数据定义语言，用来定义数据库对象(数据库，表，字段)
- DML (Data Manipulation Language) 数据操作语言，用来对数据库表中的数据进行增删改
- DQL (Data Query Language) 数据查询语言，用来查询数据库中表的记录
- DCL (Data Control Language) 数据控制语言，用来创建数据库用户、控制数据库的访问权限

![LOGO](/public/image/javapublic/072fcecc-8b49-4104-9cdc-c8d86d3aa9ae.png)


:::code-group
```sql [DDL语句]
-- 查询所有数据库
show databases; 

-- 查询当前使用的数据库
select database();


-- 创建数据库
create database [ if not exists ] 数据库名  [default charset utf8mb4];

-- 数据库不存在,则创建该数据库；如果存在则不创建
create database if not exists itcast;

-- 使用数据库
use 数据库名

-- 删除数据库
drop database [ if exists ] 数据库名 ;

```
:::

![LOGO](/public/image/javapublic/WX20250609-195259@2x.png)


## 图形化工具

使用 idea 或者图形化工具来操作数据库，可以更直观地进行数据的管理和操作。

![LOGO](/public/image/javapublic/653b9546-f5de-4f74-8631-b8e058584797.png)

![LOGO](/public/image/javapublic/355bcf2a-2f18-45d9-8502-31d422081b0c.png)

- 使用图形化工具创建数据库

![LOGO](/public/image/javapublic/WX20250610-134440@2x.png)































