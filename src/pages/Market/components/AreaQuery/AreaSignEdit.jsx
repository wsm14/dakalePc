import React, { useState } from 'react';
import { connect } from 'umi';
import { Form, Button, Tabs } from 'antd';
import CITYJSON from '@/common/city';
import aliOssUpload from '@/utils/aliOssUpload';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';

const { TabPane } = Tabs;

const AreaSignEdit = (props) => {
  const { dispatch, childRef, visible, onClose, loading } = props;
  const { show = false, detail = {} } = visible;

  const [form] = Form.useForm();
  const [tabKey, setTabKey] = useState(0);

  // 新增
  const fetchCityManageSet = () => {
    form.validateFields().then((values) => {
      const { backgroundImg } = values;
      aliOssUpload(backgroundImg).then((res) => {
        dispatch({
          type: 'manageCity/fetchCityManageSet',
          payload: {
            ...detail,
            ...values,
            backgroundImg: res.toString(),
          },
          callback: () => {
            onClose();
            childRef.current.fetchGetData();
          },
        });
      });
    });
  };

  const tabItem = ['定金', '签约'];
  const tabItemFom = ['付定', '签约'];

  const formItems = [
    {
      title: `填写${tabItemFom[tabKey]}信息`,
      label: '客户姓名',
      name: 'backsndImg',
    },
    {
      label: '客户手机号',
      name: 'ba1ndImg',
    },
    {
      label: '签约区/县',
      name: 'ba1n11dImg',
    },
    {
      label: `${tabItem[tabKey]}金额`,
      name: 'ba1n122g',
      type: 'number',
    },
    {
      label: `${tabItemFom[tabKey]}日期`,
      name: 'ba1nsssg',
      type: 'dataPicker',
    },
    {
      label: '签约日期',
      name: 'ba1nssssg',
      type: 'dataPicker',
      visible: tabKey === '1',
    },
    {
      label: '合同期限',
      name: 'ba1nssdsg',
      type: 'rangePicker',
      visible: tabKey === '1',
    },
    {
      label: '上传凭证',
      type: 'upload',
      name: 'backgroundImg',
      maxFile: 1,
    },
    {
      label: '上传附件',
      type: 'otherUpload',
      name: 'backgrossundImg',
      maxFile: 1,
      rules: [{ required: false }],
    },
  ];

  const modalProps = {
    title: detail.name,
    visible: show,
    onClose,
    footer: (
      <Button type="primary" onClick={() => fetchCityManageSet()} loading={loading}>
        确定
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <Tabs defaultActiveKey="1" type="card" onChange={setTabKey}>
        <TabPane tab="定金" key="0">
          <FormCondition form={form} formItems={formItems}></FormCondition>
        </TabPane>
        <TabPane tab="签约" key="1">
          <FormCondition form={form} formItems={formItems}></FormCondition>
        </TabPane>
      </Tabs>
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading: loading.models.manageCity,
}))(AreaSignEdit);
