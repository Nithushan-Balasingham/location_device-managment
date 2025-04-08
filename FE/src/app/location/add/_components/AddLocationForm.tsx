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
import { useState } from "react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { addLocation } from "@/app/api/location";
import { useRouter } from "next/navigation";

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
  const { control, setValue, watch } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "deviceDto",
  });
  const session = useSession();
  const token = session.data?.refreshToken;
  const [loading, setLoading] = useState(false);
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
        formData.append(`deviceDto[${index}][serialNumber]`, device.serialNumber);
        formData.append(`deviceDto[${index}][type]`, device.type);
        formData.append(`deviceDto[${index}][status]`, device.status);

        const fileInput = document.querySelector(
          `input[name="deviceDto[${index}][file]"]`
        ) as HTMLInputElement;
        if (fileInput?.files?.[0]) {
          formData.append("file", fileInput.files[0]);
        }
      });

      const response = await addLocation(token,formData);


      if (response.ok) {
        const data = await response.json();
        toast.success("Location added successfully!");
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
        console.log("API Response:", data);
      } else {
        console.error("Error:", response.statusText);
        toast.error("Failed to add location.");
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
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
      <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Add Location
      </h2>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 flex flex-col w-[50%]"
      >
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          {...form.register("title")}
          error={!!form.formState.errors.title}
          helperText={form.formState.errors.title?.message}
        />

        <TextField
          label="Address"
          variant="outlined"
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

              <div>
                <label htmlFor={`deviceDto[${index}][file]`}>Upload Image</label>
                <input
                  type="file"
                  name={`deviceDto[${index}][file]`}
                  id={`deviceDto[${index}][file]`}
                  accept="image/*"
                />
              </div>

              <Button
                type="button"
                variant="outlined"
                onClick={() => handleRemove(index)}
                className="mt-2"
              >
                Remove Device
              </Button>
            </div>
          );
        })}

        <Button
          type="button"
          variant="outlined"
          onClick={() =>
            append({ serialNumber: "", type: "pos", status: "Active" })
          }
        >
          Add Device
        </Button>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          className="mt-6"
        >
          {loading ? <CircularProgress size={24} /> : "Submit"}
        </Button>
      </form>
    </div>
  );
};

export default AddLocationForm;
