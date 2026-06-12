import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';

export const dynamic = 'force-dynamic';

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
    <div className="flex flex-col md:flex-row min-h-screen" style={{ backgroundColor: '#FFF' }}>
      {/* Desktop Sidebar handles its own active state via usePathname() */}
      <Sidebar />
      <div className="flex-1 flex flex-col pb-16 md:pb-0" style={{ minWidth: 0 }}>
        {children}
      </div>
      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
}
