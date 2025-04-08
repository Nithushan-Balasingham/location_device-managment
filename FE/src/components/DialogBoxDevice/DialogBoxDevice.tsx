"use client";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
;
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { fetchSingleDevice, updateDevice } from "@/app/api/device";
import { useEffect, useState } from "react";
import Image from "next/image";

interface FormDialogProps {
  open: boolean;
  onClose: () => void;
  deviceID: number;
}

export default function DialogBoxDevice({
  open,
  onClose,
  deviceID,
}: FormDialogProps) {
  console.log(deviceID);
  const [serialNo, setSerialNo] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [deviceImg, setDeviceImg] = useState("");
  const [newImage, setNewImage] = useState<File | null>(null);
  const session = useSession();
  const token = session.data?.refreshToken;
  const router = useRouter();

  useEffect(() => {
    const getDevice = async () => {
      if (token) {
        try {
          const res = await fetchSingleDevice(deviceID, token);
          setSerialNo(res.data.serialNumber);
          setStatus(res.data.status);
          setType(res.data.type);
          setDeviceImg(res.data.image);
          console.log(res.data);
        } catch (error: unknown) {
          if (error instanceof Error) {
            if (
              error.message === "Error fetching device: 404 - Device not found"
            ) {
              toast.error("Not Found: Device not found");
            }
            console.log(error.message);
          } else {
            toast.error("Error fetching location: An unknown error occurred");
          }
        }
      }
    };

    getDevice();
  }, [token]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setNewImage(file); 
  };

  const updateDeviceSubmit = async () => {
    if (!type || !status || !serialNo) {
      toast.error("Please fill all the fields");
      return;
    }

    const formData = new FormData();
    formData.append("serialNumber", serialNo);
    formData.append("type", type);
    formData.append("status", status);
    if (newImage) {
      formData.append("file", newImage); 
    }

    try {
      await updateDevice(deviceID, formData, token);
      toast.success("Device updated successfully");
      onClose();
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            if (error.response?.data?.message) {
              toast.error(`Error updating device: ${error.response.data.message}`);
            } else {
              toast.error("Error updating device: " + error.message);
            }
          } else {
            toast.error("An unknown error occurred while updating the device.");
          }
        }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose} // Ensure this is correctly passed
      sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "100%",
            maxWidth: "500px",
          },
        },
      }}
    >
      <DialogTitle> Update Location</DialogTitle>
      <DialogContent>
        <Stack direction={"column"} gap={2}>
          {" "}
          <TextField
            autoFocus
            required
            margin="dense"
            value={serialNo}
            id="serialNo"
            label="serialNo"
            type="text"
            onChange={(e) => setSerialNo(e.target.value)}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              value={type}
              onChange={(e) => setType(e.target.value)}
              label="Type"
            >
              <MenuItem value="pos">POS</MenuItem>
              <MenuItem value="kiosk">Kiosk</MenuItem>
              <MenuItem value="signage">Signage</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="InActive">InActive</MenuItem>
            </Select>
          </FormControl>

          <div>
            <label htmlFor="deviceImage">Upload Image</label>
            <input
              type="file"
              id="deviceImage"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          {newImage ? (
            <Image
              src={URL.createObjectURL(newImage)} 
              alt="New Device Image"
              width={200}
              height={200}
            />
          ) : (
            deviceImg && (
              <Image
                src={deviceImg}
                alt="Device Image"
                width={200}
                height={200}
              />
            )
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button> {/* Ensure this calls onClose */}
        <Button type="submit" onClick={updateDeviceSubmit}>
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}
