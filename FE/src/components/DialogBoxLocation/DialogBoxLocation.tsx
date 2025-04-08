import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useSession } from "next-auth/react";
import { fetchSingleLocation, updateLocation } from "@/app/api/location";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

interface FormDialogProps {
  open: boolean;
  onClose: () => void;
  locationId: number;
}

export default function DialogBoxLocation({
  open,
  onClose,
  locationId,
}: FormDialogProps) {
  console.log(locationId);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");
  const [address, setAddress] = useState("");
  const session = useSession();
  const token = session.data?.refreshToken;

  useEffect(() => {
    const getLocation = async () => {
      if (token) {
        try {
          const res = await fetchSingleLocation(locationId, token);
          setTitle(res.data.title);
          setStatus(res.data.status);
          setAddress(res.data.address);
          console.log(res.data);
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

  const updateLocationSubmit = async () => {
    if (!title || !address || !status) {
      toast.error("Please fill all the fields");
      return;
    }
    const data = {
      title: title,
      address: address,
      status: status,
    };
    try {
       await updateLocation(locationId, data, token);
      toast.success("Location updated successfully");
      onClose();
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error("Error updating location: " + error.message);
      } else {
        toast.error("An unknown error occurred while updating the location.");
      }
    }
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "100%",
            maxWidth: "500px",
          },
        },
      }}
      slotProps={{
        paper: {
          component: "form",
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(
              Array.from(formData.entries()) as [string, FormDataEntryValue][]
            );
            const email = formJson.email;
            console.log(email);
            onClose();
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
            value={title}
            id="title"
            label="Title"
            type="text"
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
          />
          <TextField
            autoFocus
            required
            margin="dense"
            value={address}
            id="address"
            label="Address"
            type="text"
            onChange={(e) => setAddress(e.target.value)}
            fullWidth
          />
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
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" onClick={updateLocationSubmit}>
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}
