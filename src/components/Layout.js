// src/components/Layout.js
import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Home, Map, User, Crown, History, Shield, LogOut,
  Menu, X, Bell, Activity
} from 'lucide-react';
import toast from 'react-hot-toast';

const NAV_LINKS = [
  { to: '/', icon: Home, label: 'Dashboard', exact: true },
  { to: '/map', icon: Map, label: 'Live Map' },
  { to: '/history', icon: History, label: 'SOS History' },
  { to: '/profile', icon: User, label: 'My Profile' },
  { to: '/subscription', icon: Crown, label: 'Subscription' },
];

const Layout = () => {
  const { userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      toast.success('Logged out safely');
    } catch {
      toast.error('Logout failed');
    }
  };

  const planColors = {
    free: '#6b7280',
    pro: '#3b82f6',
    premium: '#f59e0b',
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--dark)' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
            zIndex: 40, display: 'none',
          }}
          className="mobile-overlay"
        />
      )}

      {/* Sidebar */}
      <aside style={{
        width: 260,
        background: 'var(--dark-2)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0, bottom: 0, left: 0,
        zIndex: 50,
        transform: sidebarOpen ? 'translateX(0)' : undefined,
        transition: 'transform 0.3s ease',
      }}>
        {/* Logo */}
        <div style={{
          padding: '24px 20px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <div style={{
            width: 40, height: 40,
            background: 'linear-gradient(135deg, #dc2626, #991b1b)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 900,
            boxShadow: '0 0 20px rgba(220,38,38,0.4)',
          }}>⚡</div>
          <div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, letterSpacing: 3, color: '#ef4444' }}>RES-Q</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: 2, marginTop: -4 }}>EMERGENCY RESPONSE</div>
          </div>
        </div>

        {/* User info */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <div style={{
            width: 40, height: 40,
            background: 'linear-gradient(135deg, #dc2626, #7f1d1d)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, fontWeight: 700, flexShrink: 0,
          }}>
            {userProfile?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {userProfile?.name || 'User'}
            </div>
            <div style={{
              fontSize: 11,
              color: planColors[userProfile?.subscription || 'free'],
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}>
              {userProfile?.subscription || 'free'} plan
            </div>
          </div>
          {userProfile?.role === 'admin' && (
            <div style={{
              background: 'rgba(245,158,11,0.2)',
              border: '1px solid #f59e0b',
              borderRadius: 4,
              padding: '2px 6px',
              fontSize: 10,
              color: '#f59e0b',
              fontWeight: 700,
              letterSpacing: 1,
              marginLeft: 'auto',
            }}>ADMIN</div>
          )}
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {NAV_LINKS.map(({ to, icon: Icon, label, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              onClick={() => setSidebarOpen(false)}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 14px',
                borderRadius: 10,
                color: isActive ? '#ef4444' : 'rgba(255,255,255,0.6)',
                background: isActive ? 'rgba(239,68,68,0.1)' : 'transparent',
                border: isActive ? '1px solid rgba(239,68,68,0.2)' : '1px solid transparent',
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: isActive ? 600 : 400,
                transition: 'all 0.2s',
              })}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}

          {/* Admin link */}
          {userProfile?.role === 'admin' && (
            <NavLink
              to="/admin"
              onClick={() => setSidebarOpen(false)}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 14px', borderRadius: 10,
                color: isActive ? '#f59e0b' : 'rgba(255,255,255,0.6)',
                background: isActive ? 'rgba(245,158,11,0.1)' : 'transparent',
                border: isActive ? '1px solid rgba(245,158,11,0.2)' : '1px solid transparent',
                textDecoration: 'none', fontSize: 14, fontWeight: isActive ? 600 : 400,
                transition: 'all 0.2s',
              })}
            >
              <Shield size={18} />
              Admin Panel
            </NavLink>
          )}
        </nav>

        {/* Logout */}
        <div style={{ padding: '12px 12px 24px' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 14px', borderRadius: 10,
              background: 'transparent', border: '1px solid var(--border)',
              color: 'rgba(255,255,255,0.5)', cursor: 'pointer',
              fontSize: 14, fontFamily: "'Space Grotesk', sans-serif",
              transition: 'all 0.2s',
            }}
            onMouseOver={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; }}
            onMouseOut={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, marginLeft: 260, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top bar */}
        <header style={{
          height: 64,
          background: 'var(--dark-2)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          gap: 16,
          position: 'sticky',
          top: 0,
          zIndex: 30,
        }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              display: 'none', background: 'none', border: 'none',
              color: '#f0f0f0', cursor: 'pointer', padding: 4,
            }}
            className="mobile-menu-btn"
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <div style={{ flex: 1 }} />

          {/* Live indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Activity size={14} style={{ color: '#10b981' }} />
            <span style={{ fontSize: 12, color: '#10b981', fontWeight: 600 }}>SYSTEM LIVE</span>
          </div>

          {/* Notification bell */}
          <button style={{
            width: 38, height: 38, borderRadius: 8,
            background: 'var(--dark-3)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#f0f0f0',
          }}>
            <Bell size={16} />
          </button>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflow: 'auto' }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          aside { transform: translateX(-100%); }
          aside.open { transform: translateX(0); }
          .mobile-overlay { display: block !important; }
          .mobile-menu-btn { display: flex !important; }
          main > div { margin-left: 0 !important; }
          div[style*="margin-left: 260"] { margin-left: 0 !important; }
        }
      `}</style>
    </div>
  );
};

export default Layout;
