
## Descriptions组件封装, DrawerCondition + Descriptions展示详情页面

---

### 涉及 antd 组件文档

- [Descriptions 描述列表](https://ant.design/components/descriptions-cn/)

## API

| 参数 | 说明 | 类型 | 默认值 
--- | --- | ---- | ----
| [formItems](#formItems) | `表单内容数组`  | `Object[] | []` | -
| initialValues | 展示默认值 | Object | -
| title |  描述列表的标题，显示在最顶部 | string | -
| children | react 默认最高级传递组件 | ReactNode | -


### <a id="formItems">formItems</a>

formItems内容

| 参数 | 说明 | 类型 | 默认值 
--- | --- | ---- | ----
| name | 单个字段描述项展示 | `string | []` | -
| label | 展示默认值 | string | -
| type | 展示类型，`比如type==="upload" ,使用组件<image></image>展示图片` | string | `input`
| title | 描述列表的标题，显示在最顶部`在formItems第一项中添加` | string | -
| disabled | 是否禁用 | boolean | false
| visible | 是否展示 | boolean | true
| hidden | 是否展示`和visible值相反` | boolean | false
| show | 是否展示`和visible值一样` | boolean | true
| children | react 默认最高级传递组件 | ReactNode | -


- ### 2021-02-05