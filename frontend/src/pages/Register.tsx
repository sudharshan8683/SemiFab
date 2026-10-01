import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { apiClient } from '../api/client'
import { Logo } from '../components/Logo'

export const Register = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('viewer')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    
    try {
      await apiClient.post('/auth/register', {
        username,
        email,
        password,
        role
      })
      
      setSuccess('Account created successfully! Redirecting to login...')
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed')
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
          <h2 className="text-sm font-bold tracking-widest text-brand uppercase">Create Account</h2>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-status-critical/10 border border-status-critical/30 text-status-critical text-sm rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-status-running/10 border border-status-running/30 text-status-running text-sm rounded">
            {success}
          </div>
        )}
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">USERNAME</label>
            <input 
              type="text" 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-elevated border border-border rounded p-2 text-white focus:outline-none focus:border-brand"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">EMAIL</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-elevated border border-border rounded p-2 text-white focus:outline-none focus:border-brand"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">PASSWORD</label>
            <input 
              type="password"
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-elevated border border-border rounded p-2 text-white focus:outline-none focus:border-brand"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">ROLE</label>
            <select 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-elevated border border-border rounded p-2 text-white focus:outline-none focus:border-brand"
            >
              <option value="viewer">Viewer</option>
              <option value="admin">Admin</option>
              <option value="prod_mgr">Production Manager</option>
              <option value="maint_eng">Maintenance Engineer</option>
            </select>
          </div>
          <button 
            type="submit" 
            disabled={loading || !!success}
            className="w-full bg-brand text-background font-bold py-2 rounded hover:bg-brand/90 transition-colors disabled:opacity-50 mt-4"
          >
            {loading ? 'REGISTERING...' : 'REGISTER'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-brand text-sm hover:underline">
            Already have an account? Login here
          </Link>
        </div>
      </div>
    </div>
  )
}
