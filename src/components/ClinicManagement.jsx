import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  ExternalLink,
  ArrowLeft,
  Building2,
  MapPin,
  Phone,
  Mail,
  Users,
  UserCheck,
  Globe,
  Upload,
  Clock,
  Settings,
  Shield,
  CheckCircle,
  AlertCircle,
  X,
  Calendar,
  FileText,
  Monitor
} from 'lucide-react';

const ClinicManagement = ({ onBreadcrumbChange }) => {
  // Staff roles
  const staffRoles = ['Intake Team', 'Scheduling Team', 'Supervisor', 'Provider POC', 'RCM'];

  // Sample clinics data
  const [clinics, setClinics] = useState([
    {
      id: 1,
      name: 'Penfield Medical Center',
      address: '123 Medical Drive, Penfield, NY 14526',
      email: 'contact@penfield.clinic',
      phone: '(585) 555-0123',
      fax: '(585) 555-0124',
      website: 'https://penfield.clinic',
      opsPortalUrl: 'https://ops.penfield.clinic',
      patientPortalUrl: 'https://patient.penfield.clinic',
      clinicType: 'Mental Health',
      npi: '1234567890',
      tin: '12-3456789',
      timeZone: 'Eastern Time (ET)',
      businessHours: {
        monday: '9:00 AM - 5:00 PM',
        tuesday: '9:00 AM - 5:00 PM',
        wednesday: '9:00 AM - 5:00 PM',
        thursday: '9:00 AM - 5:00 PM',
        friday: '9:00 AM - 5:00 PM',
        saturday: 'Closed',
        sunday: 'Closed'
      },
      providerCount: 12,
      staffCount: 8,
      logo: null,
      domains: [
        { id: 1, domain: 'penfield.clinic', type: 'Primary', status: 'Verified' },
        { id: 2, domain: 'ops.penfield.clinic', type: 'Operations', status: 'Verified' }
      ],
      taskSettings: {
        defaultEscalationTime: '24 hours',
        defaultEscalationTarget: 'Dr. Sarah Johnson',
        standardTaskReviewer: 'Jennifer Martinez',
        roleSpecific: {
          'Intake Team': {
            escalationTime: '4 hours',
            escalationTarget: 'Dr. Sarah Johnson',
            reviewer: 'Jennifer Martinez'
          },
          'Scheduling Team': {
            escalationTime: '8 hours',
            escalationTarget: 'Robert Thompson',
            reviewer: 'Lisa Anderson'
          },
          'Supervisor': {
            escalationTime: '24 hours',
            escalationTarget: 'Dr. Sarah Johnson',
            reviewer: 'Jennifer Martinez'
          },
          'Provider POC': {
            escalationTime: '2 hours',
            escalationTarget: 'Dr. Michael Chen',
            reviewer: 'Robert Thompson'
          },
          'RCM': {
            escalationTime: '48 hours',
            escalationTarget: 'Lisa Anderson',
            reviewer: 'Jennifer Martinez'
          }
        }
      }
    },
    {
      id: 2,
      name: 'Finger Lakes Health Center',
      address: '456 Wellness Ave, Finger Lakes, NY 14456',
      email: 'info@fingerlakes.health',
      phone: '(315) 555-0456',
      fax: '(315) 555-0457',
      website: 'https://fingerlakes.health',
      opsPortalUrl: 'https://ops.fingerlakes.health',
      patientPortalUrl: 'https://patient.fingerlakes.health',
      clinicType: 'General Practice',
      npi: '2345678901',
      tin: '23-4567890',
      timeZone: 'Eastern Time (ET)',
      businessHours: {
        monday: '8:00 AM - 6:00 PM',
        tuesday: '8:00 AM - 6:00 PM',
        wednesday: '8:00 AM - 6:00 PM',
        thursday: '8:00 AM - 6:00 PM',
        friday: '8:00 AM - 6:00 PM',
        saturday: '9:00 AM - 1:00 PM',
        sunday: 'Closed'
      },
      providerCount: 8,
      staffCount: 6,
      logo: null,
      domains: [],
      taskSettings: {
        defaultEscalationTime: '12 hours',
        defaultEscalationTarget: 'Dr. Michael Chen',
        standardTaskReviewer: 'Robert Thompson',
        roleSpecific: {
          'Intake Team': {
            escalationTime: '2 hours',
            escalationTarget: 'Dr. Michael Chen',
            reviewer: 'Robert Thompson'
          },
          'Scheduling Team': {
            escalationTime: '4 hours',
            escalationTarget: 'Lisa Anderson',
            reviewer: 'Dr. Michael Chen'
          },
          'Supervisor': {
            escalationTime: '12 hours',
            escalationTarget: 'Dr. Michael Chen',
            reviewer: 'Robert Thompson'
          },
          'Provider POC': {
            escalationTime: '1 hour',
            escalationTarget: 'Dr. Michael Chen',
            reviewer: 'Lisa Anderson'
          },
          'RCM': {
            escalationTime: '24 hours',
            escalationTarget: 'Robert Thompson',
            reviewer: 'Dr. Michael Chen'
          }
        }
      }
    }
  ]);

  // Sample providers and staff data
  const [allProviders] = useState([
    { id: 1, name: 'Dr. Sarah Johnson', specialization: 'Psychiatrist', clinicIds: [1] },
    { id: 2, name: 'Dr. Michael Chen', specialization: 'Therapist', clinicIds: [2] },
    { id: 3, name: 'Dr. Emily Rodriguez', specialization: 'Counselor', clinicIds: [] }
  ]);

  const [allStaff] = useState([
    { id: 1, name: 'Jennifer Martinez', role: 'Intake Team', clinicIds: [1] },
    { id: 2, name: 'Robert Thompson', role: 'Scheduling Team', clinicIds: [2] },
    { id: 3, name: 'Lisa Anderson', role: 'Supervisor', clinicIds: [] }
  ]);

  // State variables
  const [currentView, setCurrentView] = useState('list'); // 'list', 'view', 'edit'
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [activeTab, setActiveTab] = useState('Details'); // 'Details', 'Providers', 'Staff', 'Branding', 'Domain', 'Task Settings'
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showDomainModal, setShowDomainModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addModalType, setAddModalType] = useState(''); // 'provider' or 'staff'
  const [selectedItems, setSelectedItems] = useState([]);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemToRemove, setItemToRemove] = useState(null);

  // Form state for editing
  const [formData, setFormData] = useState({});
  const [newDomain, setNewDomain] = useState('');

  useEffect(() => {
    const viewPath = {
      'list': ['Clinic Management'],
      'view': ['Clinic Management', selectedClinic?.name || 'View Clinic'],
      'edit': ['Clinic Management', selectedClinic?.name || 'Edit Clinic', 'Edit']
    };
    onBreadcrumbChange(viewPath[currentView] || ['Clinic Management']);
  }, [currentView, selectedClinic, onBreadcrumbChange]);

  // Filter clinics based on search
  const filteredClinics = clinics.filter(clinic =>
    clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    clinic.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = (clinic) => {
    setSelectedClinic(clinic);
    setCurrentView('view');
    setActiveTab('Details');
  };

  const handleEdit = (clinic) => {
    setSelectedClinic(clinic);
    // Ensure taskSettings has proper structure
    const formDataWithDefaults = {
      ...clinic,
      taskSettings: {
        ...clinic.taskSettings,
        roleSpecific: clinic.taskSettings?.roleSpecific || {}
      }
    };
    setFormData(formDataWithDefaults);
    setCurrentView('edit');
    setActiveTab('Details');
  };

  const handleDelete = (clinic) => {
    setItemToDelete(clinic);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setClinics(prev => prev.filter(clinic => clinic.id !== itemToDelete.id));
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const handleSave = () => {
    setClinics(prev => prev.map(clinic =>
      clinic.id === selectedClinic.id ? { ...clinic, ...formData } : clinic
    ));
    // Update selectedClinic to reflect changes
    setSelectedClinic({ ...selectedClinic, ...formData });
    setCurrentView('view');
  };

  const handleRemoveFromClinic = (item, type) => {
    setItemToRemove({ item, type });
    setShowRemoveModal(true);
  };

  const confirmRemove = () => {
    // Logic to remove provider/staff from clinic would go here
    setShowRemoveModal(false);
    setItemToRemove(null);
  };

  const handleAddDomain = () => {
    if (newDomain.trim()) {
      const updatedClinic = {
        ...selectedClinic,
        domains: [
          ...selectedClinic.domains,
          {
            id: Date.now(),
            domain: newDomain.trim(),
            type: 'Custom',
            status: 'Pending'
          }
        ]
      };
      setSelectedClinic(updatedClinic);
      setClinics(prev => prev.map(clinic =>
        clinic.id === selectedClinic.id ? updatedClinic : clinic
      ));
      setNewDomain('');
      setShowDomainModal(false);
    }
  };

  const handleAddToClinic = (type) => {
    setAddModalType(type);
    setSelectedItems([]);
    setShowAddModal(true);
  };

  const handleItemSelection = (itemId, checked) => {
    if (checked) {
      setSelectedItems(prev => [...prev, itemId]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    }
  };

  const confirmAddToClinic = () => {
    const currentData = addModalType === 'provider' ? allProviders : allStaff;
    
    selectedItems.forEach(itemId => {
      const itemIndex = currentData.findIndex(item => item.id === itemId);
      if (itemIndex !== -1) {
        currentData[itemIndex] = {
          ...currentData[itemIndex],
          clinicIds: [...currentData[itemIndex].clinicIds, selectedClinic.id]
        };
      }
    });

    // Update clinic counts
    const updatedClinic = {
      ...selectedClinic,
      [addModalType === 'provider' ? 'providerCount' : 'staffCount']: 
        selectedClinic[addModalType === 'provider' ? 'providerCount' : 'staffCount'] + selectedItems.length
    };
    
    setSelectedClinic(updatedClinic);
    setClinics(prev => prev.map(clinic =>
      clinic.id === selectedClinic.id ? updatedClinic : clinic
    ));

    setShowAddModal(false);
    setSelectedItems([]);
  };

  const getAvailableItems = () => {
    const currentData = addModalType === 'provider' ? allProviders : allStaff;
    return currentData.filter(item => !item.clinicIds.includes(selectedClinic.id));
  };

  // Render main list view
  if (currentView === 'list') {
    return (
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Clinic Management</h1>
            <p className="text-gray-400 mt-1">Manage clinic details, branding, domains, and settings</p>
          </div>
        </div>

        {/* Search */}
        <div className="flex justify-end">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search clinics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Clinic Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClinics.map((clinic) => (
            <div key={clinic.id} className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">{clinic.name}</h3>
                  <div className="flex items-start gap-2 text-gray-400 text-sm">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{clinic.address}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={() => window.open(clinic.opsPortalUrl, '_blank')}
                  className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm"
                  title="Operations Portal"
                >
                  <Monitor className="w-4 h-4" />
                  Ops Portal
                </button>
                <button
                  onClick={() => window.open(clinic.patientPortalUrl, '_blank')}
                  className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm"
                  title="Patient Portal"
                >
                  <ExternalLink className="w-4 h-4" />
                  Patient Portal
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {clinic.providerCount} Providers
                  </span>
                  <span className="flex items-center gap-1">
                    <UserCheck className="w-4 h-4" />
                    {clinic.staffCount} Staff
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleView(clinic)}
                    className="text-blue-400 hover:text-blue-300 p-1"
                    title="View"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(clinic)}
                    className="text-green-400 hover:text-green-300 p-1"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(clinic)}
                    className="text-red-400 hover:text-red-300 p-1"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-medium text-white mb-4">Confirm Delete</h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete this clinic? THIS ACTION CANNOT BE UNDONE.
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
      </div>
    );
  }

  // Render clinic detail view
  if (currentView === 'view' || currentView === 'edit') {
    const isEditing = currentView === 'edit';
    const clinic = isEditing ? formData : selectedClinic;

    return (
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">{clinic.name}</h1>
            <p className="text-gray-400 mt-1">{isEditing ? 'Edit Clinic Details' : 'Clinic Information'}</p>
          </div>
          <div className="flex gap-3">
            {!isEditing ? (
              <>
                <button
                  onClick={() => handleEdit(selectedClinic)}
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
                  Back to List
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setCurrentView('view')}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {/* Highlight Panel */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold text-white mb-2">{clinic.name}</h2>
              <div className="space-y-2 text-gray-300">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{clinic.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{clinic.phone}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{clinic.providerCount}</div>
                <div className="text-sm text-gray-400">Providers</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{clinic.staffCount}</div>
                <div className="text-sm text-gray-400">Staff Members</div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-700">
            <button
              onClick={() => window.open(clinic.patientPortalUrl, '_blank')}
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              Patient Portal
            </button>
            <button
              onClick={() => window.open(clinic.opsPortalUrl, '_blank')}
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm"
            >
              <Monitor className="w-4 h-4" />
              Operations Portal
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-700">
          <div className="flex space-x-8">
            {['Details', 'Providers', 'Staff', 'Branding', 'Domain', 'Task Settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'Details' && (
            <div className="space-y-6">
              {/* Clinic Identification */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Clinic Identification
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Clinic Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={clinic.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-white">{clinic.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Clinic Type</label>
                    {isEditing ? (
                      <select
                        value={clinic.clinicType}
                        onChange={(e) => setFormData(prev => ({ ...prev, clinicType: e.target.value }))}
                        className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Mental Health">Mental Health</option>
                        <option value="General Practice">General Practice</option>
                        <option value="Specialist">Specialist</option>
                      </select>
                    ) : (
                      <p className="text-white">{clinic.clinicType}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">NPI</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={clinic.npi}
                        onChange={(e) => setFormData(prev => ({ ...prev, npi: e.target.value }))}
                        className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-white">{clinic.npi}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">TIN</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={clinic.tin}
                        onChange={(e) => setFormData(prev => ({ ...prev, tin: e.target.value }))}
                        className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-white">{clinic.tin}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Location & Contact */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Location & Contact
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Street Address</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={clinic.address}
                        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                        className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-white">{clinic.address}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={clinic.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-white">{clinic.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={clinic.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-white">{clinic.phone}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Fax</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={clinic.fax}
                        onChange={(e) => setFormData(prev => ({ ...prev, fax: e.target.value }))}
                        className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-white">{clinic.fax}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Website</label>
                    {isEditing ? (
                      <input
                        type="url"
                        value={clinic.website}
                        onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                        className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      // Continuation of Complete Clinic Management Module

                    ) : (
                      <p className="text-white">{clinic.website}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Time Zone</label>
                    {isEditing ? (
                      <select
                        value={clinic.timeZone}
                        onChange={(e) => setFormData(prev => ({ ...prev, timeZone: e.target.value }))}
                        className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Eastern Time (ET)">Eastern Time (ET)</option>
                        <option value="Central Time (CT)">Central Time (CT)</option>
                        <option value="Mountain Time (MT)">Mountain Time (MT)</option>
                        <option value="Pacific Time (PT)">Pacific Time (PT)</option>
                      </select>
                    ) : (
                      <p className="text-white">{clinic.timeZone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Business Hours
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(clinic.businessHours).map(([day, hours]) => (
                    <div key={day}>
                      <label className="block text-sm font-medium text-gray-300 mb-2 capitalize">{day}</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={hours}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            businessHours: { ...prev.businessHours, [day]: e.target.value }
                          }))}
                          className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="9:00 AM - 5:00 PM"
                        />
                      ) : (
                        <p className="text-white">{hours}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Providers' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-white">Clinic Providers</h3>
                <button 
                  onClick={() => handleAddToClinic('provider')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Provider
                </button>
              </div>
              
              <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Provider Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Specialization</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {allProviders.filter(p => p.clinicIds.includes(clinic.id)).map((provider) => (
                      <tr key={provider.id} className="hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-white font-medium">{provider.name}</td>
                        <td className="px-6 py-4 text-gray-300">{provider.specialization}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              className="text-blue-400 hover:text-blue-300 p-1"
                              title="View Provider"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRemoveFromClinic(provider, 'provider')}
                              className="text-red-400 hover:text-red-300 p-1"
                              title="Remove from Clinic"
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
          )}

          {activeTab === 'Staff' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-white">Clinic Staff</h3>
                <button 
                  onClick={() => handleAddToClinic('staff')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Staff
                </button>
              </div>
              
              <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Staff Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {allStaff.filter(s => s.clinicIds.includes(clinic.id)).map((staff) => (
                      <tr key={staff.id} className="hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-white font-medium">{staff.name}</td>
                        <td className="px-6 py-4 text-gray-300">{staff.role}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              className="text-blue-400 hover:text-blue-300 p-1"
                              title="View Staff"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRemoveFromClinic(staff, 'staff')}
                              className="text-red-400 hover:text-red-300 p-1"
                              title="Remove from Clinic"
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
          )}

          {activeTab === 'Branding' && (
            <div className="space-y-6">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Clinic Logo
                </h3>
                <div className="space-y-4">
                  {clinic.logo ? (
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center">
                        <Building2 className="w-8 h-8 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Current Logo</p>
                        <p className="text-gray-400 text-sm">Click to replace</p>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400 mb-2">No logo uploaded</p>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                        Upload Logo
                      </button>
                    </div>
                  )}
                  <div className="text-sm text-gray-400">
                    <p>• Recommended size: 200x200 pixels</p>
                    <p>• Supported formats: PNG, JPG, SVG</p>
                    <p>• Maximum file size: 2MB</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Domain' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-white">Domain Management</h3>
                <button
                  onClick={() => setShowDomainModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Domain
                </button>
              </div>

              {/* Current Portal URLs */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h4 className="text-md font-medium text-white mb-4">Current Portal URLs</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div>
                      <p className="text-white font-medium">Operations Portal</p>
                      <p className="text-gray-400 text-sm">{clinic.opsPortalUrl}</p>
                    </div>
                    <button
                      onClick={() => window.open(clinic.opsPortalUrl, '_blank')}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div>
                      <p className="text-white font-medium">Patient Portal</p>
                      <p className="text-gray-400 text-sm">{clinic.patientPortalUrl}</p>
                    </div>
                    <button
                      onClick={() => window.open(clinic.patientPortalUrl, '_blank')}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Custom Domains */}
              {clinic.domains && clinic.domains.length > 0 && (
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <h4 className="text-md font-medium text-white mb-4">Custom Domains</h4>
                  <div className="space-y-3">
                    {clinic.domains.map((domain) => (
                      <div key={domain.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                        <div>
                          <p className="text-white font-medium">{domain.domain}</p>
                          <p className="text-gray-400 text-sm">{domain.type} Domain</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            domain.status === 'Verified' 
                              ? 'bg-green-900 text-green-300 border border-green-700'
                              : domain.status === 'Pending'
                              ? 'bg-yellow-900 text-yellow-300 border border-yellow-700'
                              : 'bg-red-900 text-red-300 border border-red-700'
                          }`}>
                            {domain.status}
                          </span>
                          {domain.status === 'Pending' && (
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">
                              Verify
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'Task Settings' && (
            <div className="space-y-6">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Role-Based Task Configuration
                </h3>
                
                <div className="space-y-4">
                  {staffRoles.map((role) => {
                    const roleSettings = clinic.taskSettings?.roleSpecific?.[role] || {
                      escalationTime: '24 hours',
                      escalationTarget: '',
                      reviewer: ''
                    };
                    
                    return (
                      <div key={role} className="bg-gray-700 border border-gray-600 rounded-lg p-4">
                        <h4 className="text-white font-medium mb-4 flex items-center gap-2">
                          <UserCheck className="w-4 h-4" />
                          {role}
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Escalation Time
                            </label>
                            {isEditing ? (
                              <select
                                value={roleSettings.escalationTime}
                                onChange={(e) => setFormData(prev => ({
                                  ...prev,
                                  taskSettings: {
                                    ...prev.taskSettings,
                                    roleSpecific: {
                                      ...prev.taskSettings?.roleSpecific,
                                      [role]: {
                                        ...roleSettings,
                                        escalationTime: e.target.value
                                      }
                                    }
                                  }
                                }))}
                                className="w-full bg-gray-600 border border-gray-500 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="2 hours">2 hours</option>
                                <option value="4 hours">4 hours</option>
                                <option value="8 hours">8 hours</option>
                                <option value="24 hours">24 hours</option>
                                <option value="48 hours">48 hours</option>
                                <option value="+1 day from previous step">+1 day from previous step</option>
                                <option value="+2 days from previous step">+2 days from previous step</option>
                              </select>
                            ) : (
                              <p className="text-white">{roleSettings.escalationTime}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Escalation Target
                            </label>
                            {isEditing ? (
                              <select
                                value={roleSettings.escalationTarget}
                                onChange={(e) => setFormData(prev => ({
                                  ...prev,
                                  taskSettings: {
                                    ...prev.taskSettings,
                                    roleSpecific: {
                                      ...prev.taskSettings?.roleSpecific,
                                      [role]: {
                                        ...roleSettings,
                                        escalationTarget: e.target.value
                                      }
                                    }
                                  }
                                }))}
                                className="w-full bg-gray-600 border border-gray-500 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select escalation target</option>
                                {allProviders.concat(allStaff).map(person => (
                                  <option key={person.id} value={person.name}>{person.name}</option>
                                ))}
                              </select>
                            ) : (
                              <p className="text-white">{roleSettings.escalationTarget || 'Not set'}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Reviewer
                              <span className="block text-xs text-gray-400 mt-1">
                                Notified when task is rejected
                              </span>
                            </label>
                            {isEditing ? (
                              <select
                                value={roleSettings.reviewer}
                                onChange={(e) => setFormData(prev => ({
                                  ...prev,
                                  taskSettings: {
                                    ...prev.taskSettings,
                                    roleSpecific: {
                                      ...prev.taskSettings?.roleSpecific,
                                      [role]: {
                                        ...roleSettings,
                                        reviewer: e.target.value
                                      }
                                    }
                                  }
                                }))}
                                className="w-full bg-gray-600 border border-gray-500 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select reviewer</option>
                                {allStaff.concat(allProviders).map(person => (
                                  <option key={person.id} value={person.name}>{person.name}</option>
                                ))}
                              </select>
                            ) : (
                              <p className="text-white">{roleSettings.reviewer || 'Not set'}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Remove Confirmation Modal */}
        {showRemoveModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-medium text-white mb-4">Confirm Removal</h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to remove this {itemToRemove?.type} from the clinic?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowRemoveModal(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRemove}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Domain Modal */}
        {showDomainModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-lg w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-white">Add Custom Domain</h3>
                <button
                  onClick={() => setShowDomainModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Domain Name</label>
                  <input
                    type="text"
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    placeholder="example.com"
                    className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="bg-blue-900 border border-blue-700 rounded-lg p-4">
                  <h4 className="text-blue-300 font-medium mb-2">DNS Configuration Required</h4>
                  <p className="text-blue-200 text-sm mb-2">
                    Please add the following CNAME record to your DNS provider:
                  </p>
                  <div className="bg-gray-800 rounded p-3 font-mono text-sm">
                    <div className="text-gray-300">
                      <span className="text-blue-400">Type:</span> CNAME<br/>
                      <span className="text-blue-400">Name:</span> {newDomain || 'your-domain.com'}<br/>
                      <span className="text-blue-400">Value:</span> clinicmd.domain.com
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowDomainModal(false)}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddDomain}
                    disabled={!newDomain.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                  >
                    Add Domain
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Provider/Staff Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-white">
                  Add {addModalType === 'provider' ? 'Provider' : 'Staff'} to Clinic
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-gray-300">
                    Select {addModalType === 'provider' ? 'providers' : 'staff members'} to add to this clinic:
                  </p>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm">
                    + Create New {addModalType === 'provider' ? 'Provider' : 'Staff'}
                  </button>
                </div>

                {getAvailableItems().length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    No available {addModalType === 'provider' ? 'providers' : 'staff members'} to add.
                    All are already assigned to this clinic.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {getAvailableItems().map((item) => (
                      <label key={item.id} className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={(e) => handleItemSelection(item.id, e.target.checked)}
                          className="text-blue-600 bg-gray-600 border-gray-500 rounded focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <p className="text-white font-medium">{item.name}</p>
                          <p className="text-gray-400 text-sm">
                            {addModalType === 'provider' ? item.specialization : item.role}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmAddToClinic}
                    disabled={selectedItems.length === 0}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                  >
                    Add Selected ({selectedItems.length})
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
};

export default ClinicManagement;