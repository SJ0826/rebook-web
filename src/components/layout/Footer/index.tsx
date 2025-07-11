import React from 'react';
import FooterDesktop from '@/components/layout/Footer/Footer.desktop';
import FooterMobile from '@/components/layout/Footer/Footer.mobile';

const Footer = () => {
  return (
    <>
      {/* desktop footer */}
      <FooterDesktop />

      {/*  mobile footer */}
      <FooterMobile />

      {/* 하단 네비게이션 공간 확보 */}
      <div className="h-20 md:hidden"></div>
    </>
  );
};

export default Footer;
