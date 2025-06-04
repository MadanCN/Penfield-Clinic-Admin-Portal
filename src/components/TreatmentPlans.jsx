import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  Filter,
  ChevronDown,
  ChevronUp,
  GripVertical,
  X,
  ArrowLeft,
  Users,
  Clock,
  Building2,
  FileText,
  Calendar,
  Settings
} from 'lucide-react';

const TreatmentPlans = ({ onBreadcrumbChange }) => {
  // Sample clinic data
  const clinics = ['All Clinics', 'Penfield', 'Finger Lakes', 'Albany', 'Rochester', 'Syracuse'];
  
  // Sample staff data organized by role
  const staffByRole = {
    'Intake Team': ['Smith', 'Johnson', 'Williams'],
    'Provider POC': ['Nurse Adams', 'Nurse Brown', 'Nurse Davis'],
    'Provider': ['Therapist Clark', 'Therapist Miller', 'Therapist Wilson'],
    'Scheduling Team': ['Taylor', 'Anderson', 'Thomas'],
    'RCM': ['Coord. Martin', 'Coord. Garcia', 'Coord. Rodriguez']
  };

  const allStaff = Object.values(staffByRole).flat();

  // Sample treatment plans data
  const [treatmentPlans, setTreatmentPlans] = useState([
    {
      id: 1,
      name: 'Post-Surgery Recovery Protocol',
      description: 'Comprehensive recovery plan for post-surgical patients including medication management and physical therapy',
      clinicAccess: ['Penfield', 'Albany'],
      stagesCount: 4,
      lastUpdated: '2024-05-28',
      status: 'Active',
      stages: [
        {
          id: 1,
          stageName: 'Initial Assessment',
          assignedRole: 'Provider',
          assignedAgents: ['Dr. Smith'],
          escalationTime: '24 hours',
          escalationTarget: 'Dr. Johnson'
        },
        {
          id: 2,
          stageName: 'Medication Review',
          assignedRole: 'Provider POC',
          assignedAgents: ['Nurse Adams'],
          escalationTime: '+2 days from previous step',
          escalationTarget: 'Nurse Brown'
        }
      ]
    },
    {
      id: 2,
      name: 'Diabetes Management Plan',
      description: 'Long-term care coordination for diabetic patients',
      clinicAccess: ['Finger Lakes', 'Rochester'],
      stagesCount: 6,
      lastUpdated: '2024-05-25',
      status: 'Active',
      stages: []
    },
    {
      id: 3,
      name: 'Mental Health Support Protocol',
      description: 'Structured approach for mental health patient care',
      clinicAccess: ['Syracuse'],
      stagesCount: 3,
      lastUpdated: '2024-05-20',
      status: 'Inactive',
      stages: []
    }
  ]);

  const [currentView, setCurrentView] = useState('list'); // 'list', 'create', 'edit', 'preview'
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClinicFilter, setSelectedClinicFilter] = useState('All Clinics');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showActiveWarningModal, setShowActiveWarningModal] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);

  // Form state for create/edit
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    clinicAccess: [],
    status: 'Active',
    stages: []
  });

  const [draggedStage, setDraggedStage] = useState(null);

  useEffect(() => {
    switch (currentView) {
      case 'list':
        onBreadcrumbChange(['Treatment Plans']);
        break;
      case 'create':
        onBreadcrumbChange(['Treatment Plans', 'Create Treatment Plan']);
        break;
      case 'edit':
        onBreadcrumbChange(['Treatment Plans', 'Edit Treatment Plan']);
        break;
      case 'preview':
        onBreadcrumbChange(['Treatment Plans', 'Preview Treatment Plan']);
        break;
      default:
        onBreadcrumbChange(['Treatment Plans']);
    }
  }, [currentView, onBreadcrumbChange]);

  // Filtering and sorting logic
  const filteredPlans = treatmentPlans.filter(plan => {
    const matchesSearch = plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClinic = selectedClinicFilter === 'All Clinics' || 
                         plan.clinicAccess.includes(selectedClinicFilter);
    return matchesSearch && matchesClinic;
  });

  const sortedPlans = [...filteredPlans].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];
    
    if (sortConfig.key === 'clinicAccess') {
      aValue = aValue.join(', ');
      bValue = bValue.join(', ');
    }
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const handlePreview = (plan) => {
    setSelectedPlan(plan);
    setCurrentView('preview');
  };

  const handleEdit = (plan) => {
    setSelectedPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description,
      clinicAccess: plan.clinicAccess,
      status: plan.status,
      stages: plan.stages || []
    });
    setCurrentView('edit');
  };

  const handleDelete = (plan) => {
  if (plan.status === 'Active') {
    setPlanToDelete(plan);
    setShowActiveWarningModal(true);
    return;
  }
  setPlanToDelete(plan);
  setShowDeleteModal(true);
};
  const confirmDelete = () => {
    setTreatmentPlans(prev => prev.filter(plan => plan.id !== planToDelete.id));
    setShowDeleteModal(false);
    setPlanToDelete(null);
  };

  const handleCreateNew = () => {
    setFormData({
      name: '',
      description: '',
      clinicAccess: [],
      status: 'Active',
      stages: []
    });
    setSelectedPlan(null);
    setCurrentView('create');
  };

  const handleSavePlan = () => {
    if (selectedPlan) {
      // Edit existing plan
      setTreatmentPlans(prev => prev.map(plan => 
        plan.id === selectedPlan.id 
          ? { ...plan, ...formData, lastUpdated: new Date().toISOString().split('T')[0], stagesCount: formData.stages.length }
          : plan
      ));
    } else {
      // Create new plan
      const newPlan = {
        id: Math.max(...treatmentPlans.map(p => p.id)) + 1,
        ...formData,
        lastUpdated: new Date().toISOString().split('T')[0],
        stagesCount: formData.stages.length
      };
      setTreatmentPlans(prev => [...prev, newPlan]);
    }
    setCurrentView('list');
  };

  const handleAddStage = () => {
    const newStage = {
      id: Math.max(0, ...formData.stages.map(s => s.id)) + 1,
      stageName: '',
      assignedRole: '',
      assignedAgents: [],
      escalationTime: '',
      escalationTarget: ''
    };
    setFormData(prev => ({
      ...prev,
      stages: [...prev.stages, newStage]
    }));
  };

  const handleStageChange = (stageId, field, value) => {
    setFormData(prev => ({
      ...prev,
      stages: prev.stages.map(stage =>
        stage.id === stageId ? { ...stage, [field]: value } : stage
      )
    }));
  };

  const handleRemoveStage = (stageId) => {
    setFormData(prev => ({
      ...prev,
      stages: prev.stages.filter(stage => stage.id !== stageId)
    }));
  };

  const handleDragStart = (e, stage) => {
    setDraggedStage(stage);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetStage) => {
    e.preventDefault();
    if (!draggedStage || draggedStage.id === targetStage.id) return;

    const stages = [...formData.stages];
    const draggedIndex = stages.findIndex(s => s.id === draggedStage.id);
    const targetIndex = stages.findIndex(s => s.id === targetStage.id);

    stages.splice(draggedIndex, 1);
    stages.splice(targetIndex, 0, draggedStage);

    setFormData(prev => ({ ...prev, stages }));
    setDraggedStage(null);
  };

  // Render main list view
  if (currentView === 'list') {
    return (
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Treatment Plans</h1>
            <p className="text-gray-400 mt-1">Manage comprehensive care plan templates for encounters</p>
          </div>
          <button
            onClick={handleCreateNew}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Treatment Plan
          </button>
        </div>

        {/* Filters and Search */}
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <select
                value={selectedClinicFilter}
                onChange={(e) => setSelectedClinicFilter(e.target.value)}
                className="bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {clinics.map(clinic => (
                  <option key={clinic} value={clinic}>{clinic}</option>
                ))}
              </select>
              <Filter className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
          
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search treatment plans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Treatment Plans Table */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  {[
                    { key: 'name', label: 'Treatment Plan Name' },
                    { key: 'description', label: 'Plan Description' },
                    { key: 'clinicAccess', label: 'Clinic Access' },
                    { key: 'stagesCount', label: 'Stages Count' },
                    { key: 'lastUpdated', label: 'Last Updated On' },
                    { key: 'status', label: 'Status' }
                  ].map(({ key, label }) => (
                    <th
                      key={key}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600"
                      onClick={() => handleSort(key)}
                    >
                      <div className="flex items-center gap-2">
                        {label}
                        {sortConfig.key === key && (
                          sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {sortedPlans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-white font-medium">{plan.name}</td>
                    <td className="px-6 py-4 text-gray-300 max-w-xs truncate">{plan.description}</td>
                    <td className="px-6 py-4 text-gray-300">{plan.clinicAccess.join(', ')}</td>
                    <td className="px-6 py-4 text-gray-300">{plan.stagesCount}</td>
                    <td className="px-6 py-4 text-gray-300">{plan.lastUpdated}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        plan.status === 'Active' 
                          ? 'bg-green-900 text-green-300 border border-green-700'
                          : 'bg-gray-900 text-gray-400 border border-gray-700'
                      }`}>
                        {plan.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handlePreview(plan)}
                          className="text-blue-400 hover:text-blue-300 p-1"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(plan)}
                          className="text-green-400 hover:text-green-300 p-1"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(plan)}
                          className="text-red-400 hover:text-red-300 p-1"
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
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-medium text-white mb-4">Confirm Delete</h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete this Treatment Plan? THIS ACTION CANNOT BE UNDONE.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Active Plan Warning Modal */}
{showActiveWarningModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-md w-full mx-4">
      <h3 className="text-lg font-medium text-white mb-4">Cannot Delete Active Treatment Plan</h3>
      <p className="text-gray-300 mb-6">
        Active treatment plans cannot be deleted. Please deactivate it before deletion.
      </p>
      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowActiveWarningModal(false)}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            setShowActiveWarningModal(false);
            handleEdit(planToDelete);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Edit Plan
        </button>
      </div>
    </div>
  </div>
)}
      </div>
    );
  }

  // Render preview view
  if (currentView === 'preview') {
    return (
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">{selectedPlan.name}</h1>
            <p className="text-gray-400 mt-1">Treatment Plan Preview</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handleEdit(selectedPlan)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={() => setCurrentView('list')}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Treatment Plans
            </button>
          </div>
        </div>

        {/* Plan Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-4">Plan Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                  <p className="text-white">{selectedPlan.description}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Clinic Access</label>
                  <p className="text-white">{selectedPlan.clinicAccess.join(', ')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    selectedPlan.status === 'Active' 
                      ? 'bg-green-900 text-green-300 border border-green-700'
                      : 'bg-gray-900 text-gray-400 border border-gray-700'
                  }`}>
                    {selectedPlan.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Stages Grid */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-4">Treatment Stages</h3>
              {selectedPlan.stages && selectedPlan.stages.length > 0 ? (
                <div className="space-y-4">
                  {selectedPlan.stages.map((stage, index) => (
                    <div key={stage.id} className="bg-gray-700 border border-gray-600 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-white font-medium">Stage {index + 1}: {stage.stageName}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Users className="w-4 h-4" />
                          {stage.assignedRole}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <label className="block text-gray-400 mb-1">Assigned Agents</label>
                          <p className="text-white">{stage.assignedAgents.join(', ') || 'None assigned'}</p>
                        </div>
                        <div>
                          <label className="block text-gray-400 mb-1">Escalation Time</label>
                          <p className="text-white">{stage.escalationTime || 'Not set'}</p>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-gray-400 mb-1">Escalation Target</label>
                          <p className="text-white">{stage.escalationTarget || 'Not set'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No stages defined for this treatment plan.</p>
              )}
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="p-6 space-y-6">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-4">Plan Statistics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Total Stages</span>
                  <span className="text-white font-medium">{selectedPlan.stagesCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Last Updated</span>
                  <span className="text-white font-medium">{selectedPlan.lastUpdated}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Clinic Count</span>
                  <span className="text-white font-medium">{selectedPlan.clinicAccess.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render create/edit form
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {selectedPlan ? 'Edit Treatment Plan' : 'Create Treatment Plan'}
          </h1>
          <p className="text-gray-400 mt-1">
            {selectedPlan ? 'Modify existing treatment plan' : 'Build a new comprehensive care plan template'}
          </p>
        </div>
        <button
          onClick={() => setCurrentView('list')}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to List
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {/* Step 1: Treatment Plan Details */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Step 1: Treatment Plan Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Treatment Plan Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter treatment plan name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Plan Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the treatment plan purpose and scope"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Clinic Access *</label>
                <div className="space-y-2">
                  {clinics.slice(1).map(clinic => (
                    <label key={clinic} className="flex items-center gap-2">
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
                        className="text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-white">{clinic}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Step 2: Stages and Workflow Setup */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Step 2: Stages and Workflow Setup
              </h3>
              <button
                onClick={handleAddStage}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Stage
              </button>
            </div>

            {formData.stages.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-600 rounded-lg">
                <Settings className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">No stages added yet</p>
                <button
                  onClick={handleAddStage}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Add Your First Stage
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.stages.map((stage, index) => (
                  <div
                    key={stage.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, stage)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, stage)}
                    className="bg-gray-700 border border-gray-600 rounded-lg p-4 cursor-move hover:border-gray-500"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-5 h-5 text-gray-400" />
                        <h4 className="text-white font-medium">Stage {index + 1}</h4>
                      </div>
                      <button
                        onClick={() => handleRemoveStage(stage.id)}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Stage Name *</label>
                        <input
                          type="text"
                          value={stage.stageName}
                          // Continuation of Treatment Plans Module from the form section

                          onChange={(e) => handleStageChange(stage.id, 'stageName', e.target.value)}
                          className="w-full bg-gray-600 border border-gray-500 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter stage name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Assigned Role *</label>
                        <select
                          value={stage.assignedRole}
                          onChange={(e) => handleStageChange(stage.id, 'assignedRole', e.target.value)}
                          className="w-full bg-gray-600 border border-gray-500 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select role</option>
                          {Object.keys(staffByRole).map(role => (
                            <option key={role} value={role}>{role}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Assigned Agents</label>
                        <div className="space-y-1 max-h-24 overflow-y-auto">
                          {stage.assignedRole && staffByRole[stage.assignedRole] ? 
                            staffByRole[stage.assignedRole].map(agent => (
                              <label key={agent} className="flex items-center gap-2 text-sm">
                                <input
                                  type="checkbox"
                                  checked={stage.assignedAgents.includes(agent)}
                                  onChange={(e) => {
                                    const updatedAgents = e.target.checked
                                      ? [...stage.assignedAgents, agent]
                                      : stage.assignedAgents.filter(a => a !== agent);
                                    handleStageChange(stage.id, 'assignedAgents', updatedAgents);
                                  }}
                                  className="text-blue-600 bg-gray-600 border-gray-500 rounded focus:ring-blue-500"
                                />
                                <span className="text-white">{agent}</span>
                              </label>
                            )) : (
                              <p className="text-gray-400 text-sm">Select a role first</p>
                            )
                          }
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Escalation Time</label>
                        <select
                          value={stage.escalationTime}
                          onChange={(e) => handleStageChange(stage.id, 'escalationTime', e.target.value)}
                          className="w-full bg-gray-600 border border-gray-500 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select escalation time</option>
                          <option value="2 hours">2 hours</option>
                          <option value="4 hours">4 hours</option>
                          <option value="8 hours">8 hours</option>
                          <option value="24 hours">24 hours</option>
                          <option value="48 hours">48 hours</option>
                          <option value="+1 day from previous step">+1 day from previous step</option>
                          <option value="+2 days from previous step">+2 days from previous step</option>
                          <option value="+3 days from previous step">+3 days from previous step</option>
                          <option value="+1 week from previous step">+1 week from previous step</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-1">Escalation Target</label>
                        <select
                          value={stage.escalationTarget}
                          onChange={(e) => handleStageChange(stage.id, 'escalationTarget', e.target.value)}
                          className="w-full bg-gray-600 border border-gray-500 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select escalation target</option>
                          {allStaff.map(staff => (
                            <option key={staff} value={staff}>{staff}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setCurrentView('list')}
              className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSavePlan}
              disabled={!formData.name || !formData.description || formData.clinicAccess.length === 0}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              {selectedPlan ? 'Update Treatment Plan' : 'Create Treatment Plan'}
            </button>
          </div>
        </div>

        {/* Sidebar - Form Summary */}
        <div className="space-y-6">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 sticky top-6">
            <h3 className="text-lg font-medium text-white mb-4">Plan Summary</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Plan Name</label>
                <p className="text-white text-sm">{formData.name || 'Not specified'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  formData.status === 'Active' 
                    ? 'bg-green-900 text-green-300 border border-green-700'
                    : 'bg-gray-900 text-gray-400 border border-gray-700'
                }`}>
                  {formData.status}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Clinic Access</label>
                <p className="text-white text-sm">
                  {formData.clinicAccess.length > 0 ? formData.clinicAccess.join(', ') : 'None selected'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Total Stages</label>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-blue-400">{formData.stages.length}</span>
                  <span className="text-sm text-gray-400">stages configured</span>
                </div>
              </div>

              {formData.stages.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Stage Overview</label>
                  <div className="space-y-2">
                    {formData.stages.map((stage, index) => (
                      <div key={stage.id} className="bg-gray-700 rounded p-2">
                        <div className="flex items-center justify-between">
                          <span className="text-white text-sm font-medium">
                            {index + 1}. {stage.stageName || 'Unnamed Stage'}
                          </span>
                          {stage.assignedRole && (
                            <span className="text-xs text-gray-400">{stage.assignedRole}</span>
                          )}
                        </div>
                        {stage.escalationTime && (
                          <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {stage.escalationTime}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-gray-700">
                <div className="flex items-center gap-2 text-sm">
                  <div className={`w-3 h-3 rounded-full ${
                    formData.name && formData.description && formData.clinicAccess.length > 0 
                      ? 'bg-green-500' 
                      : 'bg-red-500'
                  }`}></div>
                  <span className="text-gray-400">
                    {formData.name && formData.description && formData.clinicAccess.length > 0 
                      ? 'Ready to save' 
                      : 'Missing required fields'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Help Card */}
          <div className="bg-blue-900 border border-blue-700 rounded-lg p-6">
            <h4 className="text-blue-300 font-medium mb-2">💡 Quick Tips</h4>
            <ul className="text-blue-200 text-sm space-y-1">
              <li>• Use drag & drop to reorder stages</li>
              <li>• Set escalation times for critical stages</li>
              <li>• Assign multiple agents per stage for coverage</li>
              <li>• Use relative time for flexible workflows</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreatmentPlans;