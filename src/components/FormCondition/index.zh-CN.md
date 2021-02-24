## FormCondition 表单组件

---

表单封装 `兼容大部分 antd 文档表单组件配置项`

### 涉及 antd 组件文档

- [Form 表单](https://ant.design/components/form-cn/)
- [Cascader 级联选择](https://ant.design/components/cascader-cn/)
- [Checkbox 多选框](https://ant.design/components/checkbox-cn/)
- [DatePicker 日期选择框](https://ant.design/components/date-picker-cn/)
- [Input 输入框](https://ant.design/components/input-cn/)
- [Radio 单选框](https://ant.design/components/radio-cn/)
- [InputNumber 数字输入框](https://ant.design/components/input-number-cn/)
- [Select 选择器](https://ant.design/components/select-cn/)
- [Switch 开关](https://ant.design/components/switch-cn/)
- [TimePicker 时间选择框](https://ant.design/components/time-picker-cn/)
- [Upload 上传](https://ant.design/components/upload-cn/)

## API

### FormCondition

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| formItems | `（必填）` 表单内容数组 | <a href="#formItems">formItems[]</a> | [] |
| form | 经 `Form.useForm()` 创建的 form 控制实例 | [FormInstance](https://ant.design/components/form-cn/#FormInstance) | - |
| formItemLayouts | 表单布局，文档内 `labelCol，wrapperCol` `{ labelCol: null, wrapperCol: null, }` | object | {} |
| initialValues | 表单默认值，只有初始化以及重置时生效 | object | {} |
| children | react 内置子元素，表单组件包裹后显示在底部 | ReactNode | - |

<span id="formItems"><h4>formItems 表单组件通用配置（[更多配置](https://ant.design/components/form-cn/#Form.Item)）</h4></span>

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | `（必填）` 表单的类型 `input | cascader | textArea | datePicker | rangePicker | timePicker | number | select | multiple | checkbox | radio | tags | switch | upload | videoUpload | otherUpload | noForm | formItem`，`noForm` 不使用`formItem`组件包裹，`formItem`使用`formItem`包裹自定义表单组件 | string | input |
| title | 标题 | ReactNode | - |
| label | label 标签的文本 | ReactNode | - |
| name | 数据参数名 | string | - |
| rules | 规则配置 默认[{ required: true, message: `请确认${label}` }] | [Rule[]](https://ant.design/components/form-cn/#Rule) | [] |
| addRules | 额外规则配置 | [Rule[]](https://ant.design/components/form-cn/#Rule) | - |
| visible | 是否显示表单 | boolean | true |
| hidden | 是否隐藏字段（依然会收集和校验字段），`可额外数据收集时使用` | boolean | false |
| extra | 额外的提示信息 | ReactNode | - |

#### input 输入框 （[更多配置](https://ant.design/components/input-cn/)）

| 参数       | 说明                                   | 类型        | 默认值 |
| ---------- | -------------------------------------- | ----------- | ------ |
| suffix     | 带有后缀图标的 input，`无法点击`       | ReactNode   | -      |
| addonAfter | 带标签的 input，设置后置标签，`可点击` | ReactNode   | -      |
| maxLength  | 最长字数，配置后显示字数统计           | number      | -      |
| onChange   | 输入框内容变化时的回调                 | function(e) | -      |

#### TextArea 输入框 （[更多配置](https://ant.design/components/input-cn/)）

| 参数      | 说明                         | 类型   | 默认值 |
| --------- | ---------------------------- | ------ | ------ |
| maxLength | 最长字数，配置后显示字数统计 | number | -      |
| rows      | 最大行数                     | number | -      |

#### Cascader 级联选择（[更多配置](https://ant.design/components/cascader-cn/)）

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| select | `（必填）` 选择值，默认城市数据 | [] | CITYJSON |
| placeholder | 默认文本 | string | 选择城市 |
| disabled | 是否禁用 | boolean | false |
| changeOnSelect | 点选每级菜单选项值都会发生变化 | boolean | false |
| fieldNames | 自定义 select 中 label name children 的字段 | object | { label: label, value: value, children: children } |
| onChange | 选择完成后的回调 | (value, form) => void | - |

#### Select 选择器 && Tags 选择器 （[更多配置](https://ant.design/components/select-cn/)）

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| select | `（必填）` 选择值 | `[] | [{ }] | { label: string; value: string; tip?: string; }` | [] |
| fieldNames | 自定义 select 中 label name children 的字段 | object | { label: name, value: value, tip: otherData } |
| loading | loading 状态 | boolean | false |

#### Upload 上传组件

> 图片`upload`/视频`videoUpload`/文件`otherUpload`处理逻辑不同，拆分三个组件

##### upload 图片上传

| 参数     | 说明                                     | 类型           | 默认值 |
| -------- | ---------------------------------------- | -------------- | ------ |
| maxFile  | 最大文件数                               | number         | 999    |
| maxSize  | 图片大小限制`MB`                         | number         | 1      |
| multiple | 是否允许多选,`isCut`为 true 默认为 false | boolean        | true   |
| isCut    | 是否选择时裁剪                           | boolean        | false  |
| imgRatio | 裁剪图片比例                             | number         | -      |
| onChange | 选择回调                                 | function(file) | -      |

---

##### videoUpload 视频上传

| 参数     | 说明         | 类型           | 默认值 |
| -------- | ------------ | -------------- | ------ |
| maxFile  | 最大文件数   | number         | 999    |
| multiple | 是否允许多选 | boolean        | true   |
| onChange | 选择回调     | function(file) | -      |

---

##### otherUpload 文件上传

| 参数     | 说明       | 类型           | 默认值 |
| -------- | ---------- | -------------- | ------ |
| maxFile  | 最大文件数 | number         | 999    |
| onChange | 选择回调   | function(file) | -      |

---

#### Radio 单选框

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| select | `（必填）` 选择值 | `[] | [{ }] | { label: string; value: string; disabled?: boolean; }` | [] |
| fieldNames | 自定义 select 中 label name children 的字段 | object | { label: label, value: value, children: children } |

#### TimePicker 时间选择框

| 参数   | 说明           | 类型   | 默认值  |
| ------ | -------------- | ------ | ------- |
| format | 展示的时间格式 | string | 'HH:mm' |

## 更新日志

- ### 2021 年 2 月 24 日 12:13:00 Dong

组件重构

> - `childrenOwn`字段 改为 `formItem`
>   > - 全局替换
> - `select` 组件增加 `fieldNames` 配置 参数别名
>   > - 目的：替换原本常量中数组键值对形式数据为对象
> - 组件抽离，antd 相关组件配置兼容
