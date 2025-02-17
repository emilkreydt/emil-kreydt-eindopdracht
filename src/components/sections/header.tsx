import { Button } from "@/components/ui/button";

const Header = () => {
    return (
        <header className="flex justify-between items-center p-6 bg-white shadow-md">
            {/* Logo */}
            <div className="text-2xl font-bold text-blue-600">HealthyMe</div>

            {/* Navigatie */}
            <nav className="hidden md:flex space-x-6">
                <a href="#" className="text-gray-700 hover:text-blue-600">Home</a>
                <a href="#" className="text-gray-700 hover:text-blue-600">About Us</a>
                <a href="#" className="text-gray-700 hover:text-blue-600">How to Use</a>
            </nav>

            {/* Taal + Knoppen */}
            <div className="flex items-center space-x-4">
                {/* Placeholder voor taalkeuze (kan later vervangen worden door dropdown) */}
                <span className="text-gray-700 hidden md:inline">🌍 English ▼</span>

                {/* Sign In en Register knoppen */}
                <Button variant="ghost" size="sm">Sign in</Button>
                <Button variant="default" size="sm">Register</Button>
            </div>
        </header>
    );
};

export default Header;
