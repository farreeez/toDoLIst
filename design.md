# ToDo List Application Design Document

## 1. Introduction

This document serves as a comprehensive guide for building a ToDo List application with a React (TypeScript) frontend and a C# .NET Web API backend. The goal is to provide detailed design decisions and technical steps, allowing you to focus purely on the implementation and learning the technologies (TypeScript, React, C#) without getting bogged down in architectural choices.

We will adopt best practices and conventions to ensure a clean, maintainable, and scalable application structure.

## 2. Overall Project Structure (Monorepo)

To manage both the frontend and backend components within a single repository, we will use a monorepo approach. This helps keep related projects together, simplifies dependency management (if using tools like Lerna or Yarn Workspaces, though not strictly necessary for this project), and ensures a consistent development environment.

Your existing React project will form the base of the `frontend` directory, and we will create a new `backend` directory for the C# Web API.

```
ToDoList/
├── frontend/             # Your existing React/TypeScript project
│   ├── public/
│   ├── src/
│   ├── ... (other frontend files like package.json, tsconfig.json, vite.config.ts)
├── backend/              # New C# .NET Web API project
│   ├── Controllers/
│   ├── Data/
│   ├── DTOs/
│   ├── Migrations/
│   ├── Models/
│   ├── Services/
│   ├── ... (other backend files like .csproj, appsettings.json)
├── design.md             # This document
├── .gitignore
├── instructions.txt
├── package.json
├── ... (other root-level configuration files)
```

## 3. Frontend Design (React with TypeScript)

The frontend will be built using React with TypeScript, providing a robust and type-safe development experience.

### 3.1 Project Setup

Your current project already provides the React with TypeScript boilerplate. The first step is to organize it within the monorepo structure:

1.  **Create the `frontend` directory:** In your `ToDoList` root directory, create a new folder named `frontend`.
2.  **Move existing files:** Move all files and folders related to your current React project (e.g., `public`, `src`, `package.json`, `package-lock.json`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `vite.config.ts`, `eslint.config.js`, `index.html`, `App.css`, `index.css`, `main.tsx`, `App.tsx`, `vite.svg`, `react.svg`) into the newly created `frontend` directory.
3.  **Update scripts (if necessary):** If you run npm commands from the `ToDoList` root, you'll need to `cd frontend` first. For example:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
    Alternatively, you can adjust your root `package.json` (if you plan to keep one) to include scripts like `"frontend:dev": "npm --prefix frontend run dev"`.

### 3.2 Core Dependencies

We will rely on a few key libraries to build out the frontend functionality:

*   **React & TypeScript:** (Already set up) These form the core of our application, providing a component-based UI and type safety.
*   **`react-router-dom`:** For client-side routing, allowing us to navigate between different "pages" or views without full page reloads.
    *   **Installation:** `npm install react-router-dom`
*   **`axios`:** A popular, promise-based HTTP client for making requests to the backend API. While `fetch` is built-in, `axios` offers a slightly nicer API, automatic JSON parsing, and better error handling.
    *   **Installation:** `npm install axios`
*   **State Management (React Context API):** For managing application-wide state (like the list of ToDo items, user authentication status, etc.). For a project of this scope, React's built-in Context API is often sufficient and avoids external library overhead. If the application grows significantly, you might consider libraries like Zustand or Redux Toolkit, but start with Context.

### 3.3 Folder Structure within `frontend/src`

A well-organized `src` directory is crucial for maintainability. Here's a recommended structure:

