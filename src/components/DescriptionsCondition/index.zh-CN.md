## DescriptionsCondition 详情展示组件

---

详情展示组件 antd [Descriptions 描述列表](https://ant.design/components/descriptions-cn/)二次封装 `兼容文档Descriptions配置项目 props 全打入配置`

### 涉及 antd 组件文档

- [Descriptions 描述列表](https://ant.design/components/descriptions-cn/)

## API

### DescriptionsCondition

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| column | 一行的 DescriptionItems 数量，可以写成像素值或支持响应式的对象写法 { xs: 8, sm: 16, md: 24} | number | 1 |
| extra | 描述列表的操作区域，显示在右上方 | ReactNode | - |
| formItems | 表单内容数组 | <a href="#formType">formType[]</a> | [] |
| initialValues | 默认值 | object | {} |
| style | Descriptions 样式 | CSSProperties | - |
| title | 描述列表的标题，显示在最顶部 | ReactNode | - |
| children | Descriptions 附加内容，显示最底部 | ReactNode | - |

<span id="formType"><h4>formItems</h4></span>

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 内容的描述 `（必填）` | ReactNode | - |
| name | 内容参数名 `（必填）` | string | - |
| fieldNames | 参数别名 `此参数优先于name` | number | - |
| initialValue | 当前行显示值，无关 name 处理直接显示此参数 `此参数优先于组件initialValue` | any | - |
| render | 生成复杂数据的渲染函数，参数分别为当前行的值，当前行数据 | function(text, record, ) {} | - |
| show | 是否显示当前项 | boolean | true |
| span | 包含列的数量 | number | 1 |
| type | 显示类型 text textArea upload | String | text |
| children | 额外内容在 item 底部 | ReactNode | - |

## 更新日志

- ### 2021 年 8 月 4 日 17:42:18 Dong

> - `render` 默认无数据时默认返回 `--` 修改为 `''`

- ### 2021 年 3 月 10 日 sunbeibei

组件重构

> - `getArrKeyVal` 函数修改，添加条件判断，当数组 key 获取值时某一层不存在时直接返回 null

- ### 2021 年 2 月 6 日 17:17:26 Dong

组件重构

> - `fieldNames` 替代 `childrenName` 参数
>   > - 会影响原本使用`childrenName`参数获取数值字段，全局检查
> - 移除参数 `visible` `hidden`参数，`show`参数 承接所有显示隐藏职能
>   > - 会影响原本使用`visible` `hidden`参数做显示隐藏的详情字段，全局检查
> - 子组件抽离- upload 类型 图片显示组件抽离
> - 参数值获取方法重写
> - 兼容所有[Descriptions 描述列表](https://ant.design/components/descriptions-cn/)Descriptions 配置
