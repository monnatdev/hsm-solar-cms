import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'HSM Solar CMS',
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>{props.children}</body>
    </html>
  )
}
