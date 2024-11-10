import { getUser, isLoggedIn } from "@/api/auth/sign-in";
import Sidebar from "@/components/Sidebar";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();
  const auth = await isLoggedIn();
  return (
    <>
      {user && auth && <Sidebar />}
      <main className="w-full h-full">{children}</main>
    </>
  );
}
