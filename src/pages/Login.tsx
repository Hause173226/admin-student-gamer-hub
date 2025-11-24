import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin, useAuthStore } from '../stores/AuthStore';

export function Login() {
    const [formData, setFormData] = useState({ userNameOrEmail: '', password: '' });
    const { login, isLoading, error } = useLogin();
    const { clearError } = useAuthStore();
    const navigate = useNavigate();

    // Reset loading state when component mounts (in case it was stuck)
    useEffect(() => {
        const store = useAuthStore.getState();
        if (store.isLoading) {
            useAuthStore.setState({ isLoading: false, error: null });
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (error) {
            clearError();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const loginStartTime = Date.now();
        try {
            console.log('🔐 Login attempt started...');
            await login(formData); // Awaits state update
            const loginDuration = Date.now() - loginStartTime;
            console.log(`✅ Login successful in ${loginDuration}ms`);
            
            // Navigate immediately after login - don't wait for other components
            navigate('/admin/', { replace: true });
        } catch (err) {
            const loginDuration = Date.now() - loginStartTime;
            console.error(`❌ Login failed after ${loginDuration}ms:`, err);
            // Error is already handled in AuthStore, just ensure we don't navigate
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
                <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white">SGH Admin Login</h2>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <input
                            name="userNameOrEmail"
                            type="text"
                            required
                            value={formData.userNameOrEmail}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="Username or Email"
                        />
                    </div>
                    <div>
                        <input
                            name="password"
                            type="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="Password"
                        />
                    </div>
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg disabled:opacity-50"
                    >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;