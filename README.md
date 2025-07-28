# ChronoDev - Git Development Hours Tracker

<div align="center">
  <h3>📊 Estimate development hours and visualize commit activity across GitHub repositories</h3>
  <p>A modern React dashboard using Git Hours-like heuristics for project time tracking</p>
  
  [![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
  [![Material-UI](https://img.shields.io/badge/Material--UI-5-blue.svg)](https://mui.com/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
</div>

## ✨ Features

- 🔍 **Multi-Repository Analysis** - Analyze multiple GitHub repositories simultaneously
- ⏱️ **Smart Hours Estimation** - Git Hours algorithm with session grouping and heuristics
- 📈 **Interactive Charts** - Weekly activity visualization with commits and hours metrics
- 🎨 **Beautiful Project Cards** - Modern cards showing statistics and activity levels
- 👤 **Author Filtering** - Filter commits by specific authors for solo project analysis
- 📅 **Flexible Date Ranges** - Analyze activity within custom time periods
- ⚙️ **Environment Configuration** - Pre-configure GitHub credentials and default repos
- 📱 **Responsive Design** - Material-UI interface that works on all devices
- 🚀 **Client-Only Architecture** - No backend required, runs entirely in browser

## 🚀 Quick Start

### Prerequisites

- **Node.js 16+** and npm
- **GitHub account** with repositories to analyze
- **GitHub Personal Access Token** (recommended for best experience)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/ChronoDev.git
cd ChronoDev

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your GitHub credentials

# 4. Start development server
npm start

# 5. Open browser at http://localhost:3000
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the project root:

```bash
# Required: Your GitHub username
REACT_APP_GITHUB_USERNAME=your_github_username

# Recommended: GitHub Personal Access Token
REACT_APP_GITHUB_TOKEN=ghp_your_github_personal_access_token

# Optional: Default repositories to analyze (comma-separated)
REACT_APP_DEFAULT_REPOS=repo1,repo2,repo3
```

### 🔑 GitHub Personal Access Token Setup

1. **Navigate to GitHub Settings**:
   - GitHub.com → Settings → Developer settings → Personal access tokens → Tokens (classic)

2. **Create new token**:
   - Click "Generate new token (classic)"
   - Name: `ChronoDev Dashboard`
   - Expiration: Choose your preference

3. **Select permissions**:
   - ✅ `public_repo` - For public repositories
   - ✅ `repo` - For private repositories (if needed)

4. **Copy token to `.env` file**

**🎯 Benefits of using a token:**
- 🚀 Higher rate limits (5,000 vs 60 requests/hour)
- 🔒 Access to private repositories
- ⚡ Better performance and reliability
- 📊 More accurate data for analysis

## 📖 Usage Guide

### 1. GitHub Repository Analysis

1. **Setup Access**:
   - Enter your GitHub username
   - Add your GitHub token (optional but recommended)
   - Click "Load Repositories"

2. **Select Repositories**:
   - Choose repositories from the dropdown
   - Multiple selections supported
   - Repositories sorted by recent activity

3. **Configure Analysis**:
   - Set author filter (defaults to your username)
   - Choose date range (defaults to last 6 months)
   - Click "Analyze Selected Repositories"

### 2. Understanding Results

#### 📊 Summary Dashboard
- **Total Projects** - Number of repositories analyzed
- **Total Commits** - Sum of all commits in selected period
- **Estimated Hours** - Total estimated development time
- **Inactive Projects** - Projects without recent commits (>2 weeks)

#### 📈 Weekly Activity Charts
- **Interactive Visualization** - Switch between line, bar, and area charts
- **Metric Toggle** - View commits or estimated hours per week
- **Project Filtering** - Show/hide specific projects
- **Detailed Tooltips** - Hover for weekly statistics

#### 🎨 Project Cards
- **Activity Level** - Visual indicator (High/Medium/Low/Very Low)
- **Key Statistics** - Commits, hours, and coding sessions
- **Last Commit Info** - Recent activity and commit messages
- **Progress Visualization** - Activity level progress bars

## 🧮 Algorithm Details

### Git Hours Estimation Method

ChronoDev implements a sophisticated Git Hours-like algorithm:

```
1. 📥 Fetch Commits → 2. 🔗 Group Sessions → 3. ⏱️ Calculate Hours → 4. 📊 Weekly Stats
```

**Session Grouping Logic:**
- Commits within 2 hours = Same coding session
- Gaps > 2 hours = New session starts
- Each session gets base time (2 hours) + inter-commit time
- Heuristic adjustments for commit patterns

**Activity Classification:**
- 🔥 **High Activity**: ≥50 hours
- 🟡 **Medium Activity**: 20-49 hours
- 🔵 **Low Activity**: 5-19 hours
- ⚪ **Very Low Activity**: <5 hours

## 🏗️ Project Structure

```
src/
├── components/
│   ├── dashboard/          # Main dashboard components
│   ├── repository/         # Repository selection & cards
│   ├── charts/            # Data visualization components
│   └── common/            # Reusable UI components
├── hooks/                 # Custom React hooks
│   └── useDashboard.js    # Main dashboard state management
├── services/              # API services & business logic
│   └── GitHubService.js   # GitHub API integration
├── utils/                 # Utility functions
├── constants/             # Application constants
└── App.js                 # Main application component
```

## 🛠️ Development

### Available Scripts

```bash
npm start          # Start development server
npm test           # Run test suite
npm run build      # Build for production
npm run eject      # Eject from Create React App
```

### 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Generate coverage report
npm test -- --coverage
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Netlify/Vercel

1. **Build the project**: `npm run build`
2. **Deploy the `build/` folder** to your hosting platform
3. **Set environment variables** in your hosting platform's dashboard

## 🔧 Technologies Used

| Category | Technology | Version |
|----------|------------|----------|
| **Frontend** | React | 18+ |
| **UI Library** | Material-UI (MUI) | 5+ |
| **Charts** | Recharts | Latest |
| **HTTP Client** | Axios | Latest |
| **Date Handling** | Moment.js | Latest |
| **Build Tool** | Create React App | Latest |
| **API** | GitHub REST API | v3 |

## ⚠️ Limitations & Considerations

- 📊 **Estimation Accuracy**: Hours are approximate, based on heuristics
- 🌐 **Internet Required**: Needs connection for GitHub API
- 🔄 **Rate Limits**: 60 requests/hour without token, 5,000 with token
- 🔒 **Client-Side Security**: GitHub token processed in browser
- 📱 **Browser Compatibility**: Modern browsers required

## 🗺️ Roadmap

- [ ] 📁 Local Git repository analysis
- [ ] 📤 Export functionality (CSV, JSON, PDF)
- [ ] 👥 Team collaboration features
- [ ] 🔍 Advanced filtering and search
- [ ] ⚙️ Custom estimation algorithms
- [ ] 🔗 Integration with time tracking tools
- [ ] 📱 Progressive Web App (PWA)
- [ ] 🌙 Dark mode theme
- [ ] 📊 Advanced analytics and insights

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### 📝 Development Guidelines

- Follow React best practices and hooks patterns
- Use Material-UI components consistently
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Issues

If you encounter any issues or have questions:

1. 🔍 **Check existing issues**: [GitHub Issues](https://github.com/yourusername/ChronoDev/issues)
2. 🐛 **Report bugs**: Create a new issue with detailed information
3. 💡 **Feature requests**: Open an issue with the "enhancement" label
4. 📧 **Direct contact**: [your-email@example.com]

### 🐛 Bug Report Template

```
**Environment:**
- OS: [e.g., macOS, Windows, Linux]
- Browser: [e.g., Chrome, Firefox, Safari]
- Node.js version: [e.g., 18.0.0]

**Steps to Reproduce:**
1. Go to '...'
2. Click on '....'
3. See error

**Expected Behavior:**
A clear description of what you expected to happen.

**Actual Behavior:**
A clear description of what actually happened.

**Screenshots:**
If applicable, add screenshots to help explain your problem.
```

## 🙏 Acknowledgments

- 💡 **Inspired by**: [Git Hours](https://github.com/kimmobrunfeldt/git-hours) by Kimmo Brunfeldt
- ⚛️ **Built with**: [Create React App](https://create-react-app.dev/)
- 🎨 **UI Components**: [Material-UI](https://mui.com/)
- 📊 **Charts**: [Recharts](https://recharts.org/)
- 🔧 **HTTP Client**: [Axios](https://axios-http.com/)
- 📅 **Date Handling**: [Moment.js](https://momentjs.com/)

---

<div align="center">
  <p>Made with ❤️ for developers who want to track their coding time</p>
  <p>⭐ Star this repo if you find it useful!</p>
</div>
