# Admin Dashboard

A comprehensive admin dashboard for the Car Rental System with full management capabilities.

## Features

### 🏠 Dashboard Overview
- Real-time statistics (Users, Bookings, Properties, Revenue)
- Interactive charts (Revenue trends, User growth)
- Recent activity feed
- Quick access to key metrics

### 👥 User Management
- View all registered users
- Add, edit, and delete user accounts
- Search and filter users
- Role-based access control (User, Admin, Moderator)
- User status management (Active/Inactive)

### 📅 Booking Management
- View all bookings and reservations
- Manage booking statuses (Pending, Confirmed, Completed, Cancelled)
- Edit booking details
- Search and filter bookings
- Export booking data

### 🏢 Property Management
- Manage property listings
- Add new properties
- Edit property information
- Property status tracking
- Bulk operations support

### 💳 Payment Management
- Monitor payment transactions
- View payment history
- Handle refunds and disputes
- Payment method management
- Financial reporting

### 📝 Content Management
- Edit website content
- Manage pages and sections
- Content approval workflow
- SEO optimization tools

### 🖼️ Media Library
- Upload and manage images
- Organize media files
- Image optimization
- Bulk media operations

### ⭐ Review Management
- Moderate user reviews
- Manage ratings and feedback
- Review approval system
- Response management

### ⚙️ System Settings
- General site configuration
- Security settings (2FA, session management)
- Email configuration
- API settings

### 🔒 Security Center
- User access logs
- Security audit trails
- IP blocking/whitelisting
- Password policies

### 📊 Analytics & Reports
- User engagement metrics
- Booking analytics
- Revenue reports
- Performance dashboards
- Export capabilities

### 📋 System Logs
- Activity logging
- Error monitoring
- System health checks
- Audit trails

## Technical Features

### 🎨 Modern UI/UX
- Responsive design for all devices
- Dark/light theme support
- Smooth animations and transitions
- Intuitive navigation

### 🔧 Advanced Functionality
- Real-time data updates
- Interactive charts and graphs
- Advanced search and filtering
- Bulk operations
- Export capabilities

### 🛡️ Security Features
- Role-based access control
- Session management
- Activity logging
- Secure authentication

### 📱 Mobile Responsive
- Optimized for tablets and phones
- Touch-friendly interface
- Collapsible sidebar for mobile

## File Structure

```
admin/dashboard/
├── index.html          # Main dashboard page
├── dashboard.css       # Dashboard styling
└── dashboard.js        # Dashboard functionality
```

## Usage

1. Access via admin login: `admin/admin-login.html`
2. Navigate through different sections using the sidebar
3. Use search and filters to find specific data
4. Perform CRUD operations on users, bookings, etc.
5. Monitor system health and analytics

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Dependencies

- Chart.js for data visualization
- Font Awesome for icons
- Google Fonts (Inter)

## Security Notes

- All admin actions are logged
- Session timeout after inactivity
- Two-factor authentication support
- Secure password policies enforced