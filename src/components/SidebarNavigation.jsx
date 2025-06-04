import React, { useState } from 'react';
import FormBuilder from './FormBuilder';
import TreatmentPlans from './TreatmentPlans';
import ProviderStaff from './ProviderStaff';
import ClinicManagement from './ClinicManagement';
import { 
  Home, 
  FileText, 
  Calendar, 
  Building2, 
  Users, 
  MessageSquare, 
  HelpCircle, 
  Headphones, 
  Settings,
  ChevronLeft,
  ChevronRight,
  User,
  LogOut,
  ChevronDown,
  Bell
} from 'lucide-react';

const SidebarNavigation = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeModule, setActiveModule] = useState('Home');
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [breadcrumb, setBreadcrumb] = useState('');

  const mainModules = [
    { name: 'Home', icon: Home },
    { name: 'Form Builder', icon: FileText },
    { name: 'Treatment Plans', icon: Calendar },
    { name: 'Clinic Management', icon: Building2 },
    { name: 'Provider & Staff', icon: Users },
    { name: 'Message', icon: MessageSquare }
  ];

  const systemModules = [
    { name: 'Help', icon: HelpCircle },
    { name: 'Support', icon: Headphones },
    { name: 'Settings', icon: Settings }
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleModuleClick = (moduleName) => {
    setActiveModule(moduleName);
    setBreadcrumb('');
  };

  const toggleAccountDropdown = () => {
    setShowAccountDropdown(!showAccountDropdown);
  };

  const handleBreadcrumbChange = (newBreadcrumb) => {
    setBreadcrumb(newBreadcrumb);
  };

  const renderContent = () => {
    switch(activeModule) {
      
      case 'Home':
        return (
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 text-center">
              <h2 className="text-2xl font-semibold text-white mb-4">Welcome to Penfield Psychiatry</h2>
              <p className="text-slate-300">Select a module from the sidebar to get started.</p>
            </div>
            {/* Add more content to demonstrate scrolling */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6,7,8,9].map(i => (
                <div key={i} className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                  <h3 className="text-white font-semibold mb-3">Dashboard Card {i}</h3>
                  <p className="text-slate-300 mb-4">This is sample content to demonstrate the sticky sidebar functionality.</p>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Updated today</span>
                    <button className="text-blue-400 hover:text-blue-300 text-sm">View →</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
         case 'Treatment Plans':
   return <TreatmentPlans onBreadcrumbChange={handleBreadcrumbChange} />;
       case 'Form Builder':
        return <FormBuilder onBreadcrumbChange={handleBreadcrumbChange} />;
        
      case 'Clinic Management':
  return <ClinicManagement onBreadcrumbChange={handleBreadcrumbChange} />;
      case 'Provider & Staff':
        return <ProviderStaff onBreadcrumbChange={handleBreadcrumbChange} />;
      case 'Message':
        return (
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 text-center">
            <h2 className="text-2xl font-semibold text-white mb-4">Messages</h2>
            <p className="text-slate-300">Messages module coming soon...</p>
          </div>
        );
      case 'Help':
        return (
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 text-center">
            <h2 className="text-2xl font-semibold text-white mb-4">Help Center</h2>
            <p className="text-slate-300">Help documentation coming soon...</p>
          </div>
        );
      case 'Support':
        return (
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 text-center">
            <h2 className="text-2xl font-semibold text-white mb-4">Support</h2>
            <p className="text-slate-300">Support center coming soon...</p>
          </div>
        );
      case 'Settings':
        return (
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 text-center">
            <h2 className="text-2xl font-semibold text-white mb-4">Settings</h2>
            <p className="text-slate-300">Settings panel coming soon...</p>
          </div>
        );
      default:
        return (
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 text-center">
            <h2 className="text-2xl font-semibold text-white mb-4">Welcome</h2>
            <p className="text-slate-300">Select a module to get started.</p>
          </div>
        );
    }
  };

  const formatBreadcrumb = () => {
    if (!breadcrumb) {
      return activeModule;
    }
    return breadcrumb;
  };

  return (
    <div className="flex min-h-screen bg-slate-900">
      {/* Sticky Sidebar */}
      <div className={`bg-slate-900 text-white transition-all duration-300 ease-in-out ${isCollapsed ? 'w-16' : 'w-64'} 
                      fixed left-0 top-0 h-screen z-30 flex flex-col border-r border-slate-700`}>
        
        {/* Header with Logo and Toggle */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold">Penfield</span>
            </div>
          )}
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Scrollable Navigation Area */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
          <nav className="py-6">
            {/* Main Modules */}
            <div className="space-y-1 px-3">
              {mainModules.map((module) => {
                const IconComponent = module.icon;
                const isActive = activeModule === module.name;
                
                return (
                  <button
                    key={module.name}
                    onClick={() => handleModuleClick(module.name)}
                    className={`w-full flex items-center px-3 py-3 rounded-lg text-left transition-all duration-200 group ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <IconComponent className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : 'mr-3'} ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                    {!isCollapsed && (
                      <span className="font-medium text-sm">{module.name}</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Separator */}
            {!isCollapsed && (
              <div className="my-6 mx-6 border-t border-slate-700"></div>
            )}
            {isCollapsed && (
              <div className="my-6 mx-3 border-t border-slate-700"></div>
            )}

            {/* System Modules */}
            <div className="space-y-1 px-3">
              {systemModules.map((module) => {
                const IconComponent = module.icon;
                const isActive = activeModule === module.name;
                
                return (
                  <button
                    key={module.name}
                    onClick={() => handleModuleClick(module.name)}
                    className={`w-full flex items-center px-3 py-3 rounded-lg text-left transition-all duration-200 group ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <IconComponent className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : 'mr-3'} ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                    {!isCollapsed && (
                      <span className="font-medium text-sm">{module.name}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Account Section - Fixed at bottom */}
        <div className="border-t border-slate-700 p-3 flex-shrink-0">
          <div className="relative">
            <button
              onClick={toggleAccountDropdown}
              className="w-full flex items-center px-3 py-3 rounded-lg hover:bg-slate-800 transition-colors group"
            >
              <div className={`w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center ${isCollapsed ? 'mx-auto' : 'mr-3'}`}>
                <User className="w-4 h-4 text-slate-300" />
              </div>
              {!isCollapsed && (
                <>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-white">Dr. Sarah Wilson</div>
                    <div className="text-xs text-slate-400">Administrator</div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showAccountDropdown ? 'rotate-180' : ''}`} />
                </>
              )}
            </button>

            {/* Account Dropdown */}
            {showAccountDropdown && !isCollapsed && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-slate-800 rounded-lg shadow-lg py-2 border border-slate-700">
                <button className="w-full flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
                  <User className="w-4 h-4 mr-3" />
                  Profile
                </button>
                <button className="w-full flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
                  <LogOut className="w-4 h-4 mr-3" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area with proper margin for sticky sidebar */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Sticky Top Header */}
        <header className="bg-slate-900 px-6 py-3 sticky top-0 z-20 border-b border-slate-700">
          <div className="flex items-center justify-between">
            {/* Left side - Breadcrumb */}
            <div className="flex items-center space-x-2 text-sm">
              <button className="text-gray-400 hover:text-white transition-colors">
                <Home className="w-4 h-4" />
              </button>
              <ChevronRight className="w-4 h-4 text-gray-500" />
              <span className="text-gray-400">Home</span>
              <ChevronRight className="w-4 h-4 text-gray-500" />
              <span className="text-white">Clinics</span>
            </div>
            
            {/* Right side - Settings */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300">US</span>
              <div className="flex items-center space-x-1">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <button className="text-gray-400 hover:text-white transition-colors">
                  <span className="text-lg">🌙</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 bg-slate-900 p-6 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default SidebarNavigation;