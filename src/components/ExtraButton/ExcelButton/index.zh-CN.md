## 导出控件封装

---

### 涉及到的组件

- [ AuthConsumer ](@/layouts/AuthConsumer) 页面内组件位置 `@/layouts/AuthConsumer`

- `权限控制，auth 默认 auth = 'exportList'`

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| auth | 按钮权限 | `boolean | string` | exportList |
| dispatchType | 请求 type，dispatch 的 type，发起 action | string | - |
| dispatchData | 请求参数，dispatch 的 payload，默认为顶部 form 的搜索数据 | object | - |
| dispatchProps | 请求覆盖配置 type payload | object | - |
| exportProps | 导出配置 header fieldNames，表格头参数列 | object | - |

### <ExcelButton></ExcelButton>在组件中的使用例子 eg:

```jsx
 btnExtra={({ get }) => (
        <ExcelButton
          dispatchType={'businessSettled/fetchMerchantGetExcel'}
          dispatchData={get()}
          exportProps={{ header: getColumns.slice(0, -1) }}
        ></ExcelButton>
      )}

```

- ### 2021-2-06
