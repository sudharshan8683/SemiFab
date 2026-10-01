import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { apiClient } from '../api/client'
import { Eye, EyeOff } from 'lucide-react'
import { Logo } from '../components/Logo'

export const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const setToken = useAuthStore(state => state.setToken)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      const { data } = await apiClient.post('/auth/login', {
        username: username.trim(),
        password: password
      })
      setToken(data.access_token)
      navigate('/dashboard')
    } catch (err: any) {
      console.error("Login attempt error:", err)
      let msg = err.response?.data?.detail
      if (!msg && typeof err.response?.data === 'string') {
        msg = err.response.data
      }
      if (!msg) {
        msg = err.message || 'Login failed'
      }
      if (err.response?.status === 500 && !err.response?.data?.detail) {
        msg = `Backend server (port 8000) not responding. Please ensure uvicorn is running: ${msg}`
      }
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-text-primary p-4">
      <div className="w-full max-w-md bg-surface p-8 rounded-xl border border-border shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="drop-shadow-xl">
            <Logo className="w-16 h-16" />
          </div>
        </div>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-widest text-white mb-2">FABSENSE</h1>
          <h2 className="text-sm font-bold tracking-widest text-brand uppercase">Login</h2>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-status-critical/10 border border-status-critical/30 text-status-critical text-sm rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">USERNAME</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-elevated border border-border rounded p-2 text-white focus:outline-none focus:border-brand"
            />
          </div>
          <div className="relative">
            <label className="block text-xs font-semibold text-text-secondary mb-1">PASSWORD</label>
            <input 
              type={showPassword ? "text" : "password"} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-elevated border border-border rounded p-2 text-white focus:outline-none focus:border-brand pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[26px] text-text-muted hover:text-white"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand text-background font-bold py-2 rounded hover:bg-brand/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'AUTHENTICATING...' : 'LOGIN'}
          </button>
        </form>
        


        <div className="mt-6 text-center">
          <Link to="/register" className="text-brand text-sm hover:underline">
            Don't have an account? Create one
          </Link>
        </div>
      </div>
    </div>
  )
}
