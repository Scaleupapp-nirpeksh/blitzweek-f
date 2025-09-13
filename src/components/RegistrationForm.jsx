import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import api, { endpoints } from '../api/client'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import confetti from 'canvas-confetti'

const Wrap = styled.section`
  padding: 28px 0 48px;
`
const Card = styled.form`
  background: rgba(255,255,255,0.04);
  border: 1px solid ${({theme})=> theme.colors.line };
  border-radius: 24px;
  padding: 20px;
  box-shadow: ${({theme})=> theme.shadows.card };
  max-width: 860px; margin: 0 auto;
`
const Title = styled.h2` margin: 0 0 12px; `
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0,1fr));
  gap: 14px;
  @media (max-width: 800px){ grid-template-columns: 1fr; }
`
const Field = styled.div` display:flex; flex-direction:column; gap:8px; `
const Label = styled.label` font-size: 13px; color: ${({theme})=> theme.colors.subtext}; `
const Input = styled.input`
  background: #0f3a4b;
  border: 1px solid ${({theme})=> theme.colors.line};
  color: ${({theme})=> theme.colors.text};
  padding: 12px 14px; border-radius: 12px; outline: none;
  &:focus{ border-color: ${({theme})=> theme.colors.accent}; box-shadow: 0 0 0 3px rgba(245,188,0,0.15); }
`
const Select = styled.select`
  background: #0f3a4b;
  border: 1px solid ${({theme})=> theme.colors.line};
  color: ${({theme})=> theme.colors.text};
  padding: 12px 14px; border-radius: 12px;
  &:focus{ border-color: ${({theme})=> theme.colors.accent}; box-shadow: 0 0 0 3px rgba(245,188,0,0.15); }
`
const Help = styled.div` color: #e89; font-size: 12px; min-height: 16px; `
const Row = styled.div` display:flex; gap:12px; align-items:center; flex-wrap:wrap; `
const Radio = styled.input` accent-color: ${({theme})=> theme.colors.accent}; `
const Submit = styled.button`
  margin-top: 10px;
  background: ${({theme})=> theme.colors.accent}; color:#0b2230;
  border: none; border-radius: 14px; padding: 12px 18px; font-weight: 800;
  cursor: pointer;
  &:disabled{ opacity: .6; cursor: not-allowed; }
`
const Banner = styled.div`
  background: rgba(0,0,0,0.35);
  border: 1px solid ${({theme})=> theme.colors.line};
  border-radius: 12px;
  padding: 10px 12px; margin-bottom: 12px;
  font-size: 14px; color: ${({theme})=> theme.colors.subtext};
`

const schema = z.object({
  name: z.string().min(2).max(100).regex(/^[a-zA-Z\s]+$/,"Only letters and spaces"),
  ldapId: z.string().email().regex(/@iitb\.ac\.in$/i, "Use your IITB email"),
  rollNumber: z.string().regex(/^[0-9]{2}[A-Z][0-9]{4,5}$/i, "e.g., 21B1234"),
  branch: z.string().min(1),
  year: z.string().min(1),
  phoneNumber: z.string().optional().refine((v)=> !v || /^[6-9]\d{9}$/.test(v), {message: 'Enter 10‑digit Indian mobile'}),
  interestedEvents: z.enum(['ScaleUp Blitz','ScaleUp Ignite','Both'])
})

const branches = [
  'Aerospace Engineering',
  'Chemical Engineering',
  'Civil Engineering',
  'Computer Science and Engineering',
  'Electrical Engineering',
  'Engineering Physics',
  'Environmental Science and Engineering',
  'Mechanical Engineering',
  'Metallurgical Engineering and Materials Science',
  'Biosciences and Bioengineering',
  'Chemistry',
  'Earth Sciences',
  'Mathematics',
  'Physics',
  'Climate Studies',
  'Educational Technology',
  'Energy Science and Engineering',
  'Systems and Control Engineering',
  'Technology and Development',
  'Other'
]

