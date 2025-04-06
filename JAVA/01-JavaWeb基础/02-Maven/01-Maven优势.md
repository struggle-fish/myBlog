# Maven 优势

Maven 是一款用于管理和构建Java项目的工具，是apache旗下的开源项目。


## Maven 作用

![LOGO](/public/image/javapublic/maven-1280X1280.png)

### 依赖管理

方便快捷的管理项目依赖的资源(jar包)，避免版本冲突问题。 
只需要在maven项目的pom.xml文件中，添加一段如下图所示的配置即可实现。


![LOGO](/public/image/javapublic/maven1-1280X1280.png)


### 项目构建

通过Maven中的命令，就可以很方便的完成项目的编译(compile)、测试(test)、打包(package)、发布(deploy) 等操作。
而且这些操作都是跨平台的。

![LOGO](/public/image/javapublic/2340e5fa-555b-4dca-8555-d9df4b54e13b.png)

![LOGO](/public/image/javapublic/WX20250401-145501.png)


### 统一项目结构

如果我们使用了Maven这一款项目构建工具，它给我们提供了一套标准的java项目目录。如下所示：
![LOGO](/public/image/javapublic/aef91964-e9e3-4609-9b4c-d82a45bf309d.png)

也就意味着，无论我们使用的是什么开发工具，只要是基于maven构建的java项目，最终的目录结构都是相同的，
如图所示。 那这样呢，我们使用Eclipse、MyEclipse、IDEA创建的maven项目，
就可以在各个开发工具直接直接导入使用了，更加方便、快捷。

![LOGO](/public/image/javapublic/3a7bcd0f-cd18-4ed8-93a2-ee17c2d18d15.png)


而在上面的maven项目的目录结构中，
main目录下存放的是项目的源代码，
test目录下存放的是项目的测试代码。 
而无论是在main还是在test下，都有两个目录，
一个是java，用来存放源代码文件；
另一个是resources，用来存放配置文件。

<sapn class="marker-text">
最后呢，一句话总结一下什么是Maven。 Maven就是一款管理和构建java项目的工具。
</sapn>




