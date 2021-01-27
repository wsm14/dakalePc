import React from 'react';
import { connect } from 'umi';
import { Button, Tooltip } from 'antd';
import AuthConsumer from '@/layouts/AuthConsumer';
import { FileExcelOutlined } from '@ant-design/icons';
import exportExcel from '@/utils/exportExcel';

/**
 * 导出excel 按钮
 * @param {*} auth 按钮权限
 * @param {*} dispatchType 请求type
 * @param {*} dispatchData 请求data
 * @param {*} dispatchProps 请求覆盖配置 type payload
 * @param {*} exportProps 导出配置 header fieldNames
 * 2021年1月22日 18:08:23
 */
const ExcelButton = (props) => {
  const {
    auth = 'exportList',
    dispatchType,
    dispatchData,
    dispatchProps,
    exportProps = {},
    dispatch,
    loading,
  } = props;

  // 导出excel 数据
  const fetchGetExcel = () => {
    dispatch({
      type: dispatchType,
      payload: dispatchData,
      ...dispatchProps,
      callback: (data) => exportExcel({ ...exportProps, data }),
    });
  };

  return (
    <AuthConsumer auth={auth}>
      <Tooltip placement="top" title={'导出excel'}>
        <Button
          type="primary"
          className="dkl_green_btn"
          icon={<FileExcelOutlined />}
          onClick={() => fetchGetExcel()}
          loading={loading.effects[dispatchType]}
        ></Button>
      </Tooltip>
    </AuthConsumer>
  );
};

export default connect(({ loading }) => ({ loading }))(ExcelButton);
