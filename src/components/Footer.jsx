import React from 'react'
import styled from 'styled-components'

const Wrap = styled.footer`
  padding: 36px 0 28px;
  border-top: 1px solid ${({theme})=> theme.colors.line};
  margin-top: 28px;
  color: ${({theme})=> theme.colors.subtext};
  font-size: 13px;
`

export default function Footer(){
  return (
    <Wrap>
      <div className="container" style={{display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:10}}>
        <div>© {new Date().getFullYear()} ScaleUp • All rights reserved</div>
        <div>Contact: admin@scaleupapp.club</div>
      </div>
    </Wrap>
  )
}
