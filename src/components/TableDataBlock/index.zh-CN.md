## TableDataBlock 搜索表格信息组件

---

表格信息回显组件 整合了拖动排序 搜索表单 兼容所有antd [Table 表格](https://ant.design/components/table-cn/)配置参数`（TableDataBlock props将完整打入表格中，传递即可）`

### 涉及 antd 组件文档

- [Card 卡片](https://ant.design/components/card-cn/)
- [Table 表格](https://ant.design/components/table-cn/)

## API

### TableDataBlock

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| list | 表格数据源`（必填）` | object[] | [] |
| columns | 表头`（必填）` | object[] | - |
| rowKey | 表格行 key 的取值，可以是字符串或一个函数`（必填）` | `string | function(record): string` | - |
| dispatchType | 请求路径 | String | - |
| cRef | 子组件绑定 ref 获取请求方法 | React.useRef() | - |
| btnExtra | 搜索表格额外的按钮，存在搜索条件 function 返回一个 get 方法获取搜索参数 | `ReactNode | function({ get: function() => nowData })` | - |
| keepData | 是否保持数据，true 的情况下顶部显示 tab 选项页（仅`运营` `销售`后台支持） | boolean | false |
| searchItems | 搜索条件 | object[] | - |
| searchForm | 搜索表单 form | Form.useForm() | - |
| searchCallback | 搜索事件回调，返回（当前搜索事件参数，table 所有请求参数（包含分页）） | function(searchVal, tableVal) | - |
| resetSearch | 重置事件回调 | function | - |
| loading | 表格页面是否加载中 loading | `boolean | object (更多)` | false |
| pagination | 分页是否显示 | boolean | true |
| tableSort | 表格基础排序组件配置，复杂排序可从`TableDataBlock/SortBlock`导出<a href="#DraggableContent">默认方法 draggableContent</a>配置 | `Object{ key, onSortEnd:function (newData) => {} }` | - |
| noCard | 表格是否需要 Card 组件包裹 | boolean | true |
| cardProps | Card 组件配置项 | Object | {} |
| size | 组件大小 | String | small default middle |
| scrollY | 设置纵向滚动，也可用于指定滚动区域的高，可以设置为像素值 | `string | number` | - |
| scrollX | 设置横向滚动，也可用于指定滚动区域的宽，可以设置为像素值，百分比，true 和 'max-content' | `string | number | true | max-content` | - |
| firstFetch | 刚打开是否请求接口 | boolean | true |
| params | 搜索时默认参数 | Object | {} |
| children | 表格搜索框顶部显示内容 | ReactNode | - |

<span id="DraggableContent"><h4>DraggableContent</h4></span>

`TableDataBlock/SortBlock` 默认导出方法 返回 `{ components:{ body:{} } }` 对象

| 参数       | 说明                                       | 类型                 | 默认值 |
| ---------- | ------------------------------------------ | -------------------- | ------ |
| dataSource | 排序数据源`（必填）`                       | object[]             | []     |
| key        | 排序唯一键名 `（必填）`                    | string               | -      |
| onSortEnd  | 排序完成回调函数，将会返回排序完成后新数据 | `function(): Object` | -      |

```
<TableDataBlock
  {...draggableContent(
      list,
      { key, onSortEnd: (val) => {} }
  )}
/>
```

## 更新日志

- ### 2021-02-05

组件重构

> - `noCard` 替换 `CardNone`
> - `firstFetch` 替换 `NoSearch`
> - `keepData` 替换 `keepName`，`keepName`由原路径名称变为 boolean（仅`运营` `销售`后台支持）
> - 移除参数 `setParams`
> - 移除参数 `pParams`，用`params` 替代全部职能
> - 移除参数 `CardTitle` `style` `bodyStyle` `extra`，用`cardProps` 替代全部职能完整传递 antd [Card 卡片](https://ant.design/components/card-cn/)配置
> - 搜索回调`searchCallback`增加 `tableParems`回参，第二个参数返回当前 table 请求参数包含分页等信息