```
frontend/
└── src/
    ├── api/                # Functions for interacting with the backend API
    │   └── todoApi.ts      # Functions for fetching, adding, updating, deleting todos
    ├── components/         # Reusable UI components (e.g., buttons, input fields, cards)
    │   ├── ui/             # Generic, presentational components (e.g., Button.tsx, Input.tsx)
    │   └── common/         # Components specific to the app but reusable across pages
    │       ├── TodoItem.tsx
    │       └── TodoList.tsx
    ├── contexts/           # React Context providers for global state
    │   └── TodoContext.tsx # Manages the list of todos and related actions
    ├── hooks/              # Custom React hooks for reusable logic
    │   └── useTodos.ts     # A hook to interact with TodoContext (or API directly)
    ├── pages/              # Top-level components representing different routes/views
    │   ├── HomePage.tsx    # Displays the main todo list and input form
    │   └── NotFoundPage.tsx
    ├── types/              # TypeScript type definitions and interfaces
    │   └── todo.ts         # Defines the TodoItem interface and related types
    ├── utils/              # Utility functions (e.g., date formatting, validators)
    ├── App.tsx             # Main application component, sets up routing
    ├── main.tsx            # Entry point for the React application
    ├── index.css           # Global styles
    └── ... (other root-level src files)
```

### 3.4 Component Design Principles

*   **Atomic Design:** Think about breaking your UI into small, reusable components (atoms, molecules, organisms, templates, pages). This promotes reusability and maintainability.
*   **Single Responsibility Principle:** Each component should ideally do one thing well.
*   **Presentational vs. Container Components:**
    *   **Presentational (or Dumb) Components:** Focus solely on how things look. They receive data and callbacks via props and have no direct dependency on the application's state management. (e.g., `TodoItem`, `Button`).
    *   **Container (or Smart) Components):** Focus on how things work. They manage state, fetch data, and pass data/callbacks to presentational components. (e.g., `TodoListContainer`, `HomePage`).

**Examples of Components for a ToDo App:**

*   `ui/Button.tsx`: A generic button component.
*   `ui/Input.tsx`: A generic text input field.
*   `common/TodoItem.tsx`: Displays a single ToDo item (title, checkbox, delete button).
*   `common/TodoList.tsx`: Renders a list of `TodoItem` components.
*   `common/AddTodoForm.tsx`: Input form for adding new todos.
*   `layout/Header.tsx`, `layout/Footer.tsx`: For common layout elements.
*   `pages/HomePage.tsx`: Orchestrates `AddTodoForm` and `TodoList`.

### 3.5 API Integration

All communication with the backend will go through a dedicated `api` layer.

1.  **Define Types:** Start by defining your `TodoItem` type in `frontend/src/types/todo.ts` to match the backend model.

    ```typescript
    // frontend/src/types/todo.ts
    export interface TodoItem {
      id: string; // or number, depending on backend ID type
      title: string;
      isCompleted: boolean;
      createdAt: string; // ISO date string
    }

    export interface CreateTodoItemDto {
      title: string;
    }
    ```

2.  **Create API Client:** In `frontend/src/api/todoApi.ts`, create functions to encapsulate API calls using `axios`.

    ```typescript
    // frontend/src/api/todoApi.ts
    import axios from 'axios';
    import { TodoItem, CreateTodoItemDto } from '../types/todo';

    const API_BASE_URL = 'http://localhost:5000/api'; // Update with your backend URL

    export const getTodos = async (): Promise<TodoItem[]> => {
      const response = await axios.get<TodoItem[]>(`${API_BASE_URL}/todos`);
      return response.data;
    };

    export const createTodo = async (newTodo: CreateTodoItemDto): Promise<TodoItem> => {
      const response = await axios.post<TodoItem>(`${API_BASE_URL}/todos`, newTodo);
      return response.data;
    };

    export const updateTodo = async (id: string, updatedTodo: TodoItem): Promise<TodoItem> => {
      const response = await axios.put<TodoItem>(`${API_BASE_URL}/todos/${id}`, updatedTodo);
      return response.data;
    };

    export const deleteTodo = async (id: string): Promise<void> => {
      await axios.delete(`${API_BASE_URL}/todos/${id}`);
    };
    ```

3.  **Integrate with Components/Context:** Use these API functions within your Context providers or custom hooks to fetch and manipulate data, updating the local state accordingly. Handle loading, success, and error states appropriately.

### 3.6 Routing

