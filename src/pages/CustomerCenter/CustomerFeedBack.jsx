import React, { useRef } from "react";
import { connect } from "dva";
import HandleSetTable from "@/components/HandleSetTable";
import DataTableBlock from "@/components/DataTableBlock";

const CustomerFeedBack = (props) => {
  const { customerFeedBack, loading } = props;

  const childRef = useRef();

  // 搜索参数
  const searchItems = [
    {
      label: "反馈人",
      name: "userMobile1s",
    },
    {
      label: "问题状态",
      name: "userMosbile1s",
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: "反馈人",
      dataIndex: "userId",
    },
    {
      title: "身份",
      align: "center",
      dataIndex: "phoneNumber",
    },
    {
      title: "问题描述",
      align: "left",
      dataIndex: "orderCount",
    },
    {
      title: "反馈时间",
      align: "left",
      dataIndex: "orderTotal",
      render: (val) => `￥${val}`,
    },
    {
      title: "问题状态",
      align: "left",
      dataIndex: "parkName",
      render: (val) => val || "-",
    },
    {
      title: "操作人",
      align: "center",
      dataIndex: "addTimeStamp",
    },
    {
      title: "操作时间",
      align: "center",
      dataIndex: "addTimeStamp",
    },
    {
      title: "操作",
      dataIndex: "id",
      fixed: 'right',
      align: "right",
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              type: "own",
              title: "查看",
              //   click: () => setShowCoach(record),
            },
            {
              type: "own",
              title: "回复",
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
      dispatchType="customerFeedBack/fetchAppUserList"
      {...customerFeedBack}
    ></DataTableBlock>
  );
};

export default connect(({ customerFeedBack, loading }) => ({
  customerFeedBack,
  loading: loading.models.customerFeedBack,
}))(CustomerFeedBack);
