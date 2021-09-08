import React, { useState, useEffect } from 'react';
import { Space, Button } from 'antd';
import { connect } from 'umi';
import { MSG_PSUH_TYPE, MSG_PSUH_OBJECT } from '@/common/constant';
import { NativeFormSet } from '@/components/FormListCondition';
import FormCondition from '@/components/FormCondition';
import { UserSelectShow } from '@/components/MerUserSelectTable';
import ImportDataModal from './ImportDataModal';

const MessagePushSet = (props) => {
  const { initialValues = {}, form, experLevel, dispatch } = props;
  const { linkType, link = '', pushObjectIds, ...ohter } = initialValues;
  const [pushObj, setPushObj] = useState('all');
  const [visiblePort, setVisiblePort] = useState(false);
  const [visibleSelect, setVisibleSelect] = useState(false); // 选择用户弹窗
  const [userList, setUserList] = useState({ keys: [], list: [], resultList: [] }); // 选择后回显的数据
  const newDetail = {
    ...ohter,
    jumpUrl: link,
    jumpUrlType: { '': '', h5: 'H5', native: 'inside' }[linkType],
  };

  useEffect(() => {
    fetchGetExpertLevel();
    if (initialValues.pushObjectType) {
      setPushObj(initialValues.pushObjectType);
    }
    if (pushObjectIds) {
      getUserList();
    }
  }, []);
  const getUserList = () => {
    dispatch({
      type: 'baseData/fetchListUserByIds',
      payload: { userIds: pushObjectIds?.split(',') },
      callback: (list) => {
        const keys = list.map((item) => item.userIdString);
        setUserList({ keys, list });
      },
    });
  };

  // 获取哒人等级映射
  const fetchGetExpertLevel = () => {
    dispatch({
      type: 'baseData/fetchGetExpertLevel',
    });
  };

  //批量导入事件
  const handleImport = () => {
    setVisiblePort({ show: true, pushObj });
  };
  //用户table
  const userColumns = [
    {
      title: '手机号',
      dataIndex: 'mobile',
    },
    {
      title: '昵称',
      dataIndex: 'username',
    },
    {
      title: '级别',
      dataIndex: 'level',
      render: (val) => (val.length > 2 ? val : experLevel[val]),
    },
  ];

  const formItems = [
    {
      label: '消息标题',
      name: 'title',
      maxLength: 20,
    },
    {
      label: '消息内容',
      name: 'content',
      type: 'textArea',
    },
    {
      type: 'noForm',
      formItem: <NativeFormSet form={form} detail={newDetail}></NativeFormSet>,
    },
    {
      label: '消息类型',
      name: 'messageType',
      type: 'select',
      select: MSG_PSUH_TYPE,
    },
    {
      label: '推送时间',
      name: 'pushTime',
      type: 'dataPicker',
      format: 'YYYY-MM-DD HH:mm',
      showTime: true,
    },
    {
      label: '推送对象',
      name: 'pushObjectType',
      type: 'radio',
      select: MSG_PSUH_OBJECT,
      onChange: (e) => {
        setUserList({ keys: [], list: [] });
        setPushObj(e.target.value);
      },
    },
    {
      label: '适用用户',
      name: 'pushObjectIds',
      type: 'formItem',
      visible: pushObj === 'specific',
      rules: [{ required: true, message: '请选择用户' }],
      formItem: (
        <Space size="large">
          <Button type="primary" ghost onClick={() => setVisibleSelect(true)}>
            选择用户
          </Button>
          <Button type="primary" ghost onClick={handleImport}>
            批量导入
          </Button>
        </Space>
      ),
    },
    {
      label: '适用用户',
      type: 'noForm',
      visible: pushObj === 'specific',
      formItem: (
        <UserSelectShow
          maxLength={500}
          key="UserTable"
          {...userList}
          columns={userColumns}
          showSelect={visibleSelect}
          onCancelShowSelect={() => setVisibleSelect(false)}
          onOk={(val) => {
            setUserList(val);
            form.setFieldsValue({ pushObjectIds: val.keys });
          }}
        ></UserSelectShow>
      ),
    },
  ];

  return (
    <>
      <FormCondition form={form} formItems={formItems} initialValues={newDetail}></FormCondition>
      <ImportDataModal
        visible={visiblePort}
        onClose={() => setVisiblePort(false)}
        setUserList={(list) => {
          setUserList({ ...list });
          form.setFieldsValue({ pushObjectIds: list.keys });
        }}
      ></ImportDataModal>
    </>
  );
};

export default connect(({ baseData }) => ({
  experLevel: baseData.experLevel,
}))(MessagePushSet);
