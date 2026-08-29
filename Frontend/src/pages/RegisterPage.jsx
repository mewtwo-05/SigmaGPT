import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import './AuthPage.css';

function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [name, setName]         = useState('');
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm]   = useState('');
    const [error, setError]       = useState('');
    const [loading, setLoading]   = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!name.trim() || !email.trim() || !password.trim() || !confirm.trim()) {
            setError('Please fill in all fields.');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        if (password !== confirm) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            await register(name.trim(), email.trim(), password);
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

                <h1 className="auth-title">Create your account</h1>
                <p className="auth-subtitle">Start your AI journey today — it&apos;s free</p>

                <form className="auth-form" onSubmit={handleSubmit} noValidate>
                    {error && (
                        <div className="auth-error" role="alert">
                            ⚠ {error}
                        </div>
                    )}

                    <div className="auth-field">
                        <label className="auth-label" htmlFor="reg-name">Full Name</label>
                        <input
                            id="reg-name"
                            className="auth-input"
                            type="text"
                            placeholder="Saurabh Chopade"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoComplete="name"
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label className="auth-label" htmlFor="reg-email">Email</label>
                        <input
                            id="reg-email"
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
                        <label className="auth-label" htmlFor="reg-password">Password</label>
                        <input
                            id="reg-password"
                            className="auth-input"
                            type="password"
                            placeholder="At least 6 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="new-password"
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label className="auth-label" htmlFor="reg-confirm">Confirm Password</label>
                        <input
                            id="reg-confirm"
                            className="auth-input"
                            type="password"
                            placeholder="Repeat your password"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            autoComplete="new-password"
                            required
                        />
                    </div>

                    <button id="register-submit-btn" className="auth-btn" type="submit" disabled={loading}>
                        {loading && <span className="auth-btn-spinner" />}
                        {loading ? 'Creating account…' : 'Create Account'}
                    </button>
                </form>

                <div className="auth-divider">or</div>

                <p className="auth-switch">
                    Already have an account?{' '}
                    <Link to="/login">Sign in</Link>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;
