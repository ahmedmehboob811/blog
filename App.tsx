
import React from 'react';
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { HashRouter, Routes, Route, Link, NavLink } from 'react-router-dom';
import Home from './components/pages/Home';
import PostDetail from './components/pages/PostDetail';
import NewPost from './components/pages/NewPost';
import { CLERK_PUBLISHABLE_KEY } from './constants';
import { PenSquare, BookOpen, BrainCircuit } from 'lucide-react';

const Header: React.FC = () => (
  <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
    <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2 text-white text-lg font-bold">
            <BrainCircuit className="h-7 w-7 text-teal-500" />
            <span>AI Blog</span>
          </Link>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                    isActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`
                }>
                <BookOpen className="h-4 w-4" />
                <span>Posts</span>
              </NavLink>
              <SignedIn>
                <NavLink 
                  to="/new" 
                  className={({ isActive }) => 
                    `flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                      isActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`
                  }>
                  <PenSquare className="h-4 w-4" />
                  <span>New Post</span>
                </NavLink>
              </SignedIn>
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <SignedOut>
            <SignInButton mode="modal">
                <button className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-md transition duration-300">
                    Sign in
                </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </nav>
  </header>
);

const App: React.FC = () => {
  if (!CLERK_PUBLISHABLE_KEY) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-red-500">
        Clerk Publishable Key is not set. Please check your environment variables.
      </div>
    );
  }

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <HashRouter>
        <div className="min-h-screen bg-gray-900 text-gray-200">
          <Header />
          <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/post/:id" element={<PostDetail />} />
              <Route path="/new" element={
                <SignedIn>
                  <NewPost />
                </SignedIn>
              } />
            </Routes>
          </main>
        </div>
      </HashRouter>
    </ClerkProvider>
  );
};

export default App;
