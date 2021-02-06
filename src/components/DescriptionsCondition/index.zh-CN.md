## DescriptionsCondition 详情展示组件

---

详情展示组件 antd [Descriptions 描述列表](https://ant.design/components/descriptions-cn/)二次封装 `兼容文档配置项目 props 全打入配置`

### 涉及 antd 组件文档

- [Descriptions 描述列表](https://ant.design/components/descriptions-cn/)

## API

### DescriptionsCondition

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| formItems | 表单内容数组 | <a href="#formType">formType[]</a> | - |
| initialValues | 默认值 | object | - |
| title | 描述列表的标题，显示在最顶部 | ReactNode | - |
| extra | 描述列表的操作区域，显示在右上方 | ReactNode | - |
| column | 一行的 DescriptionItems 数量，可以写成像素值或支持响应式的对象写法 { xs: 8, sm: 16, md: 24} | number | - |
| style | Descriptions 样式 | CSSProperties | - |
| children | Descriptions 附加内容，显示最底部 | ReactNode | - |

<span id="formType"><h4>formItems</h4></span>

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 内容的描述 `（必填）` | ReactNode | - |
| name | 内容参数名 `（必填）` | string | - |
| type | 显示类型 text upload | String | text |
| fieldNames | 参数别名 `此参数优先于name` | number | 1 |
| render | 生成复杂数据的渲染函数，参数分别为当前行的值，当前行数据 | function(text, record, ) {} | - |
| show | 是否显示当前项 | boolean | true |
| initialValue | 当前行显示值，无关 name 处理直接显示此参数 `此参数优先于组件initialValue` | any | - |
| span | 包含列的数量 | number | 1 |
| children | 额外内容在 item 底部 | ReactNode | - |

## 更新日志

- ### 2021年2月6日 17:17:26 Dong

组件重构

> - 移除参数 `visible` `hidden`参数，`show`参数 承接所有显示隐藏职能
>   > - 会影响原本使用`visible` `hidden`参数做显示隐藏的详情字段，全局检查
> - 子组件抽离- upload类型 图片显示组件抽离
> - 参数值获取方法重写
