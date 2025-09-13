// src/components/Footer.jsx
import React, { useState, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

/* ────────── Styled Components ────────── */
const FooterContainer = styled.footer`
  margin-top: 80px;
  background: ${({ theme }) => theme.colors.bgAlt};
  border-top: 1px solid ${({ theme }) => theme.colors.line};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      ${({ theme }) => theme.colors.accent}40,
      transparent
    );
  }
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 20px 32px;
  
  @media (max-width: 768px) {
    padding: 32px 20px 24px;
  }
`;

const FooterTop = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 48px;
  margin-bottom: 48px;
  
  @media (max-width: 968px) {
    grid-template-columns: 2fr 1fr 1fr;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
`;

const BrandSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`;

const LogoText = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.accent}, ${({ theme }) => theme.colors.accentDark});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const TagLine = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.subtext};
  margin: 0;
  line-height: 1.6;
  max-width: 300px;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
`;

const SocialIcon = styled.a`
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.line};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.subtext};
  transition: all 0.2s ease;
  
  &:hover {
    color: ${({ theme }) => theme.colors.accent};
    border-color: ${({ theme }) => theme.colors.accent}40;
    transform: translateY(-2px);
  }
`;

const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ColumnTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const FooterLink = styled.a`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.subtext};
  text-decoration: none;
  transition: all 0.2s ease;
  position: relative;
  width: fit-content;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 1px;
    background: ${({ theme }) => theme.colors.accent};
    transition: width 0.2s ease;
  }
  
  &:hover {
    color: ${({ theme }) => theme.colors.text};
    
    &::after {
      width: 100%;
    }
  }
`;

const FooterBottom = styled.div`
  padding-top: 32px;
  border-top: 1px solid ${({ theme }) => theme.colors.line};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  
  @media (max-width: 640px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

const Copyright = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.subtext};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LegalLinks = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  
  @media (max-width: 640px) {
    justify-content: center;
  }
`;

const LegalLink = styled.a`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.subtext};
  text-decoration: none;
  transition: color 0.2s ease;
  
  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const Newsletter = styled.div`
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 24px;
  margin-bottom: 48px;
  
  @media (max-width: 768px) {
    margin-bottom: 32px;
  }
`;

const NewsletterHeader = styled.div`
  margin-bottom: 16px;
`;

const NewsletterTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 4px;
`;

const NewsletterDesc = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.subtext};
  margin: 0;
`;

const NewsletterForm = styled.form`
  display: flex;
  gap: 12px;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 12px 16px;
  background: ${({ theme }) => theme.colors.bgAlt};
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.875rem;
  transition: all 0.2s ease;
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.subtext}50;
  }
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.accent}20;
  }
`;

const SubscribeButton = styled.button`
  padding: 12px 24px;
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.bg};
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  
  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.accentDark};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${({ theme }) => theme.colors.accent}40;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Badge = styled.span`
  display: inline-block;
  padding: 2px 8px;
  background: ${({ theme }) => theme.colors.accent}20;
  color: ${({ theme }) => theme.colors.accent};
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 600;
  margin-left: 8px;
  text-transform: uppercase;
`;

const ScrollToTop = styled(motion.button)`
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.bg};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 100;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
  }
`;

const Toast = styled(motion.div)`
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  background: ${({ $variant, theme }) => 
    $variant === 'success' ? '#5dd39e' : theme.colors.accent};
  color: white;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.875rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 1000;
`;

/* ────────── Icons ────────── */
const Icons = {
  Instagram: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  Twitter: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
    </svg>
  ),
  LinkedIn: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
  GitHub: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
    </svg>
  ),
  ArrowUp: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  ),
};

/* ────────── Main Component ────────── */
export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [toast, setToast] = useState(null);
  
  const currentYear = new Date().getFullYear();
  
  const handleSubscribe = useCallback(async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setToast({ message: 'Please enter a valid email', variant: 'error' });
      setTimeout(() => setToast(null), 3000);
      return;
    }
    
    // Simulate subscription
    setSubscribed(true);
    setToast({ message: 'Successfully subscribed!', variant: 'success' });
    setEmail('');
    setTimeout(() => setToast(null), 3000);
  }, [email]);
  
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <>
      <FooterContainer>
        <FooterContent>
          <Newsletter>
            <NewsletterHeader>
              <NewsletterTitle>Stay Updated</NewsletterTitle>
              <NewsletterDesc>
                Get the latest updates about ScaleUp Blitz Week events and workshops
              </NewsletterDesc>
            </NewsletterHeader>
            <NewsletterForm onSubmit={handleSubscribe}>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={subscribed}
              />
              <SubscribeButton type="submit" disabled={subscribed}>
                {subscribed ? 'Subscribed ✓' : 'Subscribe'}
              </SubscribeButton>
            </NewsletterForm>
          </Newsletter>
          
          <FooterTop>
            <BrandSection>
              <Logo>
                <LogoText>ScaleUp</LogoText>
                <Badge>2025</Badge>
              </Logo>
              <TagLine>
                IIT Bombay's premier entrepreneurship event bringing together innovators, 
                builders, and dreamers.
              </TagLine>
              <SocialLinks>
                <SocialIcon href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <Icons.Instagram />
                </SocialIcon>
                <SocialIcon href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <Icons.Twitter />
                </SocialIcon>
                <SocialIcon href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <Icons.LinkedIn />
                </SocialIcon>
                <SocialIcon href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <Icons.GitHub />
                </SocialIcon>
              </SocialLinks>
            </BrandSection>
            
            <FooterColumn>
              <ColumnTitle>Events</ColumnTitle>
              <FooterLink href="#blitz">ScaleUp Blitz</FooterLink>
              <FooterLink href="#ignite">ScaleUp Ignite</FooterLink>
              <FooterLink href="#workshops">Workshops</FooterLink>
              <FooterLink href="#speakers">Speakers</FooterLink>
            </FooterColumn>
            
            <FooterColumn>
              <ColumnTitle>Resources</ColumnTitle>
              <FooterLink href="#schedule">Schedule</FooterLink>
              <FooterLink href="#faq">FAQ</FooterLink>
              <FooterLink href="#sponsors">Sponsors</FooterLink>
              <FooterLink href="#media">Media Kit</FooterLink>
            </FooterColumn>
            
            <FooterColumn>
              <ColumnTitle>Contact</ColumnTitle>
              <FooterLink href="mailto:admin@scaleupapp.club">admin@scaleupapp.club</FooterLink>
              <FooterLink href="tel:+919876543210">+91 98765 43210</FooterLink>
              <FooterLink href="#location">IIT Bombay Campus</FooterLink>
              <FooterLink href="#support">Support</FooterLink>
            </FooterColumn>
          </FooterTop>
          
          <FooterBottom>
            <Copyright>
              © {currentYear} ScaleUp • IIT Bombay • All rights reserved
            </Copyright>
            <LegalLinks>
              <LegalLink href="#privacy">Privacy Policy</LegalLink>
              <LegalLink href="#terms">Terms of Service</LegalLink>
              <LegalLink href="#cookies">Cookie Policy</LegalLink>
            </LegalLinks>
          </FooterBottom>
        </FooterContent>
      </FooterContainer>
      
      <AnimatePresence>
        {showScrollTop && (
          <ScrollToTop
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Icons.ArrowUp />
          </ScrollToTop>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {toast && (
          <Toast
            $variant={toast.variant}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {toast.message}
          </Toast>
        )}
      </AnimatePresence>
    </>
  );
}