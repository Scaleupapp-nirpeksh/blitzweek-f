// src/components/RegistrationForm.jsx
import React, { useEffect, useMemo, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import api, { endpoints } from '../api/client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import confetti from 'canvas-confetti';

/* ───────── schema ───────── */
const schema = z.object({
  name: z.string().min(2, 'Enter your full name').max(100).regex(/^[a-zA-Z\s]+$/, 'Only letters and spaces'),
  ldapId: z.string().email('Enter a valid email').regex(/@iitb\.ac\.in$/i, 'Use your IITB email'),
  rollNumber: z.string().min(1, 'Roll number is required'),
  branch: z.string().min(1, 'Select your branch'),
  year: z.string().min(1, 'Select your year'),
  phoneNumber: z.string().optional().refine(v => !v || /^[6-9]\d{9}$/.test(v), { message: 'Enter 10-digit Indian mobile' }),
  interestedEvents: z.enum(['ScaleUp Blitz', 'ScaleUp Ignite', 'Both']),
});

/* ───────── visuals ───────── */
const spin = keyframes`to { transform: rotate(360deg); }`;
const appear = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 } };

const Section = styled.section`
  padding: 56px 0 72px;
  position: relative;
`;

const Card = styled(motion.form)`
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 24px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
`;

const TopBar = styled.div`
  position: absolute;
  inset: 0 0 auto 0;
  height: 4px;
  background: ${({ theme }) => theme.colors.line};
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${({ $pct }) => `${Math.max(6, Math.min(100, Math.round($pct))) }%`};
  background: ${({ theme }) => theme.colors.accent};
  transition: width .25s ease;
`;

const Header = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  gap: 12px; margin-bottom: 16px; flex-wrap: wrap;
`;

const Title = styled.h2`
  margin: 0;
  font-size: clamp(20px, 3vw, 28px);
  letter-spacing: -0.02em;
`;

const Badge = styled.span`
  display: inline-flex; align-items: center; gap: 8px;
  padding: 8px 12px;
  background: rgba(255,255,255,0.06);
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${({ theme }) => theme.radii.pill};
  font-size: 12px; color: ${({ theme }) => theme.colors.subtext};
`;

const Banner = styled(motion.div)`
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 10px 12px; margin-bottom: 12px;
  font-size: 14px; color: ${({ theme }) => theme.colors.subtext};
`;

const Success = styled(Banner)`
  border-color: rgba(93,211,158,.5);
  color:#77e2b4; background: rgba(93,211,158,.10);
`;
const Danger = styled(Banner)`
  border-color: rgba(255,107,107,.5);
  color:#ff9b9b; background: rgba(255,107,107,.10);
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0,1fr));
  gap: 14px;
  @media (max-width: 800px){ grid-template-columns: 1fr; }
`;

const Field = styled.div`
  display:flex; flex-direction:column; gap:8px;
`;

const LabelRow = styled.div`
  display:flex; align-items:center; justify-content:space-between; gap:8px;
`;

const Label = styled.label`
  font-size: 13px; color: ${({ theme }) => theme.colors.subtext};
`;

const InputWrap = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme, $invalid }) => $invalid ? theme.colors.error : theme.colors.line};
  color: ${({ theme }) => theme.colors.text};
  padding: 12px 40px 12px 14px;
  border-radius: ${({ theme }) => theme.radii.md};
  outline: none;
  transition: border-color .15s ease, box-shadow .15s ease, background .2s ease;

  &::placeholder{ color: rgba(255,255,255,.42); }
  &:focus{
    border-color: ${({ theme }) => theme.colors.lineFocus};
    box-shadow: 0 0 0 3px rgba(245,188,0,.15);
    background: ${({ theme }) => theme.colors.surfaceHover};
  }
`;

const Select = styled.select`
  width: 100%;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme, $invalid }) => $invalid ? theme.colors.error : theme.colors.line};
  color: ${({ theme }) => theme.colors.text};
  padding: 12px 14px; border-radius: ${({ theme }) => theme.radii.md};
  outline: none;
  transition: border-color .15s ease, box-shadow .15s ease, background .2s ease;

  &:focus{
    border-color: ${({ theme }) => theme.colors.lineFocus};
    box-shadow: 0 0 0 3px rgba(245,188,0,.15);
    background: ${({ theme }) => theme.colors.surfaceHover};
  }
`;

const Help = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-size: 12px; min-height: 16px;
`;

const Adorner = styled.span`
  position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
  display: inline-flex; align-items: center; justify-content: center;
  width: 18px; height: 18px; border-radius: 999px;
  color: ${({ theme }) => theme.colors.text};
