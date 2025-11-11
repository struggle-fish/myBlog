# IoC 和 AOP


## IoC 控制反转

IoC（控制反转）：解决 “对象依赖” 问题
解决了对象依赖的 “耦合问题”，让组件之间松耦合，便于扩展和测试；

::: tip
将对象的创建权和依赖关系的管理权从代码中 “反转” 给框架（如 `Spring` 容器），
而非由开发者手动通过 `new` 关键字创建对象或维护依赖。
:::

### 为什么需要 IoC？

传统开发中，对象的创建和依赖关系由代码直接控制，例如：

```java
public class UserService {
    // 手动创建依赖的对象
    private UserDao userDao = new UserDao(); 
    
    public void doService() {
        userDao.doDao(); // 直接依赖 UserDao 的实现
    }
}

```

- 依赖关系 “硬编码”，如果 `UserDao` 换成其他实现（如 `UserDaoMySQL`），必须修改 `UserService` 的代码，违背 “开闭原则”；
- 对象创建逻辑分散在各处，难以统一管理（如单例、懒加载等）；
- 测试困难（无法轻松替换为模拟对象）。

### IoC 如何解决？

Spring 引入 “容器”（IoC Container），由容器负责：

- 创建对象：开发者通过注解（如 `@Service、@Component`）或配置文件告诉容器需要管理哪些类；

- 管理依赖：通过 `@Autowired` 等注解声明依赖，容器自动将依赖的对象 “注入” 到当前对象中（即 “依赖注入 DI”，`DI 是 IoC 的具体实现方式`）。

```java

// 1. 告诉容器：这是一个需要管理的对象
@Service
public class UserService {
    // 2. 声明依赖，由容器自动注入（无需手动 new）
    @Autowired
    private UserDao userDao; 
    
    public void doService() {
        userDao.doDao(); 
    }
}

// 3. 容器管理的依赖实现类
@Repository
public class UserDaoMySQL implements UserDao {
    public void doDao() { ... }
}
```


此时，`UserService` 不再关心 `UserDao` 如何创建，也不依赖具体实现
（如果换成 `UserDaoOracle`，只需修改 `UserDao` 的实现类，`UserService` 无需改动）。

:::tip

- 传统方式：你（开发者）亲自买菜（创建对象）、做饭（管理依赖）；

- IoC 方式：你（开发者）告诉餐厅（Spring 容器）想吃什么（声明需要的对象和依赖），餐厅做好后直接端给你（容器注入对象）。
  
:::

## AOP

AOP（面向切面编程）：解决 “横切逻辑” 问题
解决了横切逻辑的 “冗余问题”，让业务逻辑更纯粹，便于维护

### 核心思想

将分散在各个业务逻辑中的通用横切逻辑（如日志、事务、权限校验）抽离出来，单独定义和管理，再 “动态织入” 到业务方法中，实现 “关注点分离”。

### 为什么需要 AOP？

业务代码中往往混杂着大量非业务逻辑（横切逻辑），例如：

```java 
public class OrderService {
    public void createOrder() {
        // 横切逻辑：日志
        log.info("开始创建订单");
        // 横切逻辑：权限校验
        if (!hasPermission()) { throw new Exception(); }
        // 横切逻辑：事务开始
        tx.begin();
        
        // 核心业务逻辑
        doCreateOrder();
        
        // 横切逻辑：事务提交
        tx.commit();
        // 横切逻辑：日志
        log.info("订单创建完成");
    }
}
```

- 横切逻辑重复出现在多个方法中，代码冗余，维护困难（如修改日志格式需改所有方法）；
- 业务逻辑被横切逻辑 “污染”，可读性差。

### AOP 如何解决？

AOP 将横切逻辑抽离为 “切面（`Aspect`）”，通过配置指定在哪些业务方法（“连接点 `JoinPoint`”）的什么时机（“通知 `Advice`”：如方法前、后、异常时）执行。


- 定义切面（横切逻辑）：

```java 
@Aspect // 标识为切面
@Component
public class LogAspect {
    // 定义：在所有 Service 类的方法执行前打印日志
    @Before("execution(* com.example.service.*.*(..))")
    public void logBefore() {
        log.info("方法开始执行");
    }
}

```

- 业务代码只保留核心逻辑：

```java 
@Service
public class OrderService {
    public void createOrder() {
        // 只关注核心业务，横切逻辑由 AOP 自动织入
        doCreateOrder();
    }
}

```

运行时，Spring 会通过动态代理技术，在 `createOrder()` 执行前自动调用 `logBefore()`，实现横切逻辑与业务逻辑的分离。


### 通俗理解

- 传统方式：每个演员（业务方法）表演时，都要自己带灯光、音响（横切逻辑）；
- AOP 方式：专门的灯光师、音响师（切面）负责这些通用工作，演员只需专注表演（核心业务）。

