import { formatCurrency } from "@/lib/formater";

export type ClientStatus = "Aktif" | "Pause";
export type InvoiceStatus = "Paid" | "Pending" | "Overdue";
export type LeadStage = "Baru" | "Dihubungi" | "Proposal" | "Menang";
export type CampaignStatus = "Live" | "Scheduled" | "Draft";
export type BillingModel = "retainer" | "per_lead";

export type Client = {
  id: string;
  name: string;
  industry: string;
  retainer: number;
  billingModel?: BillingModel;
  amount?: number;
  status: ClientStatus;
  contact: string;
  email: string;
  phone?: string;
  since: string;
  image: string;
  notes?: string;
};

export type Invoice = {
  id: string;
  clientId: string;
  amount: number;
  status: InvoiceStatus;
  issued: string;
};

export type Lead = {
  id: string;
  name: string;
  company: string;
  source: string;
  value: number;
  stage: LeadStage;
  owner: string;
  image: string;
  externalId?: string;
};

export type Campaign = {
  id: string;
  name: string;
  clientId: string;
  channel: string;
  status: CampaignStatus;
  spend: number;
  result: string;
  image: string;
};

export const clients: Client[] = [
  {
    id: "northwind",
    name: "Northwind Labs",
    industry: "B2B SaaS",
    retainer: 4200,
    status: "Aktif",
    contact: "Alya Rahman",
    email: "alya@northwind.example",
    since: "Jan 2025",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "sinar",
    name: "Sinar Raya Coffee",
    industry: "Food & beverage",
    retainer: 2800,
    status: "Aktif",
    contact: "Dimas Putra",
    email: "dimas@sinarraya.example",
    since: "Mar 2025",
    image:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "atelier",
    name: "Atelier Muda",
    industry: "Fashion",
    retainer: 3600,
    status: "Aktif",
    contact: "Sari Wijaya",
    email: "sari@ateliermuda.example",
    since: "Nov 2024",
    image:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "biru",
    name: "Biru Studio",
    industry: "Architecture",
    retainer: 1950,
    status: "Aktif",
    contact: "Kenji Mori",
    email: "kenji@birustudio.example",
    since: "Jun 2025",
    image:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "kanvas",
    name: "Kanvas Digital",
    industry: "Education",
    retainer: 5400,
    status: "Aktif",
    contact: "Maya Chen",
    email: "maya@kanvas.example",
    since: "Aug 2024",
    image:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "harbor",
    name: "Harbor & Co",
    industry: "Logistics",
    retainer: 890,
    status: "Pause",
    contact: "Omar Hassan",
    email: "omar@harborco.example",
    since: "Feb 2025",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
  },
];

export const invoices: Invoice[] = [
  { id: "1048", clientId: "northwind", amount: 4200, status: "Paid", issued: "2026-09-02" },
  { id: "1047", clientId: "sinar", amount: 2800, status: "Paid", issued: "2026-09-02" },
  { id: "1046", clientId: "atelier", amount: 3600, status: "Pending", issued: "2026-09-08" },
  { id: "1045", clientId: "kanvas", amount: 5400, status: "Paid", issued: "2026-09-02" },
  { id: "1044", clientId: "biru", amount: 1950, status: "Pending", issued: "2026-09-12" },
  { id: "1042", clientId: "harbor", amount: 890, status: "Overdue", issued: "2026-08-04" },
];

export const leads: Lead[] = [
  {
    id: "l1",
    name: "Maya Putri",
    company: "Lautan Skin",
    source: "Instagram",
    value: 2400,
    stage: "Baru",
    owner: "Alya",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "l2",
    name: "Raka Wijaya",
    company: "Nusantara Fit",
    source: "Referral",
    value: 1800,
    stage: "Baru",
    owner: "Dimas",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "l3",
    name: "Hana Park",
    company: "Orbit Dental",
    source: "Website",
    value: 3200,
    stage: "Dihubungi",
    owner: "Sari",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "l4",
    name: "Leo Santoso",
    company: "Kiln Ceramics",
    source: "Google Ads",
    value: 1500,
    stage: "Dihubungi",
    owner: "Kenji",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "l5",
    name: "Nadia Rahman",
    company: "Padi Hotels",
    source: "LinkedIn",
    value: 8600,
    stage: "Proposal",
    owner: "Alya",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "l6",
    name: "Chris Adeyemi",
    company: "Fieldnote",
    source: "Webinar",
    value: 4100,
    stage: "Proposal",
    owner: "Maya",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "l7",
    name: "Intan Sari",
    company: "Kopi Senja",
    source: "Referral",
    value: 2200,
    stage: "Menang",
    owner: "Dimas",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
  },
];

