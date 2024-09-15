import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import './QualificationPage.css';

const QualificationPage = () => {
  const [qualificationData, setQualificationData] = useState({
    qualificationType: '',
    companyEstablishmentDate: '',
    registeredCapital: '',
    totalEmployees: '',
    companyArea: '',
    documents: {
      businessLicense: null,
      safetyCertificate: null,
      hazardousCertificate: null,
      other: null,
    },
  });

  const onDrop = (acceptedFiles, fieldName) => {
    setQualificationData((prevData) => ({
      ...prevData,
      documents: { ...prevData.documents, [fieldName]: acceptedFiles[0] },
    }));
  };

  const { getRootProps: getBusinessLicenseProps, getInputProps: getBusinessLicenseInputProps } = useDropzone({
    onDrop: (acceptedFiles) => onDrop(acceptedFiles, 'businessLicense'),
    multiple: false,
  });

  const { getRootProps: getSafetyCertificateProps, getInputProps: getSafetyCertificateInputProps } = useDropzone({
    onDrop: (acceptedFiles) => onDrop(acceptedFiles, 'safetyCertificate'),
    multiple: false,
  });

  const { getRootProps: getHazardousCertificateProps, getInputProps: getHazardousCertificateInputProps } = useDropzone({
    onDrop: (acceptedFiles) => onDrop(acceptedFiles, 'hazardousCertificate'),
    multiple: false,
  });

  const { getRootProps: getOtherProps, getInputProps: getOtherInputProps } = useDropzone({
    onDrop: (acceptedFiles) => onDrop(acceptedFiles, 'other'),
    multiple: false,
  });

  const handleSave = () => {
    console.log('保存资格证照信息:', qualificationData);
    // Here, you would typically send this data to the backend API
  };

  return (
    <div className="qualification-container">
      <h2>资质证照</h2>
      <form className="qualification-form">
        {/* 基本信息 */}
        <div className="form-group">
          <label>经营资质类型*</label>
          <input
            type="text"
            value={qualificationData.qualificationType}
            onChange={(e) =>
              setQualificationData({ ...qualificationData, qualificationType: e.target.value })
            }
            required
          />
        </div>

        <div className="form-group">
          <label>公司成立时间*</label>
          <input
            type="date"
            value={qualificationData.companyEstablishmentDate}
            onChange={(e) =>
              setQualificationData({ ...qualificationData, companyEstablishmentDate: e.target.value })
            }
            required
          />
        </div>

        <div className="form-group">
          <label>注册资本*</label>
          <input
            type="number"
            value={qualificationData.registeredCapital}
            onChange={(e) =>
              setQualificationData({ ...qualificationData, registeredCapital: e.target.value })
            }
            required
          />
        </div>

        <div className="form-group">
          <label>员工总数*</label>
          <input
            type="number"
            value={qualificationData.totalEmployees}
            onChange={(e) =>
              setQualificationData({ ...qualificationData, totalEmployees: e.target.value })
            }
            required
          />
        </div>

        <div className="form-group">
          <label>公司占地面积*</label>
          <input
            type="number"
            value={qualificationData.companyArea}
            onChange={(e) =>
              setQualificationData({ ...qualificationData, companyArea: e.target.value })
            }
            required
          />
        </div>

        {/* 文件上传区 */}
        <div className="file-upload-section">
          <h4>经营许可证</h4>
          <div {...getBusinessLicenseProps({ className: 'dropzone' })}>
            <input {...getBusinessLicenseInputProps()} />
            <button type="button">上传文件</button>
          </div>
          {qualificationData.documents.businessLicense && (
            <div className="file-preview">
              <span>{qualificationData.documents.businessLicense.name}</span>
              <button type="button" onClick={() => onDrop([], 'businessLicense')}>删除</button>
            </div>
          )}
        </div>

        <div className="file-upload-section">
          <h4>安全生产许可证</h4>
          <div {...getSafetyCertificateProps({ className: 'dropzone' })}>
            <input {...getSafetyCertificateInputProps()} />
            <button type="button">上传文件</button>
          </div>
          {qualificationData.documents.safetyCertificate && (
            <div className="file-preview">
              <span>{qualificationData.documents.safetyCertificate.name}</span>
              <button type="button" onClick={() => onDrop([], 'safetyCertificate')}>删除</button>
            </div>
          )}
        </div>

        <div className="file-upload-section">
          <h4>危险品生产或经营许可证</h4>
          <div {...getHazardousCertificateProps({ className: 'dropzone' })}>
            <input {...getHazardousCertificateInputProps()} />
            <button type="button">上传文件</button>
          </div>
          {qualificationData.documents.hazardousCertificate && (
            <div className="file-preview">
              <span>{qualificationData.documents.hazardousCertificate.name}</span>
              <button type="button" onClick={() => onDrop([], 'hazardousCertificate')}>删除</button>
            </div>
          )}
        </div>

        <div className="file-upload-section">
          <h4>其他</h4>
          <div {...getOtherProps({ className: 'dropzone' })}>
            <input {...getOtherInputProps()} />
            <button type="button">上传文件</button>
          </div>
          {qualificationData.documents.other && (
            <div className="file-preview">
              <span>{qualificationData.documents.other.name}</span>
              <button type="button" onClick={() => onDrop([], 'other')}>删除</button>
            </div>
          )}
        </div>

        <button type="button" className="save-button" onClick={handleSave}>
          保存
        </button>
      </form>
    </div>
  );
};

export default QualificationPage;
