# DQL语句

DQL英文全称是`Data Query Language(数据查询语言)`，用来查询数据库表中的记录。

查询关键字：**SELECT**


::: tip DQL查询语句的格式
```sql
SELECT
    字段列表
FROM
    表名列表
WHERE
    条件列表
GROUP  BY
    分组字段列表
HAVING
    分组后条件列表
ORDER BY
    排序字段列表
LIMIT
    分页参数
```
:::



## 基本查询

::: code-group

```sql [格式]
-- 查询多个字段
select 字段1, 字段2, 字段3 from  表名;

-- 查询所有字段（通配符）
select *  from  表名;

-- 设置别名
select 字段1 [ as 别名1 ] , 字段2 [ as 别名2 ]  from  表名;

-- 去除重复记录
select distinct 字段列表 from  表名;

```

```sql [示例]
-- 案例1：查询指定字段 name，entry_date并返回
select name,entry_date from emp;

-- 案例2：查询返回所有字段
select * from emp;

-- 案例3：查询所有员工的 name, entry_date，并起别名(姓名、入职日期)
-- 方式1：
select name AS 姓名, entry_date AS 入职日期 from emp;

-- 方式2： 别名中有特殊字符时，使用''或""包含
select name AS '姓 名', entry_date AS '入职日期' from emp;

-- 方式3：
select name AS "姓名", entry_date AS "入职日期" from emp;


-- 案例4：查询已有的员工关联了哪几种职位(不要重复)
select distinct job from emp;
```
:::


## 条件查询

条件查询就是学习条件的构建方式，而在SQL语句当中构造条件的运算符分为两类：
- 比较运算符


![LOGO](/public/image/javapublic/WX20250612-151924.png)

- 逻辑运算符

![LOGO](/public/image/javapublic/WX20250612-152034.png)

::: code-group

```sql [格式]
-- 条件列表：意味着可以有多个条件
select  字段列表  from   表名   where   条件列表 ; 
```

