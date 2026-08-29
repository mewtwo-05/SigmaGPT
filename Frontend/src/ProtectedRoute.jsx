import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';

/**
 * ProtectedRoute
 * - While session is loading → show a full-page spinner
 * - If no user → redirect to /login
 * - If authenticated → render children
 */
function ProtectedRoute({ children }) {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#0d0d0f'
            }}>
                <div style={{
                    width: 40,
                    height: 40,
                    border: '3px solid rgba(167, 139, 250, 0.2)',
                    borderTop: '3px solid #a78bfa',
                    borderRadius: '50%',
                    animation: 'spin 0.7s linear infinite'
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;