const years = ['1st Year','2nd Year','3rd Year','4th Year','5th Year','MTech','PhD','Other']

export default function RegistrationForm(){
  const [checking, setChecking] = useState(false)
  const [dup, setDup] = useState(null)

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { interestedEvents: 'ScaleUp Blitz' }
  })

  const ldapId = watch('ldapId'); const rollNumber = watch('rollNumber')

  useEffect(()=>{
    const check = async (identifier) => {
      setChecking(true)
      setDup(null)
      try{
        await api.get(endpoints.check(identifier))
        setDup('Already registered with this identifier.')
      }catch(e){ /* 404 is ok, means not registered */ }
      setChecking(false)
    }
    const t = setTimeout(()=>{
      if(ldapId && /@iitb\.ac\.in$/i.test(ldapId)) check(ldapId)
      else if(rollNumber && /^[0-9]{2}[A-Z][0-9]{4,5}$/i.test(rollNumber)) check(rollNumber)
    }, 600)
    return ()=> clearTimeout(t)
  }, [ldapId, rollNumber])

  const onSubmit = async (values) => {
    if(dup) return
    try{
      const res = await api.post(endpoints.register, {
        ...values,
        interestedEvents: values.interestedEvents
      })
      if(res.data?.success){
        confetti({ particleCount: 140, spread: 70, origin: { y: .7 } })
        alert(`Registration successful!\nReg No: ${res.data.data.registrationNumber}`)
      }
    }catch(e){
      const msg = e?.response?.data?.message || 'Failed to register. Try again.'
      alert(msg)
    }
  }

  return (
    <Wrap id="register">
      <div className="container">
        <Card onSubmit={handleSubmit(onSubmit)}>
          <Title>Register Now</Title>
          <Banner>
            Use your IITB LDAP email and official roll number. If you’ve already registered, the form will notify you automatically.
          </Banner>
          <Grid>
            <Field>
              <Label>Name</Label>
              <Input placeholder="Your full name" {...register('name')} />
              <Help>{errors.name?.message}</Help>
            </Field>
            <Field>
              <Label>LDAP Email (@iitb.ac.in)</Label>
              <Input placeholder="example@iitb.ac.in" {...register('ldapId')} />
              <Help>{errors.ldapId?.message}</Help>
            </Field>
            <Field>
              <Label>Roll Number</Label>
              <Input placeholder="21B1234" {...register('rollNumber')} />
              <Help>{errors.rollNumber?.message}</Help>
            </Field>
            <Field>
              <Label>Branch</Label>
              <Select {...register('branch')}>
                <option value="">Select branch</option>
                {branches.map(b => <option key={b} value={b}>{b}</option>)}
              </Select>
              <Help>{errors.branch?.message}</Help>
            </Field>
            <Field>
              <Label>Year</Label>
              <Select {...register('year')}>
                <option value="">Select year</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </Select>
              <Help>{errors.year?.message}</Help>
            </Field>
            <Field>
              <Label>Phone (optional)</Label>
              <Input placeholder="10-digit mobile" {...register('phoneNumber')} />
              <Help>{errors.phoneNumber?.message}</Help>
            </Field>
          </Grid>

          <div style={{height:8}} />

          <Field>
            <Label>Interested Event</Label>
            <Row role="group" aria-label="Event selection">
              {['ScaleUp Blitz','ScaleUp Ignite','Both'].map(v => (
                <label key={v} style={{display:'flex', alignItems:'center', gap:8}}>
                  <Radio type="radio" value={v} {...register('interestedEvents')} />
                  {v}
                </label>
              ))}
            </Row>
            <Help>{errors.interestedEvents?.message}</Help>
          </Field>

          <div style={{display:'flex', gap:12, alignItems:'center', marginTop:12}}>
            <Submit disabled={isSubmitting || checking || !!dup}>{checking ? 'Checking…' : 'Submit Registration'}</Submit>
            {dup && <span style={{color:'#f79'}}>{dup}</span>}
          </div>
        </Card>
      </div>
    </Wrap>
  )
}
