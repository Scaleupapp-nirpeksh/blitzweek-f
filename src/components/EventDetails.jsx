// src/components/EventDetails.jsx
import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

/* ───────────────── Variants ───────────────── */
const fadeUp = {
  initial: { opacity: 0, y: 18 },
  in:      { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.2,0.8,0.2,1] } },
  out:     { opacity: 0, y: -12, transition: { duration: 0.25, ease: [0.4,0,1,1] } },
};

const sweep = keyframes`
  from { background-position: 0% 50%; }
  to   { background-position: 200% 50%; }
`;

/* ───────────────── Styled ───────────────── */
const Section = styled.section`
  padding: 80px 0;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  position: relative;

  @media (max-width: 768px) { padding: 60px 0; }
`;

const Container = styled.div`
  max-width: ${({theme})=> theme.layout.maxWidth};
  margin: 0 auto;
  padding: 0 ${({theme})=> theme.layout.containerPadding};
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const SectionTitle = styled.h2`
  font-size: ${({theme})=> theme.typography.fluid.h2};
  font-weight: 700;
  letter-spacing: ${props=> props.theme.typography.letterSpacing.tight};
  margin: 0 0 10px;
`;

const SectionSubtitle = styled.p`
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.subtext};
  max-width: 680px;
  margin: 0 auto 18px;
`;

const AccentUnderline = styled.div`
  height: 2px;
  width: 96px;
  margin: 0 auto 28px;
  border-radius: 999px;
  background: ${({theme})=> theme.colors.gradientGold};
  box-shadow: 0 0 18px rgba(245,188,0,.25);
`;

const PrizeHighlight = styled(motion.div)`
  margin: 0 auto 36px;
  max-width: 820px;
  padding: 18px;
  border-radius: ${({theme})=> theme.radii.lg};
  position: relative;

  /* animated border sweep */
  background: linear-gradient(120deg,
    rgba(255,255,255,.12),
    rgba(245,188,0,.35),
    rgba(255,255,255,.12),
    rgba(100,181,246,.28),
    rgba(255,255,255,.12));
  background-size: 200% 100%;
  animation: ${sweep} 10s linear infinite;

  & > .inner {
    background: ${({theme})=> theme.colors.surface};
    border: 1px solid ${({theme})=> theme.colors.line};
    border-radius: inherit;
    padding: 18px;
    text-align: center;
    box-shadow: ${({theme})=> theme.shadows.card};
  }
`;

const PrizeAmount = styled.div`
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 900;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.accent}, ${({ theme }) => theme.colors.accentDark});
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 6px 0 4px;
`;

const PrizeText = styled.div`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.subtext};
`;

const HighlightBadge = styled.div`
  display: inline-block;
  padding: 7px 12px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 12px;
  color: #0b2230;
  background: ${({theme})=> theme.colors.accentLight};
`;

const Tabs = styled.div`
  display: grid;
  place-items: center;
  margin: 24px 0 28px;
`;

const Segmented = styled.div`
  display: inline-grid; grid-auto-flow: column; gap: 6px;
  background: rgba(255,255,255,.05);
  border: 1px solid ${({theme})=> theme.colors.line};
  border-radius: 12px; padding: 4px;
`;

const SegBtn = styled.button`
  appearance: none; border: 0; cursor: pointer;
  padding: 8px 14px; border-radius: 8px; font-weight: 800; font-size: 13px;
  color: ${({$active, theme}) => $active ? theme.colors.primaryFg || '#0b2230' : theme.colors.text};
  background: ${({$active, theme}) => $active ? theme.colors.accent : 'transparent'};
  transition: transform .12s ease, background .2s ease, color .2s ease;
  &:hover{ transform: translateY(-1px); }
`;

const Card = styled(motion.div)`
  background: ${({theme})=> theme.colors.surface};
  border: 1px solid ${({theme})=> theme.colors.line};
  border-radius: ${({theme})=> theme.radii.xl};
  padding: 24px;
  position: relative;
  overflow: hidden;
  box-shadow: ${({theme})=> theme.shadows.card};

  /* top accent bar */
  &::before{
    content:''; position:absolute; left:0; top:0; width:100%; height:4px;
    background: ${({$bar, theme}) =>
      $bar === 'blitz'
        ? `linear-gradient(90deg, ${theme.colors.info}, #4aa3e6)`
        : `linear-gradient(90deg, ${theme.colors.accent}, ${theme.colors.accentDark})`};
  }

  @media (max-width: 768px){ padding: 20px; }