Use `react-router-dom` to manage navigation within your single-page application.

1.  **Setup in `App.tsx`:**

    ```typescript
    // frontend/src/App.tsx
    import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
    import HomePage from './pages/HomePage';
    import NotFoundPage from './pages/NotFoundPage';
    // Import your TodoContextProvider here

    function App() {
      return (
        // <TodoContextProvider> // Wrap with your context provider
          <Router>
            <div className="App">
              {/* Optional: Header goes here */}
              <Routes>
                <Route path="/" element={<HomePage />} />
                {/* Potentially other routes, e.g., /todo/:id for details */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
              {/* Optional: Footer goes here */}
            </div>
          </Router>
        // </TodoContextProvider>
      );
    }

    export default App;
    ```

### 3.7 Styling

You have several options for styling your React application:

*   **CSS Modules (Recommended for component-scoped styles):** This is often the default with Vite. It allows you to write regular CSS, but scopes it to specific components to prevent style collisions. (e.g., `ComponentName.module.css`).
*   **Global CSS:** For base styles and utilities (`index.css`).
*   **Tailwind CSS:** A utility-first CSS framework that allows for rapid UI development by composing utility classes directly in your markup. (Requires installation and configuration).
*   **Styled Components / Emotion:** CSS-in-JS libraries for writing component-scoped styles directly in your JavaScript/TypeScript files.

For this project, a combination of global CSS (for resets/base styles) and CSS Modules (for component-specific styles) is a good, straightforward approach.

## 4. Backend Design (C# .NET Web API)

The backend will be a C# .NET Web API, providing RESTful endpoints for managing ToDo items. We will follow common architectural patterns to ensure a clean separation of concerns.

### 4.1 Project Setup

1.  **Install .NET SDK:** Ensure you have the latest .NET SDK installed (e.g., .NET 8). You can download it from the official Microsoft website.
2.  **Create the `backend` directory:** In your `ToDoList` root directory, create a new folder named `backend`.
3.  **Create Web API project:** Open your terminal in the `ToDoList/backend` directory and run:
    ```bash
    dotnet new webapi -n ToDoList.Api
    ```
    This creates a new Web API project named `ToDoList.Api` inside the `backend` folder. You can rename `ToDoList.Api` to simply `backend` if you prefer, or keep it as a solution name. For simplicity, let's assume the project name is `backend`.
    So your `backend` directory will contain `backend.csproj` and other generated files.
4.  **Install Entity Framework Core packages:**
    ```bash
    cd backend # Ensure you are in the backend project directory
    dotnet add package Microsoft.EntityFrameworkCore.Design
    dotnet add package Microsoft.EntityFrameworkCore.Sqlite # Or .SqlServer for SQL Server
    dotnet add package AutoMapper.Extensions.Microsoft.DependencyInjection # For DTO mapping
    ```

### 4.2 Folder Structure within `backend`

Adhering to best practices for a clean architecture, the `backend` project will have the following structure:

```
backend/
├── Controllers/            # API endpoints that handle HTTP requests
│   └── TodosController.cs  # Manages ToDo item related API requests
├── Data/                   # Database context and repository implementations
│   ├── ApplicationDbContext.cs # EF Core DbContext for database interaction
│   └── Repositories/       # Implementations of generic and specific repositories
│       ├── IRepository.cs  # Generic repository interface
│       ├── Repository.cs   # Generic repository implementation
│       ├── ITodoRepository.cs # Specific interface for TodoItem operations
│       └── TodoRepository.cs # Specific implementation for TodoItem operations
├── DTOs/                   # Data Transfer Objects for API request/response models
│   ├── TodoItemDto.cs      # Represents a ToDo item for API output
│   └── CreateTodoItemDto.cs # Represents data for creating a new ToDo item
│   └── UpdateTodoItemDto.cs # Represents data for updating an existing ToDo item
├── Migrations/             # EF Core database migration files (auto-generated)
├── Models/                 # Domain models (entities) representing database tables
│   └── TodoItem.cs         # Represents a single ToDo item in the database
├── Services/               # Business logic layer, orchestrates repositories
│   ├── IService.cs         # Generic service interface
│   ├── Service.cs          # Generic service implementation
│   ├── ITodoService.cs     # Specific interface for TodoItem business logic
│   └── TodoService.cs      # Specific implementation for TodoItem business logic
├── MappingProfile.cs       # AutoMapper profile for DTO to Model mapping
├── Program.cs              # Application entry point, configures services and middleware
├── appsettings.json        # Application configuration settings (e.g., database connection strings)
└── ... (other project files like .csproj)
```

