
import Head from 'next/head'
import React from 'react'
import Footer from './footer'
import Header from './header'

type props = {
  children: React.ReactNode
}
function Layout({ children }: props) {
  return (
    <div className="min-h-screen py-2">
      <div className="bg-white">
        <Head>
          <title>E-commerce</title>
          <link rel='icon' href='/public/favicon.ico'/>
        </Head>
        <Header />
        {children}
        <Footer />
      </div>
    </div>
  )
}

export default Layout
