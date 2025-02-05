import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MenuForm, MenuTable } from '../ui';

const MenuManager = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:5000/api/menu', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setMenuItems(response.data);
  };

  const handleSave = async (itemData) => {
    const token = localStorage.getItem('token');
    if (editingItem) {
      await axios.put(`http://localhost:5000/api/menu/${editingItem._id}`, itemData, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } else {
      await axios.post('http://localhost:5000/api/menu', itemData, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
    fetchMenuItems();
    setShowForm(false);
    setEditingItem(null);
  };

  return (
    <div className="menu-manager">
      <div className="header">
        <h2>Menu Management</h2>
        <button onClick={() => setShowForm(true)}>Add New Item</button>
      </div>
      
      {showForm && (
        <MenuForm 
          initialData={editingItem}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
        />
      )}

      <MenuTable 
        items={menuItems}
        onEdit={(item) => {
          setEditingItem(item);
          setShowForm(true);
        }}
        onDelete={async (id) => {
          const token = localStorage.getItem('token');
          await axios.delete(`http://localhost:5000/api/menu/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          fetchMenuItems();
        }}
      />
    </div>
  );
};

export default MenuManager;
