# Full-Stack-Project
# GROUP EXPENSE TRACKER

This project leverages **Supabase** for authentication, group and expense management, providing an intuitive interface for users to manage their finances effectively.

## AI Usage

### AI Tools Used
- **ChatGPT (OpenAI)**: ChatGPT assisted in various aspects of this project, from generating SQL queries and React components to debugging and improving the user experience.

### How AI Was Used

1. **Database Management & SQL Queries**
   - ChatGPT helped generate SQL queries for validating user emails, inserting new groups and expenses, and subscribing to real-time updates in Supabase.
   
2. **React Components**
   - I used ChatGPT to scaffold the authentication pages (login/sign-up), handle email validation, and integrate Supabase authentication.
   
3. **Frontend Styling**
   - Styling of the login/sign-up pages was aided by ChatGPT, ensuring a consistent, modern look with a dark theme matching the overall dashboard design.

4. **Troubleshooting & Optimization**
   - Whenever I faced issues, ChatGPT provided solutions to debugging problems, optimized code, and recommended best practices to enhance the performance and readability of the application.

5. **Code Review & Refinement**
   - ChatGPT reviewed parts of the code and suggested improvements for clarity and efficiency.

### AI-Generated Parts

- SQL queries for user authentication and managing group/expense data.
- Initial structure for React components (Auth page, Dashboard).
- CSS styles for the login/signup pages, particularly the dark theme.
- Core functionality for user sign-up, login, and real-time data updates from Supabase.

### Modifications
- Based on AI suggestions, I tailored the code to suit the specific project needs, implemented edge case handling, and refined the UI.
- I personalized the logic for group and expense management in the dashboard.

## Installation

To run the project locally, follow these steps:

1. Clone the repository:
    ```bash
    git clone <repository-url>
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up environment variables for Supabase (accessible from the Supabase dashboard).

4. Run the development server:
    ```bash
    npm run dev
    ```

5. Open the project in your browser:
    ```bash
    http://localhost:3000
    ```

## Features

- **User Authentication**: Secure sign-up and login using email/password handled by Supabase.
- **Group Management**: Users can create and manage groups to track shared expenses.
- **Expense Management**: Users can easily add and track expenses within groups.
- **Real-Time Updates**: The app uses Supabase's real-time features to sync updates instantly across devices.

## Technologies Used

- **Supabase**: Backend-as-a-service for authentication, database, and real-time capabilities.
- **React**: Frontend framework for building the user interface.
- **Next.js**: React framework for server-side rendering and routing.
- **CSS (Styled Components)**: For custom dark theme styling.
- **JavaScript/TypeScript**: For frontend logic.
