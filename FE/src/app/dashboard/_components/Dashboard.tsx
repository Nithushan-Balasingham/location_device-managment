'use client'
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { fetchLocation } from '@/app/api/location';

interface LocationData {
  id: number;
  name: string;
  [key: string]: any;
}


export default function Dashboard() {
  const [location, setLocation] = useState<LocationData[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const session = useSession()
  const token =session.data?.refreshToken
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
  }, [token]);
  

  if (error) return <div>Error: {error}</div>;
  if (!location) return <div>Loading...</div>;

  return (
    <div className='bg-gray-400 min-h-screen flex items-center justify-center'>
      <div>{location?.map((loc)=>(
        <div key={loc.id}>
          <h2><span>Location:</span>{loc.title}</h2>
          <p><span>Status:</span>{loc.status}</p>
          <p><span>Address:</span>{loc.address}</p>
          <div>
            {loc?.devices?.map((device:any)=>(
              <div key={device.id}>
                <h3>{device.name}</h3>
                <p>{device.status}</p>
                <p>{device.type}</p>
                <p>{device.location}</p>
              </div>
            ))}
          </div>
        </div>
      ))}</div>
    </div>
  );
}
