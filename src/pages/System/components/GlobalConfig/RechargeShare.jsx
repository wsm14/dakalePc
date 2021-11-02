import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { Tabs, Form, Button } from 'antd';
import { GLOBAL_CONFIG_SHARE } from '@/common/imgRatio';
import FormCondition from '@/components/FormCondition';
import aliOssUpload from '@/utils/aliOssUpload';

const { TabPane } = Tabs;

const RechargeShare = (props) => {
  const { loading, dispatch } = props;

  const [tabKey, setTabKey] = useState('telephone');
  const [list, setList] = useState({});
  const [telephone] = Form.useForm();
  const [member] = Form.useForm();

  useEffect(() => {
    getShareList();
  }, [tabKey]);

  const getShareList = () => {
    dispatch({
      type: 'globalConfig/fetchGetShareImgValue',
      payload: {
        shareType: tabKey,
      },
      callback: (list) => setList(list),
    });
  };

  const handleUpload = (form) => {
    console.log(form);
    form.validateFields().then((values) => {
      const { shareImg } = values;
      aliOssUpload(shareImg).then((res) => {
        dispatch({
          type: 'globalConfig/fetchSaveRechargeShareImg',
          payload: {
            shareImg: res.toString(),
            shareType: tabKey,
          },
          callback: () => {
            getShareList();
          },
        });
      });
    });
  };

  const formItems = [
    {
      name: 'shareImg',
      type: 'upload',
      maxFile: 1,
      extra: '请上传1080*1920px的png/jpg格式图片',
      imgRatio: GLOBAL_CONFIG_SHARE,
    },
  ];
  const handleChange = (key) => {
    console.log(key);
    setList({});
    setTabKey(key);
  };

  return (
    <>
      <Tabs defaultActiveKey="telephone" onChange={handleChange}>
        <TabPane tab="话费充值分享海报" key="telephone" loading={loading}>
          <FormCondition
            form={telephone}
            formItems={formItems}
            initialValues={list}
          ></FormCondition>
          <Button type="primary" onClick={() => handleUpload(telephone)}>
            确认
          </Button>
        </TabPane>
        <TabPane tab="会员充值分享海报" key="member" loading={loading}>
          <FormCondition form={member} formItems={formItems} initialValues={list}></FormCondition>
          <Button type="primary" onClick={() => handleUpload(member)}>
            确认
          </Button>
        </TabPane>
      </Tabs>
    </>
  );
};
export default connect(({ loading, globalConfig }) => ({
  loading: loading.effects['globalConfig/fetchGetRechargeShareImg'],
}))(RechargeShare);
