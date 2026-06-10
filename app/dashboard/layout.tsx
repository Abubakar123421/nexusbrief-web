import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import Sidebar from '@/components/Sidebar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/login');
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#FFF' }}>
      {/* Sidebar handles its own active state via usePathname() */}
      <Sidebar />
      <div className="flex-1 flex flex-col" style={{ minWidth: 0 }}>
        {children}
      </div>
    </div>
  );
}
