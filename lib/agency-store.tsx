"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  clients as seedClients,
  invoices as seedInvoices,
  leads as seedLeads,
  nextInvoiceStatus,
  type Client,
  type Invoice,
  type InvoiceStatus,
  type Lead,
} from "@/lib/agency";

const STORAGE_KEY = "haoken-agency-v1";

type AgencyState = {
  clients: Client[];
  invoices: Invoice[];
  leads: Lead[];
};

type AgencyContextValue = AgencyState & {
  ready: boolean;
  saveError: string;
  addClient: (client: Client) => void;
  addInvoice: (invoice: Invoice) => void;
  removeInvoice: (id: string) => void;
  setInvoiceStatus: (id: string, status: InvoiceStatus) => void;
  cycleInvoiceStatus: (id: string) => void;
  addLead: (lead: Lead) => void;
  importLeads: (leads: Lead[]) => number;
};

const AgencyContext = createContext<AgencyContextValue | null>(null);

function seedState(): AgencyState {
  return {
    clients: seedClients,
    invoices: seedInvoices,
    leads: seedLeads,
  };
}

function isState(value: unknown): value is AgencyState {
  if (!value || typeof value !== "object") return false;
  const record = value as AgencyState;
  return Array.isArray(record.clients) && Array.isArray(record.invoices) && Array.isArray(record.leads);
}

export function AgencyProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AgencyState>(seedState);
  const [ready, setReady] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (isState(parsed)) setState(parsed);
      }
    } catch {
      setSaveError("Saved agency data could not be read. Showing the starter book.");
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      setSaveError("");
    } catch {
      setSaveError("This browser could not store the photo. Try a smaller image.");
    }
  }, [ready, state]);

  const value = useMemo<AgencyContextValue>(
    () => ({
      ...state,
      ready,
      saveError,
      addClient: (client) =>
        setState((current) => ({ ...current, clients: [client, ...current.clients] })),
      addInvoice: (invoice) =>
        setState((current) => ({ ...current, invoices: [invoice, ...current.invoices] })),
      removeInvoice: (id) =>
        setState((current) => ({
          ...current,
          invoices: current.invoices.filter((invoice) => invoice.id !== id),
        })),
      setInvoiceStatus: (id, status) =>
        setState((current) => ({
          ...current,
          invoices: current.invoices.map((invoice) =>
            invoice.id === id ? { ...invoice, status } : invoice,
          ),
        })),
      cycleInvoiceStatus: (id) =>
        setState((current) => ({
          ...current,
          invoices: current.invoices.map((invoice) =>
            invoice.id === id
              ? { ...invoice, status: nextInvoiceStatus(invoice.status) }
              : invoice,
          ),
        })),
      addLead: (lead) => setState((current) => ({ ...current, leads: [lead, ...current.leads] })),
      importLeads: (incoming) => {
        const known = new Set(state.leads.map((lead) => lead.externalId).filter(Boolean));
        const fresh = incoming.filter((lead) => !lead.externalId || !known.has(lead.externalId));
        if (fresh.length) {
          setState((current) => ({ ...current, leads: [...fresh, ...current.leads] }));
        }
        return fresh.length;
      },
    }),
    [ready, saveError, state],
  );

  return <AgencyContext.Provider value={value}>{children}</AgencyContext.Provider>;
}

export function useAgency() {
  const context = useContext(AgencyContext);
  if (!context) {
    throw new Error("useAgency must be used inside AgencyProvider.");
  }
  return context;
}
