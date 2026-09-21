import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  Users, ShieldCheck, Building2, HeartHandshake,
  ArrowLeft, ArrowRight, Eye, EyeOff, Loader2, Clock
} from 'lucide-react';

// ── 5 Roles matching exact spec ─────────────────────────────────
const ROLES = [
  {
    id: 'citizen',
    label: 'Citizen',
    tagline: 'Report and track problems in your community',
    icon: Users,
    photo: '/auth_citizen.jpg',
    valueStatement: 'Stop reporting into the void. Real tracking to verified resolution.',
    requiresApproval: false,
    route: '/app',
  },
  {
    id: 'government',
    label: 'Government / Admin',
    tagline: 'Validate, assign, and resolve civic issues',
    icon: ShieldCheck,
    photo: '/auth_gov.jpg',
    valueStatement: 'Turn accountability into momentum with public milestone tracking.',
    requiresApproval: true,
    route: '/government',
  },
  {
    id: 'university',
    label: 'University',
    tagline: 'Lead root-cause solutions with your faculty and students',
    icon: Building2,
    photo: '/auth_university.jpg',
    valueStatement: 'Lead root-cause solutions with faculty backing and field datasets.',
    requiresApproval: true,
    route: '/university',
  },
  {
    id: 'industry',
    label: 'NGO / Private Funder',
    tagline: 'Fund, support, or field-verify real impact',
    icon: HeartHandshake,
    photo: '/auth_ngo.jpg',
    valueStatement: 'Put your funding where it is provably needed. Verifiable CSR credit.',
    requiresApproval: true,
    route: '/industry',
  },
];

const roleRoutes = {
  citizen: '/app',
  government: '/government',
  university: '/university',
  student: '/university',
  industry: '/industry',
  ngo: '/industry',
};

export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const initialRoleParam = searchParams.get('role');

  const [selectedRole, setSelectedRole] = useState(
    ROLES.find(r => r.id === initialRoleParam) ? initialRoleParam : null
  );
  const [authMode, setAuthMode] = useState('signin'); // 'signin' | 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form states per role
  const [formData, setFormData] = useState({
    // Common
    name: '',
    email: '',
    phone: '',
    password: '',
    // Citizen
    location: '',
    // Government
    department: '',
    designation: '',
    // University
    institution: '',
    uniDepartment: '',
    facultyEmail: '',
    expertise: 'Urban Infrastructure',
    // Student
    studentDepartment: '',
    academicYear: 'Final Year',
    facultySponsorEmail: '',
    // NGO / Funder
    orgName: '',
    regNumber: '',
    domainInterest: 'Public Sanitation',
    contactPerson: '',
  });

  useEffect(() => {
    if (initialRoleParam && ROLES.some(r => r.id === initialRoleParam)) {
      setSelectedRole(initialRoleParam);
    }
  }, [initialRoleParam]);

  const activeRole = ROLES.find(r => r.id === selectedRole);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    
const displayName = formData.name || formData.orgName || formData.institution || '';

