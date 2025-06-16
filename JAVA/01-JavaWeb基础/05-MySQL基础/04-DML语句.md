# DML 语句

DML英文全称是Data Manipulation Language(`数据操作语言`)，
用来对数据库中表的`数据记录进行增、删、改操作`。

- 添加数据（INSERT）
- 修改数据（UPDATE）
- 删除数据（DELETE） 


- 增加(insert)

::: code-group

```sql [格式]
-- 向指定字段添加数据
insert into 表名 (字段名1, 字段名2) values (值1, 值2);
-- 全部字段添加数据
insert into 表名 values (值1, 值2, ...);

-- 批量添加数据（指定字段）
insert into 表名 (字段名1, 字段名2) values (值1, 值2), (值1, 值2);

-- 批量添加数据（全部字段）
insert into 表名 values (值1, 值2, ...), (值1, 值2, ...);
```

```sql [示例1]
-- 案例1：向emp表的
-- username, name, gender, phone, create_time, update_time 字段插入数据

-- 因为设计表时create_time, update_time两个字段不能为NULL，所以也做为要插入的字段
insert into emp(
    username,
    name,
    gender,
    phone,
    create_time,
    update_time
)
values ('wuji', '张无忌', 1, '13309091231', now(), now());

```

```sql [示例2]
-- 向emp表的所有字段插入数据
insert into emp(
    id,
    username,
    password,
    name,
    gender,
    phone,
    job,
    salary,
    image,
    entry_date,
    create_time,
    update_time
)
values (
    1,
    'shinaian',
    '123456',
    '施耐庵',
    1,
    '13309090001',
    4,
    15000,
    '1.jpg',
    '2000-01-01',
    now(),
    now()
)

```

```sql [示例3]
-- 批量向emp表的username、name、gender字段插入数据

insert into emp(username, name, gender, phone, create_time, update_time)
values ('Tom1', '汤姆1', 1, '13309091231', now(), now()),
       ('Tom2', '汤姆2', 1, '13309091232', now(), now());

```
:::


:::tip insert操作的注意事项
1. 插入数据时，指定的字段顺序需要与值的顺序是一一对应的。
2. 字符串和日期型数据应该包含在引号中。
3. 插入的数据大小，应该在字段的规定范围内。
:::




- 修改(update)

::: code-group

```sql [格式]
update 表名 set 字段名1 = 值1 , 字段名2 = 值2 , .... [where 条件] ;
```

```sql [示例1]
-- 将emp表中id为1的员工，姓名name字段更新为'张三'
update emp set name='张三', update_time=now() where id=1;
```
```sql [示例2]
-- 将emp表的所有员工入职日期更新为'2010-01-01'
update emp set entry_date='2010-01-01', update_time=now();
```
:::

:::tip
1. 修改语句的条件可以有，也可以没有，如果没有条件，则会修改整张表的所有数据。
2. 在修改数据时，一般需要同时修改公共字段update_time，将其修改为当前操作时间。
:::



-  删除(delete)


::: code-group

```sql [格式]
delete from 表名  [where  条件] ;
```
```sql [示例1]
-- 删除emp表中id为1的员工
delete from emp where id = 1;
```
```sql [示例2]
-- 删除emp表中所有员工
delete from tb_emp;
```
:::

:::tip
- DELETE 语句的条件可以有，也可以没有，如果没有条件，则会删除整张表的所有数据。
- DELETE 语句不能删除某一个字段的值(可以使用UPDATE，将该字段值置为NULL即可)。
- 当进行删除全部数据操作时，会提示询问是否确认删除所有数据，直接点击Execute即可。
:::





































