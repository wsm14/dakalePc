import React, { useRef } from "react";
import { connect } from "dva";
import HandleSetTable from "@/components/HandleSetTable";
import DataTableBlock from "@/components/DataTableBlock";
import { ACCOUNT_STATUS, BUSINESS_STATUS } from "@/common/constant";

const CircleMasterList = (props) => {
  const { circleMasterList, loading } = props;

  const childRef = useRef();

  // 调用子组件方法
  // const fetchGetData = () => {
  //   childRef.current.fetchGetData();
  // };

  // 搜索参数
  const searchItems = [
    {
      label: "商户ID",
      name: "userMobile1s",
    },
    {
      label: "商家账号",
      name: "userMosbile1s",
    },
    {
      label: "账号状态",
      name: "userMobile1",
      type: "select",
      select: { list: ACCOUNT_STATUS },
    },
    {
      label: "经营状态",
      name: "userMobile1",
      type: "select",
      select: { list: BUSINESS_STATUS },
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: "商户ID",
      dataIndex: "userId",
    },
    {
      title: "商家名称",
      align: "center",
      dataIndex: "phoneNumber",
      render: (val) => val || "暂未授权",
    },
    {
      title: "商家账号",
      align: "center",
      dataIndex: "orderCount",
    },
    {
      title: "商家类型",
      align: "center",
      dataIndex: "orderTotal",
      render: (val) => `￥${val}`,
    },
    {
      title: "所在城市",
      align: "center",
      dataIndex: "parkName",
      render: (val) => val || "-",
    },
    {
      title: "详细地址",
      align: "center",
      dataIndex: "addTimeStamp",
    },
    {
      title: "家主手机",
      align: "center",
      dataIndex: "addTimeStamp",
    },
    {
      title: "经营状态",
      align: "center",
      dataIndex: "addTimeStamp",
      render: (val) => val || "-",
    },
    {
      title: "店铺状态",
      align: "center",
      dataIndex: "addTimeStamp",
      render: (val) => BUSINESS_STATUS[val],
    },
    {
      title: "操作",
      dataIndex: "id",
      align: "center",
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              type: "info",
              //   click: () => setShowCoach(record),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <DataTableBlock
      cRef={childRef}
      loading={loading}
      columns={getColumns}
      searchItems={searchItems}
      rowKey={(record) => `${record.userId}`}
      dispatchType="circleMasterList/fetchAppUserList"
      {...circleMasterList}
    ></DataTableBlock>
  );
};

export default connect(({ circleMasterList, loading }) => ({
  circleMasterList,
  loading: loading.models.circleMasterList,
}))(CircleMasterList);
