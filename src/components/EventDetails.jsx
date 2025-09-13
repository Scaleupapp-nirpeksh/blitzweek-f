import React from 'react'
import styled from 'styled-components'

const Wrap = styled.section`
  padding: 40px 0 12px;
`
const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  @media (max-width: 900px){ grid-template-columns: 1fr; }
`
const Card = styled.div`
  background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03));
  border: 1px solid ${({theme})=> theme.colors.line };
  border-radius: 20px;
  padding: 18px 18px 10px;
`
const H3 = styled.h3` margin: 8px 0 6px; font-size: 22px; `
const P = styled.p` margin: 0 0 14px; color: ${({theme})=> theme.colors.subtext}; `
const Ul = styled.ul` margin: 0; padding-left: 18px; line-height: 1.7; color: ${({theme})=> theme.colors.subtext }; `

export default function EventDetails(){
  return (
    <Wrap id="details">
      <div className="container">
        <Grid>
          <Card>
            <H3>ScaleUp Blitz — Speed Learning Tournament</H3>
            <P>Fast‑paced quizzes and challenges across domains. Compete, climb the leaderboard, and win!</P>
            <Ul>
              <li>Rapid rounds: MCQs + lightning problem‑solving</li>
              <li>Live leaderboard & shout‑outs</li>
              <li>Top finalists qualify for on‑campus showdown</li>
            </Ul>
          </Card>
          <Card>
            <H3>ScaleUp Ignite — Build Sprint & Showcase</H3>
            <P>Teams build mini‑projects with prompts/tools. Pitch your idea and demo what you’ve shipped.</P>
            <Ul>
              <li>4‑hour sprint with theme revealed on day‑of</li>
              <li>Mentor huddles + public demos</li>
              <li>Prizes for innovation, design, and impact</li>
            </Ul>
          </Card>
        </Grid>
      </div>
    </Wrap>
  )
}
