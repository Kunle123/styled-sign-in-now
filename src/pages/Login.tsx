import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, Eye, EyeOff, Shield } from "lucide-react";
import SocialAuthButton from "@/components/auth/SocialAuthButton";
import CaptchaComponent, { CaptchaRef } from "@/components/auth/CaptchaComponent";
import { oauthService } from "@/services/oauthService";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const captchaRef = useRef<CaptchaRef>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Show CAPTCHA after first login attempt
    if (!showCaptcha) {
      setShowCaptcha(true);
      toast({
        title: "Security verification required",
        description: "Please complete the CAPTCHA below to continue."
      });
      return;
    }
    
    if (!captchaToken) {
      toast({
        title: "CAPTCHA required",
        description: "Please complete the CAPTCHA verification.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // TODO: Connect to your backend API
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email, 
          password, 
          captchaToken 
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Login successful!",
          description: "Welcome back!"
        });
        // Handle successful login (redirect, store token, etc.)
      } else {
        const error = await response.json();
        toast({
          title: "Login failed",
          description: error.message || "Invalid credentials",
          variant: "destructive"
        });
        // Reset CAPTCHA on failed attempt
        captchaRef.current?.reset();
        setCaptchaToken(null);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    try {
      oauthService.initiateGoogleAuth();
    } catch (error) {
      toast({
        title: "OAuth Error",
        description: "Failed to initiate Google authentication",
        variant: "destructive"
      });
    }
  };

  const handleLinkedInAuth = () => {
    try {
      oauthService.initiateLinkedInAuth();
    } catch (error) {
      toast({
        title: "OAuth Error", 
        description: "Failed to initiate LinkedIn authentication",
        variant: "destructive"
      });
    }
  };

  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
  };

  const handleCaptchaError = () => {
    toast({
      title: "CAPTCHA Error",
      description: "CAPTCHA verification failed. Please try again.",
      variant: "destructive"
    });
    setCaptchaToken(null);
  };

  return (
    <div className="min-h-screen bg-auth-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <Card className="shadow-elegant border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold bg-auth-gradient bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border-border/50 focus:border-primary focus:ring-primary/20 transition-all duration-300"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 border-border/50 focus:border-primary focus:ring-primary/20 transition-all duration-300"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:text-primary-glow transition-colors underline-offset-4 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {showCaptcha && (
                <div className="space-y-2">
                  <Label className="text-foreground font-medium flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Security Verification
                  </Label>
                  <CaptchaComponent
                    ref={captchaRef}
                    siteKey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" // Test key - replace with your actual key
                    onChange={handleCaptchaChange}
                    onError={handleCaptchaError}
                    theme="light"
                  />
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-auth-gradient hover:opacity-90 border-0 shadow-soft transition-all duration-300 hover:shadow-elegant hover:-translate-y-0.5"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : showCaptcha ? "Verify & Sign In" : "Sign In"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="space-y-3">
              <SocialAuthButton 
                provider="google" 
                onClick={handleGoogleAuth}
                disabled={isLoading}
              />
              <SocialAuthButton 
                provider="linkedin" 
                onClick={handleLinkedInAuth}
                disabled={isLoading}
              />
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-primary hover:text-primary-glow transition-colors underline-offset-4 hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;