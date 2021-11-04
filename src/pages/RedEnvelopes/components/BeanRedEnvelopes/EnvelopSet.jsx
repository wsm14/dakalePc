import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import DrawerCondition from '@/components/DrawerCondition';
import { Form, Button } from 'antd';
import FormCondition from '@/components/FormCondition';
import { RED_ENVELOPES_TYPE_SHE, SHARE_SEX_TYPE } from '@/common/constant';
import { UserSelectShow } from '@/components/MerUserSelectTable';
import { set } from 'lodash-es';

const EnvelopSet = (props) => {
  const { kolLevel, onClose, childRef, visible, dispatch } = props;
  const { show = false, detail = {} } = visible;
  const [form] = Form.useForm();
  const [envelopType, setEnvelopType] = useState(false);
  const [visibleSelect, setVisibleSelect] = useState(false); // 选择用户弹窗
  const [userList, setUserList] = useState({ keys: [], list: [] });

  const handleSave = () => {
    form.validateFields().then((values) => {
      console.log(values);
      const { extraParam, extraParamNormal } = values;
      return;
      dispatch({
        type: 'redEnvelopes/fetchSetLuckyRedEnvelopeAuthority',
        payload: {
          dictionaryId: detail.dictionaryId,
          extraParam,
          extraParamNormal,
        },
        callback: () => {
          onClose();
          childRef.current.fetchGetData();
        },
      });
    });
  };
  useEffect(() => {
    fetchGetKolLevel();
  }, []);

  // 获取哒人等级数据
  const fetchGetKolLevel = () => {
    dispatch({
      type: 'baseData/fetchGetKolLevel',
    });
  };

  const modalProps = {
    title: '权限设置',
    visible: show,
    width: 800,
    onClose,
    footer: (
      <Button type="primary" onClick={handleSave}>
        保存
      </Button>
    ),
  };
  const columns = [
    {
      title: '用户昵称',
      dataIndex: 'username',
    },
    {
      title: '注册手机号',
      dataIndex: 'mobile',
    },
    {
      title: '角色',
      dataIndex: 'levelName',
    },
    {
      title: '开通时间',
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      dataIndex: 'userIdString',
      type: 'handle',
      render: (val, row, index) => [
        {
          type: 'del',
          click: () => {
            userList.list.splice(index, 1);
            userList.keys.splice(index, 1);
            setUserList({
              keys: [...userList.keys],
              list: [...userList.list],
            });
          },
        },
      ],
    },
  ];

  const formItems = [
    {
      title: '拼手气红包',
      label: '单次发卡豆上限',
      name: ['extraParam', 'beanLimit'],
      type: 'number',
      suffix: '卡豆/次',
      min: 0,
      precision: 0,
    },
    {
      label: '红包使用权限设置',
      name: ['extraParam', 'level'],
      type: 'select',
      select: kolLevel,
      onChange: (val, option) => {
        form.setFieldsValue({
          levelName: option.option.name,
        });
      },
    },
    {
      label: '等级名称',
      name: 'levelName',
      rules: [{ required: false }],
      hidden: true,
    },
    {
      title: '普通红包',
      label: '单次发卡豆上限',
      name: ['extraParamNormal', 'beanLimit'],
      type: 'number',
      suffix: '卡豆/次',
      min: 0,
      precision: 0,
    },
    {
      label: '白名单列表',
      name: ['extraParamNormal', 'userIdList'],
      type: 'formItem',
      addRules: [
        {
          validator: () => {
            if (userList?.list.length === 0) {
              return Promise.reject(`请选择用户`);
            }
            return Promise.resolve();
          },
        },
      ],
      // visible: envelopType == '1',
      // rules: [{ required: true, message: '请选择用户' }],
      formItem: (
        <Button type="primary" ghost onClick={() => setVisibleSelect(true)}>
          选择用户
        </Button>
      ),
    },
    {
      label: '适用用户',
      type: 'noForm',
      // visible: envelopType == '1',
      formItem: (
        <UserSelectShow
          maxLength={500}
          key="UserTable"
          columns={columns}
          {...userList}
          showSelect={visibleSelect}
          onCancelShowSelect={() => setVisibleSelect(false)}
          onOk={(val) => {
            console.log(val);
            setUserList(val);
            form.setFieldsValue({ userIdList: val });
          }}
        ></UserSelectShow>
      ),
    },
  ];

  return (
    <DrawerCondition {...modalProps}>
      <FormCondition form={form} formItems={formItems} initialValues={detail}></FormCondition>
    </DrawerCondition>
  );
};

export default connect(({ baseData }) => ({
  kolLevel: baseData.kolLevel,
}))(EnvelopSet);
