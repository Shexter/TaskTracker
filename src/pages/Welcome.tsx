import { useState } from 'react';
import {
    Sparkles,
    CalendarDays,
    ListTodo,
    BarChart3,
    MessageSquare,
    Eye,
    EyeOff,
    ArrowRight,
    CheckCircle,
    Zap,
    Shield,
} from 'lucide-react';
import './Welcome.css';

interface WelcomeProps {
    onSignIn: () => void;
}

export default function Welcome({ onSignIn }: WelcomeProps) {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSignIn();
    };

    const features = [
        {
            icon: <CalendarDays size={22} />,
            title: 'Smart Calendar',
            desc: 'Day, week, month & year views with recurring task expansion',
        },
        {
            icon: <ListTodo size={22} />,
            title: 'Task Management',
            desc: 'Create, track, and complete tasks with full recurrence support',
        },
        {
            icon: <BarChart3 size={22} />,
            title: 'Analytics Dashboard',
            desc: 'Real-time metrics, completion rates, and productivity insights',
        },
        {
            icon: <MessageSquare size={22} />,
            title: 'AI Assistant',
            desc: 'Chat with your schedule — get priorities and summaries instantly',
        },
    ];

    return (
        <div className="welcome-page">
            {/* Animated background */}
            <div className="welcome-bg">
                <div className="bg-orb orb-1" />
                <div className="bg-orb orb-2" />
                <div className="bg-orb orb-3" />
                <div className="bg-grid" />
            </div>

            <div className="welcome-container">
                {/* Left - Hero */}
                <div className="welcome-hero">
                    <div className="hero-badge animate-fade-in-up">
                        <Sparkles size={14} />
                        <span>Built for productivity</span>
                    </div>

                    <h1 className="hero-title animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                        Master Your Time with
                        <span className="hero-gradient"> TaskTracker</span>
                    </h1>

                    <p className="hero-subtitle animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                        Transform your recurring tasks into a seamless workflow.
                        Plan your day, week, month, and year — all in one place.
                    </p>

                    <div className="hero-features stagger">
                        {features.map((feature, i) => (
                            <div key={i} className="hero-feature-item">
                                <div className="feature-icon-wrapper">
                                    {feature.icon}
                                </div>
                                <div className="feature-text">
                                    <span className="feature-title">{feature.title}</span>
                                    <span className="feature-desc">{feature.desc}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="hero-stats animate-fade-in-up" style={{ animationDelay: '600ms' }}>
                        <div className="stat-item">
                            <span className="stat-value">99.9%</span>
                            <span className="stat-label">Uptime</span>
                        </div>
                        <div className="stat-divider" />
                        <div className="stat-item">
                            <span className="stat-value">&lt;500ms</span>
                            <span className="stat-label">Sync Speed</span>
                        </div>
                        <div className="stat-divider" />
                        <div className="stat-item">
                            <span className="stat-value">∞</span>
                            <span className="stat-label">Task Instances</span>
                        </div>
                    </div>
                </div>

                {/* Right - Sign In Card */}
                <div className="welcome-auth animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                    <div className="auth-card glass-strong">
                        <div className="auth-logo">
                            <div className="auth-logo-icon">
                                <Sparkles size={24} />
                            </div>
                            <span className="auth-logo-text">TaskTracker</span>
                        </div>

                        <h2 className="auth-title">
                            {isSignUp ? 'Create your account' : 'Welcome back'}
                        </h2>
                        <p className="auth-subtitle">
                            {isSignUp
                                ? 'Start managing your tasks in seconds'
                                : 'Sign in to continue to your dashboard'}
                        </p>

                        <form className="auth-form" onSubmit={handleSubmit}>
                            <div className="auth-field">
                                <label>Email</label>
                                <input
                                    type="email"
                                    className="auth-input"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="auth-field">
                                <label>Password</label>
                                <div className="auth-input-wrapper">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className="auth-input"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="auth-eye-btn"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            {!isSignUp && (
                                <div className="auth-forgot">
                                    <a href="#">Forgot password?</a>
                                </div>
                            )}

                            <button type="submit" className="auth-submit-btn">
                                {isSignUp ? 'Create Account' : 'Sign In'}
                                <ArrowRight size={16} />
                            </button>
                        </form>

                        <div className="auth-divider">
                            <span>or</span>
                        </div>

                        <button className="auth-demo-btn" onClick={onSignIn}>
                            <Zap size={16} />
                            Continue with Demo Account
                        </button>

                        <div className="auth-switch">
                            {isSignUp ? (
                                <span>
                                    Already have an account?{' '}
                                    <button onClick={() => setIsSignUp(false)}>Sign in</button>
                                </span>
                            ) : (
                                <span>
                                    Don't have an account?{' '}
                                    <button onClick={() => setIsSignUp(true)}>Sign up</button>
                                </span>
                            )}
                        </div>

                        <div className="auth-trust">
                            <div className="trust-item">
                                <Shield size={12} />
                                <span>JWT Secured</span>
                            </div>
                            <div className="trust-item">
                                <CheckCircle size={12} />
                                <span>End-to-end encrypted</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
