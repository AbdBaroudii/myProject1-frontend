# Task Tracker

A responsive, feature-rich Task Tracker web application built with React and integrated with a Laravel backend API. Features user authentication, task management, drag-and-drop reordering, dark mode, and comprehensive filtering capabilities.

## Features

- 🔐 **User Authentication** - Register, login, and logout with JWT token-based authentication
- ✅ **Add, Edit, Delete Tasks** - Full CRUD operations for task management via Laravel API
- 🎯 **Priority Levels** - Low, Medium, and High priority options
- 📊 **Task Status** - Open, In Progress, and Done status tracking
- 📅 **Due Dates** - Set and track task due dates
- ✅ **Task Completion** - Mark tasks as completed with visual feedback
- 🔍 **Search Functionality** - Real-time search tasks by title or description (debounced)
- 🎨 **Filtering** - Filter by priority and completion status
- 🎨 **Dark/Light Theme** - Toggle between themes with persistent preference
- 🖱️ **Drag and Drop** - Reorder tasks by dragging (client-side)
- 💾 **API Integration** - All tasks stored in Laravel backend database
- 📱 **Responsive Design** - Works seamlessly on mobile and desktop
- ♿ **Accessible** - WCAG compliant with proper ARIA labels and keyboard navigation
- ✨ **Animations** - Smooth transitions for adding/removing tasks
- ⚡ **Loading States** - Visual feedback during API operations
- 🛡️ **Error Handling** - Comprehensive error handling with user-friendly messages

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Laravel backend API running (see API documentation)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure API endpoint:
   - Create a `.env` file in the root directory
   - Add your Laravel API base URL:
   ```
   VITE_API_BASE_URL=http://localhost:8000/api
   ```
   - Or use the default: `http://localhost:8000/api`

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

5. **Login or Register:**
   - Use the demo credentials: `john@example.com` / `password`
   - Or create a new account

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
front-training/
├── src/
│   ├── components/
│   │   ├── Header.jsx          # App header with theme toggle and user info
│   │   ├── TaskForm.jsx         # Form for adding/editing tasks
│   │   ├── TaskList.jsx         # Task list with filters and search
│   │   ├── TaskItem.jsx         # Individual task item component
│   │   ├── Login.jsx            # Login component
│   │   └── Register.jsx         # Registration component
│   ├── contexts/
│   │   └── AuthContext.jsx      # Authentication context provider
│   ├── services/
│   │   └── api.js               # API service layer for Laravel backend
│   ├── hooks/
│   │   ├── useLocalStorage.js   # Custom hook for localStorage
│   │   └── useDebounce.js       # Custom hook for debouncing search
│   ├── App.jsx                  # Main application component
│   ├── main.jsx                 # Application entry point
│   └── index.css                # Global styles with Tailwind
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── .env                         # Environment variables (create from .env.example)
```

## Technologies Used

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Beautiful DnD** - Drag and drop functionality
- **React Icons** - Icon library
- **Laravel Backend API** - RESTful API for task management and authentication

## Usage

### Authentication

1. **Register**: Create a new account with name, email, and password
2. **Login**: Sign in with your email and password
3. **Logout**: Click the logout button in the header

### Task Management

1. **Adding a Task**: 
   - Fill in the title (required)
   - Add description (optional)
   - Select priority (Low/Medium/High)
   - Set due date (optional)
   - Click "Add Task"

2. **Editing a Task**: 
   - Click the "Edit" button on any task
   - Modify the fields (including status)
   - Click "Update Task"

3. **Completing a Task**: 
   - Click the circle icon next to a task to toggle between open and done status
   - Or edit the task and change the status to "Done"

4. **Deleting a Task**: 
   - Click the "Delete" button on any task
   - Task will be soft-deleted in the backend

5. **Searching**: 
   - Type in the search box to filter tasks by title or description
   - Search is debounced (waits 500ms after typing stops)

6. **Filtering**: 
   - Click the "Filters" button
   - Filter by priority (All/Low/Medium/High)
   - Filter by status (All/Pending/Completed)

7. **Reordering**: 
   - Click and drag the grip icon (⋮⋮) to reorder tasks
   - Note: Reordering is client-side only and doesn't persist to the backend

8. **Theme Toggle**: 
   - Click the sun/moon icon in the header to switch between light and dark themes
   - Preference is saved in localStorage

## API Integration

The application integrates with a Laravel backend API. All API calls are handled through the `src/services/api.js` service layer.

### API Endpoints Used

- `POST /api/register` - User registration
- `POST /api/login` - User authentication
- `POST /api/logout` - User logout
- `GET /api/tasks` - List tasks with filtering
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task

### Authentication

- JWT tokens are stored in localStorage
- Tokens are automatically included in API requests via Authorization header
- On 401 errors, users are automatically logged out

### Error Handling

- Network errors are caught and displayed to users
- Validation errors from the API are shown with field-specific messages
- 401 errors trigger automatic logout

## Environment Variables

Create a `.env` file in the root directory:

```
VITE_API_BASE_URL=http://localhost:8000/api
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### API Connection Issues

- Ensure your Laravel backend is running on the configured port
- Check CORS settings in Laravel (should allow `http://localhost:5173`)
- Verify the API base URL in `.env` file

### Authentication Issues

- Clear localStorage if experiencing token issues
- Check that the backend API is returning tokens correctly
- Verify token format matches `Bearer {token}`

### Drag and Drop Issues

- If drag-and-drop doesn't work, try removing `StrictMode` from `src/main.jsx`
- This is a known compatibility issue with React 18's StrictMode

## License

MIT