`;

const EventHeader = styled.div`
  display: flex; justify-content: space-between; align-items: flex-start;
  gap: 16px; flex-wrap: wrap; margin-bottom: 12px;
`;

const EventInfo = styled.div` flex: 1; `;

const DayBadge = styled.div`
  display: inline-block; padding: 6px 10px;
  border-radius: 999px; font-size: 11px; font-weight: 800;
  background: rgba(255,255,255,.06);
  border: 1px solid ${({theme})=> theme.colors.line};
  color: ${({theme})=> theme.colors.text};
  letter-spacing: .5px; text-transform: uppercase; margin-bottom: 10px;
`;

const EventTitle = styled.h3`
  margin: 0 0 6px; font-weight: 800;
  font-size: clamp(20px, 2.6vw, 28px);
  color: ${({theme})=> theme.colors.text};
`;

const EventMeta = styled.div`
  display: flex; flex-wrap: wrap; gap: 14px; margin-top: 6px;
`;

const Meta = styled.span`
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 12px; color: ${({theme})=> theme.colors.subtext};
  svg{ opacity: .8 }
`;

const Lead = styled.p`
  margin: 6px 0 0; color: ${({theme})=> theme.colors.subtext};
`;

const Timeline = styled.div`
  margin: 18px 0 8px; position: relative; padding-left: 18px;
  &::before{
    content:''; position: absolute; left: 6px; top: 2px; bottom: 2px;
    width: 2px; background: ${({theme})=> theme.colors.line};
  }
`;

const TItem = styled.div`
  position: relative; padding: 0 0 16px;
  &:last-child{ padding-bottom: 0; }
  &::before{
    content:''; position: absolute; left: -12px; top: 2px;
    width: 10px; height: 10px; border-radius: 50%;
    background: ${({theme})=> theme.colors.accent};
    box-shadow: 0 0 0 3px rgba(245,188,0,.16);
  }
`;

const TTime = styled.div`
  font-size: 12px; font-weight: 800; color: ${({theme})=> theme.colors.accent}; margin-bottom: 2px;
`;
const TTitle = styled.div` font-weight: 700; color: ${({theme})=> theme.colors.text}; margin-bottom: 2px; `;
const TDesc  = styled.div` font-size: 13px; color: ${({theme})=> theme.colors.subtext}; line-height: 1.6; `;

const PrizeGrid = styled.div`
  display: grid; gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  margin-top: 14px;
`;
const PrizeCard = styled.div`
  background: rgba(255,255,255,.06);
  border: 1px solid ${({theme})=> theme.colors.line};
  border-radius: ${({theme})=> theme.radii.md};
  padding: 14px; text-align: center;
`;
const PrizeValue = styled.div` font-size: 20px; font-weight: 800; color: ${({theme})=> theme.colors.accent}; `;
const PrizeLabel = styled.div` font-size: 12px; color: ${({theme})=> theme.colors.subtext}; `;

const CTASection = styled.div`
  text-align: center; margin-top: 36px; padding-top: 28px;
  border-top: 1px solid ${({ theme }) => theme.colors.line};
`;
const CTAButton = styled(motion.a)`
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 28px; border-radius: ${({theme})=> theme.radii.md};
  font-weight: 800; font-size: 1rem; text-decoration: none;
  background: ${({theme})=> theme.colors.accent}; color: #0b2230;
  box-shadow: ${({theme})=> theme.shadows.glow};
  transition: transform .12s ease, background .2s ease, box-shadow .2s ease;
  &:hover{ transform: translateY(-1px); background: ${({theme})=> theme.colors.accentDark}; box-shadow: ${({theme})=> theme.shadows.glowStrong}; }
