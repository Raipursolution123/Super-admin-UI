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

// Mock data for companies using your HRMS (Kept for Table as no API provided yet)
const mockCompanies = [
  {
    id: 1,
    company_name: 'Tech Innovators Inc.',
    employee_count: 245,
    subscription_plan: 'Enterprise',
    status: 'Active',
    joined_date: '2024-01-15',
    monthly_fee: 2499,
    contact_email: 'admin@techinnovators.com',
  },
  {
    id: 2,
    company_name: 'Digital Solutions Ltd.',
    employee_count: 89,
    subscription_plan: 'Premium',
    status: 'Active',
    joined_date: '2024-03-22',
    monthly_fee: 999,
    contact_email: 'hr@digitalsolutions.com',
  },
  {
    id: 3,
    company_name: 'StartUp Ventures',
    employee_count: 25,
    subscription_plan: 'Basic',
    status: 'Active',
    joined_date: '2024-06-10',
    monthly_fee: 299,
    contact_email: 'team@startupventures.com',
  },
  {
    id: 4,
    company_name: 'Global Enterprises',
    employee_count: 520,
    subscription_plan: 'Enterprise',
    status: 'Active',
    joined_date: '2023-11-05',
    monthly_fee: 2499,
    contact_email: 'contact@globalenterprises.com',
  },
  {
    id: 5,
    company_name: 'Creative Studios',
    employee_count: 42,
    subscription_plan: 'Premium',
    status: 'Active',
    joined_date: '2024-08-18',
    monthly_fee: 999,
    contact_email: 'info@creativestudios.com',
  },
  {
    id: 6,
    company_name: 'Retail Chain Co.',
    employee_count: 156,
    subscription_plan: 'Premium',
    status: 'Active',
    joined_date: '2024-02-28',
    monthly_fee: 999,
    contact_email: 'hr@retailchain.com',
  },
  {
    id: 7,
    company_name: 'Finance Corp',
    employee_count: 78,
    subscription_plan: 'Basic',
    status: 'Active',
    joined_date: '2024-09-12',
    monthly_fee: 299,
    contact_email: 'admin@financecorp.com',
  },
  {
    id: 8,
    company_name: 'Marketing Agency',
    employee_count: 18,
    subscription_plan: 'Free',
    status: 'Trial',
    joined_date: '2024-11-20',
    monthly_fee: 0,
    contact_email: 'hello@marketingagency.com',
  },
];

const Dashboard = () => {
  const { loading, stats: apiStats, growthData, planDistribution } = useDashboard();

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
    return status === 'Active' ? 'success' : 'warning';
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
          <div style={{ fontSize: '12px', color: '#64748b' }}>{record.contact_email}</div>
        </div>
      ),
    },
    {
      title: 'Employees',
      dataIndex: 'employee_count',
      width: 120,
      align: 'center',
      render: (count) => (
        <div style={{ fontWeight: 600, fontSize: '16px', color: '#667eea' }}>
          {count}
        </div>
      ),
      sorter: (a, b) => a.employee_count - b.employee_count,
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
      render: (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      sorter: (a, b) => new Date(a.joined_date) - new Date(b.joined_date),
    },
  ];

  const stats = [
    {
      title: 'Total Companies',
      value: totalCompanies,
      icon: <TeamOutlined />,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      trend: 'up',
      trendValue: '+12%',
      delay: 0,
    },
    {
      title: 'Total Employees',
      value: totalEmployees.toLocaleString(),
      icon: <UserOutlined />,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      trend: 'up',
      trendValue: '+18%',
      delay: 0.1,
    },
    {
      title: 'Active Subscriptions',
      value: activeSubscriptions,
      icon: <CheckCircleOutlined />,
      gradient: 'linear-gradient(135deg, #0ba360 0%, #3cba92 100%)',
      trend: 'up',
      trendValue: '+8%',
      delay: 0.2,
    },
    {
      title: 'Monthly Revenue',
      value: `₹${monthlyRevenue.toLocaleString()}`,
      icon: <DollarOutlined />,
      gradient: 'linear-gradient(135deg, #f83600 0%, #f9d423 100%)',
      trend: 'up',
      trendValue: '+23%',
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
            dataSource={mockCompanies}
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
