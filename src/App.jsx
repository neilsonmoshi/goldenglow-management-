import React, { useState } from 'react'
import {
  LayoutDashboard, Users, Shirt, Wallet,
  Receipt, BarChart3, Settings, LogOut,
  Menu, Bell, Search, ArrowUpRight
} from 'lucide-react'

export default function App() {
  const [branch, setBranch] = useState('Kasulu')
  const [active, setActive] = useState('Dashboard')

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
          <button className="nav-item">
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
            <p>Welcome to GOLDENGLOW Management</p>
          </div>

          <div className="top-actions">
            <select value={branch} onChange={e => setBranch(e.target.value)}>
              <option>Kasulu</option>
              <option>Kigoma</option>
            </select>
            <button className="notification"><Bell size={19} /></button>
            <div className="avatar">N</div>
          </div>
        </header>

        <section className="content">
          <div className="welcome">
            <div>
              <p className="eyebrow">OVERVIEW</p>
              <h1>Good day, Nelson</h1>
              <p>Here's what's happening at GOLDENGLOW {branch}.</p>
            </div>
            <div className="date-label">OWNER ACCOUNT</div>
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
            <button className="outline-button">View all <ArrowUpRight size={16} /></button>
          </div>

          <div className="empty-state">
            <div className="empty-icon"><Shirt size={30} /></div>
            <h3>No orders to display</h3>
            <p>Customer orders will appear here after connecting the database.</p>
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
