## DndDragContext dom 拖动组件

## API

### DndDragContext

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| data | `（必填）` 可拖动 dom 的数据 | array | [] |
| accept | `（必填）` 类型拖拽放置时的 dom 标识, 数组时表示可放置多个对应 dom 下 | `string[] | string` | - |
| onEnd | 放置时的回调，返回排序后的数据 | (value) => void | - |
| children | react 内置子元素，组件包裹后显示排序元素 | ReactNode | - |

## 更新日志

- ### 2021 年 3 月 8 日 17:26:18 Dong

组件重构

> - 组件封装
