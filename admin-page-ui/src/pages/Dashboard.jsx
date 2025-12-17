import React, { useState } from 'react';
import { Row, Col, Card, Table, Tag, Space, Progress, Statistic } from 'antd';
import {
  TeamOutlined,
  UserOutlined,
  CheckCircleOutlined,
  DollarOutlined,
  RiseOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import StatCard from '../components/dashboard/StatCard';

import { useDashboard } from '../hooks/useDashboard';
import { useCompanies } from '../hooks/useCompanies';


const Dashboard = () => {
  const { loading: dashboardLoading, stats: apiStats, growthData, planDistribution } = useDashboard();
  const { companies: backendCompanies, loading: companiesLoading } = useCompanies();

  const loading = dashboardLoading || companiesLoading;

  // Calculate statistics (Use API data if available, else 0/loading state)
  const totalCompanies = apiStats?.totalCompanies || 0;
  const totalEmployees = apiStats?.totalEmployees || 0;
  const activeSubscriptions = apiStats?.activeSubscriptions || 0;
  const monthlyRevenue = apiStats?.monthlyRevenue || 0;

  // Plan colors and badges
  const getPlanColor = (plan) => {
    const colors = {
      'Enterprise': 'purple',
      'Premium': 'blue',
      'Basic': 'orange',
      'Free': 'default',
    };
    return colors[plan] || 'default';
  };

  const getStatusColor = (status) => {
    return status?.toLowerCase() === 'active' ? 'success' : 'warning';
  };

  // Table columns
  const columns = [
    {
      title: 'S/N',
      dataIndex: 'id',
      width: 70,
      align: 'center',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Company Name',
      dataIndex: 'company_name',
      width: 250,
      render: (name, record) => (
        <div>
          <div style={{ fontWeight: 600, fontSize: '14px' }}>{name}</div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>{record.owner_email}</div>
        </div>
      ),
    },
    {
      title: 'Employees',
      dataIndex: 'employees_count',
      width: 120,
      align: 'center',
      render: (count) => (
        <div style={{ fontWeight: 600, fontSize: '16px', color: '#667eea' }}>
          {count}
        </div>
      ),
      sorter: (a, b) => a.employees_count - b.employees_count,
    },
    {
      title: 'Subscription Plan',
      dataIndex: 'subscription_plan',
      width: 150,
      align: 'center',
      render: (plan) => (
        <Tag color={getPlanColor(plan)} style={{ fontWeight: 500, fontSize: '13px' }}>
          {plan}
        </Tag>
      ),
      filters: [
        { text: 'Enterprise', value: 'Enterprise' },
        { text: 'Premium', value: 'Premium' },
        { text: 'Basic', value: 'Basic' },
        { text: 'Free', value: 'Free' },
      ],
      onFilter: (value, record) => record.subscription_plan === value,
    },
    {
      title: 'Monthly Fee',
      dataIndex: 'monthly_fee',
      width: 130,
      align: 'center',
      render: (fee) => (
        <span style={{ fontWeight: 600, color: '#10b981' }}>
          ₹{fee.toLocaleString()}
        </span>
      ),
      sorter: (a, b) => a.monthly_fee - b.monthly_fee,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 100,
      align: 'center',
      render: (status) => (
        <Tag color={getStatusColor(status)} style={{ fontWeight: 500 }}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Joined Date',
      dataIndex: 'joined_date',
      width: 130,
      align: 'center',
      render: (date) => date,
      sorter: (a, b) => new Date(a.joined_date) - new Date(b.joined_date),
    },
  ];

  const stats = [
    {
      title: 'Total Companies',
      value: totalCompanies,
      icon: <TeamOutlined />,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      //trend: 'up',
      //trendValue: '+12%',
      delay: 0,
    },
    {
      title: 'Total Employees',
      value: totalEmployees.toLocaleString(),
      icon: <UserOutlined />,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      //trend: 'up',
      //trendValue: '+18%',
      delay: 0.1,
    },
    {
      title: 'Active Subscriptions',
      value: activeSubscriptions,
      icon: <CheckCircleOutlined />,
      gradient: 'linear-gradient(135deg, #0ba360 0%, #3cba92 100%)',
      //trend: 'up',
      //trendValue: '+8%',
      delay: 0.2,
    },
    {
      title: 'Monthly Revenue',
      value: `₹ ${monthlyRevenue.toLocaleString()}`,
      icon: <DollarOutlined />,
      gradient: 'linear-gradient(135deg, #f83600 0%, #f9d423 100%)',
      //trend: 'up',
      //trendValue: '+23%',
      delay: 0.3,
    },
  ];

  return (
    <div>
      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <StatCard {...stat} />
          </Col>
        ))}
      </Row>

      {/* Charts Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        {/* Growth Chart */}
        <Col xs={24} lg={16}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <Card
              title={<span style={{ fontWeight: 600, fontFamily: 'Poppins, sans-serif' }}>Growth Overview</span>}
              style={{
                borderRadius: '16px',
                border: 'none',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              bodyStyle={{ padding: '24px' }}
            >
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="companies" stroke="#667eea" strokeWidth={3} name="Companies" />
                  <Line type="monotone" dataKey="employees" stroke="#764ba2" strokeWidth={3} name="Employees" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </Col>

        {/* Plan Distribution Chart */}
        <Col xs={24} lg={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <Card
              title={<span style={{ fontWeight: 600, fontFamily: 'Poppins, sans-serif' }}>Plan Distribution</span>}
              style={{
                borderRadius: '16px',
                border: 'none',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              bodyStyle={{ padding: '24px' }}
            >
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={planDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {planDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Companies Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        <Card
          title={
            <span style={{
              fontSize: '18px',
              fontWeight: 600,
              fontFamily: 'Poppins, sans-serif',
            }}>
              Companies Using Our HRMS
            </span>
          }
          style={{
            borderRadius: '16px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Table
            columns={columns}
            dataSource={backendCompanies}
            loading={loading}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} companies`,
            }}
            bordered
            scroll={{ x: 1000 }}
          />
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;
