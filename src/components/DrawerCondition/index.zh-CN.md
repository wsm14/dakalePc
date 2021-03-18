## 单纯的 Drawer 组件 Drawer + Skeleton 合并封装

---

### 涉及 antd 组件文档

- [Drawer 抽屉](https://ant.design/components/drawer-cn/)

## API

| 参数           | 说明                           | 类型      | 默认值     |
| -------------- | ------------------------------ | --------- | ---------- |
| visible        | 显示状态                       | boolean   | -          |
| title          | drawer 组件 title 的值         | string    | -          |
| width          | drawer 框的宽度                | number    | -          |
| onClose        | 关闭 Drawer 方法，取消按钮方法 | function  | -          |
| closeLabel     | 取消按钮显示值                 | string    | `取消`     |
| loading        | 额外 Skeleton loading          | boolean   | -          |
| footer         | 底部按钮组配置                 | button    | `取消按钮` |
| afterCallBack  | 打开 Drawer 框显示的回调方法   | function  | -          |
| closeCallBack  | 关闭 Drawer 后回调函数         | function  | -          |
| maskClosable   | 点击蒙版关闭                   | boolean   | true       |
| maskShow       | 蒙版是否显示颜色               | boolean   | true       |
| destroyOnClose | 关闭 Drawer 销毁子组件         | boolean   | true       |
| bodyStyle      | Drawer bodyStyle               | -         | -          |
| zIndex         | z-index 配置                   | number    | -          |
| children       | react 默认最高级传递组件       | ReactNode | -          |

## 更新日志

- ### 2021 年 3 月 10 日 sunbeibei

组件重构

> - `maskShow` 配置增加，配置蒙版是否显示颜色

- ### 2021-02-05

组件文档编写
