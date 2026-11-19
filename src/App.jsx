import React, { useEffect, useState } from 'react'
import {
  LayoutDashboard, Users, Shirt, Wallet,
  Receipt, BarChart3, Settings, LogOut,
  Menu, Bell, ArrowUpRight, LockKeyhole
} from 'lucide-react'
import { supabase } from './supabase'

export default function App() {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [branch, setBranch] = useState('Kasulu')
  const [active, setActive] = useState('Dashboard')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setSession(data.session)
        setLoading(false)
      }
    })

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
      })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    async function getProfile() {
      if (!session?.user) {
        setProfile(null)
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, role')
        .eq('id', session.user.id)
        .single()

      if (error) {
        setError('Account profile not found. Please contact the owner.')
        setProfile(null)
      } else {
        setError('')
        setProfile(data)
      }
    }

    getProfile()
  }, [session])

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    setBusy(true)

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    })

    if (error) setError(error.message)
    setBusy(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setProfile(null)
    setPassword('')
  }

  if (loading) {
    return <div className="login-screen">Loading GOLDENGLOW...</div>
  }

  if (!session) {
    return (
      <div className="login-screen">
        <form className="login-card" onSubmit={handleLogin}>
          <div className="login-logo">G</div>
          <h1>GOLDENGLOW</h1>
          <p className="login-subtitle">CLEANING SERVICES MANAGEMENT</p>

          <h2>Welcome Back</h2>
          <p className="login-description">
            Sign in to manage your branch.
          </p>

          <label>Select Branch</label>
          <select
            value={branch}
            onChange={e => setBranch(e.target.value)}
          >
            <option value="Kasulu">Kasulu Branch</option>
            <option value="Kigoma">Kigoma Branch</option>
          </select>

          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          {error && <div className="login-error">{error}</div>}

          <button className="login-button" disabled={busy}>
            <LockKeyhole size={17} />
            {busy ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="login-footer">
            We collect, we clean, we deliver.
          </p>
        </form>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="login-screen">
        {error || 'Loading your account...'}
        <button onClick={handleLogout}>Sign out</button>
      </div>
    )
  }

  const navigation = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Customers', icon: Users },
    { name: 'Orders', icon: Shirt },
    { name: 'Payments', icon: Wallet },
    { name: 'Expenses', icon: Receipt },
    { name: 'Reports', icon: BarChart3 },
    { name: 'Settings', icon: Settings }
  ]

  const stats = [
    { title: 'Total Customers', value: '—', icon: Users },
    { title: 'Total Orders', value: '—', icon: Shirt },
    { title: 'Total Revenue', value: 'TSh —', icon: Wallet },
    { title: 'Total Expenses', value: 'TSh —', icon: Receipt }
  ]

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">G</div>
          <div>
            <h2>GOLDENGLOW</h2>
            <small>MANAGEMENT SYSTEM</small>
          </div>
        </div>

        <p className="menu-label">MAIN MENU</p>

        <nav>
          {navigation.map(item => {
            const Icon = item.icon
            return (
              <button
                key={item.name}
                className={active === item.name ? 'nav-item active' : 'nav-item'}
                onClick={() => setActive(item.name)}
              >
                <Icon size={19} />
                <span>{item.name}</span>
              </button>
            )
          })}
        </nav>

        <div className="sidebar-bottom">
          <button className="nav-item" onClick={handleLogout}>
            <LogOut size={19} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="mobile-menu"><Menu /></button>
          <div>
            <h2>{active}</h2>
            <p>GOLDENGLOW Management</p>
          </div>

          <div className="top-actions">
            <select value={branch} onChange={e => setBranch(e.target.value)}>
              <option value="Kasulu">Kasulu</option>
              <option value="Kigoma">Kigoma</option>
            </select>
            <button className="notification"><Bell size={19} /></button>
            <div className="avatar">
              {(profile.full_name || 'G').charAt(0)}
            </div>
          </div>
        </header>

        <section className="content">
          <div className="welcome">
            <div>
              <p className="eyebrow">OVERVIEW</p>
              <h1>Welcome, {profile.full_name}</h1>
              <p>
                {profile.role} · {branch} Branch
              </p>
            </div>
            <div className="date-label">
              {profile.role?.toUpperCase()}
            </div>
          </div>

          <div className="stats-grid">
            {stats.map(stat => {
              const Icon = stat.icon
              return (
                <div className="stat-card" key={stat.title}>
                  <div className="stat-top">
                    <span>{stat.title}</span>
                    <Icon size={21} />
                  </div>
                  <h2>{stat.value}</h2>
                  <small>Awaiting database connection</small>
                </div>
              )
            })}
          </div>

          <div className="section-heading">
            <div>
              <h2>Recent Orders</h2>
              <p>Latest customer laundry orders</p>
            </div>
            <button className="outline-button">
              View all <ArrowUpRight size={16} />
            </button>
          </div>

          <div className="empty-state">
            <div className="empty-icon"><Shirt size={30} /></div>
            <h3>No orders to display</h3>
            <p>Orders will appear here after database connection.</p>
          </div>

          <footer>
            <strong>GOLDENGLOW CLEANING SERVICES</strong>
            <span>We collect, we clean, we deliver.</span>
          </footer>
        </section>
      </main>
    </div>
  )
}
