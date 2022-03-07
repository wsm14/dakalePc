import React, { useState, useRef } from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import { BLINDBOX_PRIZE_TYPE } from '@/common/constant';
import DrawerCondition from '@/components/DrawerCondition';
import TableDataBlock from '@/components/TableDataBlock';
import FormCondition from '@/components/FormCondition';
import PopImgShow from '@/components/PopImgShow';
import InputNumber from '@/components/FormCondition/InputNumber';
import aliOssUpload from '@/utils/aliOssUpload';
import PrizeSelectModal from '../../NoobJackPot/PrizeSelectModal';
import ChangeInvite from './ChangeInvite';
import { DAREN_TEMP_FLAG } from '@/common/constant';

function EditBean(props) {
  const { visible, onClose, blindBoxRule = {}, loading, keyType, dispatch, callBack } = props;

  const [form] = Form.useForm();

  //弹窗显示
  const [modalVisible, setModalVisible] = useState(false);

  //列表数据
  const [tableList, setTableList] = useState([]);

  //表单提交
  const handleUpAction = () => {
    form.validateFields().then(async (values) => {
      const { backGroundImg = '', dynamicEffect = '' } = values;
      let payload = {};
      if (keyType === 'bean') {
        const sImg = await aliOssUpload(backGroundImg);
        const fImg = await aliOssUpload(dynamicEffect);
        const newTabList = tableList.map(item=>{
          let probability = item.probability/100
          return {
            ...item,
            probability
          }
        })
      
        payload = {
          needBean: values.needBean,
          giveTimes:values.giveTimes,
          backGroundImg: sImg.toString(),
          dynamicEffect: fImg.toString(),
          showPrizePoolList: newTabList,
        };
      } else {
        payload = {
          num: values.num,
          times: values.times,
          showPrizePoolList: newTabList,
        };
      }

      dispatch({
        type: 'prizeConfig/fetchSetLuckDrawConfig',
        payload: {
          ruleType: keyType,
          ...payload,
        },
        callback: () => {
          onClose();
          callBack(keyType);
        },
      });
    });
  };

  //弹窗点击确认
  const handleBlindConfigSet = (lists, callback) => {
    tableList.forEach((item) => {
      const num = lists.findIndex((val) => {
        return val.luckPrizeIdStr === item.luckPrizeIdStr;
      });
      if (num !== -1) {
        lists.splice(num, 1, item);
      }
    });
    setTableList(lists);
    callback();
  };

  //改变抽中概率
  const onChangeInput = (val, index, type) => {
    switch (type) {
      case 'add':
        tableList[index].probability = val;
        break;
      case 'delete':
        tableList.splice(index, 1);
        break;
      default:
        break;
    }
    setTableList([...tableList]);
  };

  // table 表头
  const getColumns = [
    {
      title: '奖品ID',
      fixed: 'left',
      dataIndex: 'luckPrizeIdStr',
    },
    {
      title: '奖品类型',
      fixed: 'left',
      dataIndex: 'prizeType',
      render: (val) => BLINDBOX_PRIZE_TYPE[val],
    },
    {
      title: '中奖图',
      dataIndex: 'winPrizeImg',
      render: (val) => <PopImgShow url={val}></PopImgShow>,
    },
    {
      title: '奖池图',
      dataIndex: 'prizeImg',
      render: (val) => <PopImgShow url={val}></PopImgShow>,
    },
    {
      title: '奖品名称',
      dataIndex: 'prizeName',
      ellipsis: true,
    },
    {
      title: '盲盒展示名称',
      dataIndex: 'prizeName',
      ellipsis: true,
    },
    {
      title: '抽中概率',
      dataIndex: 'probability',
      render: (val, row, index) => (
        <InputNumber
          style={{ width: '100px' }}
          precision={5}
          min={0}
          max={100}
          suffix={'%'}
          value={val}
          onChange={(e) => {
            onChangeInput(e, index, 'add');
          }}
        ></InputNumber>
      ),
    },
    {
      title: '是否真实奖品',
      dataIndex: 'isJoinLuck',
      render: (val) => DAREN_TEMP_FLAG[val],
    },
    {
      type: 'handle',
      dataIndex: 'luckPrizeIdStr',
      fixed: 'right',
      render: (val, row, index) => [
        {
          type: 'del',
          auth: true,
          click: () => onChangeInput(val, index, 'delete'),
        },
      ],
    },
  ];

  // 卡豆专场 编辑规则
  const formItems = [
    {
      label: '每次抽取需要卡豆',
      name: 'needBean',
      type: 'number',
      suffix: '卡豆',
      rules: [{ required: false }],
    },
    {
      label: '赠送次数',
      name: 'giveTimes',
      type: 'number',
      suffix: '次',
      rules: [{ required: false }],
    },
    {
      label: '盲盒背景图',
      type: 'upload',
      rules: [{ required: false }],
      extra: '(请上传XXX*XXX尺寸，大小50KB以内的PNG格式图片)',
      name: 'backGroundImg',
    },
    {
      label: '盲盒动效',
      type: 'otherUpload',
      extra: '请上传大小XX以内的XX格式文件',
      rules: [{ required: false }],
      name: 'dynamicEffect',
    },
    {
      label: '奖池',
      name: 'showPrizePoolList',
      type: 'formItem',
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
      type: 'noForm',
      formItem: (
        <TableDataBlock
          noCard={false}
          loading={loading}
          columns={getColumns}
          rowKey={(record) => `${record.luckPrizeIdStr}`}
          list={tableList}
          pagination={false}
        ></TableDataBlock>
      ),
    },
  ];

  // 邀请专场 编辑规则
  const formItemsInvitation = [
    {
      type: 'noForm',
      formItem: <ChangeInvite></ChangeInvite>,
    },
    {
      label: '奖池',
      name: 'showPrizePoolList',
      type: 'formItem',
      addRules: [
        {
          validator: () => {
            const total = tableList
              .filter((item) => item.isJoinLuck === '1')
              .reduce((item, next) => {
                return item + Number(next.probability);
              }, 0);
            // console.log(total);
            if (total != 100) {
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
          rowKey={(record) => `${record.luckPrizeIdStr}`}
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
    afterCallBack: () => {
      const newTabList = blindBoxRule?.showPrizePoolList.map(item=>{
        let probability = item.probability*100
        return {
          ...item,
          probability
        }
      })
      setTableList(newTabList);
    },
    footer: (
      <Button onClick={handleUpAction} type="primary" loading={loading}>
        提交
      </Button>
    ),
  };

  return (
    <>
      <DrawerCondition {...modalProps}>
        <FormCondition
          form={form}
          formItems={keyType === 'bean' ? formItems : formItemsInvitation}
          initialValues={blindBoxRule}
        ></FormCondition>
      </DrawerCondition>
      <PrizeSelectModal
        visible={modalVisible}
        selectList={tableList}
        // data={{ isNovice: 0 }} // 覆盖数据 isNovice 是否属于新手必中奖池 0-否 1-是 这里不是新手奖池
        onOk={handleBlindConfigSet}
        onCancel={() => setModalVisible(false)}
      ></PrizeSelectModal>
    </>
  );
}

export default connect(({ prizeConfig, loading }) => ({
  // blindBoxRule: prizeConfig.blindBoxRule,
  loading:
    loading.effects['prizeConfig/fetchGetList'] ||
    loading.effects['prizeConfig/fetchSetLuckDrawConfig'],
}))(EditBean);
