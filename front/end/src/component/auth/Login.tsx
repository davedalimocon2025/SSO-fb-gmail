import React, { useState } from 'react';
import { loginUser } from '../../services/authServices'; // ✅ Import the service
import { 
  Box, TextField, Button, Typography, Paper, Container, 
  Divider, IconButton, InputAdornment, Alert 
} from '@mui/material';
import { Visibility, VisibilityOff, Facebook, Google } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await loginUser(formData);
      console.log("Login Success:", data);
      
      // Redirect user or update Global State (Redux/Context) here
      alert("Welcome, " + data.user.name);
      navigate('/'); // Example redirect after login
    } catch (err: any) {
      setError(err); // This will show "Invalid credentials" from your Express server
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = (provider: 'facebook' | 'google') => {
    window.open(`http://localhost:3001/auth/${provider}`, "_self");
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 2 }}>
          <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
            Welcome Back
          </Typography>

          {/* ✅ Show error message if login fails */}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              margin="normal"
              required
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              margin="normal"
              required
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button 
              fullWidth 
              type="submit" 
              variant="contained" 
              size="large" 
              disabled={loading} // ✅ Disable button while connecting
              sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: 'bold' }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <Divider sx={{ my: 2 }}>OR</Divider>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Google sx={{ color: '#DB4437' }} />}
              onClick={() => handleOAuth('google')}
              sx={{ py: 1 }}
            >
              Continue with Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Facebook sx={{ color: '#1877F2' }} />}
              onClick={() => handleOAuth('facebook')}
              sx={{ py: 1 }}
            >
              Continue with Facebook
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;