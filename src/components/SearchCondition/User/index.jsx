import React from 'react';
import { connect } from 'umi';
import debounce from 'lodash/debounce';
import { Select, Spin, Empty } from 'antd';
import styles from '../index.less';

/**
 * 用户选择器
 */
const { Option } = Select;

const UserSelect = (props) => {
  const {
    dispatch,
    allItem = 'true',
    defaultValue = '',
    fieldNames = {},
    selectList,
    loading,
    placeholder,
    multiple = false,
    onChange,
  } = props;

  const { label = 'username', value = 'userIdString', tip = 'tipInfo' } = fieldNames;

  // 获取用户搜索
  const fetchGetUser = debounce((content) => {
    if (!content || content.length < 2) return;
    dispatch({
      type: 'baseData/fetchGetUsersSearch',
      payload: {
        content,
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
      dropdownMatchSelectWidth
      style={{ width: '100%' }}
      loading={loading}
      notFoundContent={
        loading ? <Spin size="small" /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      }
      placeholder={placeholder || `请输入昵称、手机号或豆号`}
      onSearch={(val) => fetchGetUser(val)}
      onChange={onChange}
      maxTagTextLength={5}
      {...multProps}
    >
      {!multiple && allItem && <Option value={defaultValue}>全部</Option>}
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
  selectList: baseData.userList,
  loading: loading.effects['baseData/fetchGetUsersSearch'],
}))(UserSelect);
