"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { deleteLocation, fetchLocation } from "@/app/api/location";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import DialogBoxLocation from "@/components/DialogBoxLocation/DialogBoxLocation";
import Swal from "sweetalert2";

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
  [key: string]: any;
}

export default function Dashboard() {
  const [location, setLocation] = useState<LocationData[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const session = useSession();
  const token = session.data?.refreshToken;
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState<number | null>(null);

  const handleClickOpen = (id: number) => {
    setOpenDialog(id);
  };

  const handleClose = () => {
    setOpenDialog(null);
  };
  useEffect(() => {
    const getLocation = async () => {
      if (token) {
        try {
          const res = await fetchLocation(token);
          console.log(res.data);
          setLocation(res.data);
        } catch (error) {
          console.error(error.message);
        }
      }
    };

    getLocation();
  }, [token, openDialog]);
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

  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!location) return <div className="text-gray-500">Loading...</div>;

  const handleRoute = () => {
    router.push("/location/add");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <Button
        onClick={handleRoute}
        className="mb-8 px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md"
      >
        Add Location
      </Button>
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
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-700">
                    Devices:
                  </h3>
                  <div>➕</div>
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
                        <div className="cursor-pointer">✏️</div>
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
    </div>
  );
}
