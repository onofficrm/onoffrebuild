import { API_ENDPOINTS } from '../config/api';
import { apiJson } from './apiClient';

export type ContractAgreements = {
  readAll: boolean;
  personalUse: boolean;
  noRedistribute: boolean;
  electronic: boolean;
};

export type ContractFormFields = {
  companyName: string;
  representativeName: string;
  businessNumber: string;
  companyAddress: string;
  companyPhone: string;
  signerName: string;
  signerPosition: string;
  signerPhone: string;
  signerEmail: string;
  serviceScope: string;
  amount: string;
  startDate: string;
  endDate: string;
  negotiatedTerms: string;
  specialClauses: string;
  agreements: ContractAgreements;
  step?: number;
};

export type ContractAccessApi = {
  applies?: boolean;
  signed?: boolean;
  blocked?: boolean;
  status?: string;
  viewable?: boolean;
  requires?: boolean;
  rejectionReason?: string;
};

export type ContractPackage = {
  id?: string;
  version?: string;
  title?: string;
  serviceScope?: string;
  amount?: string;
  durationLabel?: string;
};

export type ContractViewPayload = {
  access?: ContractAccessApi;
  canWrite?: boolean;
  form?: Partial<ContractFormFields>;
  contractHtml?: string;
  partyB?: Record<string, string>;
  package?: ContractPackage;
  hasSignature?: boolean;
  isApprovalPending?: boolean;
  isRejected?: boolean;
  rejectionReason?: string;
  urls?: { document?: string; download?: string; signature?: string };
  contract?: Record<string, unknown> | null;
  csrfToken?: string;
};

export type ContractReadPayload = {
  contract?: Record<string, unknown> | null;
  history?: Array<{ version?: string; status?: string; signedAt?: string }>;
  addenda?: Array<{ id?: number; title?: string; body?: string; createdAt?: string }>;
  canAddAddendum?: boolean;
};

function postContract<T>(body: Record<string, unknown>): Promise<T> {
  return apiJson<T>(API_ENDPOINTS.contract, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function getContract(): Promise<ContractViewPayload> {
  return apiJson<ContractViewPayload>(API_ENDPOINTS.contract);
}

export function getContractRead(version?: string): Promise<ContractReadPayload> {
  const qs = version ? `?mode=read&version=${encodeURIComponent(version)}` : '?mode=read';
  return apiJson<ContractReadPayload>(`${API_ENDPOINTS.contract}${qs}`);
}

export function saveDraft(form: Partial<ContractFormFields>): Promise<{ message?: string; contract?: unknown }> {
  return postContract({ action: 'draft', ...form });
}

export function saveSignature(signatureData: string): Promise<{ message?: string; path?: string }> {
  return postContract({ action: 'signature', signatureData });
}

export function validate(form: Partial<ContractFormFields>): Promise<{ validated?: boolean; contract?: unknown }> {
  return postContract({ action: 'validate', ...form });
}

export function sign(
  form: Partial<ContractFormFields>,
  signatureData: string
): Promise<{ message?: string; contract?: unknown }> {
  return postContract({ action: 'sign', ...form, signatureData });
}

export function addAddendum(payload: { title: string; body: string }): Promise<{ message?: string; id?: number }> {
  return postContract({ action: 'add_addendum', ...payload });
}
