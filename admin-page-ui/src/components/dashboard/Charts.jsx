import React from 'react';
import { Card, Row, Col } from 'antd';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const Charts = () => {
  const lineData = [
    { name: 'Jan', users: 400, revenue: 2400 },
    { name: 'Feb', users: 300, revenue: 1398 },
    { name: 'Mar', users: 600, revenue: 9800 },
    { name: 'Apr', users: 800, revenue: 3908 },
    { name: 'May', users: 890, revenue: 4800 },
    { name: 'Jun', users: 1200, revenue: 3800 },
  ];

  const pieData = [
    { name: 'Active', value: 400 },
    { name: 'Pending', value: 300 },
    { name: 'Completed', value: 300 },
    { name: 'Cancelled', value: 200 },
  ];

  const COLORS = ['#667eea', '#764ba2', '#06b6d4', '#f59e0b'];

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} lg={12}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <Card
            title={<span style={{ fontWeight: 600 }}>User Growth</span>}
            style={{
              borderRadius: '16px',
              border: 'none',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#667eea" strokeWidth={3} />
                <Line type="monotone" dataKey="revenue" stroke="#764ba2" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </Col>

      <Col xs={24} lg={12}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <Card
            title={<span style={{ fontWeight: 600 }}>Status Distribution</span>}
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
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </Col>
    </Row>
  );
};

export default Charts;
