import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-auth-gradient-subtle flex items-center justify-center p-4">
      <div className="text-center animate-fade-in space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold bg-auth-gradient bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-xl text-muted-foreground max-w-md mx-auto">
            Ready to continue your journey? Sign in to access your account or create a new one.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            asChild 
            className="bg-auth-gradient hover:opacity-90 shadow-soft transition-all duration-300 hover:shadow-elegant hover:-translate-y-0.5"
          >
            <Link to="/login">Sign In</Link>
          </Button>
          <Button 
            asChild 
            className="bg-green-600 hover:bg-green-700 text-white shadow-soft transition-all duration-300 hover:shadow-elegant hover:-translate-y-0.5 border-0"
          >
            <Link to="/signup">Create Account</Link>
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground">
          Experience our modern, secure authentication system
        </p>
      </div>
    </div>
  );
};

export default Index;
