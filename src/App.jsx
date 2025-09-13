//src/App.jsx
import React from 'react'
import { ThemeProvider } from 'styled-components'
import { theme } from './styles/theme'
import { GlobalStyles } from './styles/GlobalStyles'
import Hero from './components/Hero'
import Countdown from './components/Countdown'
import LiveStats from './components/LiveStats'
import EventDetails from './components/EventDetails'
import QRCard from './components/QRCard'
import RegistrationForm from './components/RegistrationForm'
import styled from 'styled-components'

const Divider = styled.div`
  height: 1px; background: ${({theme})=> theme.colors.line}; margin: 24px 0;
`

export default function App(){
  const eventISO = import.meta.env.VITE_EVENT_START_ISO || '2025-10-20T10:00:00+05:30'
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Hero />
      <div className="container">
        <Countdown targetISO={eventISO} />
        <LiveStats />
        <EventDetails />
        <Divider />
        <QRCard />
      </div>
      <RegistrationForm />
      <Footer />
    </ThemeProvider>
  )
}

function Footer(){
  return <div style={{opacity:.8, padding:'28px 0 60px', textAlign:'center', color:'#c6d5db'}}>
    Built with ♥ for IIT Bombay · <a href="#top">Back to top</a>
  </div>
}
