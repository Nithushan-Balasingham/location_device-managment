"use client";
import { signOut, useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { deleteLocation, fetchLocation } from "@/app/api/location";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import DialogBoxLocation from "@/components/DialogBoxLocation/DialogBoxLocation";
import Swal from "sweetalert2";
import DialogBoxDevice from "@/components/DialogBoxDevice/DialogBoxDevice";
import { deleteDevice } from "@/app/api/device";

interface LocationData {
  id: number;
  title: string;
  status: string;
  address: string;
  devices: {
    id: number;
    name: string;
    status: string;
    type: string;
    location: string;
    image: string;
    serialNumber: string;
  }[];
  [key: string]:
    | string
    | number
    | {
        id: number;
        name: string;
        status: string;
        type: string;
        location: string;
        image: string;
        serialNumber: string;
      }[];
}

export default function Dashboard() {
  const [location, setLocation] = useState<LocationData[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const session = useSession();
  const token = session.data?.refreshToken;
  console.log(session.data);
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState<number | null>(null);
  const [openDialogDevice, setOpenDialogDevice] = useState<number | null>(null);
  const [refresh, setRefresh] = useState(false);
  const MAX_DEVICES = 10;
  const handleClickOpen = (id: number) => {
    setOpenDialog(id);
  };
  const handleClose = useCallback(() => {
    setRefresh((prev) => !prev);
    setOpenDialog(null);
  }, []);
  const handleNavigateAddDevice = (id: number) => {
    router.push(`/device/add/${id}`);
  };

  const handleClickOpenDevice = (id: number) => {
    setOpenDialogDevice(id);
  };

  const handleCloseDevice = () => {
    setOpenDialogDevice(null);
  };
  useEffect(() => {
    const getLocation = async () => {
      if (token) {
        try {
          const res = await fetchLocation(token);
          console.log(res.data);
          setLocation(res.data);
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
  }, [token, openDialog, openDialogDevice, refresh]);
  const handleDelete = (id: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This location will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(`Deleting location with ID: ${id}`);
        deleteLocation(id, token);
        setLocation((prevLocations) => {
          if (prevLocations) {
            return prevLocations.filter((loc) => loc.id !== id);
          }
          return null;
        });
        Swal.fire("Deleted!", "Your location has been deleted.", "success");
      }
    });
  };
  const handleDeleteDevice = (id: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This device will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(`Deleting device with ID: ${id}`);
        deleteDevice(id, token);
        setRefresh(!refresh);
        Swal.fire("Deleted!", "Your device has been deleted.", "success");
      }
    });
  };
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!location) return <div className="text-gray-500">Loading...</div>;

  const handleRoute = () => {
    router.push("/location/add");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="text-xl font-semibold text-green-400 mb-7">
        {" "}
        Welcome {session?.data?.user?.name}
      </div>
      <Button
        onClick={() => signOut()}
        className="mb-8 px-6 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-md"
      >
        Sign Out
      </Button>
      <Button
        onClick={handleRoute}
        className="mb-8 px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md"
      >
        Add Location
      </Button>
      {location.length === 0 ? (
        <div className="flex items-center font-bold text-red-500">No Locations Available</div>
      ) : (
        <div className="w-full max-w-3xl space-y-8">
          {location?.map((loc) => (
            <div
              key={loc.id}
              className="bg-white p-6 rounded-lg shadow-lg border border-gray-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="mb-4">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Location : {loc.title}
                  </h2>
                  <div className="text-sm text-gray-500">
                    Address: {loc.address}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="cursor-pointer"
                    onClick={() => handleClickOpen(loc.id)}
                  >
                    🖊️
                  </div>
                  <div
                    className="cursor-pointer"
                    onClick={() => handleDelete(loc.id)}
                  >
                    ❌
                  </div>
                </div>
              </div>

              {openDialog === loc.id && (
                <DialogBoxLocation
                  open={true}
                  onClose={handleClose}
                  locationId={loc.id}
                />
              )}

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-700">Status:</h3>
                  <p className="text-lg text-gray-600">
                    {loc.status === "Active" ? (
                      <span className="text-blue-500">{loc.status}</span>
                    ) : (
                      <span className="text-red-500">{loc.status}</span>
                    )}
                  </p>
                </div>
                <div>
                  <div className=" text-center flex font-bold text-red-500">
                    {" "}
                    You have {MAX_DEVICES - loc.devices.length}{" "}
                    {MAX_DEVICES - loc.devices.length === 1
                      ? "Device"
                      : "Devices"}{" "}
                    left
                  </div>

                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-700">
                      Devices:
                    </h3>
                    <Button
                      variant={"outline"}
                      onClick={() => handleNavigateAddDevice(loc.id)}
                      className="cursor-pointer"
                      disabled={loc.devices.length >= MAX_DEVICES}
                    >
                      ➕
                    </Button>
                  </div>
                  {loc.devices && loc.devices.length > 0 ? (
                    <div className="space-y-4 mt-2">
                      {loc.devices.map((device) => (
                        <div
                          key={device.id}
                          className="bg-gray-50 p-4 rounded-lg flex items-start justify-between shadow-sm border border-gray-200"
                        >
                          <div>
                            <h4 className="text-xl font-semibold text-gray-800">
                              {device.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Serial Number: {device.serialNumber}
                            </p>
                            <p className="text-sm text-gray-600">
                              Status: {device.status}
                            </p>
                            <p className="text-sm text-gray-600">
                              Type: {device.type}
                            </p>
                            <Image
                              src={device.image}
                              alt="Image"
                              width={200}
                              height={200}
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <div
                              className="cursor-pointer"
                              onClick={() => handleClickOpenDevice(device.id)}
                            >
                              🖊️
                            </div>
                            <div
                              className="cursor-pointer"
                              onClick={() => handleDeleteDevice(device.id)}
                            >
                              ❌
                            </div>
                          </div>

                          {openDialogDevice === device.id && (
                            <DialogBoxDevice
                              open={true}
                              onClose={handleCloseDevice}
                              deviceID={device.id}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">No devices available</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
