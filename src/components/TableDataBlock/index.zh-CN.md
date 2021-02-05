TableDataBlock 搜索表格信息组件

---

表格信息回显组件 整合了拖动排序 搜索表单 `整合antd组件 兼容所有原组件配置参数`

### 涉及 antd 组件文档

- [Card 卡片](https://ant.design/components/card-cn/)
- [Table 表格](https://ant.design/components/table-cn/)

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| list | 表格数据源`（必填）` | object[] | [] |
| columns | 表头`（必填）` | object[] | - |
| rowKey | 表格行 key 的取值，可以是字符串或一个函数`（必填）` | `string | function(record): string` | - |
| dispatchType | 请求路径 | String | - |
| cRef | 子组件绑定 ref 获取请求方法 | useRef | - |
| btnExtra | 搜索表格额外的按钮，存在搜索条件 function 返回一个 get 方法获取搜索参数 | `ReactNode | function({ get:getData() })` | - |
| searchItems | 搜索条件 | object[] | - |
| searchForm | 搜索表单 form | useForm | - |
| searchCallback | 搜索事件回调，返回（当前搜索事件参数，table 所有请求参数（包含分页）） | function | - |
| resetSearch | 重置事件回调 | function | - |
| loading | 表格页面是否加载中 loading | `boolean | object (更多)` | false |
| pagination | 分页是否显示 | boolean | true |
| tableSort | 表格排序组件配置 | `Object{ key, onSortEnd:function (newData) => {} }` | - |
| noCard | 表格是否需要 Card 组件包裹 | boolean | true |
| cardProps | Card 组件配置项 | Object | {} |
| size | 组件大小 | String | small default middle |
| scrollY | 设置纵向滚动，也可用于指定滚动区域的高，可以设置为像素值 | `string | number` | - |
| scrollX | 设置横向滚动，也可用于指定滚动区域的宽，可以设置为像素值，百分比，true 和 'max-content' | `string | number | true | max-content` | - |
| firstFetch | 刚打开是否请求接口 | boolean | true |
| params | 搜索时默认参数 | Object | {} |
| children | 表格搜索框顶部显示内容 | ReactNode | - |

### 2021-02-05

组件重构

> - `noCard` 替换 `CardNone`
> - `firstFetch` 替换 `NoSearch`
> - 移除参数 `pParams`，用`params` 替代全部职能
> - 移除参数 `CardTitle` `style` `bodyStyle` `extra`，用`cardProps` 替代全部职能完整传递 antd Card 组件配置
> - 移除参数 `setParams`
> - 搜索回调`searchCallback`增加 `tableParems`回参，第二个参数返回当前 table 请求参数包含分页等信息
