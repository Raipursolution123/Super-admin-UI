import React, { useState } from "react";
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Tag,
  Modal,
  Descriptions,
  Popconfirm,
  Row,
  Col,
  Statistic,
  Dropdown,
  Menu,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  StopOutlined,
  MoreOutlined,
  TeamOutlined,
  UserOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import CompanyModal from "../components/common/CompanyModal";
import { useCompanies } from "../hooks/useCompanies";
import { companiesAPI } from "../services/companiesService";

const { Search } = Input;

const CompanyManagement = () => {
  const {
    companies,
    loading,
    pagination,
    fetchCompanies,
    createCompany,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
  } = useCompanies();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter handlers
  const handleSearch = (value) => {
    setSearch(value);
    fetchCompanies(1, pagination.pageSize, value, statusFilter);
  };

  // Calculate statistics
  const activeCompaniesList = companies.filter(
    (c) => c.status?.toLowerCase() === "active"
  );
  const activeCompaniesCount = activeCompaniesList.length;
  const totalRevenueValue = activeCompaniesList.reduce(
    (sum, c) => sum + (Number(c.monthly_fee) || 0),
    0
  );

  // Status colors
  const getStatusColor = (status) => {
    const colors = {
      Active: "success",
      Pending: "warning",
      Suspended: "error",
      Inactive: "default",
    };
    return colors[status] || "default";
  };

  const getPlanColor = (plan) => {
    const colors = {
      Enterprise: "purple",
      Premium: "blue",
      Basic: "orange",
      Free: "green",
    };
    return colors[plan] || "default";
  };

  const columns = [
    {
      title: "S/N",
      dataIndex: "id",
      width: 70,
      align: "center",
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Company",
      dataIndex: "company_name",
      width: 250,
      render: (name) => (
        <div style={{ fontWeight: 600, fontSize: "15px" }}>
          {name}
        </div>
      ),
    },
    {
      title: "Owner",
      dataIndex: "owner_email",
      width: 250,
      render: (email) => (
        <div style={{ fontSize: "14px", color: "#64748b" }}>
          {email}
        </div>
      ),
    },
    {
      title: "Employees",
      dataIndex: "employees_count",
      width: 100,
      align: "center",
      render: (count) => (
        <div style={{ fontWeight: 600, fontSize: "16px", color: "#667eea" }}>
          {count}
        </div>
      ),
      sorter: (a, b) => a.employees_count - b.employees_count,
    },
    {
      title: "Plan",
      dataIndex: "subscription_plan",
      width: 120,
      align: "center",
      render: (plan) => (
        <Tag color={getPlanColor(plan)} style={{ fontWeight: 500 }}>
          {plan}
        </Tag>
      ),
    },
    {
      title: "Monthly Fee",
      dataIndex: "monthly_fee",
      width: 120,
      align: "center",
      render: (fee) => (
        <span style={{ fontWeight: 600, color: "#10b981" }}>
          ₹{fee.toLocaleString()}
        </span>
      ),
      sorter: (a, b) => a.monthly_fee - b.monthly_fee,
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 120,
      align: "center",
      render: (status) => (
        <Tag color={getStatusColor(status)} style={{ fontWeight: 500 }}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Joined",
      dataIndex: "joined_date",
      width: 150,
      align: "center",
      render: (date) => (
        <span style={{ color: "#64748b" }}>{date}</span>
      ),
    },
  ];

  return (
    <div>
      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card
              style={{
                borderRadius: "12px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "none",
              }}
              bodyStyle={{ padding: "20px" }}
            >
              <Statistic
                title={
                  <span style={{ color: "rgba(255,255,255,0.9)", fontSize: "14px" }}>
                    Total Companies
                  </span>
                }
                value={companies.length}
                prefix={<TeamOutlined />}
                valueStyle={{ color: "#fff", fontSize: "32px", fontWeight: 700 }}
              />
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card
              style={{
                borderRadius: "12px",
                background: "linear-gradient(135deg, #0ba360 0%, #3cba92 100%)",
                border: "none",
              }}
              bodyStyle={{ padding: "20px" }}
            >
              <Statistic
                title={
                  <span style={{ color: "rgba(255,255,255,0.9)", fontSize: "14px" }}>
                    Active Plans
                  </span>
                }
                value={activeCompaniesCount}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: "#fff", fontSize: "32px", fontWeight: 700 }}
              />
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card
              style={{
                borderRadius: "12px",
                background: "linear-gradient(135deg, #f83600 0%, #f9d423 100%)",
                border: "none",
              }}
              bodyStyle={{ padding: "20px" }}
            >
              <Statistic
                title={
                  <span style={{ color: "rgba(255,255,255,0.9)", fontSize: "14px" }}>
                    Monthly Revenue
                  </span>
                }
                value={totalRevenueValue}
                prefix="₹"
                valueStyle={{ color: "#fff", fontSize: "32px", fontWeight: 700 }}
              />
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Main Table Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Card
          title={
            <span
              style={{
                fontSize: "18px",
                fontWeight: 600,
                fontFamily: "Poppins, sans-serif",
              }}
            >
              Company Details (Customers)
            </span>
          }
          extra={
            <Space>
              <Search
                placeholder="Search companies..."
                allowClear
                onSearch={handleSearch}
                style={{ width: 250 }}
                prefix={<SearchOutlined />}
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setIsModalOpen(true);
                }}
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 500,
                }}
                size="large"
              >
                Add Company
              </Button>
            </Space>
          }
          style={{
            borderRadius: "16px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Table
            columns={columns}
            dataSource={companies}
            loading={loading}
            rowKey="id"
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              onChange: (page, pageSize) =>
                fetchCompanies(page, pageSize, search, statusFilter),
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} companies`,
            }}
            bordered
            scroll={{ x: 1200 }}
          />
        </Card>
      </motion.div>

      {/* Add Modal */}
      <CompanyModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(data) => createCompany(data)}
      />
    </div>
  );
};

export default CompanyManagement;
