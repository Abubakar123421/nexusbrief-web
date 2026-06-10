'use client';

import React from 'react';

interface Assignment {
  courseName: string;
  title: string;
  dueDate: string | null;
  link: string | null;
}

interface ClassroomWidgetProps {
  assignments: Assignment[];
}

function isDueWithinTwoDays(dueDate: string): boolean {
  const due = new Date(dueDate);
  const now = new Date();
  const diffMs = due.getTime() - now.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= 2;
}

function formatDueDate(dueDate: string): string {
  const due = new Date(dueDate);
  return due.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export const ClassroomWidget: React.FC<ClassroomWidgetProps> = ({
  assignments,
}) => {
  if (assignments.length === 0) return null;

  return (
    <section>
      {/* Section header */}
      <p className="font-montserrat text-[10px] uppercase tracking-[0.2em] text-[#8A8A8A] mb-3 select-none">
        📚 Upcoming
      </p>

      {/* Horizontal scroll */}
      <div className="flex gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {assignments.map((assignment, idx) => {
          const urgent =
            assignment.dueDate !== null &&
            isDueWithinTwoDays(assignment.dueDate);

          const cardContent = (
            <div className="min-w-[200px] max-w-[220px] border border-[#E0DDD8] p-4 bg-white flex-shrink-0 transition-shadow hover:shadow-[0_2px_8px_rgba(0,0,0,0.07)]">
              {/* Course name */}
              <p className="font-montserrat text-[9px] uppercase tracking-widest text-[#8A8A8A]">
                {assignment.courseName}
              </p>

              {/* Title */}
              <p className="font-playfair text-[15px] font-medium text-[#0A0A0A] mt-1 line-clamp-2 leading-snug">
                {assignment.title}
              </p>

              {/* Due date */}
              {assignment.dueDate && (
                <p
                  className={`font-montserrat text-[11px] mt-2 flex items-center gap-1 ${
                    urgent ? 'text-[#8C1F1F]' : 'text-[#8A8A8A]'
                  }`}
                >
                  {urgent ? '🔴' : '📅'}{' '}
                  {formatDueDate(assignment.dueDate)}
                </p>
              )}
            </div>
          );

          if (assignment.link) {
            return (
              <a
                key={idx}
                href={assignment.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                {cardContent}
              </a>
            );
          }

          return <div key={idx}>{cardContent}</div>;
        })}
      </div>
    </section>
  );
};

export default ClassroomWidget;
