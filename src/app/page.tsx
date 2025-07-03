import HomePage from '@/components/modules/home/home-page';
import Image from 'next/image';
import { cookies } from 'next/headers';

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');
  const isLoggedIn = !!token;

  return (
    <div className="scroll-smooth ">
      <HomePage isLoggedIn={isLoggedIn} />
    </div>
  );
}