`;

const Spinner = styled.span`
  width: 16px; height: 16px; border: 2px solid rgba(255,255,255,.35);
  border-top-color: ${({ theme }) => theme.colors.accent};
  border-radius: 999px; display:inline-block; animation: ${spin} .8s linear infinite;
`;

const Dot = styled.span`
  width: 10px; height: 10px; border-radius: 50%;
  background: ${({ $ok }) => $ok ? '#5dd39e' : '#94a3ad'};
  box-shadow: 0 0 0 3px rgba(255,255,255,.05);
  display:inline-block;
`;

/* segmented control */
const Segmented = styled.div`
  display:inline-grid; grid-auto-flow:column; gap:6px;
  background: rgba(255,255,255,.05);
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 4px;
`;

const SegBtn = styled.button`
  appearance:none; border:0; cursor:pointer;
  padding: 10px 16px; border-radius: ${({ theme }) => theme.radii.md};
  font-weight:800; font-size: 13px;
  color: ${({ $active, theme }) => $active ? '#0b2230' : theme.colors.text};
  background: ${({ $active, theme }) => $active ? theme.colors.accent : 'transparent'};
  transition: transform .12s ease, background .2s ease, box-shadow .2s ease;

  &:hover{ transform: translateY(-1px); }
  &:focus-visible{ outline: 2px solid ${({ theme }) => theme.colors.lineFocus}; }
`;

const Row = styled.div`
  display:flex; gap:12px; align-items:center; flex-wrap:wrap;
`;

const Submit = styled.button`
  margin-top: 10px;
  background: ${({ theme }) => theme.colors.accent}; color:#0b2230;
  border: none; border-radius: ${({ theme }) => theme.radii.lg};
  padding: 12px 18px; font-weight: 800;
  cursor: pointer; display:inline-flex; align-items:center; gap: 10px;
  transition: transform .12s ease, background .2s ease, box-shadow .2s ease;
  box-shadow: ${({ theme }) => theme.shadows.glow};

  &:hover:not(:disabled){ transform: translateY(-1px); background: ${({ theme }) => theme.colors.accentDark}; }
  &:disabled{ opacity: .6; cursor: not-allowed; }
`;

const FinePrint = styled.div`
  margin-top: 10px; font-size: 12px; color: ${({ theme }) => theme.colors.mutedText};
