import { NextResponse } from 'next/server';
import { createRouteSupabaseClient } from '@/lib/supabase/route';

const CLASSROOM_BASE = 'https://classroom.googleapis.com/v1';

export async function GET() {
  const supabase = await createRouteSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const token = session.provider_token;
  if (!token) return NextResponse.json({ error: 'No Google token — sign in with Google' }, { status: 401 });

  try {
    // Fetch active courses
    const coursesRes = await fetch(
      `${CLASSROOM_BASE}/courses?courseStates=ACTIVE&pageSize=10`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (coursesRes.status === 403 || coursesRes.status === 401) {
      return NextResponse.json({ error: 'Classroom permission not granted' }, { status: 403 });
    }

    const coursesData = await coursesRes.json();
    const courses: any[] = coursesData.courses ?? [];
    const allWork: any[] = [];

    for (const course of courses.slice(0, 5)) {
      const cwRes = await fetch(
        `${CLASSROOM_BASE}/courses/${course.id}/courseWork?pageSize=10`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!cwRes.ok) continue;
      const cwData = await cwRes.json();
      const items: any[] = cwData.courseWork ?? [];

      for (const cw of items) {
        const dueDate = parseDueDate(cw);
        allWork.push({
          courseId:   course.id,
          courseName: course.name,
          title:      cw.title,
          dueDate:    dueDate?.toISOString() ?? null,
          link:       cw.alternateLink ?? null,
        });
      }
    }

    allWork.sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

    return NextResponse.json({ assignments: allWork.slice(0, 10) });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

function parseDueDate(cw: any): Date | null {
  if (!cw.dueDate) return null;
  const { year, month, day } = cw.dueDate;
  const hour = cw.dueTime?.hours ?? 23;
  const min  = cw.dueTime?.minutes ?? 59;
  return new Date(year, month - 1, day, hour, min);
}
