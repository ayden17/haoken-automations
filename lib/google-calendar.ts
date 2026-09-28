import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];

export type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  location?: string;
  meetLink?: string;
  attendees?: { name?: string; email: string; status?: string }[];
};

export async function getCalendarEvents(): Promise<
  { upcoming: CalendarEvent[]; past: CalendarEvent[] } | { error: string }
> {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!clientEmail || !privateKey) {
    return { error: "Google Calendar is not configured." };
  }

  const jwt = new google.auth.JWT(clientEmail, undefined, privateKey, SCOPES);
  const calendar = google.calendar({ version: "v3", auth: jwt });
  const calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";
  const now = new Date();

  try {
    const upcomingRes = await calendar.events.list({
      calendarId,
      timeMin: now.toISOString(),
      maxResults: 5,
      singleEvents: true,
      orderBy: "startTime",
    });

    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    const pastRes = await calendar.events.list({
      calendarId,
      timeMax: now.toISOString(),
      timeMin: ninetyDaysAgo.toISOString(),
      maxResults: 25,
      singleEvents: true,
      orderBy: "startTime",
    });

    const formatEvent = (event: {
      id: string;
      summary?: string;
      start?: { dateTime?: string; date?: string };
      end?: { dateTime?: string; date?: string };
      location?: string;
      hangoutLink?: string;
      attendees?: { displayName?: string; email: string; responseStatus?: string }[];
    }): CalendarEvent => ({
      id: event.id,
      title: event.summary || "(No title)",
      start: event.start?.dateTime || event.start?.date || "",
      end: event.end?.dateTime || event.end?.date || "",
      location: event.location,
      meetLink: event.hangoutLink,
      attendees: event.attendees?.map((a) => ({
        name: a.displayName,
        email: a.email,
        status: a.responseStatus,
      })),
    });

    const upcoming = (upcomingRes.data.items || []).map(formatEvent);
    const past = (pastRes.data.items || [])
      .reverse()
      .slice(0, 5)
      .map(formatEvent);

    return { upcoming, past };
  } catch {
    return { error: "Could not reach Google Calendar." };
  }
}
