import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import DrawerCondition from '@/components/DrawerCondition';
import { Form, Button } from 'antd';
import FormCondition from '@/components/FormCondition';
import { RED_ENVELOPES_TYPE_SHE, SHARE_SEX_TYPE } from '@/common/constant';
import { UserSelectShow } from '@/components/MerUserSelectTable';

const EnvelopSet = (props) => {
  const { kolLevel, onClose, childRef, visible, dispatch } = props;
  const { show = false, detail = {} } = visible;
  const [form] = Form.useForm();
  const [envelopType, setEnvelopType] = useState(false);
  const [visibleSelect, setVisibleSelect] = useState(false); // 选择用户弹窗
  const [userList, setUserList] = useState({ keys: [], list: [] });

  const handleSave = () => {
    form.validateFields().then((values) => {
      dispatch({
        type: 'redEnvelopes/fetchSetLuckyRedEnvelopeAuthority',
        payload: {
          dictionaryId: detail.dictionaryId,
          extraParam: values.extraParam,
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

  const formItems = [
    {
      label: '紅包使用权限设置',
      name: 'extraParam',
      type: 'select',
      select: kolLevel,
    },
    // {
    //   label: '白名单列表',
    //   name: 'userIdList',
    //   type: 'formItem',
    //   visible: envelopType == '1',
    //   rules: [{ required: true, message: '请选择用户' }],
    //   formItem: (
    //     <Button type="primary" ghost onClick={() => setVisibleSelect(true)}>
    //       选择用户
    //     </Button>
    //   ),
    // },
    // {
    //   label: '适用用户',
    //   type: 'noForm',
    //   visible: envelopType == '1',
    //   formItem: (
    //     <UserSelectShow
    //       maxLength={500}
    //       key="UserTable"
    //       columns={columns}
    //       {...userList}
    //       showSelect={visibleSelect}
    //       onCancelShowSelect={() => setVisibleSelect(false)}
    //       onOk={(val) => {
    //         setUserList(val);
    //         form.setFieldsValue({ userIdList: val });
    //       }}
    //     ></UserSelectShow>
    //   ),
    // },
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