### 4.3 Database Setup (Entity Framework Core)

We'll use Entity Framework Core (EF Core) as our Object-Relational Mapper (ORM) to interact with the database.

1.  **Database Choice:**
    *   **SQLite (Recommended for development):** Simple, file-based, zero-configuration database, excellent for local development and learning.
    *   **SQL Server (Recommended for production/scalability):** A more robust RDBMS.
    We will proceed with SQLite for simplicity in this guide.

2.  **`TodoItem` Model:**
    Define your entity that maps to a database table.

    ```csharp
    // backend/Models/TodoItem.cs
    using System;
    using System.ComponentModel.DataAnnotations;

    namespace ToDoList.Api.Models
    {
        public class TodoItem
        {
            [Key]
            public Guid Id { get; set; } // Using Guid for unique identifiers
            
            [Required]
            [MaxLength(200)]
            public string Title { get; set; }

            public bool IsCompleted { get; set; } = false;

            public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        }
    }
    ```

3.  **`ApplicationDbContext`:**
    This class is the bridge between your application and the database.

    ```csharp
    // backend/Data/ApplicationDbContext.cs
    using Microsoft.EntityFrameworkCore;
    using ToDoList.Api.Models;

    namespace ToDoList.Api.Data
    {
        public class ApplicationDbContext : DbContext
        {
            public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
                : base(options)
            {
            }

            public DbSet<TodoItem> TodoItems { get; set; }

            protected override void OnModelCreating(ModelBuilder modelBuilder)
            {
                base.OnModelCreating(modelBuilder);
                // Seed data or configure model properties if needed
                // modelBuilder.Entity<TodoItem>().HasData(
                //     new TodoItem { Id = Guid.NewGuid(), Title = "Learn C#", IsCompleted = false },
                //     new TodoItem { Id = Guid.NewGuid(), Title = "Build React App", IsCompleted = true }
                // );
            }
        }
    }
    ```

4.  **Configure DbContext in `Program.cs`:**
    Add the database context to the dependency injection container.

    ```csharp
    // backend/Program.cs (excerpt)
    using Microsoft.EntityFrameworkCore;
    using ToDoList.Api.Data;

    var builder = WebApplication.CreateBuilder(args);

    // Add services to the container.
    // ...

    // Configure SQLite for development
    builder.Services.AddDbContext<ApplicationDbContext>(options =>
        options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

    var app = builder.Build();

    // Apply migrations on startup (for development)
    using (var scope = app.Services.CreateScope())
    {
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        db.Database.Migrate();
    }
    // ...
    ```

5.  **Add Connection String to `appsettings.json`:**

    ```json
    // backend/appsettings.json
    {
      "Logging": {
        "LogLevel": {
          "Default": "Information",
          "Microsoft.AspNetCore": "Warning"
        }
      },
      "AllowedHosts": "*",
      "ConnectionStrings": {
        "DefaultConnection": "DataSource=ToDoList.db" // SQLite database file
      }
    }
    ```

6.  **EF Core Migrations:**
    Migrations allow you to evolve your database schema as your `Models` change.

    *   **Initial Migration:** Open your terminal in the `ToDoList/backend` directory and run:
        ```bash
        dotnet ef migrations add InitialCreate -o Data/Migrations
        ```
        This command creates a `Migrations` folder with a snapshot of your current `DbContext` schema.
    *   **Apply Migration:**
        ```bash
        dotnet ef database update
        ```
        This command applies the pending migrations to your database, creating the `ToDoList.db` file and the `TodoItems` table.

