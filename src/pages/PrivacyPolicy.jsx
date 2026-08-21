import { Link } from 'react-router-dom'
import SeoHead from '../components/SeoHead.jsx'

const sections = [
  {
    title: '1. Who we are',
    content: [
      'Kingdom Drip is an online Christian apparel store operated by ROCK MISSION MINISTRIES, a South African non-profit company registered under number 2022/798592/08. Our registered office is 11 Vultee Crescent, Tuscany Glen, Cape Town, Western Cape, 7100. Our preferred Kingdom Drip branch address is 49 London Way, Malibu Village, Blue Downs, Cape Town, Western Cape, 7100.',
      'For privacy questions or requests, contact info@rockmission.co.za or visit the Rock Mission contact page at rockmission.co.za/pages/contact.html.',
    ],
  },
  {
    title: '2. Information we collect',
    content: [
      'When you create an account or place an order, we may collect your name, email address, telephone number, delivery address, account credentials, order details, and payment status.',
      'Payment card and banking details are submitted to PayFast. Kingdom Drip does not receive or store your full card or banking credentials.',
      'We may also receive basic technical information needed to operate and secure the website, such as browser, device, and error information.',
    ],
  },
  {
    title: '3. How we use your information',
    content: [
      'We use personal information to create and manage accounts, process and deliver orders, confirm PayFast payments, communicate about orders, provide support, prevent fraud, and maintain the security of the store.',
      'We may use your contact details for service messages about an order or account. We will not sell your personal information.',
    ],
  },
  {
    title: '4. Service providers',
    content: [
      'We share only the information needed to provide a service. This may include sharing order and delivery details with PayFast for payment processing and with delivery providers for fulfilment.',
      'Service providers are expected to handle information securely and only for the services they provide.',
    ],
  },
  {
    title: '5. Retention and security',
    content: [
      'We retain account and order information for as long as reasonably necessary to provide services, resolve disputes, maintain business records, and meet legal obligations.',
      'We use reasonable technical and organisational safeguards, but no internet transmission or storage system can be guaranteed to be completely secure.',
    ],
  },
  {
    title: '6. Your rights',
    content: [
      'Subject to applicable law, you may ask us to confirm what personal information we hold about you, request access to it, ask us to correct inaccurate information, or request deletion where we are not required to retain it.',
      'To make a privacy request, email info@rockmission.co.za with enough information for us to verify your identity and locate the relevant account or order.',
    ],
  },
  {
    title: '7. Cookies',
    content: [
      'The store may use essential browser storage and similar technologies to keep you signed in and retain your shopping cart. Disabling these technologies may affect account and checkout functionality.',
    ],
  },
]

export default function PrivacyPolicy() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:py-24">
      <SeoHead
        title="Privacy Policy — Kingdom Drip"
        description="Read how Kingdom Drip handles account, order, delivery and payment information for the online store."
        path="/privacy"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Kingdom Drip Privacy Policy',
          description: 'How Kingdom Drip handles account, order, delivery and payment information.',
          url: 'https://shop.rockmission.co.za/privacy',
        }}
      />
      <div className="max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-widest text-apparel-teal">Kingdom Drip</p>
        <h1 className="mt-3 font-display text-5xl tracking-wide text-apparel-cream sm:text-6xl">Privacy Policy</h1>
        <p className="mt-5 text-sm leading-7 text-apparel-muted">
          Last updated: 21 August 2026. This policy explains how Kingdom Drip handles personal information when you
          browse the store, create an account, or place an order.
        </p>
      </div>

      <div className="mt-12 space-y-10">
        {sections.map((section) => (
          <section key={section.title} className="border-t border-apparel-border pt-7">
            <h2 className="text-xl font-bold text-apparel-cream">{section.title}</h2>
            <div className="mt-4 space-y-4 text-sm leading-7 text-apparel-muted">
              {section.content.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </section>
        ))}
      </div>

      <p className="mt-12 border-t border-apparel-border pt-6 text-sm text-apparel-muted">
        <Link to="/terms" className="font-semibold text-apparel-teal hover:underline">Read our Terms &amp; Policies</Link>
      </p>
    </div>
  )
}
