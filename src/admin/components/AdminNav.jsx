import React from 'react';
import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/admin',          icon: '◉', label: 'Home',   end: true },
  { to: '/admin/artists',  icon: '♫', label: 'DJs' },
  { to: '/admin/events',   icon: '◈', label: 'Events' },
  { to: '/admin/gallery',  icon: '▣', label: 'Photo' },
  { to: '/admin/mixes',    icon: '▶', label: 'Mixes' },
  { to: '/admin/messages',  icon: '✉', label: 'Msg',    badgeKey: 'unread' },
];

export default function AdminNav({ unread = 0 }) {
  return (
    <nav className="admin-nav">
      {NAV_ITEMS.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            `admin-nav-item${isActive ? ' admin-nav-item--active' : ''}`
          }
        >
          <span className="admin-nav-item-icon">{item.icon}</span>
          <span>{item.label}</span>
          {item.badgeKey === 'unread' && unread > 0 && (
            <span className="admin-nav-badge">{unread > 9 ? '9+' : unread}</span>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