### 4.4 DTOs (Data Transfer Objects)

DTOs are simple classes used to transfer data between process boundaries (e.g., between the client and the server). They help to:
*   **Decouple:** Separate your domain models from your API contract.
*   **Shape Data:** Provide only the necessary data for a given operation, preventing over-fetching or over-posting.
*   **Validate:** Apply validation attributes relevant to API input.

```csharp
// backend/DTOs/TodoItemDto.cs
using System;

namespace ToDoList.Api.DTOs
{
    public class TodoItemDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
```

```csharp
// backend/DTOs/CreateTodoItemDto.cs
using System.ComponentModel.DataAnnotations;

namespace ToDoList.Api.DTOs
{
    public class CreateTodoItemDto
    {
        [Required]
        [StringLength(200, MinimumLength = 1)]
        public string Title { get; set; }
    }
}
```

```csharp
// backend/DTOs/UpdateTodoItemDto.cs
using System;
using System.ComponentModel.DataAnnotations;

namespace ToDoList.Api.DTOs
{
    public class UpdateTodoItemDto
    {
        [Required]
        public Guid Id { get; set; }
        [Required]
        [StringLength(200, MinimumLength = 1)]
        public string Title { get; set; }
        public bool IsCompleted { get; set; }
    }
}
```

### 4.5 Repository Pattern

The repository pattern abstracts the data access layer, making your code more modular and testable.

1.  **Generic Interface:**

    ```csharp
    // backend/Data/Repositories/IRepository.cs
    using System;
    using System.Collections.Generic;
    using System.Linq.Expressions;
    using System.Threading.Tasks;

    namespace ToDoList.Api.Data.Repositories
    {
        public interface IRepository<T> where T : class
        {
            Task<IEnumerable<T>> GetAllAsync();
            Task<T> GetByIdAsync(Guid id);
            Task AddAsync(T entity);
            Task UpdateAsync(T entity);
            Task DeleteAsync(Guid id);
            Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);
        }
    }
    ```

2.  **Generic Implementation:**

    ```csharp
    // backend/Data/Repositories/Repository.cs
    using Microsoft.EntityFrameworkCore;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Linq.Expressions;
    using System.Threading.Tasks;

    namespace ToDoList.Api.Data.Repositories
    {
        public class Repository<T> : IRepository<T> where T : class
        {
            protected readonly ApplicationDbContext _context;
            protected readonly DbSet<T> _dbSet;

            public Repository(ApplicationDbContext context)
            {
                _context = context;
                _dbSet = context.Set<T>();
            }

            public async Task<IEnumerable<T>> GetAllAsync()
            {
                return await _dbSet.ToListAsync();
            }

            public async Task<T> GetByIdAsync(Guid id)
            {
                return await _dbSet.FindAsync(id);
            }

            public async Task AddAsync(T entity)
            {
                await _dbSet.AddAsync(entity);
                await _context.SaveChangesAsync();
            }

            public async Task UpdateAsync(T entity)
            {
                _context.Entry(entity).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }

            public async Task DeleteAsync(Guid id)
            {
                var entity = await _dbSet.FindAsync(id);
                if (entity != null)
                {
                    _dbSet.Remove(entity);
                    await _context.SaveChangesAsync();
                }
            }

            public async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate)
            {
                return await _dbSet.Where(predicate).ToListAsync();
            }
        }
    }
    ```

