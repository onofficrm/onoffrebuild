import { useEffect, useMemo, useState, type Dispatch, type FormEvent, type SetStateAction } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ExternalLink, MessageCircle, Video } from 'lucide-react';
import { ContactInterestServices } from '../components/contact/ContactInterestServices';
import {
  getInquiryOptionLabel,
  parseQueryServices,
} from '../data/contactForm';
import type { InquiryServiceSlug } from '../data/navigation';
import {
  CONSULTATION_COPY,
  KAKAO_CHANNEL_CHAT_URL,
} from '../config/consultationChannels';
import { CONSULTATION_CONFIG } from '../config/consultation';
import {
  CONSULT_TIME_SLOTS,
  validateGoogleMeetForm,
  type GoogleMeetFormState,
  type GoogleMeetFormErrors,
} from '../data/meetingConsultation';
import { submitGoogleMeetToBoard } from '../lib/submitInquiry';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { FadeIn } from '../components/ui/FadeIn';
import {
  DisplayHeading,
  LeadText,
  SectionKicker,
} from '../components/ui/Typography';

const initialForm: GoogleMeetFormState = {
  hasHomepage: '',
  websiteUrl: '',
  consultDate: '',
  consultTime: '',
  googleEmail: '',
  brief: '',
  agreed: false,
  interestServices: [],
};

