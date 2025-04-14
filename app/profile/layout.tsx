import React from 'react'

export const metadata = {
  title: 'Profile',
};

function Layout({children}: {children: React.ReactNode}) {
  return (
    <div>{children}</div>
  )
}

export default Layout