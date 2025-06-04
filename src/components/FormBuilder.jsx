import React, { useState } from 'react';
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Filter,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  X,
  Check,
  AlertTriangle,
  ExternalLink,
  ArrowLeft,
  ChevronRight,
  GripVertical
} from 'lucide-react';

// Sample data for forms
const sampleForms = [
  {
    id: 1,
    name: "Patient and Insurance Information",
    description: "Comprehensive patient intake form with insurance details",
    type: "Intake Form",
    clinicAccess: ["All Clinics"],
    status: "Active",
    lastUpdated: "2025-05-28"
  },
  {
    id: 2,
    name: "HIPAA Consent Form",
    description: "Health Insurance Portability and Accountability Act consent",
    type: "Administrative/Legal",
    clinicAccess: ["Penfield", "Albany"],
    status: "Active",
    lastUpdated: "2025-05-25"
  },
  {
    id: 3,
    name: "PHQ-9 Depression Screening",
    description: "Patient Health Questionnaire for depression assessment",
    type: "Clinical & Treatment Forms",
    clinicAccess: ["All Clinics"],
    status: "Inactive",
    lastUpdated: "2025-05-20"
  },
  {
    id: 4,
    name: "Patient Satisfaction Survey",
    description: "Post-treatment feedback and satisfaction assessment",
    type: "Follow Up",
    clinicAccess: ["Finger Lakes", "New York"],
    status: "Active",
    lastUpdated: "2025-05-15"
  }
];

// Sample data for form sets
const sampleFormSets = [
  {
    id: 1,
    name: "Intake Form Set",
    description: "Complete patient onboarding forms collection",
    formsCount: 5,
    clinicAccess: ["All Clinics"],
    type: "Standard",
    lastUpdated: "2025-05-28"
  },
  {
    id: 2,
    name: "Assessment Forms",
    description: "Clinical assessment and screening forms",
    formsCount: 3,
    clinicAccess: ["Penfield", "Albany"],
    type: "Non-Standard",
    lastUpdated: "2025-05-25"
  }
];

