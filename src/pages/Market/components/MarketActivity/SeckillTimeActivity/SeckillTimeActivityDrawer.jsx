import React, { useState } from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import GoodsSelectModal from '@/components/GoodsSelectModal';
import SeckillTimeActivityBaseForm from './Form/BaseForm';
import SupplyInfoDrawer from './SupplyInfoDrawer';

// 查看 修改 新增活动
const SeckillTimeActivityDrawer = (props) => {
  const { dispatch, visible = {}, tabKey, childRef, onClose, loading } = props;

  const { mode = 'add', show = false, detail = {} } = visible;
  const [form] = Form.useForm();
  const [ruleId, setRuleId] = useState(false); // 规则id
  const [ruleData, setRuleData] = useState({}); // 规则数据
  const [visibleInfo, setVisibleInfo] = useState(false); // 补充信息
  const [visibleSelect, setVisibleSelect] = useState(false); // 选择弹窗

  // 下一步
  const handleActiveNaxt = () => {
    form.validateFields().then((value) => {
      const { seckillTimeObjectList = [], ...other } = value;
      const data = {
        ...other,
        seckillTimeObjectList: seckillTimeObjectList.map(({ times }) => ({
          seckillBeginTime: times[0].format('YYYY-MM-DD HH:mm:00'),
          seckillEndTime: times[1].format('YYYY-MM-DD HH:mm:00'),
        })),
      };
      // 新增校验逻辑
      if (mode == 'add') fetchActivityRuleSet(data);
      // 设置校验逻辑
      if (mode == 'set') fetchActivityRuleSet(data);
    });
  };

  // 设置规则 1.1
  const fetchActivityRuleSet = (value) => {
    setRuleData(value);
    dispatch({
      type: 'seckillTimeActivity/fetchSeckillTimeActivityRuleSet',
      payload: value,
      callback: (id) => {
        setRuleId(id);
        setVisibleSelect(true);
      },
    });
  };

  // 选择校验
  const handleSelectRowCheck = ({ selectItem, setSelectItem }) => {
    return {
      hideSelectAll: true, // 隐藏全选
      onChange: () => {}, // 覆盖原本选择方法
      onSelect: (record, selected) => {
        const { goodsId } = record;
        const { keys = [], list = [] } = selectItem;
        // 选中
        if (selected) {
          fetchSeckillTimeActivityCheckGoods(record, () =>
            setSelectItem([...keys, goodsId], [...list, record]),
          );
        } else {
          // 取消选中
          setSelectItem(
            keys.filter((i) => i !== goodsId),
            list.filter((i) => i.goodsId !== goodsId),
          );
        }
      },
    };
  };

  // 校验接口
  const fetchSeckillTimeActivityCheckGoods = (row, callback) => {
    const { goodsId, ownerId } = row;
    dispatch({
      type: 'seckillTimeActivity/fetchSeckillTimeActivityCheckGoods',
      payload: {
        goodsId,
        ownerId,
        goodsType: tabKey,
        marketingSeckillId: ruleId,
      },
      callback,
    });
  };

  // 弹出窗属性
  const modalProps = {
    title: '设置秒杀规则',
    visible: show,
    width: 700,
    onClose,
    footer: (
      <Button onClick={handleActiveNaxt} type="primary" loading={loading}>
        下一步
      </Button>
    ),
  };

  return (
    <>
      <DrawerCondition {...modalProps}>
        <SeckillTimeActivityBaseForm
          form={form}
          initialValues={detail}
        ></SeckillTimeActivityBaseForm>
      </DrawerCondition>
      {/* 选择商品 */}
      <GoodsSelectModal
        visible={visibleSelect}
        showTag={[tabKey]}
        loading={loading}
        rowSelection={handleSelectRowCheck}
        closeSumbit={false}
        searchParams={{ isShowSkuList: 1 }} // 是否搜索展示规格
        onSumbit={({ list }) => {
          setVisibleInfo({
            show: true,
            detail: {
              [tabKey]: list.map(({ discount, skuManagerResps = [], ...other }) => ({
                ...other,
                skuList: skuManagerResps,
              })),
            },
          });
        }}
        onClose={() => setVisibleSelect(false)}
      ></GoodsSelectModal>
      {/* 设置秒杀价 */}
      <SupplyInfoDrawer
        goodsType={tabKey}
        ruleData={ruleData}
        visible={visibleInfo}
        marketingSeckillId={ruleId}
        onClose={() => setVisibleInfo(false)}
        onSumbitClose={() => {
          childRef.current.fetchGetData();
          setVisibleInfo(false);
          setVisibleSelect(false);
          onClose();
        }}
      ></SupplyInfoDrawer>
    </>
  );
};

export default connect(({ loading }) => ({
  loading: loading.models.seckillTimeActivity,
}))(SeckillTimeActivityDrawer);
