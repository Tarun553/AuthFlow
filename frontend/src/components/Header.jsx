import React from "react";
import { useAppContext } from "../context/AppContext";


const Header = () => {
  const { isLoggedIn, userData } = useAppContext();

 

  return (
    <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 relative">
      {/* Top-right corner - Avatar OR Login button */}
      {/* <div className="absolute top-4 right-4">
        {isLoggedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer h-10 w-10 border-2 border-blue-500">
                <AvatarImage src="" alt={userData?.name} />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                  {userData?.name ? getInitials(userData.name) : "U"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                Profile
              </DropdownMenuItem>
              {!userData?.isAuthenticated && (
                <DropdownMenuItem
                  className="text-yellow-600 cursor-pointer"
                  onClick={() => navigate("/verify-email")}
                >
                  Verify Email
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className="text-red-600 cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            variant="default"
            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        )}
      </div> */}

      {/* Main Content - Centered */}
      <div className="flex flex-col items-center justify-center text-center gap-4 mt-12">
        <img
          className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-full border-4 border-blue-100 shadow-lg animate-pulse"
          src="https://i.pinimg.com/1200x/94/98/7a/94987a678eacfca58531d04dbabea8c5.jpg"
          alt="Robot Logo"
        />

        <div className="flex items-center gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500">
            Hey {userData?.name || "developer"}
          </h1>
          <span className="text-3xl">👋</span>
        </div>

        <h2 className="font-semibold text-xl">
          {isLoggedIn
            ? userData?.isAuthenticated
              ? "Welcome to our app"
              : "Please verify your email to continue"
            : "Welcome to our app"}
        </h2>
        <p className="text-gray-600 text-lg font-medium">
          {isLoggedIn && userData?.isAuthenticated
            ? "Ready to build something amazing?"
            : "Let's build something amazing with our product"}
        </p>
      </div>
    </header>
  );
};

export default Header;
