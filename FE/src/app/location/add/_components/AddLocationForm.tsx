"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, Controller } from "react-hook-form";
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
import { addLocation } from "@/app/api/location";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  address: z
    .string()
    .min(2, { message: "Address must be at least 2 characters." }),
  status: z.enum(["Active", "InActive"], {
    message: "Status must be either 'Active' or 'InActive'.",
  }),
  deviceDto: z.array(
    z.object({
      serialNumber: z
        .string()
        .min(2, { message: "Serial number must be at least 2 characters." }),
      type: z.enum(["pos", "kiosk", "signage"], {
        message: "Invalid device type.",
      }),
      status: z.enum(["Active", "InActive"], {
        message: "Device status must be either 'Active' or 'InActive'.",
      }),
    })
  ),
});

const AddLocationForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      address: "",
      status: "InActive",
      deviceDto: [{ serialNumber: "", type: "pos", status: "Active" }],
    },
  });
  const router = useRouter();
  const handleRouteBack = () => {
    router.push("/dashboard");
  };
  const { control, setValue, watch } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "deviceDto",
  });
  const session = useSession();
  const token = session.data?.refreshToken;
  const [loading, setLoading] = useState(false);
  const MAX_DEVICES = 10;

  const handleAddDevice = () => {
    if (fields.length >= MAX_DEVICES) {
      toast.error("You can only add up to 10 devices.");
      return;
    }
    append({ serialNumber: "", type: "pos", status: "Active" });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      if (!token) {
        throw new Error("No token found. Please log in again.");
      }

      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("address", values.address);
      formData.append("status", values.status);

      values.deviceDto.forEach((device, index) => {
        formData.append(
          `deviceDto[${index}][serialNumber]`,
          device.serialNumber
        );
        formData.append(`deviceDto[${index}][type]`, device.type);
        formData.append(`deviceDto[${index}][status]`, device.status);

        const fileInput = document.querySelector(
          `input[name="deviceDto[${index}][file]"]`
        ) as HTMLInputElement;
        if (fileInput?.files?.[0]) {
          formData.append("file", fileInput.files[0]);
        }
      });

      const data = await addLocation(formData, token);
      toast.success("Location added successfully!");
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);

      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
      console.log("API Response:", data);

      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
      console.log("API Response:", data);
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
      console.log("API Response:", data);
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        toast.error(`Errors: ${error.response.data.message}`);
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

  const handleRemove = (index: number) => {
    remove(index);
  };

  return (
    <div className="flex min-h-[90vh] items-center justify-center w-full flex-col">
      <div className="m-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Add Location
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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 flex flex-col w-[50%]"
      >
        <TextField
          label="Title"
          required
          variant="outlined"
          fullWidth
          {...form.register("title")}
          error={!!form.formState.errors.title}
          helperText={form.formState.errors.title?.message}
        />

        <TextField
          label="Address"
          variant="outlined"
          required
          fullWidth
          {...form.register("address")}
          error={!!form.formState.errors.address}
          helperText={form.formState.errors.address?.message}
        />

        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            value={form.getValues("status")}
            onChange={(e) =>
              setValue("status", e.target.value as "Active" | "InActive")
            }
            label="Status"
            error={!!form.formState.errors.status}
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="InActive">InActive</MenuItem>
          </Select>
        </FormControl>

        {fields.map((field, index) => {
          const serialNumber = watch(`deviceDto.${index}.serialNumber`);
          const type = watch(`deviceDto.${index}.type`);
          const status = watch(`deviceDto.${index}.status`);

          return (
            <div key={field.id} className="space-y-4">
              <h3 className="font-semibold">Device {index + 1}</h3>

              <TextField
                label="Serial Number"
                variant="outlined"
                fullWidth
                required
                {...form.register(`deviceDto.${index}.serialNumber`)}
                error={!!form.formState.errors.deviceDto?.[index]?.serialNumber}
                helperText={
                  form.formState.errors.deviceDto?.[index]?.serialNumber
                    ?.message
                }
                value={serialNumber}
              />

              <FormControl fullWidth>
                <InputLabel>Device Type</InputLabel>
                <Controller
                  key={`deviceDto-${field.id}-type`}
                  name={`deviceDto.${index}.type`}
                  control={control}
                  render={({ field: controllerField }) => (
                    <Select
                      {...controllerField}
                      label="Device Type"
                      error={!!form.formState.errors.deviceDto?.[index]?.type}
                      value={type}
                    >
                      <MenuItem value="pos">POS</MenuItem>
                      <MenuItem value="kiosk">Kiosk</MenuItem>
                      <MenuItem value="signage">Signage</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Device Status</InputLabel>
                <Controller
                  key={`deviceDto-${field.id}-status`}
                  name={`deviceDto.${index}.status`}
                  control={control}
                  render={({ field: controllerField }) => (
                    <Select
                      {...controllerField}
                      label="Device Status"
                      error={!!form.formState.errors.deviceDto?.[index]?.status}
                      value={status}
                    >
                      <MenuItem value="Active">Active</MenuItem>
                      <MenuItem value="InActive">InActive</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
              <div className="flex flex-col items-start space-y-2">
                <label
                  htmlFor={`deviceDto[${index}][file]`}
                  className="text-lg font-semibold text-gray-700"
                >
                  Upload Image
                </label>
                <input
                  required
                  type="file"
                  name={`deviceDto[${index}][file]`}
                  id={`deviceDto[${index}][file]`}
                  accept="image/*"
                  className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 
                  file:rounded-lg file:border-0 file:text-sm file:font-semibold 
                  file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <Button
                type="button"
                variant="outlined"
                onClick={() => handleRemove(index)}
                className="mt-2"
                disabled={fields.length <= 1}
              >
                Remove Device
              </Button>
            </div>
          );
        })}
        {fields.length >= MAX_DEVICES && (
          <div className="text-red-400 text-center">
            You can only add up to 10 max devices
          </div>
        )}
        <Button
          type="button"
          variant="contained"
          color="success"
          onClick={handleAddDevice}
          disabled={fields.length >= MAX_DEVICES}
        >
          Add Device
        </Button>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading || fields.length > MAX_DEVICES}
          className="mt-6"
        >
          {loading ? <CircularProgress size={24} /> : "Submit"}
        </Button>
      </form>
    </div>
  );
};

export default AddLocationForm;