3.  **Specific `ITodoRepository` and `TodoRepository` (Optional, for specific operations):**
    For a simple CRUD app, the generic repository might be enough. However, if you need specific methods for `TodoItem` not covered by the generic `IRepository`, you'd create these.

    ```csharp
    // backend/Data/Repositories/ITodoRepository.cs
    using ToDoList.Api.Models;

    namespace ToDoList.Api.Data.Repositories
    {
        public interface ITodoRepository : IRepository<TodoItem>
        {
            // Add any TodoItem-specific methods here if needed
            // Example: Task<IEnumerable<TodoItem>> GetCompletedTodosAsync();
        }
    }
    ```

    ```csharp
    // backend/Data/Repositories/TodoRepository.cs
    using ToDoList.Api.Models;

    namespace ToDoList.Api.Data.Repositories
    {
        public class TodoRepository : Repository<TodoItem>, ITodoRepository
        {
            public TodoRepository(ApplicationDbContext context) : base(context)
            {
            }
            // Implement TodoItem-specific methods here
        }
    }
    ```

### 4.6 Services (Business Logic)

The service layer contains your application's business rules and orchestrates operations involving one or more repositories.

1.  **Generic Service (Optional, but good for consistency):**

    ```csharp
    // backend/Services/IService.cs
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    namespace ToDoList.Api.Services
    {
        public interface IService<TDto, TCreateDto, TUpdateDto>
            where TDto : class
            where TCreateDto : class
            where TUpdateDto : class
        {
            Task<IEnumerable<TDto>> GetAllAsync();
            Task<TDto> GetByIdAsync(Guid id);
            Task<TDto> AddAsync(TCreateDto createDto);
            Task<bool> UpdateAsync(Guid id, TUpdateDto updateDto);
            Task<bool> DeleteAsync(Guid id);
        }
    }
    ```

2.  **Specific `ITodoService` and `TodoService`:**

    ```csharp
    // backend/Services/ITodoService.cs
    using ToDoList.Api.DTOs;
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    namespace ToDoList.Api.Services
    {
        public interface ITodoService // : IService<TodoItemDto, CreateTodoItemDto, UpdateTodoItemDto> (if using generic service)
        {
            Task<IEnumerable<TodoItemDto>> GetAllTodosAsync();
            Task<TodoItemDto> GetTodoByIdAsync(Guid id);
            Task<TodoItemDto> CreateTodoAsync(CreateTodoItemDto createDto);
            Task<bool> UpdateTodoAsync(Guid id, UpdateTodoItemDto updateDto);
            Task<bool> DeleteTodoAsync(Guid id);
        }
    }
    ```

    ```csharp
    // backend/Services/TodoService.cs
    using AutoMapper; // We'll add AutoMapper for DTO to Model mapping
    using ToDoList.Api.Data.Repositories;
    using ToDoList.Api.DTOs;
    using ToDoList.Api.Models;
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    namespace ToDoList.Api.Services
    {
        public class TodoService : ITodoService
        {
            private readonly ITodoRepository _todoRepository;
            private readonly IMapper _mapper;

            public TodoService(ITodoRepository todoRepository, IMapper mapper)
            {
                _todoRepository = todoRepository;
                _mapper = mapper;
            }

            public async Task<IEnumerable<TodoItemDto>> GetAllTodosAsync()
            {
                var todos = await _todoRepository.GetAllAsync();
                return _mapper.Map<IEnumerable<TodoItemDto>>(todos);
            }

            public async Task<TodoItemDto> GetTodoByIdAsync(Guid id)
            {
                var todo = await _todoRepository.GetByIdAsync(id);
                return _mapper.Map<TodoItemDto>(todo);
            }

            public async Task<TodoItemDto> CreateTodoAsync(CreateTodoItemDto createDto)
            {
                var todo = _mapper.Map<TodoItem>(createDto);
                todo.Id = Guid.NewGuid(); // Ensure ID is set for new entities
                todo.CreatedAt = DateTime.UtcNow;
                await _todoRepository.AddAsync(todo);
                return _mapper.Map<TodoItemDto>(todo);
            }

            public async Task<bool> UpdateTodoAsync(Guid id, UpdateTodoItemDto updateDto)
            {
                var existingTodo = await _todoRepository.GetByIdAsync(id);
                if (existingTodo == null)
                {
                    return false;
                }

                _mapper.Map(updateDto, existingTodo); // Map DTO to existing entity
                await _todoRepository.UpdateAsync(existingTodo);
                return true;
            }

            public async Task<bool> DeleteTodoAsync(Guid id)
            {
                var existingTodo = await _todoRepository.GetByIdAsync(id);
                if (existingTodo == null)
                {
                    return false;
                }
                await _todoRepository.DeleteAsync(id);
                return true;
            }
        }
    }
    ```

    *   **AutoMapper:** You'll need AutoMapper to easily map between Models and DTOs.
        *   **Installation:** `dotnet add package AutoMapper.Extensions.Microsoft.DependencyInjection` (already mentioned in 4.1.4)
        *   **Mapping Profile:** Create a `MappingProfile.cs` in the root of `backend` (or a `Configurations` folder).

        ```csharp
        // backend/MappingProfile.cs
        using AutoMapper;
        using ToDoList.Api.DTOs;
        using ToDoList.Api.Models;

        namespace ToDoList.Api
        {
            public class MappingProfile : Profile
            {
                public MappingProfile()
                {
                    CreateMap<TodoItem, TodoItemDto>();
                    CreateMap<CreateTodoItemDto, TodoItem>();
                    CreateMap<UpdateTodoItemDto, TodoItem>();
                }
            }
        }
        ```
        *   **Register AutoMapper in `Program.cs`:**
        ```csharp
        // backend/Program.cs (excerpt)
        // ...
        builder.Services.AddAutoMapper(typeof(Program)); // Scans for MappingProfiles
        // ...
        ```