const result = authMode === 'signin'
  ? await signIn({ email: formData.email.trim(), password: formData.password })
  : await signUp({
      email: formData.email.trim(),
      password: formData.password,
      name: displayName,
      role: activeRole.id,
      profileData,
    });

    setLoading(false);

    if (result.error) {
      setErrorMessage(result.error.message || 'Authentication failed. Please try again.');
      return;
    }

    if (authMode === 'signup' && !result.data?.session) {
      setSuccessMessage('Account created. Check your email to confirm the account before signing in.');
      return;
    }

    if (authMode === 'signup' && activeRole?.requiresApproval) {
      setShowApprovalModal(true);
      return;
    }

    const authenticatedRole = result.profile?.role || activeRole?.id;
    const redirectPath = roleRoutes[authenticatedRole] || '/app';
    navigate(redirectPath, { replace: true });
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setErrorMessage('');

    const { error } = await signInWithGoogle();
    setLoading(false);

    if (error) {
      setErrorMessage(error.message || 'Google authentication failed.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#14213D] font-['Public_Sans',sans-serif] selection:bg-[#E8590C]/20 selection:text-[#14213D] flex flex-col">
      
      {/* ── Minimalist Top Nav ── */}
      <header className="w-full bg-[#F7F6F2] border-b border-[#D8D4CB] px-6 py-4 flex items-center justify-between z-10">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-3 cursor-pointer group text-left"
        >
          <img src="/logo.png" alt="Civic Samadhan" className="h-10 w-auto object-contain" />
          <div>
            <span className="font-['Archivo',sans-serif] text-xl font-black tracking-tight text-[#14213D] leading-none block">
              Civic<span className="text-[#E8590C]">Samadhan</span>
            </span>
            <span className="text-[11px] font-semibold text-[#14213D]/60 tracking-wider uppercase block mt-0.5">
              Access Portal
            </span>
          </div>
        </button>

        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#14213D]/70 hover:text-[#14213D] px-3 py-1.5 rounded-lg border border-[#D8D4CB] hover:bg-[#14213D]/5 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>
      </header>

      {/* ── SCREEN 1: Role Selection (When no role is selected) ── */}
      {!selectedRole && (
        <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-14">
          <div className="max-w-4xl w-full text-center mb-12">
            <h1 className="font-['Archivo',sans-serif] text-4xl sm:text-5xl font-black text-[#14213D] tracking-tight mb-3">
              Who are you joining as?
            </h1>
            <p className="text-base sm:text-lg text-[#14213D]/70 max-w-xl mx-auto">
              Select your role to access tailored civic resolution workflows, dashboards, and institutional verified tools.
            </p>
          </div>

          {/* Responsive grid: 3-up desktop, 2-up tablet, 1-up mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl w-full">
            {ROLES.map((r) => {
              const Icon = r.icon;
              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedRole(r.id)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => e.key === 'Enter' && setSelectedRole(r.id)}
                  className="group relative p-7 rounded-2xl bg-white border border-[#D8D4CB] hover:border-[#E8590C] hover:-translate-y-1.5 shadow-xs hover:shadow-md cursor-pointer transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    {/* Line icon (navy-line, not filled) */}
                    <div className="w-12 h-12 rounded-xl bg-[#F7F6F2] border border-[#D8D4CB] flex items-center justify-center mb-5 text-[#14213D] group-hover:border-[#E8590C] group-hover:text-[#E8590C] transition-colors">
                      <Icon className="w-6 h-6 stroke-[1.8]" />
                    </div>

                    {/* Role Title in Archivo */}
                    <h2 className="font-['Archivo',sans-serif] text-xl font-black text-[#14213D] mb-2 group-hover:text-[#14213D] transition-colors">
                      {r.label}
                    </h2>

                    {/* Description in Public Sans */}
                    <p className="text-sm text-[#14213D]/70 leading-relaxed">
                      {r.tagline}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#D8D4CB]/60 flex items-center justify-between text-xs font-bold text-[#14213D]/60 group-hover:text-[#E8590C] transition-colors">
                    <span>Select {r.label}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      )}

      {/* ── SCREEN 2: Split-Screen Auth (When a role is selected) ── */}
      {selectedRole && activeRole && (
        <main className="flex-1 flex flex-col lg:flex-row min-h-0">
          
          {/* ── LEFT PANEL: The Form (50% on desktop) ── */}
          <section className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12 bg-[#F7F6F2] overflow-y-auto">
            <div className="max-w-md w-full mx-auto animate-[fadeInLeft_0.35s_ease-out]">
              
              {/* Back-link to Role Selection */}
              <button
                type="button"
                onClick={() => setSelectedRole(null)}
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#14213D]/65 hover:text-[#E8590C] mb-6 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Not {activeRole.label}? Choose another role</span>
              </button>

              {/* StatusBadge pattern: Navy pill with icon + text */}
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#14213D] text-[#F7F6F2] text-xs font-bold mb-6 shadow-xs">
                <activeRole.icon className="w-3.5 h-3.5 text-[#E8590C]" />
                <span>Signing in as {activeRole.label}</span>
              </div>

              {/* Headline */}
              <h1 className="font-['Archivo',sans-serif] text-3xl sm:text-4xl font-black text-[#14213D] tracking-tight mb-2">
                {authMode === 'signin' ? 'Welcome back' : 'Create your account'}
              </h1>
              <p className="text-sm text-[#14213D]/70 mb-8">
                {authMode === 'signin'
                  ? `Access your ${activeRole.label.toLowerCase()} dashboard and active cases.`
                  : `Join Civic Samadhan to initiate transparent, tracked civic resolutions.`}
              </p>

              {/* Tab Toggle: Sign In / Sign Up (Underline style with signal orange indicator) */}
              <div className="flex border-b border-[#D8D4CB] mb-8">
                <button
                  type="button"
                  onClick={() => setAuthMode('signin')}
                  className={`pb-3 text-sm font-['Archivo',sans-serif] font-bold tracking-tight transition-all relative ${
                    authMode === 'signin'
                      ? 'text-[#14213D]'
                      : 'text-[#14213D]/50 hover:text-[#14213D]'
                  }`}
                >
                  <span>Sign In</span>
                  {authMode === 'signin' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E8590C] rounded-full" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className={`ml-8 pb-3 text-sm font-['Archivo',sans-serif] font-bold tracking-tight transition-all relative ${
                    authMode === 'signup'
                      ? 'text-[#14213D]'
                      : 'text-[#14213D]/50 hover:text-[#14213D]'
                  }`}
                >
                  <span>Sign Up</span>
                  {authMode === 'signup' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E8590C] rounded-full" />
                  )}
                </button>
              </div>

              {errorMessage && (
                <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              )}

              {successMessage && (
                <div role="status" className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {successMessage}
                </div>
              )}

              {/* Auth Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* ── Per-Role Sign Up Fields ── */}
                {authMode === 'signup' && (
                  <>
                    {/* Citizen Sign Up */}
                    {activeRole.id === 'citizen' && (
                      <>
                        <div>
                          <label className="block text-xs font-bold text-[#14213D] uppercase tracking-wider mb-1.5">
                            Full Name
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Rahul Sharma"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white border border-[#D8D4CB] text-sm text-[#14213D] focus:outline-hidden focus:border-[#E8590C] focus:ring-1 focus:ring-[#E8590C] transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#14213D] uppercase tracking-wider mb-1.5">
                            City / Ward <span className="text-[#14213D]/50 font-normal">(Optional)</span>
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Ward 42, Pune Municipal Corp"
                            value={formData.location}
                            onChange={(e) => handleInputChange('location', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white border border-[#D8D4CB] text-sm text-[#14213D] focus:outline-hidden focus:border-[#E8590C] focus:ring-1 focus:ring-[#E8590C] transition-all"
                          />
                        </div>
                      </>
                    )}

                    {/* Government / Admin Sign Up */}
                    {activeRole.id === 'government' && (
                      <>
                        <div>
                          <label className="block text-xs font-bold text-[#14213D] uppercase tracking-wider mb-1.5">
                            Full Name &amp; Title
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. S. K. Kulkarni"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white border border-[#D8D4CB] text-sm text-[#14213D] focus:outline-hidden focus:border-[#E8590C] focus:ring-1 focus:ring-[#E8590C] transition-all"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-[#14213D] uppercase tracking-wider mb-1.5">
                              Department
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. PWD / Roads"
                              value={formData.department}
                              onChange={(e) => handleInputChange('department', e.target.value)}
                              className="w-full px-4 py-3 rounded-xl bg-white border border-[#D8D4CB] text-sm text-[#14213D] focus:outline-hidden focus:border-[#E8590C] focus:ring-1 focus:ring-[#E8590C] transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-[#14213D] uppercase tracking-wider mb-1.5">
                              Designation
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Executive Engineer"
                              value={formData.designation}
                              onChange={(e) => handleInputChange('designation', e.target.value)}
                              className="w-full px-4 py-3 rounded-xl bg-white border border-[#D8D4CB] text-sm text-[#14213D] focus:outline-hidden focus:border-[#E8590C] focus:ring-1 focus:ring-[#E8590C] transition-all"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {/* University Sign Up */}
                    {activeRole.id === 'university' && (
                      <>
                        <div>
                          <label className="block text-xs font-bold text-[#14213D] uppercase tracking-wider mb-1.5">
                            Institution Name
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. College of Engineering Pune (COEP)"
                            value={formData.institution}
                            onChange={(e) => handleInputChange('institution', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white border border-[#D8D4CB] text-sm text-[#14213D] focus:outline-hidden focus:border-[#E8590C] focus:ring-1 focus:ring-[#E8590C] transition-all"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-[#14213D] uppercase tracking-wider mb-1.5">
                              Department
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Civil &amp; Environmental"
                              value={formData.uniDepartment}
                              onChange={(e) => handleInputChange('uniDepartment', e.target.value)}
                              className="w-full px-4 py-3 rounded-xl bg-white border border-[#D8D4CB] text-sm text-[#14213D] focus:outline-hidden focus:border-[#E8590C] focus:ring-1 focus:ring-[#E8590C] transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-[#14213D] uppercase tracking-wider mb-1.5">
                              Domain of Focus
                            </label>
                            <select
                              value={formData.expertise}
                              onChange={(e) => handleInputChange('expertise', e.target.value)}
                              className="w-full px-4 py-3 rounded-xl bg-white border border-[#D8D4CB] text-sm text-[#14213D] focus:outline-hidden focus:border-[#E8590C] transition-all"
                            >
                              <option>Urban Infrastructure</option>
                              <option>Water Management</option>
                              <option>Waste Processing</option>
                              <option>AI &amp; Sensor Networks</option>
                            </select>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Student Sign Up */}
                    {activeRole.id === 'student' && (
                      <>
                        <div>
                          <label className="block text-xs font-bold text-[#14213D] uppercase tracking-wider mb-1.5">
                            Student Full Name
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Ananya Deshmukh"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white border border-[#D8D4CB] text-sm text-[#14213D] focus:outline-hidden focus:border-[#E8590C] focus:ring-1 focus:ring-[#E8590C] transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#14213D] uppercase tracking-wider mb-1.5">
                            College / Institution Name
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. VJTI Mumbai"
                            value={formData.institution}
                            onChange={(e) => handleInputChange('institution', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white border border-[#D8D4CB] text-sm text-[#14213D] focus:outline-hidden focus:border-[#E8590C] focus:ring-1 focus:ring-[#E8590C] transition-all"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-[#14213D] uppercase tracking-wider mb-1.5">
                              Branch / Dept
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Computer Eng"
                              value={formData.studentDepartment}
                              onChange={(e) => handleInputChange('studentDepartment', e.target.value)}
                              className="w-full px-4 py-3 rounded-xl bg-white border border-[#D8D4CB] text-sm text-[#14213D] focus:outline-hidden focus:border-[#E8590C] focus:ring-1 focus:ring-[#E8590C] transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-[#14213D] uppercase tracking-wider mb-1.5">
                              Faculty Sponsor Email <span className="text-[#E8590C]">*</span>
                            </label>
                            <input
                              type="email"
                              required
                              placeholder="mentor@college.edu"
                              value={formData.facultySponsorEmail}
                              onChange={(e) => handleInputChange('facultySponsorEmail', e.target.value)}
                              className="w-full px-4 py-3 rounded-xl bg-white border border-[#D8D4CB] text-sm text-[#14213D] focus:outline-hidden focus:border-[#E8590C] focus:ring-1 focus:ring-[#E8590C] transition-all"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {/* NGO / Funder Sign Up */}
                    {/* NGO / Industry Sign Up — covers both role ids */}
{(activeRole.id === 'industry' || activeRole.id === 'ngo') && (
  <>
    <div>
      <label className="block text-xs font-bold text-[#14213D] uppercase tracking-wider mb-1.5">
        Organization / Trust Name
      </label>
      <input
        type="text"
        required
        placeholder="e.g. Clean City Foundation"
        value={formData.orgName}
        onChange={(e) => handleInputChange('orgName', e.target.value)}
        className="w-full px-4 py-3 rounded-xl bg-white border border-[#D8D4CB] text-sm text-[#14213D] focus:outline-hidden focus:border-[#E8590C] focus:ring-1 focus:ring-[#E8590C] transition-all"
      />
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-xs font-bold text-[#14213D] uppercase tracking-wider mb-1.5">
          Registration / CSR Number
        </label>
        <input
          type="text"
          required
          placeholder="e.g. CSR-MH-2024-098"
          value={formData.regNumber}
          onChange={(e) => handleInputChange('regNumber', e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-white border border-[#D8D4CB] text-sm text-[#14213D] focus:outline-hidden focus:border-[#E8590C] focus:ring-1 focus:ring-[#E8590C] transition-all"
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-[#14213D] uppercase tracking-wider mb-1.5">
          Domain of Interest
        </label>
        <select
          value={formData.domainInterest}
          onChange={(e) => handleInputChange('domainInterest', e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-white border border-[#D8D4CB] text-sm text-[#14213D] focus:outline-hidden focus:border-[#E8590C] transition-all"
        >
          <option>Public Sanitation</option>
          <option>Road Safety</option>
          <option>Water Resources</option>
          <option>Renewable Power</option>
        </select>
      </div>
    </div>
  </>
)}
                  </>
                )}

                {/* Email or Phone field */}
                <div>
                  <label className="block text-xs font-bold text-[#14213D] uppercase tracking-wider mb-1.5">
                    {activeRole.id === 'government' ? 'Official Government Email' : 'Email'}
                  </label>
                  <input
                    type="email"
                    required
                    placeholder={
                      activeRole.id === 'government'
                        ? 'officer@gov.in or dept@nic.in'
                        : 'you@example.com'
                    }
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#D8D4CB] text-sm text-[#14213D] focus:outline-hidden focus:border-[#E8590C] focus:ring-1 focus:ring-[#E8590C] transition-all"
                  />
                </div>

                {/* Password field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-[#14213D] uppercase tracking-wider">
                      Password
                    </label>
                    {authMode === 'signin' && (
                      <button
                        type="button"
                        className="text-xs font-bold text-[#E8590C] hover:underline"
                      >
                        Forgot?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••••••"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="w-full px-4 py-3 pr-11 rounded-xl bg-white border border-[#D8D4CB] text-sm text-[#14213D] focus:outline-hidden focus:border-[#E8590C] focus:ring-1 focus:ring-[#E8590C] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#14213D]/40 hover:text-[#14213D]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Primary Button: Signal Orange */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 rounded-xl bg-[#E8590C] hover:bg-[#d44e08] text-white font-['Archivo',sans-serif] font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <span>{authMode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                    )}
                  </button>
                </div>

                {/* Secondary Button: Google OAuth */}
                <div>
                  <button
                    type="button"
                    onClick={handleGoogleAuth}
                    disabled={loading}
                    className="w-full py-3 px-6 rounded-xl bg-white border border-[#14213D] text-[#14213D] font-['Archivo',sans-serif] font-bold text-sm hover:bg-[#14213D]/5 transition-all flex items-center justify-center space-x-2.5 cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </button>
                </div>

                {/* Small Print / Terms */}
                <p className="text-[11px] text-[#14213D]/60 text-center pt-2 leading-normal">
                  By continuing, you agree to Civic Samadhan's{' '}
                  <span className="underline cursor-pointer hover:text-[#14213D]">Terms of Service</span> and{' '}
                  <span className="underline cursor-pointer hover:text-[#14213D]">Privacy Policy</span>.
                </p>
              </form>

            </div>
          </section>

          {/* ── RIGHT PANEL: Real Photography with Indian Civic Context (50% on desktop) ── */}
          <section className="relative w-full lg:w-1/2 min-h-85 lg:min-h-auto overflow-hidden animate-[fadeInRight_0.35s_ease-out]">
            
            {/* Thin Signal Orange Accent Bar along inner edge (the seam) */}
            <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-[#E8590C] z-20 hidden lg:block" />

            {/* Real Contextual Photography */}
            <img
              src={activeRole.photo}
              alt={activeRole.label}
              className="w-full h-full object-cover"
            />

            {/* Subtle Navy Gradient Overlay at bottom third */}
            <div className="absolute inset-0 bg-linear-to-t from-[#14213D]/95 via-[#14213D]/45 to-transparent z-10" />

            {/* Overlaid Role Value Statement */}
            <div className="absolute bottom-10 left-8 right-8 z-20 max-w-lg">
              <div className="inline-block px-2.5 py-1 rounded-md bg-[#E8590C] text-white text-[10px] font-black uppercase tracking-wider mb-2.5">
                {activeRole.label}
              </div>
              <p className="font-['Archivo',sans-serif] text-xl sm:text-2xl font-black text-white leading-snug tracking-tight">
                "{activeRole.valueStatement}"
              </p>
              <p className="text-xs text-white/60 font-semibold mt-2">
                Civic Samadhan — National Civic Resolution Ecosystem
              </p>
            </div>
          </section>

        </main>
      )}

      {/* ── Role Pending Approval Modal ── */}
      {showApprovalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#14213D]/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-[#D8D4CB] max-w-md w-full p-8 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#E8590C]/10 border border-[#E8590C]/30 flex items-center justify-center mx-auto mb-5 text-[#E8590C]">
              <Clock className="w-7 h-7" />
            </div>

            <div className="inline-block px-3 py-1 rounded-full bg-[#14213D]/10 text-[#14213D] text-xs font-bold mb-3">
              Role Pending Approval
            </div>

            <h3 className="font-['Archivo',sans-serif] text-2xl font-black text-[#14213D] mb-3">
              Institutional Review Submitted
            </h3>

            <p className="text-sm text-[#14213D]/70 leading-relaxed mb-6">
              Your registration as <strong>{activeRole?.label}</strong> has been received. Our administrative governance panel verifies credentials within <strong>24–48 hours</strong>. You will receive an official notification once approved.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowApprovalModal(false);
                  navigate(activeRole?.route || '/');
                }}
                className="w-full py-3.5 px-5 rounded-xl bg-[#14213D] hover:bg-[#14213D]/90 text-white font-['Archivo',sans-serif] font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                Proceed to Public Dashboard
              </button>
              <button
                onClick={() => {
                  setShowApprovalModal(false);
                  setSelectedRole(null);
                }}
                className="w-full py-2.5 text-xs font-bold text-[#14213D]/60 hover:text-[#14213D] transition-colors"
              >
                Sign in with another role
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
