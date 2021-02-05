
## 单纯的Drawer组件 Drawer + Skeleton 合并封装

---

### 涉及 antd 组件文档

- [Drawe 抽屉](https://ant.design/components/drawer-cn/)
- [Skeleton 骨架屏](https://ant.design/components/skeleton-cn/)
- [Button 按钮](https://ant.design/components/button-cn/)
- [Space 间距](https://ant.design/components/space-cn/)


## API


| 参数 | 说明 | 类型 | 默认值 
--- | --- | ---- | ----
| visible | 显示状态 | boolean | -
| title | drawer组件title的值 | string | -
| width | drawer框的宽度 | number | -
| onClose | 关闭Drawer方法，取消按钮方法 | function | -
| closeLabel | 取消按钮显示值 | string | `取消`
| loading | 额外Skeleton loading | boolean | -
| footer | 底部按钮组配置 | button | `取消按钮`
| afterCallBack | 打开Drawer框显示的回调方法 | function | -
| closeCallBack | 关闭Drawer后回调函数 | function | -
| maskClosable | 点击蒙版关闭 | boolean | true
| destroyOnClose | 关闭Drawer销毁子组件 | boolean | true
| bodyStyle | Drawer bodyStyle | - | -
| zIndex | z-index配置 | number | -
| children | react 默认最高级传递组件 | ReactNode | -

- ### 2021-02-05