`;

/* ───────────────── Icons ───────────────── */
const Icons = {
  Clock: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Location: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Trophy: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 2v7a6 6 0 0 0 12 0V2" /><line x1="12" y1="18" x2="12" y2="22" /><path d="M8 22h8" />
    </svg>
  ),
  Users: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    </svg>
  ),
};

/* ───────────────── Data ───────────────── */
const blitzEvent = {
  day: 'Day 1', date: 'September 27', time: '5:30 PM',
  title: 'ScaleUp Blitz', subtitle: 'Speed Learning Tournament', location: 'IIT Bombay (Hall TBA)',
  timeline: [
    { time: '5:30 PM', title: 'IIT Bombay Quiz', desc: '10 MCQs • 15 seconds each • Top 5 win ScaleUp merchandise' },
    { time: '5:45 PM', title: 'Interactive Session', desc: '45-minute discussion with ScaleUp founders' },
    { time: '6:30 PM', title: 'Tech Quiz Championship', desc: 'AI/ML, coding & architecture • 10 MCQs • ₹50,000 prize pool for top 20' },
  ],
  prizes: [
    { value: '₹50,000', label: 'Total Prize Pool' },
    { value: 'Top 20', label: 'Cash Winners' },
    { value: 'Top 5', label: 'Merchandise' },
  ]
};

const igniteEvent = {
  day: 'Day 2', date: 'September 28', time: '11:00 AM – 5:00 PM',
  title: 'ScaleUp Ignite', subtitle: '6-Hour Virtual Hackathon', location: 'Virtual',
  timeline: [
    { time: '11:00 AM', title: 'Hackathon Begins', desc: 'Theme revealed • Individual participation • Build your solution' },
    { time: '5:00 PM',  title: 'Submission Deadline', desc: 'Submit your project for evaluation' },
    { time: '5:30 PM',  title: 'Demo Session', desc: 'Top 10 participants present 5-minute demos' },
    { time: '6:30 PM',  title: 'Results & Opportunities', desc: 'Winners announced • Top 5 get internship interviews' },
  ],
  prizes: [
    { value: '₹30,000', label: '1st Prize' },
    { value: '₹20,000', label: '2nd Prize' },
    { value: '3 Months', label: 'Paid Internship' },
  ]
};

/* ───────────────── Component ───────────────── */
export default function EventDetails() {
  const [tab, setTab] = useState('overview'); // 'overview' | 'blitz' | 'ignite'

  return (
    <Section id="details">
      <Container>
        <Header>
          <SectionTitle>Two Days. Unlimited Opportunities.</SectionTitle>
          <SectionSubtitle>Join us for an action-packed weekend of learning, competing, and winning.</SectionSubtitle>
          <AccentUnderline />
        </Header>

        <PrizeHighlight variants={fadeUp} initial="initial" animate="in">
          <div className="inner">
            <HighlightBadge>Total Rewards</HighlightBadge>
            <PrizeAmount>₹1,00,000+</PrizeAmount>
            <PrizeText>Cash Prizes • Merchandise • Paid Internship Opportunities</PrizeText>
          </div>
        </PrizeHighlight>

        <Tabs>
          <Segmented role="tablist" aria-label="Event overview tabs">
            {[
              {k:'overview', label:'Overview'},
              {k:'blitz', label:'Day 1: Blitz'},
              {k:'ignite', label:'Day 2: Ignite'},
            ].map(t => (
              <SegBtn
                key={t.k}
                type="button"
                role="tab"
                aria-selected={tab === t.k}
                aria-controls={`tab-${t.k}`}
                $active={tab === t.k}
                onClick={()=> setTab(t.k)}
              >
                {t.label}
              </SegBtn>
            ))}
          </Segmented>
        </Tabs>

        <AnimatePresence mode="wait">
          {tab === 'overview' && (
            <motion.div
              key="overview"
              variants={fadeUp}
              initial="initial"
              animate="in"
              exit="out"
            >
              <div style={{ display: 'grid', gap: 16 }}>
                <Card $bar="blitz">
                  <EventHeader>
                    <EventInfo>
                      <DayBadge>Day 1 — Sept 27</DayBadge>
                      <EventTitle>ScaleUp Blitz</EventTitle>
                      <EventMeta>
                        <Meta><Icons.Clock/> 5:30 PM onwards</Meta>
                        <Meta><Icons.Location/> IIT Bombay Campus</Meta>
                        <Meta><Icons.Trophy/> ₹50,000 Prizes</Meta>
                      </EventMeta>
                      <Lead>Fast-paced competition with two quiz rounds, an interactive founders’ session, and instant wins.</Lead>
                    </EventInfo>
                  </EventHeader>
                </Card>

                <Card $bar="ignite">
                  <EventHeader>
                    <EventInfo>
                      <DayBadge>Day 2 — Sept 28</DayBadge>
                      <EventTitle>ScaleUp Ignite</EventTitle>
                      <EventMeta>
                        <Meta><Icons.Clock/> 11:00 AM – 5:00 PM</Meta>
                        <Meta><Icons.Location/> Virtual Event</Meta>
                        <Meta><Icons.Trophy/> ₹50,000 + Internships</Meta>
                      </EventMeta>
                      <Lead>Build something real in six hours and demo it. Top performers get interview opportunities.</Lead>
                    </EventInfo>
                  </EventHeader>
                </Card>
              </div>
            </motion.div>
          )}

          {tab === 'blitz' && (
            <motion.div key="blitz" variants={fadeUp} initial="initial" animate="in" exit="out">
              <Card $bar="blitz" id="tab-blitz">
                <EventHeader>
                  <EventInfo>
                    <DayBadge>{blitzEvent.day} — {blitzEvent.date}</DayBadge>
                    <EventTitle>{blitzEvent.title}</EventTitle>
                    <EventMeta>
                      <Meta><Icons.Clock /> {blitzEvent.time}</Meta>
                      <Meta><Icons.Location /> {blitzEvent.location}</Meta>
                      <Meta><Icons.Users /> Individual Participation</Meta>
                    </EventMeta>
                  </EventInfo>
                </EventHeader>

                <Timeline>
                  {blitzEvent.timeline.map((item, i) => (
                    <TItem key={i}>
                      <TTime>{item.time}</TTime>
                      <TTitle>{item.title}</TTitle>
                      <TDesc>{item.desc}</TDesc>
                    </TItem>
                  ))}
                </Timeline>

                <PrizeGrid>
                  {blitzEvent.prizes.map((p, i)=> (
                    <PrizeCard key={i}>
                      <PrizeValue>{p.value}</PrizeValue>
                      <PrizeLabel>{p.label}</PrizeLabel>
                    </PrizeCard>
                  ))}
                </PrizeGrid>
              </Card>
            </motion.div>
          )}

          {tab === 'ignite' && (
            <motion.div key="ignite" variants={fadeUp} initial="initial" animate="in" exit="out">
              <Card $bar="ignite" id="tab-ignite">
                <EventHeader>
                  <EventInfo>
                    <DayBadge>{igniteEvent.day} — {igniteEvent.date}</DayBadge>
                    <EventTitle>{igniteEvent.title}</EventTitle>
                    <EventMeta>
                      <Meta><Icons.Clock/> {igniteEvent.time}</Meta>
                      <Meta><Icons.Location/> {igniteEvent.location}</Meta>
                      <Meta><Icons.Users/> Individual Participation</Meta>
                    </EventMeta>
                  </EventInfo>
                </EventHeader>

                <Timeline>
                  {igniteEvent.timeline.map((item, i) => (
                    <TItem key={i}>
                      <TTime>{item.time}</TTime>
                      <TTitle>{item.title}</TTitle>
                      <TDesc>{item.desc}</TDesc>
                    </TItem>
                  ))}
                </Timeline>

                <PrizeGrid>
                  {igniteEvent.prizes.map((p, i)=> (
                    <PrizeCard key={i}>
                      <PrizeValue>{p.value}</PrizeValue>
                      <PrizeLabel>{p.label}</PrizeLabel>
                    </PrizeCard>
                  ))}
                </PrizeGrid>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <CTASection>
          <p style={{ fontSize: '1.05rem', marginBottom: 16, color: 'inherit', opacity:.9 }}>
            Don’t miss your chance to learn, compete, and stand out.
          </p>
          <CTAButton
            href="#register?track=both"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-label="Register for both events"
          >
            Register for Both Events <Icons.Trophy />
          </CTAButton>
        </CTASection>
      </Container>
    </Section>
  );
}
