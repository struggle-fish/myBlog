# OptionsAPI 与 CompositionAPI


Vue2 的API设计是Options（配置/选项式）风格的。

Vue3 的API设计是Composition（组合式）风格的。


## Options API 的弊端

Options类型的 API，数据、方法、计算属性等，是分散在：data、methods、computed中的，若想新增或者修改一个需求，就需要分别修改：data、methods、computed，不便于维护和复用。


![LOGO](/public/image/base/1696662197101-55d2b251-f6e5-47f4-b3f1-d8531bbf9279.gif)


![LOGO](/public/image/base/1696662200734-1bad8249-d7a2-423e-a3c3-ab4c110628be.gif)



## Composition API 的优势

可以用函数的方式，更加优雅的组织代码，让相关功能的代码更加有序的组织在一起。


![LOGO](/public/image/base/1696662249851-db6403a1-acb5-481a-88e0-e1e34d2ef53a.gif)

![LOGO](/public/image/base/1696662256560-7239b9f9-a770-43c1-9386-6cc12ef1e9c0.gif)






