import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../stores/AuthStore';

export function Login() {
    const [formData, setFormData] = useState({ userNameOrEmail: '', password: '' });
    const { login, isLoading, error } = useLogin();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(formData); // Awaits state update
            navigate('/admin/', { replace: true }); // 🔥 FIX: Redirect to rooms route post-login
        } catch (err) {
            console.error('Login error:', err);
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
                            className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500"
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
                            className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500"
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