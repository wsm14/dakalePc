import React from 'react';
import { connect } from 'umi';
import debounce from 'lodash/debounce';
import { Select, Spin, Empty } from 'antd';
import styles from '../index.less';

/**
 * 商品选择器
 */
const { Option } = Select;

const GoodSelect = (props) => {
  const {
    dispatch,
    fieldNames = {},
    selectList = [],
    loading,
    placeholder,
    multiple = false,
    params = {},
    disabled,
    onChange,
  } = props;

  const { label = 'name', value = 'value', tip = 'otherData' } = fieldNames;

  // 搜索店铺
  const fetchGetMre = debounce((activityName) => {
    if (!activityName.replace(/'/g, '')) return;
    dispatch({
      type: 'baseData/fetchGetGoodsSearch',
      payload: {
        activityName: activityName.replace(/'/g, ''),
        ...params,
      },
    });
  }, 500);

  //  multiple = true 配置
  let multProps = {};
  if (multiple) multProps = { mode: 'multiple', maxTagCount: 2 };

  // 返回结果
  return (
    <Select
      allowClear
      showSearch
      optionFilterProp="children"
      dropdownMatchSelectWidth={false}
      style={{ width: '100%' }}
      loading={loading}
      notFoundContent={
        loading ? <Spin size="small" /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      }
      placeholder={placeholder || `请输入商品名称`}
      onSearch={(val) => fetchGetMre(val)}
      onChange={onChange}
      maxTagTextLength={5}
      disabled={disabled}
      {...multProps}
    >
      {selectList.map((data, j) => {
        if (data) {
          // 兼容数组
          const valueData = !data[value] ? `${j}` : data[value];
          const nameData = data[value] ? data[label] : data;
          const otherData = data[tip] ? data[tip] : '';
          return (
            <Option key={j} value={valueData} className={styles.formSelect}>
              {`${nameData}\n${otherData}`}
            </Option>
          );
        }
      })}
    </Select>
  );
};

export default connect(({ baseData, loading }) => ({
  selectList: baseData.goodsList,
  loading: loading.effects['baseData/fetchGetGoodsSearch'],
}))(GoodSelect);
