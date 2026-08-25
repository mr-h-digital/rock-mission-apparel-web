import { Link } from 'react-router-dom'
import SeoHead from '../components/SeoHead.jsx'

const sections = [
  {
    title: '1. About Kingdom Drip',
    content: [
      'Kingdom Drip is an online Christian apparel store operated by ROCK MISSION MINISTRIES, a South African non-profit company registered under number 2022/798592/08. Its registered office is 11 Vultee Crescent, Tuscany Glen, Cape Town, Western Cape, 7100, and its preferred Kingdom Drip branch is at 49 London Way, Malibu Village, Blue Downs, Cape Town, Western Cape, 7100. Proceeds support Rock Mission outreach work.',
      'These terms apply to purchases made through the Kingdom Drip online store. By placing an order, you confirm that you have read and accepted these terms.',
    ],
  },
  {
    title: '2. Products and orders',
    content: [
      'We make reasonable efforts to display product descriptions, colours, sizes, images, and prices accurately. Small differences between product images and the delivered item may occur because of screen settings and manufacturing variations.',
      'An order is accepted only after stock is available, the order details have been checked, and payment has been successfully confirmed by PayFast. We may contact you if an item is unavailable or an order contains an obvious pricing or product error.',
      'All prices are in South African rand (ZAR) and are subject to change without notice. The price shown at checkout is the price applicable to your order.',
    ],
  },
  {
    title: '3. Payment',
    content: [
      'Payment is processed securely by PayFast. Kingdom Drip does not receive or store your full card or banking credentials.',
      'An order remains pending until PayFast confirms the payment. If payment is unsuccessful, cancelled, or cannot be verified, the order will not be fulfilled.',
    ],
  },
  {
    title: '4. Delivery policy',
    content: [
      'We deliver to addresses in South Africa supplied during checkout. Please provide a complete and accurate delivery address and a telephone number at which the courier can reach you.',
      'Orders are prepared after payment confirmation. Our usual delivery estimate is 3 to 7 business days after dispatch. Remote areas and courier delays may take longer. We will use the contact details supplied with the order to provide relevant delivery updates.',
      'The current online checkout includes delivery in the displayed total, with no separate delivery line-item charge sent to PayFast. The store advertises free shipping on qualifying orders over R850. Delivery to an incorrect or incomplete address may result in additional charges or delays.',
      'Risk passes to you when the order is delivered to the address supplied at checkout. If a parcel arrives damaged, please notify us promptly and provide photographs of the packaging and item.',
    ],
  },
  {
    title: '5. Returns and refunds',
    content: [
      'You may request a return within 14 days of delivery if the item is unused, unwashed, in its original condition, and has its original tags attached. Items returned without their original condition or tags may not qualify for a refund.',
      'For a faulty, damaged, or incorrect item, contact us as soon as possible so that we can assess the issue and arrange an appropriate remedy in line with applicable South African consumer law. Please include your order reference and clear photographs where relevant.',
      'Unless an item is faulty, damaged, or incorrect, return delivery costs are your responsibility. We recommend using a trackable delivery service, as we cannot be responsible for returns lost in transit.',
      'Once an approved return has been received and inspected, we will confirm the outcome and process any applicable refund through the original payment method. PayFast or the relevant financial institution may take additional business days to reflect the refund.',
    ],
  },
  {
    title: '6. Cancellation policy',
    content: [
      'You may request cancellation before your order has been dispatched by contacting us with your order reference. We will confirm whether cancellation is still possible.',
      'If the order has already been dispatched, it must be handled as a return under the returns policy. If we cancel an order because stock is unavailable or the order cannot be fulfilled, we will arrange a refund of the amount paid through the original payment method.',
    ],
  },
  {
    title: '7. Contact us',
    content: [
      'For order, delivery, return, refund, or cancellation questions, contact Rock Mission Ministries at info@rockmission.co.za or through the contact page at rockmission.co.za/pages/contact.html. Please include your order reference so we can assist you efficiently.',
    ],
  },
]

export default function TermsAndConditions() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:py-24">
      <SeoHead
        title="Terms & Policies — Kingdom Drip"
        description="Read the Kingdom Drip terms covering orders, PayFast payments, delivery, returns, refunds and cancellations."
        path="/terms"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Kingdom Drip Terms & Policies',
          description: 'Terms covering Kingdom Drip orders, payments, delivery, returns, refunds and cancellations.',
          url: 'https://shop.rockmission.co.za/terms',
        }}
      />
      <div className="max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-widest text-apparel-teal">Kingdom Drip</p>
        <h1 className="mt-3 font-display text-4xl tracking-wide text-apparel-cream sm:text-6xl">Terms &amp; Policies</h1>
        <p className="mt-5 text-sm leading-7 text-apparel-muted">
          Last updated: 21 August 2026. These terms explain how orders, payments, delivery, returns, refunds, and
          cancellations are handled for the Kingdom Drip online store.
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
        <Link to="/shop" className="font-semibold text-apparel-teal hover:underline">Return to the Kingdom Drip shop</Link>
      </p>
    </div>
  )
}
