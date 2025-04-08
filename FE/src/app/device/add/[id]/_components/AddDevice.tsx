"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { AxiosError } from "axios";
import { addDevice } from "@/app/api/device";
import { fetchSingleLocation } from "@/app/api/location";

const formSchema = z.object({
  serialNumber: z
    .string()
    .min(2, { message: "Serial number must be at least 2 characters." }),
  type: z.enum(["pos", "kiosk", "signage"], {
    message: "Invalid device type.",
  }),
  status: z.enum(["Active", "InActive"], {
    message: "Device status must be either 'Active' or 'InActive'.",
  }),
  file: z.instanceof(File).optional(),
});

const AddDeviceForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serialNumber: "",
      type: "pos",
      status: "Active",
    },
  });
  const router = useRouter();
  const params = useParams();
  const locationId = params.id
    ? Array.isArray(params.id)
      ? parseInt(params.id[0], 10)
      : parseInt(params.id, 10)
    : undefined;
  const handleRouteBack = () => {
    router.push("/dashboard");
  };
  const MAX_DEVICES = 10;
  const { register, setValue, formState } = form;
  const session = useSession();
  const token = session.data?.refreshToken;
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [location, setLocation] = useState([]);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };
  useEffect(() => {
    const getLocation = async () => {
      if (token && locationId !== undefined) {
        try {
          const res = await fetchSingleLocation(locationId, token);
          console.log(res.data);
          console.log(res.data.devices.length);
          setLocation(res.data.devices);
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.error(error.message);
          } else {
            console.error("An unknown error occurred");
          }
        }
      }
    };

    getLocation();
  }, [token]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      if (!token) {
        throw new Error("No token found. Please log in again.");
      }

      const formData = new FormData();
      formData.append("serialNumber", values.serialNumber);
      formData.append("type", values.type);
      formData.append("status", values.status);
      formData.append("locationId", locationId?.toString() || "");

      if (file) {
        formData.append("file", file);
      }

      const data = await addDevice(formData, token);
      toast.success("Device added successfully!");
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);

      console.log("API Response:", data);
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        toast.error(`Error: ${error.response.data.message}`);
      } else if (error instanceof Error) {
        toast.error(`Error: ${error.message || "An unknown error occurred."}`);
      } else {
        toast.error("An unknown error occurred.");
      }
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }
  const remainingDevices = MAX_DEVICES - location.length;

  return (
    <div className="flex min-h-[90vh] items-center justify-center w-full flex-col">
      <div className="m-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Add Device
        </h2>
        <Button
          variant="contained"
          color="error"
          onClick={handleRouteBack}
          className="m-2"
        >
          ⬅️ Go Back
        </Button>
      </div>

      <div className="text-red-400 font-bold text-center">
        You have {remainingDevices}{" "}
        {remainingDevices === 1 ? "Device" : "Devices"} left
      </div>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 flex flex-col w-[50%]"
      >
        <TextField
          label="Serial Number"
          variant="outlined"
          fullWidth
          {...register("serialNumber")}
          error={!!formState.errors.serialNumber}
          helperText={formState.errors.serialNumber?.message}
        />

        <FormControl fullWidth>
          <InputLabel>Device Type</InputLabel>
          <Select
            value={form.getValues("type")}
            onChange={(e) =>
              setValue("type", e.target.value as "pos" | "kiosk" | "signage")
            }
            label="Device Type"
            error={!!formState.errors.type}
          >
            <MenuItem value="pos">POS</MenuItem>
            <MenuItem value="kiosk">Kiosk</MenuItem>
            <MenuItem value="signage">Signage</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Device Status</InputLabel>
          <Select
            value={form.getValues("status")}
            onChange={(e) =>
              setValue("status", e.target.value as "Active" | "InActive")
            }
            label="Device Status"
            error={!!formState.errors.status}
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="InActive">InActive</MenuItem>
          </Select>
        </FormControl>

        <div className="flex flex-col items-start space-y-2">
          <label htmlFor="file" className="text-sm font-medium text-gray-700">
            Upload Image
          </label>
          <input
            type="file"
            required
            id="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 
               file:rounded-lg file:border-0 file:text-sm file:font-semibold 
               file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 
               focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading || location.length >= MAX_DEVICES}
          className="mt-6"
        >
          {loading ? <CircularProgress size={24} /> : "Submit"}
        </Button>
      </form>
    </div>
  );
};

export default AddDeviceForm;
