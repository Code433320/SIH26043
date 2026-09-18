import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from './useAuth';

// Usage:
//   <Route element={<ProtectedRoute allowedRoles={['university', 'student']} />}>
//     <Route path="/university" element={<UniversityLayout />}>...</Route>
//   </Route>
//
// Omit allowedRoles to just require "logged in" with no role restriction.
export default function ProtectedRoute({ allowedRoles }) {
  const { user, profile, profileError, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-slate-500">
        Loading your account...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 text-center">
        <div className="max-w-lg rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <h1 className="text-lg font-bold text-amber-900">This account cannot access this dashboard</h1>
          <p className="mt-2 text-sm text-amber-800">
            The signed-in account has the role <strong>{profile.role}</strong>, but this page requires a different role.
          </p>
        </div>
      </div>
    );
  }

  if (allowedRoles && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 text-center">
        <div className="max-w-lg rounded-2xl border border-red-200 bg-red-50 p-6">
          <h1 className="text-lg font-bold text-red-800">Profile setup could not be loaded</h1>
          <p className="mt-2 text-sm text-red-700">
            Your authentication succeeded, but the matching public.users profile is unavailable. Check the signup trigger and Row Level Security policy in Supabase.
          </p>
          {profileError?.message && (
            <p className="mt-3 wrap-break-word text-xs text-red-600">{profileError.message}</p>
          )}
        </div>
      </div>
    );
  }

  return <Outlet />;
}