### 4.7 Controllers

Controllers are responsible for handling incoming HTTP requests, calling the appropriate services, and returning HTTP responses.

```csharp
// backend/Controllers/TodosController.cs
using Microsoft.AspNetCore.Mvc;
using ToDoList.Api.DTOs;
using ToDoList.Api.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ToDoList.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // api/todos
    public class TodosController : ControllerBase
    {
        private readonly ITodoService _todoService;

        public TodosController(ITodoService todoService)
        {
            _todoService = todoService;
        }

        // GET: api/Todos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TodoItemDto>>> GetTodos()
        {
            var todos = await _todoService.GetAllTodosAsync();
            return Ok(todos);
        }

        // GET: api/Todos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TodoItemDto>> GetTodo(Guid id)
        {
            var todo = await _todoService.GetTodoByIdAsync(id);
            if (todo == null)
            {
                return NotFound();
            }
            return Ok(todo);
        }

        // POST: api/Todos
        [HttpPost]
        public async Task<ActionResult<TodoItemDto>> CreateTodo(CreateTodoItemDto createDto)
        {
            var todo = await _todoService.CreateTodoAsync(createDto);
            return CreatedAtAction(nameof(GetTodo), new { id = todo.Id }, todo);
        }

        // PUT: api/Todos/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTodo(Guid id, UpdateTodoItemDto updateDto)
        {
            if (id != updateDto.Id)
            {
                return BadRequest("ID mismatch");
            }

            var success = await _todoService.UpdateTodoAsync(id, updateDto);
            if (!success)
            {
                return NotFound();
            }
            return NoContent();
        }

        // DELETE: api/Todos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTodo(Guid id)
        {
            var success = await _todoService.DeleteTodoAsync(id);
            if (!success)
            {
                return NotFound();
            }
            return NoContent();
        }
    }
}
```

### 4.8 Dependency Injection

Register your services and repositories in `Program.cs` so they can be injected where needed.

```csharp
// backend/Program.cs (excerpt, after AddDbContext and AddAutoMapper)
using ToDoList.Api.Data.Repositories;
using ToDoList.Api.Services;

// ...
builder.Services.AddScoped<ITodoRepository, TodoRepository>(); // Or if using generic: builder.Services.AddScoped<IRepository<TodoItem>, Repository<TodoItem>>();
builder.Services.AddScoped<ITodoService, TodoService>();
// ...
```

