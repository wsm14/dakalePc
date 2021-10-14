import React, { useState, useRef } from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import PrizeSelectModal from '../../NoobJackPot/PrizeSelectModal';
import DrawerCondition from '@/components/DrawerCondition';
import TableDataBlock from '@/components/TableDataBlock';

import FormCondition from '@/components/FormCondition';
import { BLINDBOX_PRIZE_TYPE } from '@/common/constant';
import PopImgShow from '@/components/PopImgShow';
import InputNumber from '@/components/FormCondition/InputNumber';
import ChangeInvite from './ChangeInvite';

function EditBean(props) {
  const { visible, onClose, blindBoxRule, loading, keyType } = props;

  const numRef = useRef();
  const timesRef = useRef();
  // const [num, setNum] = useState(null);
  // const [times, setTimes] = useState(null);

  const { allBlindBoxProducts: list } = blindBoxRule;

  const [form] = Form.useForm();

  //弹窗显示
  const [modalVisible, setModalVisible] = useState(false);

  //列表数据
  const [tableList, setTableList] = useState([]);

  //表单提交
  const handleUpAction = () => {
    form.validateFields().then(async (values) => {
      console.log(values);
    });
    console.log(numRef.current.ariaValueNow, 'numRef');
    console.log(timesRef.current.ariaValueNow, 'timesRef');
    dispatch({
      type: 'prizeConfig/fetchBlindBoxConfigSet',
      payload: {
        ruleType: 'novice',
        allBlindBoxProducts: lists,
      },
      callback,
    });
  };

  //弹窗点击确认
  const handleBlindConfigSet = (lists, callback) => {
    setTableList(lists);
    callback();
  };

  //改变抽中概率
  const onChangeInput = (val, index, type) => {
    switch (type) {
      case 'add':
        tableList[index].rate = val;
        break;
      case 'delete':
        tableList.splice(index, 1);
        break;
      default:
        break;
    }
    setTableList([...tableList]);
  };

  const getColumns = [
    {
      title: '奖品ID',
      fixed: 'left',
      dataIndex: 'id',
    },
    {
      title: '奖品类型',
      fixed: 'left',
      dataIndex: 'type',
      render: (val) => BLINDBOX_PRIZE_TYPE[val],
    },
    {
      title: '中奖图',
      dataIndex: 'winningImg',
      render: (val) => <PopImgShow url={val}></PopImgShow>,
    },
    {
      title: '奖池图',
      dataIndex: 'winningImg',
      render: (val) => <PopImgShow url={val}></PopImgShow>,
    },
    {
      title: '奖品名称',
      dataIndex: 'prize',
      ellipsis: true,
    },
    {
      title: '盲盒展示名称',
      dataIndex: 'showName',
      ellipsis: true,
    },
    {
      title: '抽中概率',
      dataIndex: 'rate',
      render: (val, row, index) => (
        <InputNumber
          style={{ width: '100px' }}
          precision={2}
          suffix={'%'}
          onChange={(e) => {
            onChangeInput(e, index, 'add');
          }}
        ></InputNumber>
      ),
    },
    {
      title: '是否真实奖品',
      dataIndex: 'isParticipate',
      render: (val) => (val = 1 ? '是' : '仅展示'),
    },
    {
      type: 'handle',
      dataIndex: 'id',
      fixed: 'right',
      render: (val, row, index) => [
        {
          type: 'del',
          auth: 'true',
          click: () => onChangeInput(val, index, 'delete'),
        },
      ],
    },
  ];

  const formItems = [
    {
      label: '每次抽取需要卡豆',
      name: 'userIdList',
      type: 'number',
      suffix: '卡豆',
    },
    {
      label: '中奖图',
      type: 'upload',

      name: 'winningImg',
      maxFile: 1,
    },
    {
      label: '盲盒动效',
      type: 'otherUpload',
      extra: '请上传动效zip文件',
      name: ['pickUpBeans', 'file'],
      labelCol: { span: 6 },
      style: { flex: 1 },
    },
    {
      label: '奖池',
      name: 'userIdList',
      type: 'formItem',
      addRules: [
        {
          validator: () => {
            const total = tableList.reduce((item, next) => {
              return item + next.rate;
            }, 0);
            if (total < 100) {
              return Promise.reject(`当前各奖品抽中概率之和（不含仅展示）不等于100%，请修改`);
            }
            return Promise.resolve();
          },
        },
      ],
      formItem: (
        <Button
          type="primary"
          ghost
          onClick={() => {
            setModalVisible(true);
          }}
        >
          选择
        </Button>
      ),
    },
    {
      label: '适用用户',
      type: 'noForm',
      formItem: (
        <TableDataBlock
          noCard={false}
          loading={loading}
          columns={getColumns}
          rowKey={(record) => `${record.id}`}
          list={tableList}
        ></TableDataBlock>
      ),
    },
  ];

  // 弹出窗属性
  const modalProps = {
    title: '编辑规则',
    width: '800',
    visible,
    onClose,
    footer: (
      <Button onClick={handleUpAction} type="primary">
        提交
      </Button>
    ),
  };

  // 修改邀请数据
  const onChange1 = (val) => {
    setNum(val);
    console.log(num, 'num');
    console.log(val, 'val');
  };
  const onChange2 = (val) => {
    setTimes(val);
    console.log(times, 'times');
  };

  return (
    <>
      <DrawerCondition {...modalProps}>
        {keyType === 'bean' ? (
          <FormCondition form={form} formItems={formItems}></FormCondition>
        ) : (
          <ChangeInvite
            // onChange1={onChange1}
            // onChange2={onChange2}
            // num={num}
            // times={times}
            numRef={numRef}
            timesRef={timesRef}
          ></ChangeInvite>
        )}
      </DrawerCondition>
      <PrizeSelectModal
        visible={modalVisible}
        selectList={tableList}
        data={{ isNovice: 1 }} // 覆盖数据 isNovice 是否属于新手必中奖池 0-否 1-是 这里是新手奖池
        onOk={handleBlindConfigSet}
        onCancel={() => setModalVisible(false)}
      ></PrizeSelectModal>
    </>
  );
}

export default connect(({ prizeConfig, loading }) => ({
  blindBoxRule: prizeConfig.blindBoxRule,
  loading: loading.effects['prizeConfig/fetchGetList'],
}))(EditBean);
