## TableDataBlock 搜索表格信息组件

---

表格信息回显组件 整合了拖动排序 搜索表单 兼容 antd [Table 表格](https://ant.design/components/table-cn/)配置参数`（TableDataBlock props将完整打入表格中，传递即可）`

### 涉及 antd 组件文档

- [Card 卡片](https://ant.design/components/card-cn/)
- [Table 表格](https://ant.design/components/table-cn/)

## API

### TableDataBlock

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- | --- |
| list | 表格数据源`（必填）` | object[] | [] |
| columns | 表头`（必填）` | object[] | - |
| rowKey | 表格行 key 的取值，可以是字符串或一个函数`（必填）` | `string | function(record): string` | - |
| btnExtra | 搜索表格额外的按钮，存在搜索条件 function 返回一个 get 方法获取搜索参数 | `ReactNode | function({ get: function() => nowData })` | - |
| cRef | 子组件绑定 ref 获取请求方法 | React.useRef() | - |
| cardProps | Card 组件配置项 [Card 卡片](https://ant.design/components/card-cn/) | Object | {} |
| dispatchType | 请求路径 | String | - |
| order | 是否显示排序序号 | boolean | false |
| firstFetch | 刚打开是否请求接口 | boolean | true |
| keepData | 是否保持数据，true 的情况下顶部显示 tab 选项页（仅`运营` `销售`后台支持） | boolean | false |
| loading | 表格页面是否加载中 loading | `boolean | object (更多)` | false |
| noCard | 表格是否需要 Card 组件包裹 | boolean | true |
| params | 搜索时默认参数 | Object | {} |
| pagination | 分页是否显示 | boolean | true |
| resetSearch | 重置事件回调 | function | - |
| size | 组件大小 | String | small default middle |
| scrollY | 设置纵向滚动，也可用于指定滚动区域的高，可以设置为像素值 | `string | number` | - |
| scrollX | 设置横向滚动，也可用于指定滚动区域的宽，可以设置为像素值，百分比，true 和 'max-content' | `string | number | true | max-content` | - |
| searchItems | 搜索条件 | object[] | - |
| searchForm | 搜索表单 form | Form.useForm() | - |
| searchCallback | 搜索事件回调，返回（当前搜索事件参数，table 所有请求参数（包含分页）） | function(searchVal, tableVal) | - |
| tableSize | 单独控制表格大小 | String | small default middle |
| tableSort | 表格基础排序组件配置，复杂排序可从`TableDataBlock/SortBlock`导出<a href="#DraggableContent">默认方法 draggableContent</a>配置 | `Object{ key, onSortEnd:function (newData) => {} }` | - |
| children | 表格搜索框顶部显示内容 | ReactNode | - |

<span id="DraggableContent"><h4>DraggableContent</h4></span>

`TableDataBlock/SortBlock` 默认导出方法 返回 `{ components:{ body:{} } }` 对象

| 参数       | 说明                                       | 类型                 | 默认值 |
| ---------- | ------------------------------------------ | -------------------- | ------ |
| dataSource | 排序数据源`（必填）`                       | object[]             | []     |
| key        | 排序唯一键名 `（必填）`                    | string               | -      |
| onSortEnd  | 排序完成回调函数，将会返回排序完成后新数据 | `function(): Object` | -      |

```jsx
<TableDataBlock {...draggableContent(list, { key, onSortEnd: (val) => {} })} />
```

## 更新日志

- ### 2021 年 5 月 28 日 13:43:49 Dong

> - `columns` 增加 `ellipsis` 配置 `boolean | { length?: number, lines?: number }`

- ### 2021 年 3 月 4 日 10:56:15 Dong

> - 总数只有一页时不显示分页

- ### 2021 年 3 月 3 日 16:48:31 18:20:35 Dong

> - 增加配置 `tableSize`单独控制表格大小 默认 `default` 可选 `small | default | middle`

- ### 2021 年 3 月 1 日 18:20:35 Dong

> - 增加配置 `order`，是否展示排序序号 默认 `false`

- ### 2021 年 2 月 5 日 17:47:35 Dong

组件重构

> - `noCard` 替换 `CardNone`
>   > - 会影响原本使用`CardNone`参数，全局检查替换
> - `firstFetch` 替换 `NoSearch`
>   > - 会影响原本使用`NoSearch`参数，全局检查替换
> - `keepData`替换 `keepName`，`keepData`参数由原名称变为 `boolean`类型（当前仅`运营` `销售`后台支持）
>   > - 会影响原本使用`keepName`参数，全局检查替换
> - 移除参数 `setParams`
> - 移除参数 `pParams`，用`params` 替代全部职能
>   > - 会影响原本使用`pParams`参数，全局检查替换
> - 移除参数 `CardTitle` `style` `bodyStyle` `extra`，用`cardProps` 替代全部职能完整传递 antd [Card 卡片](https://ant.design/components/card-cn/)配置
>   > - 会影响原本使用 `CardTitle` `style` `bodyStyle` `extra`参数，全局检查替换
> - 搜索回调`searchCallback`增加 `tableParems`回参，第二个参数返回当前 table 请求参数包含分页等信息
