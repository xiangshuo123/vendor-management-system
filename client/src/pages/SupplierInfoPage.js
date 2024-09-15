import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import './SupplierInfoPage.css';

// 国家、省、市、区数据（可以用其他资源）
const countries = [{ label: '中国', value: 'China' }];
const states = [{ label: '广东', value: 'Guangdong' }];
const cities = [{ label: '广州', value: 'Guangzhou' }];
const districts = [{ label: '天河区', value: 'Tianhe' }];

const SupplierInfoPage = () => {
  const [supplierInfo, setSupplierInfo] = useState({
    company_name: '',
    business_nature: '',
    contact_names: [],
    selected_contact: '',
    contact_phone: '',
    mobile_phone: '',
    country: '',
    state: '',
    city: '',
    district: '',
    landline: '',
    fax: '',
    email: '',
    bank_account_name: '',
    bank_name: '',
    bank_account_number: '',
    production_capacity: '',
    advantage: '',
  });
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    // 获取供应商信息
    const fetchSupplierInfo = async () => {
      try {
        const response = await axios.get('/api/supplier/info'); // 后端API
        setSupplierInfo(response.data);
        setLastUpdated(response.data.created_at);
      } catch (error) {
        console.error('Failed to fetch supplier info:', error);
      }
    };

    fetchSupplierInfo();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSupplierInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const handleSelectChange = (selectedOption, { name }) => {
    setSupplierInfo((prevInfo) => ({ ...prevInfo, [name]: selectedOption.value }));
  };

  const handleAddContact = () => {
    if (supplierInfo.contact_names.includes(supplierInfo.selected_contact)) return;
    setSupplierInfo((prevInfo) => ({
      ...prevInfo,
      contact_names: [...prevInfo.contact_names, prevInfo.selected_contact],
      selected_contact: '',
    }));
  };

  const handleSave = async () => {
    try {
      await axios.post('/api/supplier/save', supplierInfo);
      alert('供应商信息保存成功！');
    } catch (error) {
      console.error('Failed to save supplier info:', error);
    }
  };

  return (
    <div className="supplier-info-container">
      <h2>供应商信息</h2>

      {/* 基本信息 */}
      <section className="section">
        <h3>基本信息</h3>
        <div className="form-group">
          <label>*公司名称</label>
          <input
            type="text"
            name="company_name"
            value={supplierInfo.company_name}
            onChange={handleInputChange}
            required
          />
        </div>
        {/* 其余的表单字段 */}
        <div className="form-group">
          <label>*经营性质</label>
          <input
            type="text"
            name="business_nature"
            value={supplierInfo.business_nature}
            onChange={handleInputChange}
            required
          />
        </div>
        {/* 动态联系人姓名添加 */}
        <div className="form-group">
          <label>*联系人姓名</label>
          <input
            type="text"
            name="selected_contact"
            value={supplierInfo.selected_contact}
            onChange={handleInputChange}
          />
          <button type="button" onClick={handleAddContact}>
            +
          </button>
          {supplierInfo.contact_names.map((name, index) => (
            <div key={index}>
              <input type="radio" name="default_contact" /> {name}
            </div>
          ))}
        </div>
        {/* 国家、省、市、区的选择 */}
        <Select
          options={countries}
          name="country"
          value={countries.find((c) => c.value === supplierInfo.country)}
          onChange={handleSelectChange}
          placeholder="选择国家"
        />
        <Select
          options={states}
          name="state"
          value={states.find((s) => s.value === supplierInfo.state)}
          onChange={handleSelectChange}
          placeholder="选择省"
        />
        <Select
          options={cities}
          name="city"
          value={cities.find((c) => c.value === supplierInfo.city)}
          onChange={handleSelectChange}
          placeholder="选择市"
        />
        <Select
          options={districts}
          name="district"
          value={districts.find((d) => d.value === supplierInfo.district)}
          onChange={handleSelectChange}
          placeholder="选择区"
        />
      </section>

      {/* 银行信息和生产信息 */}
      <section className="section">
        <h3>银行信息</h3>
        {/* 银行信息表单项 */}
      </section>
      <section className="section">
        <h3>生产信息</h3>
        {/* 生产信息表单项 */}
      </section>

      <button className="save-button" onClick={handleSave}>
        保存
      </button>

      <div className="last-updated">最后更新时间：{lastUpdated}</div>
    </div>
  );
};

export default SupplierInfoPage;