### 4.9 Configuration (CORS)

Cross-Origin Resource Sharing (CORS) needs to be configured to allow your frontend (running on a different port, e.g., `http://localhost:5173`) to make requests to your backend.

```csharp
// backend/Program.cs (excerpt)
// ...
var builder = WebApplication.CreateBuilder(args);

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        builder =>
        {
            builder.WithOrigins("http://localhost:5173") // Replace with your frontend URL
                   .AllowAnyHeader()
                   .AllowAnyMethod();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowFrontend"); // Use the CORS policy

app.UseAuthorization();

app.MapControllers();

app.Run();
```

## 5. Interaction Flow (Frontend & Backend)

The frontend and backend communicate via HTTP requests, typically using RESTful principles.

*   **API Calls:** The React frontend will make HTTP requests (GET, POST, PUT, DELETE) to the C# backend's API endpoints.
*   **Data Format:** JSON (JavaScript Object Notation) will be the standard format for exchanging data between the frontend and backend. The frontend will send JSON in request bodies, and the backend will respond with JSON.
*   **CORS (Cross-Origin Resource Sharing):** Since your frontend and backend will likely run on different ports (e.g., frontend on `localhost:5173`, backend on `localhost:5000` or `localhost:5001`), the browser enforces a security measure called CORS. The backend must be configured to explicitly allow requests from your frontend's origin. We've set this up in `Program.cs` on the backend.

**Example Interaction Flow: Adding a New ToDo Item**

1.  **User Action (Frontend):** The user types "Buy groceries" into an input field on the React application and clicks an "Add Todo" button.
2.  **Frontend Component Logic:** The `AddTodoForm` component (or a corresponding context/hook) captures the input value.
3.  **Frontend API Call:** The frontend calls a function like `todoApi.createTodo({ title: "Buy groceries" })`.
4.  **HTTP Request (Frontend to Backend):** `axios` sends an `HTTP POST` request to `http://localhost:5000/api/todos`. The request body contains a JSON object: `{ "title": "Buy groceries" }`.
5.  **Backend Controller Reception:** The `TodosController` in the backend receives the `POST` request. The `CreateTodoItemDto` in the method signature (`CreateTodo(CreateTodoItemDto createDto)`) automatically maps the incoming JSON request body to a C# object.
6.  **Backend Service Layer:** The `TodosController` calls `_todoService.CreateTodoAsync(createDto)`.
7.  **Backend Repository Layer:** The `TodoService` uses `_todoRepository.AddAsync(todo)` to persist the new `TodoItem` entity to the SQLite database.
8.  **Database Interaction:** EF Core translates the repository call into SQL commands and inserts the new record into the `TodoItems` table.
9.  **Backend Response:** The `TodoService` returns a `TodoItemDto` (mapped from the saved `TodoItem` model) to the controller. The controller then returns an `HTTP 201 Created` status code along with the newly created `TodoItemDto` in the response body.
10. **Frontend State Update:** The frontend receives the `201 Created` response. It then updates its internal state (e.g., the list of todos in `TodoContext`) to include the new item, causing the UI to re-render and display the newly added todo.

## 6. Next Steps

You now have a detailed architectural plan and step-by-step instructions for building your ToDo list application. Your next steps are to:

1.  **Organize your existing frontend project** into the `frontend` directory as described in section 3.1.
2.  **Set up the C# backend project** following the steps in section 4.1.
3.  **Implement the models, DTOs, repositories, services, and controllers** in the backend as detailed in sections 4.3 - 4.7.
4.  **Configure Dependency Injection and CORS** in `Program.cs` as shown in sections 4.8 - 4.9.
5.  **Implement the API integration, state management, components, and routing** in your frontend, referring to sections 3.3 - 3.6.

Remember to leverage TypeScript for strong typing, use `dotnet watch run` for backend development (auto-reloading), and `npm run dev` (from `frontend` directory) for frontend development.

Good luck with your learning journey!
