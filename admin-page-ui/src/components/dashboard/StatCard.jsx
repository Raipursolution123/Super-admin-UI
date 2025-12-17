import React from 'react';
import { Card } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon, gradient, trend, trendValue, delay = 0 }) => {
  const isPositive = trend === 'up';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="hover-lift"
    >
      <Card
        style={{
          borderRadius: '16px',
          border: 'none',
          background: gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          overflow: 'hidden',
          position: 'relative',
        }}
        bodyStyle={{ padding: '24px' }}
      >
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '16px',
          }}>
            <div>
              <div style={{
                fontSize: '14px',
                opacity: 0.9,
                marginBottom: '8px',
                fontWeight: 500,
              }}>
                {title}
              </div>
              <div style={{
                fontSize: '32px',
                fontWeight: 700,
                fontFamily: 'Poppins, sans-serif',
              }}>
                {value}
              </div>
            </div>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
            }}>
              {icon}
            </div>
          </div>

          {trendValue && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '13px',
              opacity: 0.9,
            }}>
              {isPositive ? (
                <ArrowUpOutlined style={{ marginRight: '4px' }} />
              ) : (
                <ArrowDownOutlined style={{ marginRight: '4px' }} />
              )}
              <span style={{ fontWeight: 600 }}>{trendValue}</span>
              <span style={{ marginLeft: '4px', opacity: 0.8 }}>vs last month</span>
            </div>
          )}
        </div>

        {/* Decorative circles */}
        <div style={{
          position: 'absolute',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          top: '-50px',
          right: '-50px',
        }} />
        <div style={{
          position: 'absolute',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.05)',
          bottom: '-30px',
          left: '-30px',
        }} />
      </Card>
    </motion.div>
  );
};

export default StatCard;
