import React, { useEffect, useState } from 'react';
import { Modal, Tree, message, Spin, Alert } from 'antd';
import { plansAPI } from '../../services/plansService';


// Maps to store relationships for quick lookup
const buildMaps = (nodes, depth = 0, i2k = {}, k2i = {}) => {
  nodes.forEach(node => {
    // Depth 0 = Modules (from backend structure)
    // Depth > 0 = Pages
    if (depth > 0) {
      // It is a page (or sub-page)
      // Use the key as the identifier. 
      // Note: Ensure key exists.
      if (node.key) {
        i2k[node.id] = node.key;
        k2i[node.key] = node.id;
      }
    }

    if (node.children) {
      buildMaps(node.children, depth + 1, i2k, k2i);
    }
  });
  return { i2k, k2i };
};

// Custom field names if needed, but the backend sends keys compatible (key, title->label, children)
// Converting 'label' to 'title' for AntD Tree
const processTreeData = (nodes) => {
  return nodes.map(node => ({
    ...node,
    title: node.label, // AntD Tree expects 'title'
    key: node.key,     // Ensure we use the unique string key
    children: node.children ? processTreeData(node.children) : undefined,
    // Removed manual 'checkable' logic to allow full interaction
  }));
};

const PlanPermissionsModal = ({ open, onClose, plan, onSuccess }) => {
  const [treeData, setTreeData] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Maps in state are still useful for handleSave, 
  // but we can also regenerate them if needed, but state is better for performance.
  const [keyToIdMap, setKeyToIdMap] = useState({});

  useEffect(() => {
    if (open && plan) {
      fetchData();
    } else {
      setTreeData([]);
      setCheckedKeys([]);
      setKeyToIdMap({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, plan]);


  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch all pages tree structure
      const pagesRes = await plansAPI.getAllPages();
      const rawTree = pagesRes.data;
      setTreeData(rawTree);

      console.log("Raw Tree Data:", rawTree);

      // Build maps
      const { i2k, k2i } = buildMaps(rawTree);
      console.log("Key to ID Map:", k2i);

      setKeyToIdMap(k2i);

      // 2. Fetch currently assigned pages for this plan
      const assignedRes = await plansAPI.getPlanPages(plan.id);
      const assignedIds = assignedRes.data.assigned_page_ids; // Array of ints

      // Convert IDs to Keys
      const initialKeys = assignedIds
        .map(id => i2k[id])
        .filter(key => key !== undefined);

      setCheckedKeys(initialKeys);

    } catch (error) {
      console.error(error);
      message.error("Failed to load permissions data");
    } finally {
      setLoading(false);
    }
  };

  const onCheck = (checkedKeysValue) => {
    // If checkStrictly is false (default), checkedKeysValue is an array of strings (keys).
    // If checkStrictly is true, it's { checked: [], halfChecked: [] }
    console.log("onCheck:", checkedKeysValue);
    setCheckedKeys(checkedKeysValue);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      console.log("Saving Checked Keys:", checkedKeys);

      // Convert Keys -> IDs
      // Only include keys that map to a Page ID (ignore Module keys which are not in the map)
      const pageIdsToSend = checkedKeys
        .map(k => keyToIdMap[k])
        .filter(id => id !== undefined);

      console.log("Page IDs to send:", pageIdsToSend);

      await plansAPI.assignPages(plan.id, pageIdsToSend);

      message.success("Permissions updated successfully");
      if (onSuccess) onSuccess();
      onClose();

    } catch (error) {
      console.error(error);
      message.error("Failed to save permissions");
    } finally {
      setSaving(false);
    }
  };

  const formattedTree = processTreeData(treeData);

  return (
    <Modal
      title={
        <div style={{
          fontSize: '18px',
          fontWeight: 600,
          fontFamily: 'Poppins, sans-serif',
        }}>
          Manage Permissions: <span style={{ color: '#667eea' }}>{plan?.plan_name}</span>
        </div>
      }
      open={open}
      onCancel={onClose}
      onOk={handleSave}
      okText="Save Permissions"
      confirmLoading={saving}
      width={600}
      bodyStyle={{ maxHeight: '60vh', overflowY: 'auto' }}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Alert
            message="Select pages that subscribe to this plan."
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
          {formattedTree.length > 0 ? (
            <Tree
              checkable
              defaultExpandAll
              treeData={formattedTree}
              checkedKeys={checkedKeys}
              onCheck={onCheck}
            />
          ) : (
            <div style={{ textAlign: 'center', color: '#888' }}>
              No pages found.
            </div>
          )}
        </>
      )}
    </Modal>
  );
};

export default PlanPermissionsModal;
