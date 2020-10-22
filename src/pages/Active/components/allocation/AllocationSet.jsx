import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Drawer, Button, Space, Form } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import aliOssUpload from '@/utils/aliOssUpload';
import FormCondition from '@/components/FormCondition';
import SearchData from './searchData/searchDataContent';

const AllocationSet = (props) => {
  const {
    loading,
    dispatch,
    childRef,
    records = {},
    userOs,
    promotionId,
    position,
    show,
    onClose,
  } = props;

  const [form] = Form.useForm();
  const [nativeList, setNativeList] = useState([]);
  const [visibleUrl, setVisibleUrl] = useState('');
  const [visibleSearch, setVisibleSearch] = useState({ visible: false, valueName: '', type: '' });

  // 提交表单
  const fetchDataEdit = () => {
    form.validateFields().then((values) => {
      const { promotionContent = '' } = values;
      aliOssUpload(promotionContent).then((res) => {
        dispatch({
          type: 'activeAllocation/fetchAllocationSetEdit',
          payload: {
            ...records,
            ...values,
            userOs,
            promotionId,
            position,
            promotionContent: res.toString(),
          },
          callback: () => {
            childRef.current.fetchGetData();
            onClose();
          },
        });
      });
    });
  };

  // 获取native选择项目
  const fetchAllocationNative = () => {
    dispatch({
      type: 'activeAllocation/fetchAllocationNative',
      callback: (val) => setNativeList(val.map((item) => ({ value: item.id, name: item.name }))),
    });
  };

  useEffect(() => {
    if (show) {
      fetchAllocationNative();
      setVisibleUrl(records.jumpType);
    }
  }, [show]);

  const formItems = [
    {
      label: `封面图片`,
      type: 'upload',
      name: 'promotionContent',
      maxFile: 1,
    },
    {
      label: '活动名称',
      name: 'promotionName',
    },
    {
      label: '跳转类型',
      name: 'jumpType',
      type: 'select',
      onChange: (val) => setVisibleUrl(val),
      select: [
        { value: 'h5', name: 'H5' },
        { value: 'native', name: 'Native' },
      ],
    },
    {
      label: '跳转页面',
      name: 'jumpUrl',
      visible: visibleUrl === 'h5',
      addonAfter: (
        <SearchOutlined
          onClick={() => setVisibleSearch({ visible: true, valueName: 'jumpUrl', type: 'url' })}
        />
      ),
    },
    {
      label: '跳转页面',
      name: 'nativeId',
      type: 'select',
      visible: visibleUrl === 'native',
      select: nativeList,
    },
  ];

  return (
    <>
      <Drawer
        title={`活动设置`}
        width={600}
        visible={show}
        onClose={onClose}
        destroyOnClose
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={onClose}>取消</Button>
              <Button onClick={fetchDataEdit} type="primary" loading={loading}>
                确认
              </Button>
            </Space>
          </div>
        }
      >
        <FormCondition formItems={formItems} form={form} initialValues={records} />
      </Drawer>
      <SearchData
        form={form}
        {...visibleSearch}
        onCancel={() => setVisibleSearch({ show: false })}
      ></SearchData>
    </>
  );
};

export default connect(({ loading }) => ({
  loading: loading.models.activeAllocation,
}))(AllocationSet);