export const campaigns: Campaign[] = [
  {
    id: "c1",
    name: "Product launch sequence",
    clientId: "northwind",
    channel: "LinkedIn",
    status: "Live",
    spend: 6400,
    result: "128 demo requests",
    image:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "c2",
    name: "Seasonal menu drop",
    clientId: "sinar",
    channel: "Instagram",
    status: "Live",
    spend: 2100,
    result: "4.8% CTR",
    image:
      "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "c3",
    name: "Lookbook retargeting",
    clientId: "atelier",
    channel: "Meta Ads",
    status: "Scheduled",
    spend: 3800,
    result: "Starts 1 Oct",
    image:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "c4",
    name: "Enrollment sprint",
    clientId: "kanvas",
    channel: "Google Ads",
    status: "Live",
    spend: 7200,
    result: "63 qualified leads",
    image:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "c5",
    name: "Project film",
    clientId: "biru",
    channel: "YouTube",
    status: "Draft",
    spend: 900,
    result: "Brief in review",
    image:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=80",
  },
];

export const leadStages: LeadStage[] = [
  "Baru",
  "Dihubungi",
  "Proposal",
  "Menang",
];

const clientProfiles: Record<
  string,
  { phone: string; notes: string; since: string; billingModel?: BillingModel }
> = {
  northwind: {
    phone: "+62 811 220 1101",
    since: "2025-01-12",
    notes:
      "Series B product analytics. Alya approves creative. They want LinkedIn demos, a monthly board narrative, and no discount-led ads.",
  },
  sinar: {
    phone: "+62 812 440 2202",
    since: "2025-03-03",
    notes:
      "Neighborhood coffee brand for office workers. Seasonal drinks drive visits. Tone should stay warm and specific, not lifestyle-generic.",
  },
  atelier: {
    phone: "+62 813 550 3303",
    since: "2024-11-18",
    notes:
      "Ready-to-wear label. Sari cares about lookbook quality and retargeting people who viewed a product twice. Avoid heavy promotional copy.",
  },
  biru: {
    phone: "+62 821 660 4404",
    since: "2025-06-09",
    notes:
      "Architecture studio selling residential projects. Kenji wants a short film and quieter LinkedIn proof, not performance ads yet.",
  },
  kanvas: {
    phone: "+62 822 770 5505",
    since: "2024-08-20",
    notes:
      "Online courses. Maya tracks cost per enrolled student. Google and Instagram both feed the same landing page. Reporting day is Monday.",
  },
  harbor: {
    phone: "+62 823 880 6606",
    since: "2025-02-02",
    billingModel: "per_lead",
    notes:
      "Logistics retainer is paused. They pay per qualified lead. Invoice 1042 is overdue, so new spend waits until that clears.",
  },
};

export type ClientView = Client & {
  billingModel: BillingModel;
  amount: number;
  phone: string;
  notes: string;
};

export function presentClient(client: Client): ClientView {
  const profile = clientProfiles[client.id];
  const since =
    /^\d{4}-\d{2}-\d{2}$/.test(client.since) ? client.since : (profile?.since ?? client.since);
  return {
    ...client,
    billingModel: client.billingModel ?? profile?.billingModel ?? "retainer",
    amount: client.amount ?? client.retainer,
    phone: client.phone ?? profile?.phone ?? "",
    notes: client.notes ?? profile?.notes ?? "",
    since,
  };
}

export function billingCaption(client: Client) {
  const view = presentClient(client);
  const money = formatCurrency(view.amount);
  return view.billingModel === "per_lead"
    ? `${money} · Bayar per Prospek`
    : `${money}/bln · Retainer`;
}

export const invoiceStatuses: InvoiceStatus[] = ["Pending", "Paid", "Overdue"];

export function nextInvoiceStatus(status: InvoiceStatus): InvoiceStatus {
  const index = invoiceStatuses.indexOf(status);
  return invoiceStatuses[(index + 1) % invoiceStatuses.length];
}

export function clientById(id: string, list: Client[] = clients) {
  return list.find((client) => client.id === id);
}

export function statusTone(status: string) {
  if (
    status === "Paid" ||
    status === "Aktif" ||
    status === "Live" ||
    status === "Menang"
  ) {
    return "bg-success/15 text-success-foreground";
  }
  if (
    status === "Pending" ||
    status === "Dihubungi" ||
    status === "Scheduled" ||
    status === "Proposal"
  ) {
    return "bg-warning/20 text-warning-foreground";
  }
  if (status === "Overdue" || status === "Pause") {
    return "bg-destructive/10 text-destructive";
  }
  return "bg-info/15 text-info-foreground";
}
