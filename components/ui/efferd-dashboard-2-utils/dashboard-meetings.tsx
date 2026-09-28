"use client";

import { useEffect, useState } from "react";
import { Calendar, Video } from "lucide-react";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardCard } from "./dashboard-card";

type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  location?: string;
  meetLink?: string;
};

function formatTime(iso: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function EventRow({ event }: { event: CalendarEvent }) {
  return (
    <li className="flex items-start gap-3 px-4 py-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
        {event.meetLink ? <Video className="size-4" /> : <Calendar className="size-4" />}
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{event.title}</p>
        <p className="text-muted-foreground text-xs">{formatTime(event.start)}</p>
        {event.location ? (
          <p className="text-muted-foreground text-xs truncate">{event.location}</p>
        ) : null}
      </div>
    </li>
  );
}

export function DashboardMeetings() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [upcoming, setUpcoming] = useState<CalendarEvent[]>([]);
  const [past, setPast] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    fetch("/api/calendar")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setUpcoming(data.upcoming || []);
          setPast(data.past || []);
        }
      })
      .catch(() => setError("Could not load calendar."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardCard className="md:col-span-2">
      <CardHeader className="border-b">
        <CardTitle>Meetings</CardTitle>
        <CardDescription>
          Upcoming and recent meetings from Google Calendar.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        {loading ? (
          <div className="grid gap-2 px-4 py-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton className="h-12 w-full" key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="px-4 py-6 text-center text-muted-foreground text-sm">
            {error}
          </div>
        ) : (
          <div className="grid md:grid-cols-2">
            <div className="border-b md:border-b-0 md:border-r">
              <p className="px-4 py-2 text-muted-foreground text-xs font-medium">
                Upcoming
              </p>
              {upcoming.length === 0 ? (
                <p className="px-4 py-4 text-muted-foreground text-sm">
                  No upcoming meetings.
                </p>
              ) : (
                <ul className="flex flex-col divide-y divide-border">
                  {upcoming.map((event) => (
                    <EventRow event={event} key={event.id} />
                  ))}
                </ul>
              )}
            </div>
            <div>
              <p className="px-4 py-2 text-muted-foreground text-xs font-medium">
                Recent (last 5)
              </p>
              {past.length === 0 ? (
                <p className="px-4 py-4 text-muted-foreground text-sm">
                  No recent meetings.
                </p>
              ) : (
                <ul className="flex flex-col divide-y divide-border">
                  {past.map((event) => (
                    <EventRow event={event} key={event.id} />
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </DashboardCard>
  );
}