```sql [示例]
-- 案例1：查询 姓名 为 '杨逍' 的员工
-- 字符串使用''或""包含
select id,
       username,
       password,
       name,
       gender,
       phone,
       salary,
       job,
       image,
       entry_date,
       create_time,
       update_time
from emp
where name = '杨逍'; 


-- 案例2：查询 薪资小于等于 5000 的员工信息
select id,
       username,
       password,
       name,
       gender,
       phone,
       salary,
       job,
       image,
       entry_date,
       create_time,
       update_time
from emp
where salary <=5000;

-- 案例3：查询 没有分配职位 的员工信息
select id,
       username,
       password,
       name,
       gender,
       phone,
       salary,
       job,
       image,
       entry_date,
       create_time,
       update_time
from emp
where job is null ;

-- 注意：
-- 查询为NULL的数据时，
-- 不能使用 = null 或 ！=null 。
-- 得使用 is null 或 is not null。


-- 案例4：查询 有职位 的员工信息

select id,
       username,
       password,
       name,
       gender,
       phone,
       salary,
       job,
       image,
       entry_date,
       create_time,
       update_time
from emp
where job is not null ;

-- 案例5：查询 密码不等于 '123456' 的员工信息
-- 方式1：
select id,
       username,
       password,
       name,
       gender,
       phone,
       salary,
       job,
       image,
       entry_date,
       create_time,
       update_time
from emp
where password <> '123456';

-- 方式2：
select id,
       username,
       password,
       name,
       gender,
       phone,
       salary,
       job,
       image,
       entry_date,
       create_time,
       update_time
from emp
where password != '123456';


-- 案例6：
-- 查询 入职日期 在  '2000-01-01' (包含)  到  '2010-01-01'(包含) 之间的员工信息

-- 方式1：
select id,
       username,
       password,
       name,
       gender,
       phone,
       salary,
       job,
       image,
       entry_date,
       create_time,
       update_time
from emp
where entry_date >= '2000-01-01' and entry_date <= '2010-01-01';

-- 方式2： between...and
select id,
       username,
       password,
       name,
       gender,
       phone,
       salary,
       job,
       image,
       entry_date,
       create_time,
       update_time
from emp
where entry_date between '2000-01-01' and '2010-01-01';


-- 案例7：查询 入职时间
-- 在 '2000-01-01' (包含) 到 '2010-01-01'(包含) 之间
-- 且 性别为女 的员工信息
select id,
       username,
       password,
       name,
       gender,
       phone,
       salary,
       job,
       image,
       entry_date,
       create_time,
       update_time
from emp
where entry_date between '2000-01-01' and '2010-01-01';
and gender = 2;

-- 案例8：查询 职位是 2 (讲师), 
-- 3 (学工主管), 4 (教研主管) 的员工信息
-- 方式1：使用or连接多个条件
select id,
       username,
       password,
       name,
       gender,
       phone,
       salary,
       job,
       image,
       entry_date,
       create_time,
       update_time
from emp
where job=2 or job=3 or job=4;

-- 方式2：in关键字
select id,
       username,
       password,
       name,
       gender,
       phone,
       salary,
       job,
       image,
       entry_date,
       create_time,
       update_time
from emp
where job in (2,3,4);

-- 案例9：查询 姓名 为两个字的员工信息
select id,
       username,
       password,
       name,
       gender,
       phone,
       salary,
       job,
       image,
       entry_date,
       create_time,
       update_time
from emp
where name like '__';  # 通配符 "_" 代表任意1个字符;
                         
-- 案例10：查询 姓 '张' 的员工信息
select id,
       username,
       password,
       name,
       gender,
       phone,
       salary,
       job,
       image,
       entry_date,
       create_time,
       update_time
from emp
where name like '张%'; # 通配符 "%" 代表任意个字符（0个 ~ 多个）

                                               
-- 案例11：查询 姓名中包含 '二'  的员工信息
select id,
       username,
       password,
       name,
       gender,
       phone,
       salary,
       job,
       image,
       entry_date,
       create_time,
       update_time
from emp
where name like '%二%'; # 通配符 "%" 代表任意个字符（0个 ~ 多个）
```
:::











































## 聚合函数

之前做的查询都是横向查询，就是根据条件一行一行的进行判断，
而使用聚合函数查询就是纵向查询，它是对一列的值进行计算，
然后返回一个结果值。（将一列数据作为一个整体，进行纵向计算）


![LOGO](/public/image/javapublic/WX20250612-164556.png)

注意 : 聚合函数会忽略空值，对NULL值不作为统计。

:::code-group

```sql [案例]
-- 案例1：统计该企业员工数量
-- count(字段)
select count(id) from emp;-- 结果：30
select count(job) from emp;-- 结果：29 （聚合函数对NULL值不做计算）

-- count(常量)
select count(0) from emp;
select count('A') from emp;

-- count(*)  推荐此写法（MySQL底层进行了优化）
select count(*) from emp;


-- 案例2：统计该企业员工的平均薪资
select avg(salary) from  emp;

-- 案例3：统计该企业员工的最低薪资
select min(salary) from emp;

-- 案例4：统计该企业员工的最高薪资
select max(salary) from emp;

-- 案例5：统计该企业每月要给员工发放的薪资总额(薪资之和)
select sum(salary) from emp;

```

:::




## 分组查询

分组： 按照某一列或者某几列，把相同的数据进行合并输出。
- 分组其实就是按列进行分类(指定列下相同的数据归为一类)，然后可以对分类完的数据进行合并计算。
- 分组查询通常会使用聚合函数进行计算。

::: code-group

```sql [格式]

select  字段列表  from  表名  
[where 条件]  group by 分组字段名  [having 分组后过滤条件];

```

