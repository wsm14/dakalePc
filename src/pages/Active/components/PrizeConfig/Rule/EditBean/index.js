import React, { useRef } from 'react';
import DrawerCondition from '@/components/DrawerCondition';
import TableDataBlock from '@/components/TableDataBlock';
import { BLINDBOX_PRIZE_TYPE } from '@/common/constant';
import PopImgShow from '@/components/PopImgShow';
import { Button, Form } from 'antd';
import FormCondition from '@/components/FormCondition';
import ChangeInvite from './changeInvite';

function EditBean(props) {
  const { visible, setVisible, blindBoxRule, loading, keyType } = props;

  const [form] = Form.useForm();
  const inviteRef = useRef();

  // table 表头
  // const getColumns = [
  //   {
  //     title: '奖品ID',
  //     fixed: 'left',
  //     dataIndex: 'id',
  //   },
  //   {
  //     title: '奖品类型',
  //     fixed: 'left',
  //     dataIndex: 'type',
  //     render: (val) => BLINDBOX_PRIZE_TYPE[val],
  //   },
  //   {
  //     title: '中奖图',
  //     dataIndex: 'winningImg',
  //     render: (val) => <PopImgShow url={val}></PopImgShow>,
  //   },
  //   {
  //     title: '奖池图',
  //     dataIndex: 'winningImg',
  //     render: (val) => <PopImgShow url={val}></PopImgShow>,
  //   },
  //   {
  //     title: '奖品名称',
  //     dataIndex: 'prize',
  //     ellipsis: true,
  //   },
  //   {
  //     title: '盲盒展示名称',
  //     dataIndex: 'showName',
  //     ellipsis: true,
  //   },
  //   {
  //     title: '抽中概率',
  //     dataIndex: 'rate',
  //   },
  //   {
  //     title: '是否真实奖品',
  //     dataIndex: 'isParticipate',
  //     render: (val) => (val = 1 ? '是' : '仅展示'),
  //   },
  // ];
  const formItems = [
    {
      label: '每次抽取所需卡豆',
      type: 'number',
      name: 'bean',
      //   disabled: !editType.includes('edit'),
    },
    {
      label: '盲盒背景图',
      type: 'upload',
      name: 'backImg',
      //   disabled: !editType.includes('edit'),
    },
    {
      label: '盲盒动效',
      type: 'otherUpload',
      name: 'backFile',
      //   disabled: !editType.includes('edit'),
    },
    {
      label: '奖池',
      name: 'participateBlindBoxProducts',

      //   disabled: !editType.includes('edit'),
    },
  ];
  const submitInvite = (lists, callback) => {
    setVisible(false);
    console.log(inviteRef);
    // dispatch({
    //   type: 'UpdateBlindBoxRule/fetchBlindBoxConfigSet',
    //   payload: {
    //     ruleType: 'invite',
    //     allBlindBoxProducts: lists,
    //   },
    //   callback,
    // });
  };
  return (
    <>
      <DrawerCondition title="编辑场次" visible={visible} onClose={submitInvite}>
        {keyType === 'bean' ? (
          <FormCondition
            form={form}
            formItems={formItems}
            initialValues={blindBoxRule}
          ></FormCondition>
        ) : (
          <ChangeInvite ref={inviteRef}></ChangeInvite>
        )}
      </DrawerCondition>
    </>
  );
}

export default EditBean;
