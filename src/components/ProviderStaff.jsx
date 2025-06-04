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
  X,
  ArrowLeft,
  Users,
  UserCheck,
  Building2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  FileText,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const ProviderStaff = ({ onBreadcrumbChange }) => {
  // Sample clinic data
  const clinics = ['All Clinics', 'Penfield', 'Finger Lakes', 'Albany', 'Rochester', 'Syracuse'];
  
  // Provider types
  const providerTypes = ['Psychiatrist', 'Therapist', 'Counselor', 'General Physician', 'Nurse Practitioner'];
  
  // Staff roles
  const staffRoles = ['Intake Team', 'Scheduling Team', 'Supervisor', 'Provider POC', 'RCM'];

  // Sample providers data
  const [providers, setProviders] = useState([
    {
      id: 1,
      fullName: 'Dr. Sarah Johnson',
      gender: 'Female',
      dob: '1985-03-15',
      email: 'sarah.johnson@clinic.com',
      phone: '(555) 123-4567',
      address: {
        street: '123 Medical Drive',
        city: 'Rochester',
        state: 'NY',
        zip: '14625'
      },
      providerType: 'Psychiatrist',
      specialization: 'Adult Psychiatry',
      npi: '1234567890',
      licenseNumber: 'PSY-12345',
      licenseExpiration: '2025-12-31',
      clinicAccess: ['Penfield', 'Rochester'],
      hasActiveAppointments: true
    },
    {
      id: 2,
      fullName: 'Dr. Michael Chen',
      gender: 'Male',
      dob: '1978-09-22',
      email: 'michael.chen@clinic.com',
      phone: '(555) 234-5678',
      address: {
        street: '456 Health Ave',
        city: 'Albany',
        state: 'NY',
        zip: '12203'
      },
      providerType: 'Therapist',
      specialization: 'Cognitive Behavioral Therapy',
      npi: '2345678901',
      licenseNumber: 'THR-67890',
      licenseExpiration: '2026-06-30',
      clinicAccess: ['Albany'],
      hasActiveAppointments: false
    }
  ]);

  // Sample staff data
  const [staff, setStaff] = useState([
    {
      id: 1,
      fullName: 'Jennifer Martinez',
      gender: 'Female',
      dob: '1990-07-12',
      email: 'jennifer.martinez@clinic.com',
      phone: '(555) 345-6789',
      address: {
        street: '789 Office Blvd',
        city: 'Finger Lakes',
        state: 'NY',
        zip: '14456'
      },
      role: 'Intake Team',
      clinicAccess: ['Finger Lakes', 'Rochester'],
      active: true,
      hasActiveTasks: true
    },
    {
      id: 2,
      fullName: 'Robert Thompson',
      gender: 'Male',
      dob: '1987-11-03',
      email: 'robert.thompson@clinic.com',
      phone: '(555) 456-7890',
      address: {
        street: '321 Admin Street',
        city: 'Syracuse',
        state: 'NY',
        zip: '13202'
      },
      role: 'Scheduling Team',
      clinicAccess: ['Syracuse', 'Albany'],
      active: true,
      hasActiveTasks: false
    }
  ]);

  const [activeTab, setActiveTab] = useState('Providers'); // 'Providers' or 'Staff'
  const [currentView, setCurrentView] = useState('list'); // 'list', 'create', 'edit', 'view'
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClinicFilter, setSelectedClinicFilter] = useState('All Clinics');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('All Roles');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Form state for create/edit
  const [formData, setFormData] = useState({
    // Basic details
    fullName: '',
    gender: '',
    dob: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: ''
    },
    // Provider specific
    providerType: '',
    specialization: '',
    npi: '',
    licenseNumber: '',
    licenseExpiration: '',
    // Staff specific
    role: '',
    active: true,
    // Common
    clinicAccess: []
  });

  useEffect(() => {
    const viewPath = {
      'list': ['Provider & Staff', activeTab],
      'create': ['Provider & Staff', activeTab, `Create ${activeTab.slice(0, -1)}`],
      'edit': ['Provider & Staff', activeTab, `Edit ${activeTab.slice(0, -1)}`],
      'view': ['Provider & Staff', activeTab, `View ${activeTab.slice(0, -1)}`]
    };
    onBreadcrumbChange(viewPath[currentView] || ['Provider & Staff']);
  }, [currentView, activeTab, onBreadcrumbChange]);

  // Get current data based on active tab
  const getCurrentData = () => activeTab === 'Providers' ? providers : staff;
  const setCurrentData = activeTab === 'Providers' ? setProviders : setStaff;

  // Filtering and sorting logic
  const getFilteredData = () => {
    const data = getCurrentData();
    return data.filter(item => {
      const matchesSearch = item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (activeTab === 'Staff' && item.role.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesClinic = selectedClinicFilter === 'All Clinics' || 
                           item.clinicAccess.includes(selectedClinicFilter);
      
      const matchesRole = activeTab === 'Providers' || 
                         selectedRoleFilter === 'All Roles' || 
                         item.role === selectedRoleFilter;
      
      return matchesSearch && matchesClinic && matchesRole;
    });
  };

  const getSortedData = () => {
    const filteredData = getFilteredData();
    if (!sortConfig.key) return filteredData;
    
    return [...filteredData].sort((a, b) => {
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
  };

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const handleView = (item) => {
    setSelectedItem(item);
    setCurrentView('view');
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData({ ...item });
    setCurrentView('edit');
  };

  const handleDelete = (item) => {
  const hasActiveWork = activeTab === 'Providers' ? item.hasActiveAppointments : item.hasActiveTasks;
  if (hasActiveWork) {
    setItemToDelete(item);
    setShowDeleteModal(true);
    return;
  }
  setItemToDelete(item);
  setShowDeleteModal(true);
};

  const confirmDelete = () => {
  const data = getCurrentData();
  const updatedData = data.filter(item => item.id !== itemToDelete.id);
  setCurrentData(updatedData);
  setShowDeleteModal(false);
  setItemToDelete(null);
};

  const handleCreateNew = () => {
    const initialData = {
      fullName: '',
      gender: '',
      dob: '',
      email: '',
      phone: '',
      address: { street: '', city: '', state: '', zip: '' },
      clinicAccess: []
    };

    if (activeTab === 'Providers') {
      initialData.providerType = '';
      initialData.specialization = '';
      initialData.npi = '';
      initialData.licenseNumber = '';
      initialData.licenseExpiration = '';
    } else {
      initialData.role = '';
      initialData.active = true;
    }

    setFormData(initialData);
    setSelectedItem(null);
    setCurrentView('create');
  };

  const handleSave = () => {
    const data = getCurrentData();
    
    if (selectedItem) {
      // Edit existing item
      const updatedData = data.map(item => 
        item.id === selectedItem.id ? { ...item, ...formData } : item
      );
      setCurrentData(updatedData);
    } else {
      // Create new item
      const newItem = {
        id: Math.max(...data.map(item => item.id)) + 1,
        ...formData,
        hasActiveAppointments: false,
        hasActiveTasks: false
      };
      setCurrentData([...data, newItem]);
    }
    setCurrentView('list');
  };

  // Render main list view
  if (currentView === 'list') {
    return (
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Provider & Staff</h1>
            <p className="text-gray-400 mt-1">Manage providers and staff members across your clinic organization</p>
          </div>
          <button
            onClick={handleCreateNew}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add {activeTab.slice(0, -1)}
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-700">
          <div className="flex space-x-8">
            {['Providers', 'Staff'].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setSearchTerm('');
                  setSelectedClinicFilter('All Clinics');
                  setSelectedRoleFilter('All Roles');
                }}
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
            
            {activeTab === 'Staff' && (
              <div className="relative">
                <select
                  value={selectedRoleFilter}
                  onChange={(e) => setSelectedRoleFilter(e.target.value)}
                  className="bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All Roles">All Roles</option>
                  {staffRoles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
                <Filter className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
            )}
          </div>
          
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search ${activeTab.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  {activeTab === 'Providers' ? (
                    <>
                      <th onClick={() => handleSort('fullName')} className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600">
                        <div className="flex items-center gap-2">
                          Provider Name
                          {sortConfig.key === 'fullName' && (
                            sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </th>
                      <th onClick={() => handleSort('email')} className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600">
                        <div className="flex items-center gap-2">
                          Email
                          {sortConfig.key === 'email' && (
                            sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </th>
                      <th onClick={() => handleSort('phone')} className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600">
                        <div className="flex items-center gap-2">
                          Phone
                          {sortConfig.key === 'phone' && (
                            sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </th>
                      <th onClick={() => handleSort('providerType')} className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600">
                        <div className="flex items-center gap-2">
                          Provider Type
                          {sortConfig.key === 'providerType' && (
                            sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </th>
                      <th onClick={() => handleSort('clinicAccess')} className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600">
                        <div className="flex items-center gap-2">
                          Clinic Access
                          {sortConfig.key === 'clinicAccess' && (
                            sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </th>
                    </>
                  ) : (
                    <>
                      <th onClick={() => handleSort('fullName')} className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600">
                        <div className="flex items-center gap-2">
                          Staff Full Name
                          {sortConfig.key === 'fullName' && (
                            sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </th>
                      <th onClick={() => handleSort('email')} className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600">
                        <div className="flex items-center gap-2">
                          Email Address
                          {sortConfig.key === 'email' && (
                            sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </th>
                      <th onClick={() => handleSort('phone')} className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600">
                        <div className="flex items-center gap-2">
                          Phone Number
                          {sortConfig.key === 'phone' && (
                            sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </th>
                      <th onClick={() => handleSort('role')} className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600">
                        <div className="flex items-center gap-2">
                          Role
                          {sortConfig.key === 'role' && (
                            sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </th>
                      <th onClick={() => handleSort('clinicAccess')} className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600">
                        <div className="flex items-center gap-2">
                          Clinic Access
                          {sortConfig.key === 'clinicAccess' && (
                            sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </th>
                    </>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {getSortedData().map((item) => (
                  <tr key={item.id} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-white font-medium">{item.fullName}</td>
                    <td className="px-6 py-4 text-gray-300">{item.email}</td>
                    <td className="px-6 py-4 text-gray-300">{item.phone}</td>
                    <td className="px-6 py-4 text-gray-300">
                      {activeTab === 'Providers' ? item.providerType : item.role}
                    </td>
                    <td className="px-6 py-4 text-gray-300">{item.clinicAccess.join(', ')}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleView(item)}
                          className="text-blue-400 hover:text-blue-300 p-1"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-green-400 hover:text-green-300 p-1"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
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
                Are you sure you want to delete this {activeTab.slice(0, -1).toLowerCase()}? THIS ACTION CANNOT BE UNDONE.
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
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render view details page
  if (currentView === 'view') {
    return (
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">{selectedItem.fullName}</h1>
            <p className="text-gray-400 mt-1">{activeTab.slice(0, -1)} Details</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handleEdit(selectedItem)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={() => handleDelete(selectedItem)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
            <button
              onClick={() => setCurrentView('list')}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to List
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Details */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Basic Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                  <p className="text-white">{selectedItem.fullName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Gender</label>
                  <p className="text-white">{selectedItem.gender}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Date of Birth</label>
                  <p className="text-white">{selectedItem.dob}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                  <p className="text-white">{selectedItem.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Phone</label>
                  <p className="text-white">{selectedItem.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Address</label>
                  <p className="text-white">
                    {selectedItem.address.street}, {selectedItem.address.city}, {selectedItem.address.state} {selectedItem.address.zip}
                  </p>
                </div>
              </div>
            </div>

            {/* Professional/Role Details */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {activeTab === 'Providers' ? 'Professional Details' : 'Role & Access'}
              </h3>
              {activeTab === 'Providers' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Provider Type</label>
                    <p className="text-white">{selectedItem.providerType}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Specialization</label>
                    <p className="text-white">{selectedItem.specialization}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">NPI</label>
                    <p className="text-white">{selectedItem.npi}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">License Number</label>
                    <p className="text-white">{selectedItem.licenseNumber}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">License Expiration</label>
                    <p className="text-white">{selectedItem.licenseExpiration}</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Role</label>
                    <p className="text-white">{selectedItem.role}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      selectedItem.active 
                        ? 'bg-green-900 text-green-300 border border-green-700'
                        : 'bg-gray-900 text-gray-400 border border-gray-700'
                    }`}>
                      {selectedItem.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              )}
            </div>
            

            {/* Access Management */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Access Management
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Clinic Access</label>
                <div className="flex flex-wrap gap-2">
                  {selectedItem.clinicAccess.map(clinic => (
                    <span key={clinic} className="px-2 py-1 bg-blue-900 text-blue-300 rounded text-sm">
                      {clinic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-4">Summary</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Type</span>
                  <span className="text-white font-medium">
                    {activeTab === 'Providers' ? selectedItem.providerType : selectedItem.role}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Clinic Count</span>
                  <span className="text-white font-medium">{selectedItem.clinicAccess.length}</span>
                </div>
                {activeTab === 'Staff' && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Status</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      selectedItem.active 
                        ? 'bg-green-900 text-green-300'
                        : 'bg-gray-900 text-gray-400'
                    }`}>
                      {selectedItem.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                )}
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
            {selectedItem ? `Edit ${activeTab.slice(0, -1)}` : `Add ${activeTab.slice(0, -1)}`}
          </h1>
          <p className="text-gray-400 mt-1">
            {selectedItem ? `Modify ${activeTab.slice(0, -1).toLowerCase()} information` : `Add a new ${activeTab.slice(0, -1).toLowerCase()} to your organization`}
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
          {/* Basic Details */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Basic Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData(prev => ({ ...prev, dob: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            {/* Address Section */}
            <div className="mt-6">
              <h4 className="text-md font-medium text-white mb-4">Address</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Street</label>
                  <input
                    type="text"
                    value={formData.address.street}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      address: { ...prev.address, street: e.target.value }
                    }))}
                    className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Street address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
                  <input
                    type="text"
                    value={formData.address.city}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      address: { ...prev.address, city: e.target.value }
                    }))}
                    className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">State</label>
                  <input
                    type="text"
                    value={formData.address.state}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      address: { ...prev.address, state: e.target.value }
                    }))}
                    className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="State"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">ZIP Code</label>
                  <input
                    type="text"
                    value={formData.address.zip}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      address: { ...prev.address, zip: e.target.value }
                    }))}
                    className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="ZIP code"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Professional/Role Details */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {activeTab === 'Providers' ? 'Professional Details' : 'Role & Access Management'}
            </h3>
            
            {activeTab === 'Providers' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Provider Type *</label>
                  <select
                    value={formData.providerType}
                    onChange={(e) => setFormData(prev => ({ ...prev, providerType: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select provider type</option>
                    {providerTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Specialization</label>
                  <input
                    type="text"
                    value={formData.specialization}
                    onChange={(e) => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter specialization"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">NPI (National Provider Identifier)</label>
                  <input
                    type="text"
                    value={formData.npi}
                    onChange={(e) => setFormData(prev => ({ ...prev, npi: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="10-digit NPI number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">License Number</label>
                  <input
                    type="text"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="License number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">License Expiration Date</label>
                  <input
                    type="date"
                    value={formData.licenseExpiration}
                    onChange={(e) => setFormData(prev => ({ ...prev, licenseExpiration: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Role Selection *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select role</option>
                    {staffRoles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                      className="text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-300">Active</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Access Management */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Access Management
            </h3>
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
              onClick={handleSave}
              disabled={!formData.fullName || !formData.email || formData.clinicAccess.length === 0 || 
                       (activeTab === 'Providers' && !formData.providerType) ||
                       (activeTab === 'Staff' && !formData.role)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              {selectedItem ? `Update ${activeTab.slice(0, -1)}` : `Add ${activeTab.slice(0, -1)}`}
            </button>
          </div>
        </div>

        {/* Sidebar - Form Summary */}
        <div className="space-y-6">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 sticky top-6">
            <h3 className="text-lg font-medium text-white mb-4">
              {activeTab.slice(0, -1)} Summary
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                <p className="text-white text-sm">{formData.fullName || 'Not specified'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                <p className="text-white text-sm">{formData.email || 'Not specified'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  {activeTab === 'Providers' ? 'Provider Type' : 'Role'}
                </label>
                <p className="text-white text-sm">
                  {activeTab === 'Providers' ? (formData.providerType || 'Not selected') : (formData.role || 'Not selected')}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Clinic Access</label>
                <p className="text-white text-sm">
                  {formData.clinicAccess.length > 0 ? formData.clinicAccess.join(', ') : 'None selected'}
                </p>
              </div>

              {activeTab === 'Staff' && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    formData.active 
                      ? 'bg-green-900 text-green-300 border border-green-700'
                      : 'bg-gray-900 text-gray-400 border border-gray-700'
                  }`}>
                    {formData.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              )}

              <div className="pt-4 border-t border-gray-700">
                <div className="flex items-center gap-2 text-sm">
                  <div className={`w-3 h-3 rounded-full ${
                    formData.fullName && formData.email && formData.clinicAccess.length > 0 &&
                    ((activeTab === 'Providers' && formData.providerType) || (activeTab === 'Staff' && formData.role))
                      ? 'bg-green-500' 
                      : 'bg-red-500'
                  }`}></div>
                  <span className="text-gray-400">
                    {formData.fullName && formData.email && formData.clinicAccess.length > 0 &&
                     ((activeTab === 'Providers' && formData.providerType) || (activeTab === 'Staff' && formData.role))
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
              {activeTab === 'Providers' ? (
                <>
                  <li>• NPI is required for billing</li>
                  <li>• Keep license information current</li>
                  <li>• Specialization helps with patient matching</li>
                  <li>• Multiple clinic access enables flexibility</li>
                </>
              ) : (
                <>
                  <li>• Inactive staff won't appear in assignments</li>
                  <li>• Role determines access permissions</li>
                  <li>• Multiple clinic access enables coverage</li>
                  <li>• Active status affects scheduling</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderStaff;