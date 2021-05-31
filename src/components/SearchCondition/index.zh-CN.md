## SearchCondition 搜索组件

---

搜索表单封装 `兼容 antd 文档表单子组件所有配置项`

### 涉及 antd 组件文档

- [Cascader 级联选择](https://ant.design/components/cascader-cn/)
- [DatePicker 日期选择框](https://ant.design/components/date-picker-cn/)
- [Input 输入框](https://ant.design/components/input-cn/)
- [NumberInput 数字输入框](https://ant.design/components/input-number-cn/)
- [Select 选择器](https://ant.design/components/select-cn/)

## API

### SearchCondition

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| searchItems | `（必填）` 搜索表单内容数组 | <a href="#formType">formType[]</a> | [] |
| btnExtra | 额外按钮，为 `function` 时提供 get 方法获取当前输入搜索值 | ReactNode, function({ get: getData }) | - |
| componentSize | 表单大小`small` `default` `large` | string | 'default' |
| form | 经 `Form.useForm()` 创建的 form 控制实例，不提供时会内置 | [FormInstance](https://ant.design/components/form-cn/#FormInstance) | - |
| initialValues | 默认值 | object | {} |
| handleSearch | 搜索按钮回调 | function(data) | - |
| resetSearch | 重置按钮回调 | function | - |

<span id="formType"><h4>searchItems 表单组件通用配置</h4></span>

| 参数   | 说明                         | 类型                     | 默认值     |
| ------ | ---------------------------- | ------------------------ | ---------- | ----------- | ------ | ------ | -------- | ------------ | ------ | ----- |
| type   | `（必填）` 表单的类型 `input | cascader                 | datePicker | rangePicker | number | select | multiple | numberGroup` | string | input |
| name   | `（必填）` 数据参数名        | string                   | -          |
| handle | 事件配置，向外传递 form 实例 | function: (form) => ({}) | -          |

---

```jsx
handle={(form)=> ({
  onChange: (value) => {}
})};
```

#### DatePicker 日期选择框（[更多配置](https://ant.design/components/date-picker-cn/)）

| 参数                | 说明                                    | 类型         | 默认值 |
| ------------------- | --------------------------------------- | ------------ | ------ | ---- |
| type                | `（必填）` 类型 ，`datePicker           | rangePicker` | string | -    |
| picker `datePicker` | 时间选择器展示类型，默认选择到日，`year | month`       | string | date |
| end `rangePicker`   | `（必填）` 结束时间参数名               | string       | -      |

#### Select 选择器（[更多配置](https://ant.design/components/select-cn/)）

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- | --- |
| type | `（必填）` 类型 ，`select | multiple` | string | - |
| select | `（必填）` 选择值参数值 | `object | array | { list: array } | { list: object }` | - |
| loading | 搜索等待状态 | boolean | false |
| fieldNames | 自定义 select 中 name value otherData 的字段 | object | { label: label, value: value, tip: otherData } | string | - |
| allItem `select` | 是否显示`全部`选项，配置 defaultValue | boolean | true |
| defaultValue `select` | `全部` 选项默认值 | string | - |

#### Cascader 级联选择（[更多配置](https://ant.design/components/cascader-cn/)）

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| select | `（必填）` 选择值，默认城市数据 | [] | CITYJSON |
| valuesKey | `（必填）` 返回参数 key 值，按顺序返回 ['provinceCode', 'cityCode', 'districtCode'], | array | [] |
| placeholder | 默认文本 | string | 选择城市 |
| changeOnSelect | 点选每级菜单选项值都会发生变化 | boolean | false |
| fieldNames | 自定义 select 中 label name children 的字段 | object | { label: label, value: value, children: children } |
| onChange | 选择完成后的回调 | (value, form) => void | - |

## 更新日志

- ### 2021 年 5 月 31 日 15:05:07 Dong

> - 整合额外按钮组件渲染 修改 `btnExtra` 参数变更为 `array | ({ get: getData }) => array`

- ### 2021 年 5 月 12 日 15:48:02 Dong

> - 组件增加 `numberGroup` 配置，数字区间

- ### 2021 年 2 月 22 日 15:48:57 Dong

组件重构

> - `select` 组件增加 `fieldNames` 配置 参数别名
> - `select` type 为 select 时 增加 `defaultValue` 配置 `全部` 选项默认值
> - 表单组件增加`handle`配置，抛出当前 `form` 实例，对象形式，会扩展到相关组件内
> - 新增 `form` 参数，外部传递 form 实例，`handle`配置时 会抛出当前 form
> - 移除 `NoSearch` 参数
> - 子组件抽离，antd 相关组件配置兼容
> - 使用解构写法获取参数
