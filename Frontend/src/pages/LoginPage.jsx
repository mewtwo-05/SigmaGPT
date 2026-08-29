import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import './AuthPage.css';

function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const [error, setError]       = useState('');
    const [loading, setLoading]   = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email.trim() || !password.trim()) {
            setError('Please fill in all fields.');
            return;
        }

        setLoading(true);
        try {
            await login(email.trim(), password);
            navigate('/'); // redirect to chat on success
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                {/* Brand */}
                <div className="auth-brand">
                    <div className="auth-logo">SigmaGPT</div>
                    <div className="auth-tagline">Your AI-powered thinking partner</div>
                </div>

                <h1 className="auth-title">Welcome back</h1>
                <p className="auth-subtitle">Sign in to continue your conversations</p>

                <form className="auth-form" onSubmit={handleSubmit} noValidate>
                    {error && (
                        <div className="auth-error" role="alert">
                            ⚠ {error}
                        </div>
                    )}

                    <div className="auth-field">
                        <label className="auth-label" htmlFor="login-email">Email</label>
                        <input
                            id="login-email"
                            className="auth-input"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label className="auth-label" htmlFor="login-password">Password</label>
                        <input
                            id="login-password"
                            className="auth-input"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    <button id="login-submit-btn" className="auth-btn" type="submit" disabled={loading}>
                        {loading && <span className="auth-btn-spinner" />}
                        {loading ? 'Signing in…' : 'Sign In'}
                    </button>
                </form>

                <div className="auth-divider">or</div>

                <p className="auth-switch">
                    Don&apos;t have an account?{' '}
                    <Link to="/register">Create one</Link>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;
