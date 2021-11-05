import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'umi';
import DrawerCondition from '@/components/DrawerCondition';
import { Form, Button } from 'antd';
import FormCondition from '@/components/FormCondition';
import TableDataBlock from '@/components/TableDataBlock';
import UserSelect from '@/components/MerUserSelectTable/UserSelect';
const EnvelopSet = (props) => {
  const { kolLevel, onClose, childRef, visible, dispatch, whiteNameList, loading } = props;
  const tableRef = useRef();
  const { show = false, detail = {} } = visible;
  const [form] = Form.useForm();
  const [visibleSelect, setVisibleSelect] = useState(false); // 选择用户弹窗

  const handleSave = () => {
    form.validateFields().then((values) => {
      const { extraParam, extraParamNormal } = values;
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
      dataIndex: 'userName',
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
      dataIndex: 'configRedEnvelopeWhiteAccountId',
      type: 'handle',
      render: (val, row, index) => [
        {
          type: 'del',
          click: () => handleDelete(val),
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
          extraParam: {
            levelName: option.option.name,
          },
        });
      },
    },
    {
      label: '等级名称',
      name: ['extraParam', 'levelName'],
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
            if (whiteNameList?.list.length === 0) {
              return Promise.reject(`请选择用户`);
            }
            return Promise.resolve();
          },
        },
      ],
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
        <TableDataBlock
          noCard={false}
          size="small"
          cRef={tableRef}
          loading={loading}
          columns={columns}
          rowKey={(record) => `${record.configRedEnvelopeWhiteAccountId}`}
          params={{ page: 1, limit: 10 }}
          dispatchType="redEnvelopes/fetchWhiteNameList"
          {...whiteNameList}
        ></TableDataBlock>
      ),
    },
  ];

  //白名单删除
  const handleDelete = (configRedEnvelopeWhiteAccountId) => {
    dispatch({
      type: 'redEnvelopes/fetchWhiteNameListDelete',
      payload: {
        configRedEnvelopeWhiteAccountId,
      },
      callback: tableRef.current.fetchGetData,
    });
  };

  //确认
  const onOk = (keysObj, list, resultList) => {
    const { keys = [] } = keysObj;
    console.log(keys);
    // return;
    dispatch({
      type: 'redEnvelopes/fetchWhiteNameListAdd',
      payload: {
        userIds: keys,
      },
      callback: tableRef.current.fetchGetData,
    });
  };

  return (
    <DrawerCondition {...modalProps}>
      <FormCondition form={form} formItems={formItems} initialValues={detail}></FormCondition>
      <UserSelect
        // keys={whiteNameList.keys}
        visible={visibleSelect}
        // userList={whiteNameList.list}
        onOk={onOk}
        onCancel={() => setVisibleSelect(false)}
      ></UserSelect>
    </DrawerCondition>
  );
};

export default connect(({ baseData, redEnvelopes, loading }) => ({
  kolLevel: baseData.kolLevel,
  whiteNameList: redEnvelopes.whiteNameList,
  loading: loading.effects['redEnvelopes/fetchWhiteNameList'],
}))(EnvelopSet);