function todayDateInputMin(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export function ContactPage() {
  const [searchParams] = useSearchParams();
  const serviceQuery = searchParams.get('service');
  const queryServices = useMemo(() => parseQueryServices(serviceQuery), [serviceQuery]);
  const hasQueryServices = queryServices.length > 0;

  const [interestTouched, setInterestTouched] = useState(false);
  const [interestServices, setInterestServices] = useState<InquiryServiceSlug[]>([]);
  const effectiveInterest = interestTouched ? interestServices : queryServices;

  const [form, setForm] = useState<GoogleMeetFormState>(initialForm);
  const [errors, setErrors] = useState<GoogleMeetFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [accepted, setAccepted] = useState(false);
  const isLiveMode = CONSULTATION_CONFIG.mode === 'LIVE';

  useEffect(() => {
    setInterestTouched(false);
    setInterestServices([]);
  }, [serviceQuery]);

  const pageHeading = useMemo(() => {
    if (effectiveInterest.length === 1) {
      return `${getInquiryOptionLabel(effectiveInterest[0])} 상담하기`;
    }
    return '상담하기';
  }, [effectiveInterest]);

  const leadText = useMemo(() => {
    if (effectiveInterest.length > 0) {
      const labels = effectiveInterest.map((slug) => getInquiryOptionLabel(slug)).join(', ');
      return `「${labels}」에 대한 문의입니다. 카카오톡으로 바로 연결하거나, Google Meet 화상 상담 일정을 남겨 주세요.`;
    }
    return '카카오톡으로 바로 문의하거나, Google Meet 1:1 화상 상담 일정을 남겨 주세요.';
  }, [effectiveInterest]);

  const dateMin = useMemo(() => todayDateInputMin(), []);

  const availableTimeSlots = useMemo(() => {
    if (!form.consultDate) return CONSULT_TIME_SLOTS;
    const today = todayDateInputMin();
    if (form.consultDate !== today) return CONSULT_TIME_SLOTS;

    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    return CONSULT_TIME_SLOTS.filter((slot) => {
      const [h, m] = slot.split(':').map(Number);
      const slotStart = h * 60 + m;
      return slotStart > nowMinutes;
    });
  }, [form.consultDate]);

  async function handleMeetSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validateGoogleMeetForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setSubmitError('');
    setAccepted(false);

    if (!isLiveMode) {
      setSubmitError(
        '화상 상담 예약 접수가 PREVIEW 상태입니다. 입력 내용은 화면에서만 확인됩니다.',
      );
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitGoogleMeetToBoard({
        ...form,
        interestServices: effectiveInterest,
      });
      if (result.success) {
        setAccepted(true);
        setForm(initialForm);
        setInterestTouched(false);
        setInterestServices([]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setSubmitError(result.message);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-slate-50 pb-20 pt-10 sm:pb-28 sm:pt-14">
      <Container className="max-w-3xl">
        <FadeIn>
          <SectionKicker>Contact</SectionKicker>
          <DisplayHeading className="mt-3 text-slate-950">{pageHeading}</DisplayHeading>
          <LeadText className="mt-4 max-w-2xl text-slate-600">{leadText}</LeadText>
        </FadeIn>

        {accepted && (
          <FadeIn className="mt-8">
            <div
              className="rounded-[18px] border border-blue-200 bg-blue-50/80 p-5 text-[15px] text-slate-800"
              role="status"
            >
              화상 상담 예약 요청이 접수되었습니다. 확인 후{' '}
              <strong className="font-semibold text-slate-950">Google Meet 초대</strong>를 보내
              드립니다.
            </div>
          </FadeIn>
        )}

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <FadeIn delay={0.05}>
            <a
              href={KAKAO_CHANNEL_CHAT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col rounded-[18px] border border-slate-200 bg-white p-6 shadow-[var(--shadow-subtle)] transition-colors hover:border-[#FEE500]/80 hover:bg-[#FFFCEB]"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FEE500] text-slate-900">
                  <MessageCircle className="h-5 w-5" aria-hidden="true" />
                </span>
                <h2 className="text-lg font-bold text-slate-950">{CONSULTATION_COPY.kakaoTitle}</h2>
              </div>
              <p className="mt-3 flex-1 text-[14.5px] leading-relaxed text-slate-600">
                {CONSULTATION_COPY.kakaoLead}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-blue-600 group-hover:underline">
                채널 열기
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </span>
            </a>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="flex h-full flex-col rounded-[18px] border border-slate-200 bg-white p-6 shadow-[var(--shadow-subtle)]">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
                  <Video className="h-5 w-5" aria-hidden="true" />
                </span>
                <h2 className="text-lg font-bold text-slate-950">{CONSULTATION_COPY.meetTitle}</h2>
              </div>
              <p className="mt-3 flex-1 text-[14.5px] leading-relaxed text-slate-600">
                {CONSULTATION_COPY.meetLead}
              </p>
              <a
                href="#google-meet-form"
                className="mt-4 text-[14px] font-semibold text-blue-600 hover:underline"
              >
                아래 양식으로 예약 요청
              </a>
            </div>
          </FadeIn>
        </div>

        <FadeIn className="mt-10">
          <ContactInterestServices
            selected={effectiveInterest}
            onChange={(next: InquiryServiceSlug[]) => {
              setInterestTouched(true);
              setInterestServices(next);
            }}
            fromQuery={hasQueryServices && !interestTouched}
          />
        </FadeIn>

        <FadeIn className="mt-6">
          <CardForm
            form={form}
            setForm={setForm}
            errors={errors}
            setErrors={setErrors}
            dateMin={dateMin}
            timeSlots={availableTimeSlots}
            submitError={submitError}
            submitting={submitting}
            onSubmit={handleMeetSubmit}
          />
        </FadeIn>
      </Container>
    </div>
  );
}

function CardForm(props: {
  form: GoogleMeetFormState;
  setForm: Dispatch<SetStateAction<GoogleMeetFormState>>;
  errors: GoogleMeetFormErrors;
  setErrors: Dispatch<SetStateAction<GoogleMeetFormErrors>>;
  dateMin: string;
  timeSlots: string[];
  submitError: string;
  submitting: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}) {
  const {
    form,
    setForm,
    errors,
    setErrors,
    dateMin,
    timeSlots,
    submitError,
    submitting,
    onSubmit,
  } = props;

  return (
    <div
      id="google-meet-form"
      className="rounded-[18px] border border-slate-200 bg-white p-5 sm:p-8 shadow-[var(--shadow-subtle)]"
    >
      <h3 className="text-[16px] font-bold text-slate-950">화상 상담 예약 (4항목)</h3>
      <p className="mt-1.5 text-[13.5px] text-slate-500">
        기존 홈페이지 여부 · 희망 일시 · 구글 이메일 · 상담 내용
      </p>

      <form onSubmit={onSubmit} noValidate className="mt-6 space-y-5">
        <fieldset>
          <legend className="text-[13.5px] font-semibold text-slate-950">
            기존 홈페이지 유무 <span className="text-blue-600">*</span>
          </legend>
          <div className="mt-2 flex flex-wrap gap-3">
            {(
              [
                { value: 'yes', label: '있음' },
                { value: 'no', label: '없음' },
              ] as const
            ).map((opt) => (
              <label
                key={opt.value}
                className={`flex cursor-pointer items-center gap-2 rounded-[10px] border px-4 py-2.5 text-[14px] ${
                  form.hasHomepage === opt.value
                    ? 'border-blue-600 bg-blue-50 text-slate-950'
                    : 'border-slate-300 text-slate-700 hover:border-slate-400'
                }`}
              >
                <input
                  type="radio"
                  name="hasHomepage"
                  value={opt.value}
                  checked={form.hasHomepage === opt.value}
                  onChange={() => {
                    setForm((prev) => ({
                      ...prev,
                      hasHomepage: opt.value,
                      websiteUrl: opt.value === 'no' ? '' : prev.websiteUrl,
                    }));
                    setErrors((prev) => ({
                      ...prev,
                      hasHomepage: undefined,
                      websiteUrl: undefined,
                    }));
                  }}
                  className="sr-only"
                />
                {opt.label}
              </label>
            ))}
          </div>
          {errors.hasHomepage && (
            <p className="mt-1.5 text-[12.5px] text-[#DC2626]" role="alert">
              {errors.hasHomepage}
            </p>
          )}
        </fieldset>

        {form.hasHomepage === 'yes' && (
          <div>
            <label
              htmlFor="meet-website-url"
              className="block text-[13.5px] font-semibold text-slate-950"
            >
              홈페이지 URL <span className="text-blue-600">*</span>
            </label>
            <input
              id="meet-website-url"
              type="url"
              inputMode="url"
              value={form.websiteUrl}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, websiteUrl: e.target.value }));
                if (errors.websiteUrl) setErrors((prev) => ({ ...prev, websiteUrl: undefined }));
              }}
              placeholder="https://example.com"
              className={`mt-1.5 min-h-[46px] w-full rounded-[10px] border bg-white px-3.5 py-2.5 text-[15px] ${
                errors.websiteUrl ? 'border-[#DC2626]' : 'border-slate-300'
              }`}
            />
            {errors.websiteUrl && (
              <p className="mt-1.5 text-[12.5px] text-[#DC2626]" role="alert">
                {errors.websiteUrl}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="meet-date"
              className="block text-[13.5px] font-semibold text-slate-950"
            >
              상담 희망 날짜 <span className="text-blue-600">*</span>
            </label>
            <input
              id="meet-date"
              type="date"
              min={dateMin}
              value={form.consultDate}
              onChange={(e) => {
                setForm((prev) => ({
                  ...prev,
                  consultDate: e.target.value,
                  consultTime:
                    prev.consultDate === e.target.value ? prev.consultTime : '',
                }));
                if (errors.consultDate) setErrors((prev) => ({ ...prev, consultDate: undefined }));
              }}
              className={`mt-1.5 min-h-[46px] w-full rounded-[10px] border bg-white px-3.5 py-2.5 text-[15px] ${
                errors.consultDate ? 'border-[#DC2626]' : 'border-slate-300'
              }`}
            />
            {errors.consultDate && (
              <p className="mt-1.5 text-[12.5px] text-[#DC2626]" role="alert">
                {errors.consultDate}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="meet-time"
              className="block text-[13.5px] font-semibold text-slate-950"
            >
              상담 희망 시간 (30분) <span className="text-blue-600">*</span>
            </label>
            <select
              id="meet-time"
              value={form.consultTime}
              disabled={!form.consultDate}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, consultTime: e.target.value }));
                if (errors.consultTime) setErrors((prev) => ({ ...prev, consultTime: undefined }));
              }}
              className={`mt-1.5 min-h-[46px] w-full rounded-[10px] border bg-white px-3.5 py-2.5 text-[15px] disabled:opacity-50 ${
                errors.consultTime ? 'border-[#DC2626]' : 'border-slate-300'
              }`}
            >
              <option value="">
                {form.consultDate ? '시간 선택' : '먼저 날짜를 선택하세요'}
              </option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot} ~ {addThirtyMinutes(slot)}
                </option>
              ))}
            </select>
            <p className="mt-1 text-[12px] text-slate-500">09:00 ~ 22:00, 30분 단위</p>
            {errors.consultTime && (
              <p className="mt-1.5 text-[12.5px] text-[#DC2626]" role="alert">
                {errors.consultTime}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="meet-google-email"
            className="block text-[13.5px] font-semibold text-slate-950"
          >
            구글 이메일 <span className="text-blue-600">*</span>
          </label>
          <input
            id="meet-google-email"
            type="email"
            autoComplete="email"
            value={form.googleEmail}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, googleEmail: e.target.value }));
              if (errors.googleEmail) setErrors((prev) => ({ ...prev, googleEmail: undefined }));
            }}
            placeholder="name@gmail.com"
            className={`mt-1.5 min-h-[46px] w-full rounded-[10px] border bg-white px-3.5 py-2.5 text-[15px] ${
              errors.googleEmail ? 'border-[#DC2626]' : 'border-slate-300'
            }`}
          />
          {errors.googleEmail && (
            <p className="mt-1.5 text-[12.5px] text-[#DC2626]" role="alert">
              {errors.googleEmail}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="meet-brief" className="block text-[13.5px] font-semibold text-slate-950">
            상담 내용 (간단히) <span className="text-blue-600">*</span>
          </label>
          <textarea
            id="meet-brief"
            rows={4}
            value={form.brief}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, brief: e.target.value }));
              if (errors.brief) setErrors((prev) => ({ ...prev, brief: undefined }));
            }}
            placeholder="어떤 부분을 상담받고 싶은지 간단히 적어 주세요."
            className={`mt-1.5 w-full rounded-[10px] border bg-white px-3.5 py-2.5 text-[15px] ${
              errors.brief ? 'border-[#DC2626]' : 'border-slate-300'
            }`}
          />
          {errors.brief && (
            <p className="mt-1.5 text-[12.5px] text-[#DC2626]" role="alert">
              {errors.brief}
            </p>
          )}
        </div>

        <label className="flex cursor-pointer items-start gap-3 text-[13.5px] text-slate-700">
          <input
            type="checkbox"
            checked={form.agreed}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, agreed: e.target.checked }));
              if (errors.agreed) setErrors((prev) => ({ ...prev, agreed: undefined }));
            }}
            className="mt-1 h-4 w-4 rounded border-slate-300"
          />
          <span>
            개인정보 수집·이용에 동의합니다. (상담 목적의 연락·일정 조율에만 사용합니다.)
          </span>
        </label>
        {errors.agreed && (
          <p className="text-[12.5px] text-[#DC2626]" role="alert">
            {errors.agreed}
          </p>
        )}

        {submitError && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[13.5px] text-[#DC2626]" role="alert">
            {submitError}
          </p>
        )}

        <Button type="submit" variant="primary" size="lg" disabled={submitting} className="w-full sm:w-auto">
          {submitting ? '접수 중…' : '화상 상담 예약 요청'}
        </Button>
      </form>
    </div>
  );
}

function addThirtyMinutes(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + 30;
  const nh = Math.floor(total / 60);
  const nm = total % 60;
  return `${String(nh).padStart(2, '0')}:${String(nm).padStart(2, '0')}`;
}