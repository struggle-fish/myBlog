# Hooks


Vue3 中的 Hooks 本质是基于 Composition API 封装的可复用逻辑函数，
核心目的是抽离组件中通用的业务逻辑（如防抖、请求、权限校验等），让代码更易维护、复用性更强。


Hooks 即 “钩子函数”，在 Vue3 中特指以 `use` 开头、封装特定逻辑的组合式函数（如 useRequest、useDebounce）；

本质是把组件中可复用的逻辑（如数据请求、防抖、监听窗口大小）抽离成独立函数，多个组件可直接调用，避免重复代码。


✅ useDebounce：防抖 Hooks（搜索框 / 输入框）

```js

// src/hooks/useDebounce.js
import { ref, customRef } from 'vue';

export function useDebounce(value, delay = 300) {
  // 防抖 ref（自定义 ref 实现）
  const debouncedValue = customRef((track, trigger) => {
    let timer;
    return {
      get() {
        track();
        return value;
      },
      set(newVal) {
        clearTimeout(timer);
        timer = setTimeout(() => {
          value = newVal;
          trigger();
        }, delay);
      }
    };
  });

  // 防抖函数（通用方法）
  const debounceFn = (fn) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  return { debouncedValue, debounceFn };
}

// 组件中使用
// import { useDebounce } from '@/hooks/useDebounce';
// const { debouncedValue, debounceFn } = useDebounce('', 500);

```


✅ useRequest：数据请求 Hooks（统一处理加载 / 错误）


```js

// src/hooks/useRequest.js
import { ref } from 'vue';

export function useRequest(apiFn) {
  // 响应式状态
  const data = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // 请求方法
  const fetchData = async (...args) => {
    try {
      loading.value = true;
      error.value = null;
      const res = await apiFn(...args);
      data.value = res.data;
      return res;
    } catch (err) {
      error.value = err;
      throw err; // 抛出错误，方便组件捕获
    } finally {
      loading.value = false;
    }
  };

  // 立即执行请求（可选）
  const fetchImmediately = async (...args) => {
    await fetchData(...args);
  };

  return { data, loading, error, fetchData, fetchImmediately };
}

// 组件中使用
// import { useRequest } from '@/hooks/useRequest';
// const { data, loading, error, fetchData } = useRequest(getUserList);
// fetchData(1); // 调用请求

```


✅ useLocalStorage：本地存储 Hooks（持久化数据）


```js

// src/hooks/useLocalStorage.js
import { customRef } from 'vue';

export function useLocalStorage(key, defaultValue = '') {
  return customRef((track, trigger) => {
    // 初始化从 localStorage 读取
    let value = localStorage.getItem(key) || defaultValue;

    return {
      get() {
        track();
        return value;
      },
      set(newValue) {
        value = newValue;
        // 同步到 localStorage
        localStorage.setItem(key, newValue);
        trigger();
      }
    };
  });
}

// 组件中使用
// import { useLocalStorage } from '@/hooks/useLocalStorage';
// const token = useLocalStorage('token', '');

```


✅ useUser：用户状态 Hooks（封装用户相关逻辑）


```js

// src/hooks/useUser.js
import { useStore } from 'pinia';
import { storeToRefs } from 'pinia';
import { userStore } from '@/stores/user';

export function useUser() {
  const store = useStore(userStore);
  // 解构响应式状态（storeToRefs 保持响应式）
  const { userInfo, isLogin } = storeToRefs(store);

  // 封装用户操作方法
  const login = async (form) => {
    await store.login(form);
  };
  const logout = () => {
    store.logout();
  };
  const getUserInfo = async () => {
    await store.fetchUserInfo();
  };

  return {
    userInfo,
    isLogin,
    login,
    logout,
    getUserInfo
  };
}

// 组件中使用
// import { useUser } from '@/hooks/useUser';
// const { userInfo, isLogin, login } = useUser();

```

✅ usePermission：权限校验 Hooks（封装权限逻辑）

```js

// src/hooks/usePermission.js
import { useStore } from 'pinia';
import { permissionStore } from '@/stores/permission';

export function usePermission() {
  const store = useStore(permissionStore);
  const { permissions } = storeToRefs(store);

  // 校验是否有某个权限
  const hasPermission = (perm) => {
    return permissions.value.includes(perm);
  };

  // 校验是否有某个角色
  const hasRole = (role) => {
    return store.userRole.includes(role);
  };

  return { hasPermission, hasRole };
}

// 组件中使用
// import { usePermission } from '@/hooks/usePermission';
// const { hasPermission } = usePermission();
// if (hasPermission('user:edit')) { /* 显示编辑按钮 */ }


```

开发规范：

- 命名：必须以 use 开头，驼峰命名（如 useTableData 而非 tableDataHook）；
- 单一职责：一个 Hooks 只做一件事（如 useDebounce 只处理防抖，不混请求逻辑）；
- 返回值：优先返回 ref / 函数（保持响应式），避免返回原始对象；
- 副作用清理：Hooks 中包含定时器、订阅、事件监听时，必须封装清理逻辑：