```sql [案例]

-- 案例1：根据性别分组 , 统计男性和女性员工的数量
-- 按照gender字段进行分组（gender字段下相同的数据归为一组）
select gender, count(*)
from emp
group by gender;


-- 案例2：查询入职时间在 '2015-01-01' (包含) 以前的员工 ,
-- 并对结果根据职位分组 , 获取员工数量大于等于2的职位

select job, count(*)
from emp
where entry_date <= '2015-01-01'   -- 分组前条件
group by job                      -- 按照job字段分组
having count(*) >= 2;             -- 分组后条件

```

- 分组之后，查询的字段一般为聚合函数和分组字段，查询其他字段无任何意义
- 执行顺序：where > 聚合函数 > having

:::

:::tip where与having区别（面试题）
- 执行时机不同：where是分组之前进行过滤，不满足where条件，不参与分组；而having是分组之后对结果进行过滤。
- 判断条件不同：where不能对聚合函数进行判断，而having可以。
:::


## 排查查询

排序在日常开发中是非常常见的一个操作，有升序排序，也有降序排序。


:::code-group

```sql [格式]
-- ASC ：升序（默认值） DESC：降序
select  字段列表  
from   表名   
[where  条件列表] 
[group by  分组字段 ] 
order  by  字段1  排序方式1 , 字段2  排序方式2 … ;


```
```sql [案例]
-- 案例1：根据入职时间, 对员工进行升序排序

select id,
       username,
       password,
       name,
       gender,
       phone,
       salary,
       job,
       image,
       entry_date,
       create_time,
       update_time
from emp
order by entry_date ASC; -- 按照entrydate字段下的数据进行升序排序

-- 案例2：根据入职时间，对员工进行降序排序

select id,
       username,
       password,
       name,
       gender,
       phone,
       salary,
       job,
       image,
       entry_date,
       create_time,
       update_time
from emp
order by entry_date DESC; -- 按照entrydate字段下的数据进行降序排序

-- 案例3：根据入职时间对公司的员工进行升序排序，
-- 入职时间相同，再按照更新时间进行降序排序

select id,
       username,
       password,
       name,
       gender,
       phone,
       salary,
       job,
       image,
       entry_date,
       create_time,
       update_time
from emp
order by entry_date ASC , update_time DESC;


```
:::



## 分页查询

分页操作在业务系统开发时，也是非常常见的一个功能，
日常我们在网站中看到的各种各样的分页条，后台也都需要借助于数据库的分页操作。

:::code-group

```sql [格式]
select  字段列表  from  表名  limit  起始索引, 查询记录数 ;
```

```sql [案例]
-- 案例1：从起始索引0开始查询员工数据, 每页展示5条记录
select id,
       username,
       password,
       name,
       gender,
       phone,
       salary,
       job,
       image,
       entry_date,
       create_time,
       update_time
from emp
limit 0 , 5; -- 从索引0开始，向后取5条记录


-- 案例2：查询 第1页 员工数据, 每页展示5条记录
select id,
       username,
       password,
       name,
       gender,
       phone,
       salary,
       job,
       image,
       entry_date,
       create_time,
       update_time
from emp
limit 5; -- 如果查询的是第1页数据，起始索引可以省略，直接简写为：limit 条数             

-- 案例3：查询 第2页 员工数据, 每页展示5条记录
select id,
       username,
       password,
       name,
       gender,
       phone,
       salary,
       job,
       image,
       entry_date,
       create_time,
       update_time
from emp
limit 5 , 5; -- 从索引5开始，向后取5条记录

-- 案例4：查询 第3页 员工数据, 每页展示5条记录
select id,
       username,
       password,
       name,
       gender,
       phone,
       salary,
       job,
       image,
       entry_date,
       create_time,
       update_time
from emp
limit 10 , 5; -- 从索引10开始，向后取5条记录


```
:::

:::tip

1. 起始索引从0开始。 计算公式 ：起始索引 = （查询页码 - 1）* 每页显示记录数
2. 分页查询是数据库的方言，不同的数据库有不同的实现，MySQL中是LIMIT
3. 如果查询的是第一页数据，起始索引可以省略，直接简写为 limit  条数
:::











