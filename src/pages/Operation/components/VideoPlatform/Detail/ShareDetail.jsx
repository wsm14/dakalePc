import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Form, Button } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import {
  NEW_SHARE_OWNER,
  NEW_SHARE_STATUS,
  SHARE_SEX_TYPE,
  SHARE_AREA_TYPE,
} from '@/common/constant';
import { couponsDom, goodsDom } from '@/components/VideoSelectBindContent/CouponFreeDom';
import { checkCityName } from '@/utils/utils';
import aliOssUpload from '@/utils/aliOssUpload';
import uploadLive from '@/utils/uploadLive';
import QuestionTooltip from '@/components/QuestionTooltip';
import DrawerCondition from '@/components/DrawerCondition';
import DescriptionsCondition from '@/components/DescriptionsCondition';
import GoodsSet from './GoodsSet';
import GoodsEdit from './GoodsEdit';
import SharePutInSet from '../SharePushForm/SharePutInSet';
import ShareImgEdit from '../Form/ShareImgEdit';

const ShareDetail = (props) => {
  const {
    tabKey,
    dispatch,
    visible,
    total,
    getDetail,
    onClose,
    fetchNewShareNoAudit,
    loading,
    loadingDetail,
    childRef,
  } = props;

  // tabKey 0:探店视频 1：带货视频  other：UGC视频tab

  const { index, show = false, type = 'info', detail = {} } = visible;
  // console.log(detail, 'detail');
  const { ownerId, momentId, ownerName } = detail;

  const [form] = Form.useForm();
  const [couponData, setCouponData] = useState({ free: {}, contact: [] }); // 选择券的信息

  useEffect(() => {
    if (type !== 'info') {
      form.setFieldsValue({ ownerId });
      setCouponData({ free: detail.free, contact: detail.contact });
    }
  }, [type]);

  // 表单信息
  const formItems = [
    {
      label: '视频类型',
      name: 'ownerType',
      render: (val) => NEW_SHARE_OWNER[val],
    },
    {
      label: `${NEW_SHARE_OWNER[detail.ownerType]}ID`,
      name: 'ownerId',
    },
    {
      label: `${NEW_SHARE_OWNER[detail.ownerType]}名称`,
      name: 'ownerName',
    },
    {
      label: `视频`,
      name: ['videoContent', 'url'],
      type: 'videoUpload',
    },
    // {
    //   label: '标题',
    //   name: 'title',
    // },
    {
      label: '内容详情',
      name: 'message',
    },
    {
      label: '定位',
      name: 'address',
      show: tabKey === '0' || tabKey === '1' ? false : true,
      render: (val) => (
        <>
          <EnvironmentOutlined />
          {val}
        </>
      ),
    },
    {
      label: '行业分类',
      name: 'topCategoryName',
      show: detail.ownerType !== 'user',
      render: (val, row) => `${val}/${row.categoryName}`,
    },
    {
      label: '推荐带货',
      name: 'promotionList',
      show: tabKey === '1',
      render: (val, row) =>
        val.map((item) =>
          item.type === 'special' ? goodsDom(item) : couponsDom(item, '', '', item.type),
        ),
    },
    {
      label: '性别',
      name: 'gender',
      show: detail.ownerType !== 'user',
      render: (val) => SHARE_SEX_TYPE[val],
    },
    {
      label: '年龄',
      name: 'age',
      show: detail.ownerType !== 'user',
      render: (val) => (val === '0-100' ? '不限' : val),
    },
    {
      label: '地域',
      name: 'areaType',
      show: detail.ownerType !== 'user',
      render: (val, row) =>
        `${SHARE_AREA_TYPE[val]}\n${
          {
            all: '',
            city: row?.area?.split(',').map((i) => checkCityName(i)),
            district: row?.area?.split(',').map((i) => checkCityName(i)),
            near: `${row.beanAddress || '--'}\n附近${row.area || 0}米`,
          }[val]
        }`,
    },
    {
      label: '兴趣',
      name: 'tags',
      show: detail.ownerType !== 'user',
    },
    {
      label: '发布状态',
      name: 'status',
      render: (val) => NEW_SHARE_STATUS[val],
      show: detail.ownerType !== 'user',
    },
    // {
    //   label: '卡豆打赏',
    //   name: 'aaa',
    //   render: () => (
    //     <div>
    //       <div>目标曝光量：{detail.tippingCount || 0}</div>
    //       <div>单次曝光打赏：{Math.round(detail.tippingBean || 0)}</div>
    //       <div>投放时长：{NEW_SHARETIME_TYPE[detail.tippingTimeType]}</div>
    //       {detail.tippingTimeType !== '0' && (
    //         <div>投放时间：{`${detail.beginDate} ~ ${detail.endDate}`}</div>
    //       )}
    //     </div>
    //   ),
    // },
    {
      label: '微信好友分享图',
      name: 'friendShareImg',
      type: 'upload',
    },
    {
      label: '发布时间',
      name: 'publishTime',
      render: (val, row) => (row.publishType == 'fixed' ? `${val}` : '立即发布'),
    },
  ];

  const formItemsData = [
    {
      label: '浏览量',
      name: 'onlookersNum',
    },
    {
      label: '完播量',
      name: 'viewNum',
    },
    {
      label: '完播率',
      // name: '',
      render: (val, row) =>
        row.onlookersNum === 0 ? '0' : `${((row.viewNum / row.onlookersNum) * 100).toFixed(2)}%`,
    },
    {
      label: (
        <QuestionTooltip
          type="quest"
          title="收藏数"
          content="视频收藏数为仿真数据+真实数据"
        ></QuestionTooltip>
      ),
      name: 'collectionSimulationNum',
      render: (val, row) => `${val}+${row.collectionRealNum}`,
    },
    {
      label: (
        <QuestionTooltip
          type="quest"
          title="分享数"
          content="视频分享数为仿真数据+真实数据"
        ></QuestionTooltip>
      ),
      name: 'shareSimulationNum',
      render: (val, row) => `${val}+${row.shareRealNum}`,
    },
    {
      label: (
        <QuestionTooltip
          type="quest"
          title="打赏卡豆数"
          content="视频打赏数为仿真打赏卡豆数+真实打赏卡豆数"
        ></QuestionTooltip>
      ),
      name: 'ugcSimulationNum',
      show: tabKey !== '0' && tabKey !== '1',
      render: (val, row) => `${val}+${row.ugcRewardRealNum}`,
    },
    {
      label: '打赏人次',
      name: 'ugcRewardPerson',
      show: tabKey !== '0' && tabKey !== '1',
    },
    {
      label: '累计打赏卡豆数',
      name: 'rewardBeanSum',
    },

    {
      label: '领豆人次',
      name: 'rewardPersonSum',
    },
  ];

  // 修改审核提交
  const fetchEditData = (values) => {
    const { frontImage, videoUrl, categoryNode, title, videoId, ...other } = values;
    uploadLive({
      data: frontImage, // 上传封面
      callback: (imgs) => {
        uploadLive({
          data: videoId ? videoId : videoUrl, // 上传视频
          title,
          callback: (videos) => {
            dispatch({
              type: 'videoPlatform/fetchNewShareAuditEdit',
              payload: {
                ...other,
                momentId,
                title,
                ownerId,
                frontImageWidth: 544, // 封面宽
                frontImageHeight: 960, // 封面长
                frontImage: imgs, // 封面连接
                videoId: videos,
              },
              callback: onClose,
            });
          },
        });
      },
    });
  };

  const handleUpdataSava = () => {
    form.validateFields().then(async (values) => {
      if (type === 'edit') {
        fetchEditData(values);
        return;
      }
      // 分享配置
      if (type === 'share') {
        const { shareImg = '', friendShareImg = '', customTitle } = values;
        const sImg = await aliOssUpload(shareImg);
        const fImg = await aliOssUpload(friendShareImg);
        fetchNewShareNoAudit(
          {
            momentId,
            ownerId,
            customTitle,
            shareImg: sImg.toString(),
            friendShareImg: fImg.toString(),
          },
          () => {
            childRef.current.fetchGetData();
            onClose();
          },
        );
        return;
      }
      if (type === 'portrait') {
        const { areaType, age, ageData = '', area, tagsId = '', cityList = [], ...other } = values;
        fetchNewShareNoAudit(
          {
            ...other,
            ownerId,
            momentId,
            areaType,
            age: age === 'age' ? ageData.toString() : age,
            tagsId: tagsId.toString(),
            area: {
              all: undefined,
              city: cityList.map((i) => i.city[i.city.length - 1]).toString(),
              district: cityList.map((i) => i.city[i.city.length - 1]).toString(),
              near: area,
            }[areaType],
          },
          onClose,
        );
        return;
      }
      const { free, contact } = couponData;
      fetchNewShareNoAudit(
        {
          ownerId,
          momentId,
          freeOwnerCouponList: free.couponName
            ? [{ ownerCouponId: free.ownerCouponIdString, ownerId }]
            : [],
          activityGoodsList: contact
            .filter((i) => i.goodsName)
            .map((i) => ({ activityGoodsId: i.specialGoodsId || i.activityGoodsId, ownerId })),
          ownerCouponList: contact
            .filter((i) => i.couponName)
            .map((i) => ({ ownerCouponId: i.ownerCouponIdString, ownerId })),
        },
        // onClose,
        () => {
          onClose();
          childRef.current.fetchGetData();
        },
      );
    });
  };

  // 抽屉属性
  const modalProps = {
    title: type == 'share' ? `${ownerName}` : '视频详情',
    visible: show,
    onClose,
    loading: loadingDetail,
    dataPage: type == 'info' && {
      current: index,
      total,
      onChange: (size) => getDetail(size),
    },
    footer: (
      <>
        {type !== 'info' && (
          <Button type="primary" onClick={handleUpdataSava} loading={loading}>
            保存
          </Button>
        )}
      </>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      {
        {
          // 详情
          info: (
            <>
              <DescriptionsCondition
                formItems={formItems}
                initialValues={detail}
              ></DescriptionsCondition>
              <DescriptionsCondition
                title="数据统计"
                formItems={formItemsData}
                initialValues={detail}
              ></DescriptionsCondition>
            </>
          ),
          // 带货修改
          commerce: (
            <GoodsSet form={form} couponData={couponData} setCouponData={setCouponData}></GoodsSet>
          ),
          // 修改
          edit: <GoodsEdit form={form} detail={detail}></GoodsEdit>,
          // 编辑画像
          portrait: <SharePutInSet form={form} detail={detail}></SharePutInSet>,
          // 分享配置
          share: <ShareImgEdit form={form} detail={detail}></ShareImgEdit>,
        }[type]
      }
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loadingDetail: loading.effects['videoPlatform/fetchNewShareDetail'],
  loading:
    loading.effects['videoPlatform/fetchNewShareNoAudit'] ||
    loading.effects['videoPlatform/fetchNewShareAuditEdit'],
}))(ShareDetail);
