import Link from "next/link";

export const metadata = {
  
  description: 'Food Ordering',
}

export default function Home() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="bg-white p-10 rounded-2xl shadow-lg text-center w-96">
        <h1 className="text-2xl font-bold mb-6">Welcome to Food Ordering</h1>
        <div className="space-y-4">
          <Link href="/user/login">
            <button className="mt-5 w-full bg-blue-500 text-white py-2 px-4 rounded-xl hover:bg-blue-600">
              User Login
            </button>
          </Link>
          <Link href="/restaurant/login">
            <button className="mt-5 w-full bg-green-500 text-white py-2 px-4 rounded-xl hover:bg-green-600">
              Restaurant Login
            </button>
          </Link>

          


          <p className="text-sm text-center mt-3">
          {" "} 
          <Link href="/admin/login" className="text-blue-600 font-medium">
            Admin login
          </Link>
        </p>
        </div>
      </div>
    </div>
  );
}
