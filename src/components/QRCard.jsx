import React from 'react'
import styled from 'styled-components'
import QRCode from 'react-qr-code'

const Card = styled.div`
  margin: 12px auto 0;
  width: 100%;
  max-width: 360px;
  background: rgba(255,255,255,0.04);
  border: 1px solid ${({theme})=> theme.colors.line };
  border-radius: 16px;
  padding: 16px;
  text-align: center;
`
const Label = styled.div`
  margin-top: 10px;
  color: ${({theme})=> theme.colors.subtext};
  font-size: 13px;
`

export default function QRCard(){
  const url = 'https://scaleupapp.club/'
  return (
    <Card>
      <QRCode value={url} size={220} style={{ height: 'auto', maxWidth: '100%', width: '100%'}} />
      <Label>Scan to visit <strong>scaleupapp.club</strong></Label>
    </Card>
  )
}
