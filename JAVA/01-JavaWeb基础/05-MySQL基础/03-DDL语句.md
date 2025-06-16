# DDL语句

DDL英文全称是Data Definition Language(数据定义语言)，用来定义数据库对象(数据库、表)。

DDL中数据库的常见操作：`查询、创建、使用、删除`。





## 表操作


关于表结构的操作也是包含四个部分：`创建表、查询表、修改表、删除表`。


### 创建表

::: code-group

```sql [格式]

-- 注意： [ ] 中的内容为可选参数； 最后一个字段后面没有逗号

create table  表名(
        字段1  字段1类型 [约束]  [comment  字段1注释 ],
        字段2  字段2类型 [约束]  [comment  字段2注释 ],
        ......
        字段n  字段n类型 [约束]  [comment  字段n注释 ] 
) [ comment  表注释 ] ;
```

``` sql [示例]

create table tb_user (
    id int comment 'ID,唯一标识',   # id是一行数据的唯一标识（不能重复）
    username varchar(20) comment '用户名',
    name varchar(10) comment '姓名',
    age int comment '年龄',
    gender char(1) comment '性别'
) comment '用户表';


```


:::

数据表创建完成，接下来还需要测试一下是否可以往这张表结构当中来存储数据。

双击打开tb_user表结构，大家会发现里面没有数据：


![LOGO](/public/image/javapublic/f66f6816-2574-48e1-90f2-5c4c330919d6.png)

添加数据：

![LOGO](/public/image/javapublic/2dbc5767-56e9-4c5b-923f-e02d9166d05e.gif)


#### 约束

- 概念：所谓约束就是作用在表中字段上的规则，用于限制存储在表中的数据。
- 作用：就是来保证数据库当中数据的正确性、有效性和完整性。


![LOGO](/public/image/javapublic/WX20250611-132723@2x.png)


::: code-group

```sql [示例]
create table tb_user (
    id int primary key comment 'ID,唯一标识', 
    username varchar(20) not null unique comment '用户名',
    name varchar(10) not null comment '姓名',
    age int comment '年龄',
    gender char(1) default '男' comment '性别'
) comment '用户表';
```

```sql [自增主键 auto_increment]
create table tb_user (
    id int primary key auto_increment comment 'ID,唯一标识', #主键自动增长
    username varchar(20) not null unique comment '用户名',
    name varchar(10) not null comment '姓名',
    age int comment '年龄',
    gender char(1) default '男' comment '性别'
) comment '用户表';
```

:::


![LOGO](/public/image/javapublic/356e8813-3889-4d6f-83d9-c179881ab0d9.gif)




#### 数据类型

MySQL中的数据类型有很多，主要分为三类：数值类型、字符串类型、日期时间类型。


- 数值类型


![LOGO](/public/image/javapublic/WX20250611-143242.png)

```sql
-- 年龄字段 ---不会出现负数, 而且人的年龄不会太大
   age tinyint unsigned

-- 分数 ---总分100分, 最多出现一位小数
   score double(4,1)
```

- 字符串类型

![LOGO](/public/image/javapublic/WX20250611-143854.png)


::: tip char 和 varchar

char(10) 固定占用10个字符串空间,存储A占用10个空间,存储ABCD也是占用10个空间
varchar(10) 最多占用10个字符串空间,占用实际存储的字符串空间,存储A占用1个空间,存储ABCD占用4个空间

:::

```sql

---长度不定, 最长不会超过50
username varchar(50)

---固定长度为11
phone char(11)
```


- 日期时间类型


![LOGO](/public/image/javapublic/WX20250611-151404.png)

```sql


---生日只需要年月日  
birthday date

--- 需要精确到时分秒
createtime  datetime
```





## 表结构设计

假如原型如下:

- 列表展示
![LOGO](/public/image/javapublic/56a98683-0584-4e8b-9952-7ece0bcc99d5.png)

- 新增员工


![LOGO](/public/image/javapublic/e5c5e142-a4e8-4d31-8390-8ccb77e360ec.png)


- 需求说明以及限制


![LOGO](/public/image/javapublic/b97e665a-b59d-49c7-8f13-4725238752ab.png)

步骤：
1. 阅读产品原型及需求文档，看看里面涉及到哪些字段。
2. 查看需求文档说明，确认各个字段的类型以及字段存储数据的长度限制。
3. 在页面原型中描述的基础字段的基础上，再增加额外的基础字段。


```sql
create table emp(
    id int unsigned primary key auto_increment comment 'ID,主键',
    username varchar(20) not null unique comment '用户名',
    password varchar(32) not null comment '密码',
    name varchar(10) not null comment '姓名',
    gender tinyint unsigned not null comment '性别, 1:男, 2:女',
    phone char(11) not null unique comment '手机号',
    job tinyint unsigned comment '职位, 1:班主任,2:讲师,3:学工主管,4:教研主管,5:咨询师',
    salary int unsigned comment '薪资',
    image varchar(255) comment '头像',
    entry_date date comment '入职日期',
    create_time datetime comment '创建时间',
    update_time datetime comment '修改时间'
) comment '员工表';

```

## 表其他操作

表结构的查询、修改、删除操作


:::code-group

```sql [查询]
-- 查询当前数据库的所有表
show tables;

-- 查看指定的表结构
desc 表名 ;   -- 可以查看指定表的字段、字段的类型、是否可以为NULL、是否存在默认值等信息

-- 查询指定表的建表语句
show create table 表名 ;
```

```sql [添加字段]

-- 添加字段
alter table 表名 add  字段名  类型(长度)  [comment 注释]  [约束];

-- 比如： 为tb_emp表添加字段qq，字段类型为 varchar(11)
alter table tb_emp add  qq  varchar(11) comment 'QQ号码';
```

```sql [修改字段]
-- 修改字段类型
alter table 表名 modify  字段名  新数据类型(长度);

-- 比如： 修改qq字段的字段类型，将其长度由11修改为13
alter table tb_emp modify qq varchar(13) comment 'QQ号码';

-- 修改字段名，字段类型
alter table 表名 change  旧字段名  新字段名  类型(长度)  [comment 注释]  [约束];

-- 比如： 修改qq字段名为 qq_num，字段类型varchar(13)
alter table tb_emp change qq qq_num varchar(13) comment 'QQ号码';

```

```sql [删除字段]
-- 删除字段
alter table 表名 drop 字段名;

-- 比如： 删除tb_emp表中的qq_num字段
alter table tb_emp drop qq_num;
```

```sql [修改表名]
-- 修改表名
rename table 表名 to  新表名;

-- 比如: 将当前的emp表的表名修改为tb_emp
rename table emp to tb_emp;
```

```sql [删除表结构]
-- 删除表
drop  table [ if exists ]  表名;

-- 比如：如果tb_emp表存在，则删除tb_emp表
drop table if exists tb_emp;  -- 在删除表时，表中的全部数据也会被删除。
```
:::

:::tip

关于表结构的查看、修改、删除操作，工作中一般都是直接基于图形化界面操作。
:::



![LOGO](/public/image/javapublic/WX20250611-171947@2x.png)


