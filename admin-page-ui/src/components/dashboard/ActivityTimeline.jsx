import React from 'react';
import { Card, Timeline } from 'antd';
import {
  UserAddOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';

const ActivityTimeline = () => {
  const activities = [
    {
      icon: <UserAddOutlined />,
      color: '#10b981',
      title: 'New user registered',
      description: 'John Doe joined the platform',
      time: '5 minutes ago',
    },
    {
      icon: <FileTextOutlined />,
      color: '#3b82f6',
      title: 'Document uploaded',
      description: 'Annual report 2024.pdf',
      time: '1 hour ago',
    },
    {
      icon: <CheckCircleOutlined />,
      color: '#8b5cf6',
      title: 'Task completed',
      description: 'Q4 Review finished',
      time: '3 hours ago',
    },
    {
      icon: <ClockCircleOutlined />,
      color: '#f59e0b',
      title: 'Meeting scheduled',
      description: 'Team sync at 3:00 PM',
      time: '5 hours ago',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
    >
      <Card
        title={<span style={{ fontWeight: 600 }}>Recent Activity</span>}
        style={{
          borderRadius: '16px',
          border: 'none',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        }}
        bodyStyle={{ padding: '24px' }}
      >
        <Timeline>
          {activities.map((activity, index) => (
            <Timeline.Item
              key={index}
              dot={
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: activity.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '14px',
                }}>
                  {activity.icon}
                </div>
              }
            >
              <div style={{ marginLeft: '8px' }}>
                <div style={{
                  fontWeight: 600,
                  fontSize: '14px',
                  marginBottom: '4px',
                }}>
                  {activity.title}
                </div>
                <div style={{
                  fontSize: '13px',
                  color: '#64748b',
                  marginBottom: '4px',
                }}>
                  {activity.description}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#9ca3af',
                }}>
                  {activity.time}
                </div>
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      </Card>
    </motion.div>
  );
};

export default ActivityTimeline;