`;

/* ───────── data ───────── */
const branches = [
  'Aerospace Engineering','Chemical Engineering','Civil Engineering','Computer Science and Engineering',
  'Electrical Engineering','Engineering Physics','Environmental Science and Engineering','Mechanical Engineering',
  'Metallurgical Engineering and Materials Science','Biosciences and Bioengineering','Chemistry','Earth Sciences',
  'Mathematics','Physics','Climate Studies','Educational Technology','Energy Science and Engineering',
  'Systems and Control Engineering','Technology and Development','Economics','Other'
];
const years = ['1st Year','2nd Year','3rd Year','4th Year','5th Year','MTech','PhD','Other'];

/* helpers */
function mapTrack(t){
  const v = (t || '').toLowerCase();
  if (v === 'ignite') return 'ScaleUp Ignite';
  if (v === 'both') return 'Both';
  return 'ScaleUp Blitz';
}
function shortTrack(long){
  if (long === 'ScaleUp Ignite') return 'ignite';
  if (long === 'Both') return 'both';
  return 'blitz';
}

/* ───────── component ───────── */
export default function RegistrationForm(){
  const [checking, setChecking] = useState(false);
  const [dup, setDup] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // ?track=blitz|ignite|both (also supports #register?track=blitz)
  const defaultTrack = useMemo(() => {
    try {
      const u = new URL(window.location.href);
      const fromSearch = u.searchParams.get('track');
      if (fromSearch) return mapTrack(fromSearch);
      if (u.hash.includes('track=')) {
        const sp = new URLSearchParams(u.hash.split('?')[1] || '');
        const h = sp.get('track');
        if (h) return mapTrack(h);
      }
    } catch {}
    return 'ScaleUp Blitz';
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    watch,
    reset,
    formState: { errors, isSubmitting, isValid }
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: { interestedEvents: defaultTrack }
  });

  const name = watch('name');
  const ldapId = watch('ldapId');
  const rollNumber = watch('rollNumber');
  const branch = watch('branch');
  const year = watch('year');
  const interested = watch('interestedEvents');

  // completion % for progress bar (phone optional)
  const requiredFilled = [
    Boolean(name && name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name.trim())),
    Boolean(ldapId && /@iitb\.ac\.in$/i.test(ldapId) && /^\S+@\S+\.\S+$/.test(ldapId)),
    Boolean(rollNumber && rollNumber.trim().length > 0),
    Boolean(branch),
    Boolean(year),
    Boolean(interested)
  ].filter(Boolean).length;
  const pct = (requiredFilled / 6) * 100;

  // normalize inputs
  const normalizeEmail = (e) => { e.target.value = e.target.value.trim().toLowerCase(); };
  const normalizeRoll = (e) => { e.target.value = e.target.value.trim().toUpperCase(); };
  const normalizeName = (e) => { e.target.value = e.target.value.replace(/\s+/g,' ').trim(); };

  // duplicate checker (ldap or roll)
  useEffect(()=>{
    let abort = false;
    const check = async (identifier, field) => {
      setChecking(true); setDup(null);
      try{
        await api.get(endpoints.check(identifier)); // 200 => exists
        if (!abort) {
          setDup('Already registered with this identifier.');
          setError(field, { type: 'manual', message: 'Already registered.' });
        }
      }catch(e){
        // 404 => not registered
        if (!abort) { setDup(null); clearErrors(field); }
      }
      if (!abort) setChecking(false);
    };
    const t = setTimeout(()=>{
      if(ldapId && /@iitb\.ac\.in$/i.test(ldapId)) check(ldapId, 'ldapId');
      else if(rollNumber && rollNumber.trim().length > 0) check(rollNumber, 'rollNumber');
    }, 500);
    return ()=> { abort = true; clearTimeout(t); };
  }, [ldapId, rollNumber, setError, clearErrors]);

  const onSubmit = async (values) => {
    if(dup) return;
    setSuccessMsg(null);
    try{
      const payload = {
        ...values,
        name: values.name.trim(),
        ldapId: values.ldapId.trim().toLowerCase(),
        rollNumber: values.rollNumber.trim().toUpperCase(),
        interestedEvents: values.interestedEvents,
      };
      const res = await api.post(endpoints.register, payload);
      if(res.data?.success){
        confetti({ particleCount: 180, spread: 70, origin: { y: .7 } });
        setSuccessMsg(`Registration successful — Reg No: ${res.data.data.registrationNumber}`);
        reset({ interestedEvents: values.interestedEvents, name:'', ldapId:'', rollNumber:'', branch:'', year:'', phoneNumber:'' });
        try {
          const u = new URL(window.location.href);
          u.searchParams.set('track', shortTrack(values.interestedEvents));
          window.history.replaceState({}, '', u.toString());
        } catch {}
      }
    }catch(e){
      const msg = e?.response?.data?.message || 'Failed to register. Try again.';
      setSuccessMsg(null);
      alert(msg);
    }
  };

  // adorners logic
  const showOk = (field) => {
    if (field === 'name') return !!name && !errors.name;
    if (field === 'ldapId') return !!ldapId && !errors.ldapId && !checking && !dup;
    if (field === 'rollNumber') return !!rollNumber && !errors.rollNumber && !checking && !dup;
    if (field === 'branch') return !!branch && !errors.branch;
    if (field === 'year') return !!year && !errors.year;
    return false;
  };

  const showSpin = (field) => {
    if (checking && (field === 'ldapId' || field === 'rollNumber')) return true;
    return false;
  };

  return (
    <Section id="register">
      <div className="container">
        <Card
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .4 }}
        >
          <TopBar aria-hidden>
            <ProgressFill $pct={pct} />
          </TopBar>

          <Header>
            <Title>Register Now</Title>
            <Badge><Dot $ok /> IITB students only · LDAP required</Badge>
          </Header>

          <AnimatePresence initial={false}>
            {successMsg ? (
              <Success key="ok" {...appear} aria-live="polite">
                <Dot $ok /> {successMsg}
              </Success>
            ) : (
              <Banner key="hint" {...appear}>
                Use your IITB LDAP email and official roll number. If you've already registered, we'll flag it automatically.
              </Banner>
            )}
          </AnimatePresence>

          <AnimatePresence initial={false}>
            {dup && (
              <Danger key="dup" {...appear} aria-live="polite">
                ⚠️ {dup}
              </Danger>
            )}
          </AnimatePresence>

          <Grid>
            <Field>
              <LabelRow>
                <Label htmlFor="name">Name</Label>
              </LabelRow>
              <InputWrap>
                <Input
                  id="name"
                  placeholder="Your full name"
                  autoComplete="name"
                  {...register('name')}
                  onBlur={normalizeName}
                  aria-invalid={!!errors.name}
                  $invalid={!!errors.name}
                />
                <Adorner aria-hidden>
                  {showSpin('name') ? <Spinner /> : showOk('name') ? '✓' : null}
                </Adorner>
              </InputWrap>
              <Help role="alert">{errors.name?.message}</Help>
            </Field>

            <Field>
              <LabelRow>
                <Label htmlFor="ldap">LDAP Email (@iitb.ac.in)</Label>
              </LabelRow>
              <InputWrap>
                <Input
                  id="ldap"
                  placeholder="example@iitb.ac.in"
                  autoComplete="email"
                  {...register('ldapId')}
                  onBlur={normalizeEmail}
                  inputMode="email"
                  aria-invalid={!!errors.ldapId}
                  $invalid={!!errors.ldapId || !!dup}
                />
                <Adorner aria-hidden>
                  {showSpin('ldapId') ? <Spinner /> : showOk('ldapId') ? '✓' : null}
                </Adorner>
              </InputWrap>
              <Help role="alert">{errors.ldapId?.message}</Help>
            </Field>

            <Field>
              <LabelRow>
                <Label htmlFor="roll">Roll Number</Label>
              </LabelRow>
              <InputWrap>
                <Input
                  id="roll"
                  placeholder="Enter your roll number"
                  {...register('rollNumber')}
                  onBlur={normalizeRoll}
                  aria-invalid={!!errors.rollNumber}
                  $invalid={!!errors.rollNumber || !!dup}
                />
                <Adorner aria-hidden>
                  {showSpin('rollNumber') ? <Spinner /> : showOk('rollNumber') ? '✓' : null}
                </Adorner>
              </InputWrap>
              <Help role="alert">{errors.rollNumber?.message}</Help>
            </Field>

            <Field>
              <Label htmlFor="branch">Branch</Label>
              <Select
                id="branch"
                {...register('branch')}
                aria-invalid={!!errors.branch}
                $invalid={!!errors.branch}
              >
                <option value="">Select branch</option>
                {branches.map(b => <option key={b} value={b}>{b}</option>)}
              </Select>
              <Help role="alert">{errors.branch?.message}</Help>
            </Field>

            <Field>
              <Label htmlFor="year">Year</Label>
              <Select
                id="year"
                {...register('year')}
                aria-invalid={!!errors.year}
                $invalid={!!errors.year}
              >
                <option value="">Select year</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </Select>
              <Help role="alert">{errors.year?.message}</Help>
            </Field>

            <Field>
              <Label htmlFor="phone">Phone</Label>
              <InputWrap>
                <Input
                  id="phone"
                  placeholder="10-digit mobile"
                  {...register('phoneNumber')}
                  inputMode="numeric" pattern="[0-9]*" maxLength={10}
                  aria-invalid={!!errors.phoneNumber}
                  $invalid={!!errors.phoneNumber}
                />
                <Adorner aria-hidden>
                  {errors.phoneNumber ? '!' : null}
                </Adorner>
              </InputWrap>
              <Help role="alert">{errors.phoneNumber?.message}</Help>
            </Field>
          </Grid>

          <div style={{height:8}} />

          {/* Segmented event selector */}
          <Field>
            <Label>Interested Event</Label>
            <Segmented role="tablist" aria-label="Event selection">
              {[
                {k:'ScaleUp Blitz', label:'Blitz'},
                {k:'ScaleUp Ignite', label:'Ignite'},
                {k:'Both', label:'Both'},
              ].map(o => (
                <SegBtn
                  key={o.k}
                  type="button"
                  role="tab"
                  aria-selected={interested === o.k}
                  $active={interested === o.k}
                  onClick={()=> setValue('interestedEvents', o.k, { shouldValidate:true, shouldDirty:true })}
                >
                  {o.label}
                </SegBtn>
              ))}
            </Segmented>
            <Help role="alert">{errors.interestedEvents?.message}</Help>
          </Field>

          <Row style={{marginTop:12}}>
            <Submit disabled={isSubmitting || checking || !!dup || !isValid}>
              {(isSubmitting || checking) && <Spinner aria-hidden />}
              {isSubmitting ? 'Submitting…' : checking ? 'Checking…' : 'Submit Registration'}
            </Submit>
            {checking && <span style={{fontSize:12, color:'var(--muted,#9fb3bf)'}}><Dot /> Verifying duplicate registration…</span>}
          </Row>

          <FinePrint>
            We'll email event details to your LDAP. By registering, you agree to be contacted about Blitz Week logistics.
          </FinePrint>
        </Card>
      </div>
    </Section>
  );
}