const FormBuilder = ({ onBreadcrumbChange }) => {
  const [activeTab, setActiveTab] = useState('forms');
  const [currentView, setCurrentView] = useState('list'); // 'list', 'create', 'edit', 'preview'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFormType, setSelectedFormType] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewTarget, setPreviewTarget] = useState(null);
  const [confirmText, setConfirmText] = useState('');
  const [showActiveWarningModal, setShowActiveWarningModal] = useState(false);
  
  // Form creation states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    clinicAccess: [],
    status: 'Active'
  });
  
  // Form set creation states
  const [formSetData, setFormSetData] = useState({
    name: '',
    description: '',
    clinicAccess: [],
    type: 'Standard',
    selectedForms: []
  });
  const [draggedForm, setDraggedForm] = useState(null);

  const formTypes = [
    "Intake Form",
    "Administrative/Legal", 
    "Clinical & Treatment Forms",
    "Follow Up"
  ];

  const clinicOptions = [
    "All Clinics",
    "Penfield", 
    "Finger Lakes",
    "Albany",
    "New York"
  ];

  // Update breadcrumb when view changes
  React.useEffect(() => {
    if (onBreadcrumbChange) {
      let breadcrumb = 'Form Builder';
      if (currentView === 'create') {
        breadcrumb += activeTab === 'forms' ? ' / Create Form' : ' / Create Form Set';
      } else if (currentView === 'edit') {
        breadcrumb += activeTab === 'forms' ? ' / Edit Form' : ' / Edit Form Set';
      } else if (showPreview) {
        breadcrumb += ' / Preview';
      }
      onBreadcrumbChange(breadcrumb);
    }
  }, [currentView, activeTab, showPreview, onBreadcrumbChange]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleDelete = (item, type) => {
    setDeleteTarget({ item, type });
    setShowDeleteModal(true);
  };

  const handlePreview = (item, type) => {
    setPreviewTarget({ item, type });
    setShowPreview(true);
  };

  const handleCreateForm = () => {
    setCurrentView('create');
    setFormData({
      name: '',
      description: '',
      type: '',
      clinicAccess: [],
      status: 'Active'
    });
  };

  const handleCreateFormSet = () => {
    setCurrentView('create');
    setFormSetData({
      name: '',
      description: '',
      clinicAccess: [],
      type: 'Standard',
      selectedForms: []
    });
  };

  const handleSaveForm = () => {
    // Handle form save logic
    console.log('Saving form:', formData);
    setCurrentView('list');
  };

  const handleSaveFormSet = () => {
    // Handle form set save logic
    console.log('Saving form set:', formSetData);
    setCurrentView('list');
  };

  const handleCancel = () => {
    setCurrentView('list');
    setFormData({
      name: '',
      description: '',
      type: '',
      clinicAccess: [],
      status: 'Active'
    });
    setFormSetData({
      name: '',
      description: '',
      clinicAccess: [],
      type: 'Standard',
      selectedForms: []
    });
  };

  const handleDragStart = (form) => {
    setDraggedForm(form);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (draggedForm && !formSetData.selectedForms.find(f => f.id === draggedForm.id)) {
      setFormSetData(prev => ({
        ...prev,
        selectedForms: [...prev.selectedForms, draggedForm]
      }));
    }
    setDraggedForm(null);
  };

  const removeFormFromSet = (formId) => {
    setFormSetData(prev => ({
      ...prev,
      selectedForms: prev.selectedForms.filter(f => f.id !== formId)
    }));
  };

  const confirmDelete = () => {
    if (deleteTarget?.type === 'form' && deleteTarget?.item.status === 'Active') {
      alert("Active Forms can't be deleted - Make the form inactive before deleting");
      setShowDeleteModal(false);
      return;
    }
    
    if (deleteTarget?.type === 'formset' && deleteTarget?.item.type === 'Standard') {
      if (confirmText !== deleteTarget?.item.name) {
        alert("Please enter the form name exactly as it appears");
        return;
      }
    }
    
    // Handle actual deletion logic here
    console.log('Deleting:', deleteTarget);
    setShowDeleteModal(false);
    setDeleteTarget(null);
    setConfirmText('');
  };

  const filteredForms = sampleForms.filter(form => {
    const matchesSearch = form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         form.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedFormType || form.type === selectedFormType;
    return matchesSearch && matchesType;
  });

  const SortableHeader = ({ children, sortKey }) => (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600"
      onClick={() => handleSort(sortKey)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        <ArrowUpDown className="w-4 h-4" />
      </div>
    </th>
  );

  const StatusBadge = ({ status }) => (
    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
      status === 'Active' 
        ? 'bg-green-100 text-green-800' 
        : 'bg-red-100 text-red-800'
    }`}>
      {status}
    </span>
  );

  const TypeBadge = ({ type, isFormSet = false }) => (
    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
      isFormSet 
        ? (type === 'Standard' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800')
        : 'bg-gray-100 text-gray-800'
    }`}>
      {type}
    </span>
  );

  if (showPreview) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowPreview(false)}
                className="flex items-center text-gray-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to {previewTarget?.type === 'form' ? 'Forms' : 'Form Sets'}
              </button>
              <h1 className="text-2xl font-semibold text-white">
                Preview: {previewTarget?.item.name}
              </h1>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
              <Edit className="w-4 h-4 mr-2" />
              Edit {previewTarget?.type === 'form' ? 'Form' : 'Form Set'}
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {previewTarget?.type === 'formset' && (
            <div className="mb-6">
              <div className="bg-blue-900 border border-blue-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-blue-200">Progress</span>
                  <span className="text-sm text-blue-300">1 of {previewTarget?.item.formsCount}</span>
                </div>
                <div className="w-full bg-blue-800 rounded-full h-2">
                  <div className="bg-blue-400 h-2 rounded-full" style={{width: `${(1 / previewTarget?.item.formsCount) * 100}%`}}></div>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
            <h2 className="text-xl font-semibold mb-4 text-white">{previewTarget?.item.name}</h2>
            <p className="text-gray-300 mb-6">{previewTarget?.item.description}</p>
            
            <div className="space-y-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-400 text-center">
                  [Form Preview Content Would Appear Here]
                </p>
                <p className="text-sm text-gray-500 text-center mt-2">
                  This is a placeholder for the actual form fields and layout
                </p>
              </div>
            </div>
            
            {previewTarget?.type === 'formset' && (
              <div className="flex justify-end mt-6">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center">
                  Next Form
                  <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Form Creation Screen
  if (currentView === 'create' && activeTab === 'forms') {
    return (
      <div className="p-6 bg-gray-900 min-h-screen text-white">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-white">Create New Form</h1>
        </div>

        <div className="bg-gray-800 rounded-lg shadow border border-gray-700 p-6">
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Form Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full border border-gray-600 rounded-lg px-3 py-2 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter form name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Form Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full border border-gray-600 rounded-lg px-3 py-2 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter form description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Form Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                className="w-full border border-gray-600 rounded-lg px-3 py-2 bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select form type</option>
                {formTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Clinic Access *
              </label>
              <div className="space-y-2">
                {clinicOptions.map(clinic => (
                  <label key={clinic} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.clinicAccess.includes(clinic)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({ ...prev, clinicAccess: [...prev.clinicAccess, clinic] }));
                        } else {
                          setFormData(prev => ({ ...prev, clinicAccess: prev.clinicAccess.filter(c => c !== clinic) }));
                        }
                      }}
                      className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-300">{clinic}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="Active"
                    checked={formData.status === 'Active'}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-300">Active</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="Inactive"
                    checked={formData.status === 'Inactive'}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-300">Inactive</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-8">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 border border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveForm}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Create Form
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Form Set Creation Screen
  if (currentView === 'create' && activeTab === 'formsets') {
    return (
      <div className="p-6 bg-gray-900 min-h-screen text-white">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-white">Create New Form Set</h1>
        </div>

        <div className="bg-gray-800 rounded-lg shadow border border-gray-700 p-6">
          <div className="space-y-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Form Set Name *
              </label>
              <input
                type="text"
                value={formSetData.name}
                onChange={(e) => setFormSetData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full border border-gray-600 rounded-lg px-3 py-2 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter form set name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Form Set Description *
              </label>
              <textarea
                value={formSetData.description}
                onChange={(e) => setFormSetData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full border border-gray-600 rounded-lg px-3 py-2 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter form set description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Clinic Access *
              </label>
              <div className="space-y-2">
                {clinicOptions.map(clinic => (
                  <label key={clinic} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formSetData.clinicAccess.includes(clinic)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormSetData(prev => ({ ...prev, clinicAccess: [...prev.clinicAccess, clinic] }));
                        } else {
                          setFormSetData(prev => ({ ...prev, clinicAccess: prev.clinicAccess.filter(c => c !== clinic) }));
                        }
                      }}
                      className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-300">{clinic}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Form Set Type
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="Standard"
                    checked={formSetData.type === 'Standard'}
                    onChange={(e) => setFormSetData(prev => ({ ...prev, type: e.target.value }))}
                    className="border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-300">Standard</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="Non-Standard"
                    checked={formSetData.type === 'Non-Standard'}
                    onChange={(e) => setFormSetData(prev => ({ ...prev, type: e.target.value }))}
                    className="border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-300">Non-Standard</span>
                </label>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-lg font-medium text-white mb-4">Select and Order Forms</h3>
            <div className="grid grid-cols-2 gap-6">
              {/* Available Forms */}
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-3">Available Forms</h4>
                <div className="border border-gray-600 rounded-lg p-4 h-64 overflow-y-auto bg-gray-700">
                  {sampleForms.filter(form => !formSetData.selectedForms.find(sf => sf.id === form.id)).map(form => (
                    <div
                      key={form.id}
                      draggable
                      onDragStart={() => handleDragStart(form)}
                      className="p-3 mb-2 bg-gray-600 rounded-lg cursor-move hover:bg-gray-500 border border-gray-500"
                    >
                      <div className="flex items-center">
                        <GripVertical className="w-4 h-4 text-gray-400 mr-2" />
                        <div>
                          <div className="font-medium text-sm text-white">{form.name}</div>
                          <div className="text-xs text-gray-400">{form.type}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected Forms */}
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-3">Selected Forms (Drag to reorder)</h4>
                <div
                  className="border border-gray-600 rounded-lg p-4 h-64 overflow-y-auto bg-gray-700"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  {formSetData.selectedForms.length === 0 ? (
                    <div className="text-gray-400 text-center py-8">
                      Drag forms from the left to add them to this set
                    </div>
                  ) : (
                    formSetData.selectedForms.map((form, index) => (
                      <div
                        key={form.id}
                        className="p-3 mb-2 bg-blue-900 border border-blue-700 rounded-lg flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <GripVertical className="w-4 h-4 text-gray-400 mr-2" />
                          <div>
                            <div className="font-medium text-sm text-white">{form.name}</div>
                            <div className="text-xs text-gray-400">Position: {index + 1}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFormFromSet(form.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-8">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 border border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveFormSet}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Create Form Set
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-white">Form Builder</h1>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('forms')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'forms'
                ? 'border-blue-400 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
            }`}
          >
            Forms
          </button>
          <button
            onClick={() => setActiveTab('formsets')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'formsets'
                ? 'border-blue-400 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
            }`}
          >
            Form Sets
          </button>
        </nav>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={`Search ${activeTab === 'forms' ? 'forms' : 'form sets'}...`}
              className="pl-10 pr-4 py-2 border border-gray-600 rounded-lg w-64 bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter by Form Type (only for Forms tab) */}
          {activeTab === 'forms' && (
            <div className="relative">
              <select
                value={selectedFormType}
                onChange={(e) => setSelectedFormType(e.target.value)}
                className="appearance-none bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 pr-8 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Form Types</option>
                {formTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          )}
        </div>

        {/* Create Button */}
         <button 
          onClick={activeTab === 'forms' ? handleCreateForm : handleCreateFormSet}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create {activeTab === 'forms' ? 'Form' : 'Form Set'}
        </button>
      </div>

      {/* Forms Table */}
      {activeTab === 'forms' && (
        <div className="bg-gray-800 shadow rounded-lg overflow-hidden border border-gray-700">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <SortableHeader sortKey="name">Form Name</SortableHeader>
                <SortableHeader sortKey="description">Description</SortableHeader>
                <SortableHeader sortKey="type">Form Type</SortableHeader>
                <SortableHeader sortKey="clinicAccess">Clinic Access</SortableHeader>
                <SortableHeader sortKey="status">Status</SortableHeader>
                <SortableHeader sortKey="lastUpdated">Last Updated</SortableHeader>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {filteredForms.map((form) => (
                <tr key={form.id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{form.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-300 max-w-xs truncate">{form.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <TypeBadge type={form.type} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">{form.clinicAccess.join(', ')}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={form.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {form.lastUpdated}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePreview(form, 'form')}
                        className="text-blue-400 hover:text-blue-300"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="text-green-400 hover:text-green-300"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(form, 'form')}
                        className="text-red-400 hover:text-red-300"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Form Sets Table */}
      {activeTab === 'formsets' && (
        <div className="bg-gray-800 shadow rounded-lg overflow-hidden border border-gray-700">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <SortableHeader sortKey="name">Form Set Name</SortableHeader>
                <SortableHeader sortKey="description">Description</SortableHeader>
                <SortableHeader sortKey="formsCount">Forms Count</SortableHeader>
                <SortableHeader sortKey="clinicAccess">Clinic Access</SortableHeader>
                <SortableHeader sortKey="type">Type</SortableHeader>
                <SortableHeader sortKey="lastUpdated">Last Updated</SortableHeader>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {sampleFormSets.map((formSet) => (
                <tr key={formSet.id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{formSet.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-300 max-w-xs truncate">{formSet.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">{formSet.formsCount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">{formSet.clinicAccess.join(', ')}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <TypeBadge type={formSet.type} isFormSet={true} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {formSet.lastUpdated}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePreview(formSet, 'formset')}
                        className="text-blue-400 hover:text-blue-300"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="text-green-400 hover:text-green-300"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(formSet, 'formset')}
                        className="text-red-400 hover:text-red-300"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-400 mr-3" />
              <h3 className="text-lg font-medium text-white">
                {deleteTarget?.type === 'form' && deleteTarget?.item.status === 'Active' 
                  ? "Cannot Delete Active Form"
                  : "Confirm Deletion"
                }
              </h3>
            </div>
            
            <div className="mb-4">
              {deleteTarget?.type === 'form' && deleteTarget?.item.status === 'Active' ? (
                <p className="text-sm text-gray-300">
                  Active Forms can't be deleted - Make the form inactive before deleting
                </p>
              ) : deleteTarget?.type === 'formset' && deleteTarget?.item.type === 'Standard' ? (
                <div>
                  <p className="text-sm text-gray-300 mb-3">
                    Are you sure you want to delete this form set? Doing so will remove the form set from the available list for all patients.
                  </p>
                  <p className="text-sm font-medium text-white mb-2">
                    Please enter the form name exactly as it appears to confirm deletion:
                  </p>
                  <input
                    type="text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    className="w-full border border-gray-600 rounded-lg px-3 py-2 text-sm bg-gray-700 text-white placeholder-gray-400"
                    placeholder={deleteTarget?.item.name}
                  />
                </div>
              ) : (
                <p className="text-sm text-gray-300">
                  Are you sure you want to delete this {deleteTarget?.type === 'form' ? 'form' : 'form set'}? 
                  THIS ACTION CANNOT BE UNDONE.
                </p>
              )}
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setConfirmText('');
                }}
                className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 border border-gray-600"
              >
                Cancel
              </button>
              {!(deleteTarget?.type === 'form' && deleteTarget?.item.status === 'Active') && (
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                >
                  {deleteTarget?.type === 'formset' && deleteTarget?.item.type === 'Standard' ? 'Confirm' : 'Delete'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormBuilder;