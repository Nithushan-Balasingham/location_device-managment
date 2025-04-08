"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  CircularProgress,
  Link,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { addUser } from "@/app/api/user";
import { AxiosError } from "axios";

const createFormSchema = (isSignUp: boolean) =>
  z
    .object({
      name: isSignUp
        ? z.string().min(2, { message: "Name must be at least 2 characters" })
        : z.string().optional(),
      email: z.string().email({ message: "Invalid email address" }),
      password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
      }),
      confirmPassword: isSignUp
        ? z.string().min(6, {
            message: "Confirm Password must be at least 6 characters.",
          })
        : z.string().optional(),
    })
    .refine((data) => !isSignUp || data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

const ProfileForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const formSchema = createFormSchema(isSignUp);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    if (isSignUp) {
      try {
        await addUser({
          name: values.name!,
          email: values.email,
          password: values.password,
        });

        toast.success("Account created successfully!");
        setIsSignUp(false);
        reset();
      } catch (error: unknown) {
        if (error instanceof AxiosError && error.response?.data?.message) {
          toast.error(`Errors: ${error.response.data.message}`);
        } else if (error instanceof Error) {
          toast.error(
            `Error: ${error.message || "An unknown error occurred."}`
          );
        } else {
          toast.error("An unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    } else {
      const res = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });
      if (res?.error === "CredentialsSignin") {
        setLoading(false);
        return toast.error("Invalid Credentials");
      }

      setLoading(false);

      if (res?.ok) {
        toast.success("Logged in Successfully");
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        setError("email", {
          message: "Invalid credentials",
        });
      }
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="90vh"
      width="100%"
    >
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        {isSignUp ? "Create an Account" : "Welcome Back!"}
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ width: "50%", display: "flex", flexDirection: "column", gap: 3 }}
      >
        {isSignUp && (
          <TextField
            label="Name"
            placeholder="Your Name"
            fullWidth
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        )}

        <TextField
          label="Email"
          placeholder="Email"
          fullWidth
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <TextField
          label="Password"
          placeholder="Password"
          type={showPassword ? "text" : "password"}
          fullWidth
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {isSignUp && (
          <TextField
            label="Confirm Password"
            placeholder="Re-enter Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            {...register("confirmPassword")}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
          />
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {isSignUp ? "Sign Up" : "Login"}
        </Button>

        <Typography textAlign="center">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <Link
            component="button"
            onClick={() => {
              setIsSignUp((prev) => !prev);
              reset();
            }}
          >
            {isSignUp ? "Login" : "Sign Up"}
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default ProfileForm;
