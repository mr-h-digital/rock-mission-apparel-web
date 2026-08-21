import { useEffect } from 'react'

const SITE_URL = 'https://shop.rockmission.co.za'

function toAbsoluteUrl(value) {
  if (!value) return null
  if (/^https?:\/\//i.test(value)) return value
  const path = value.startsWith('/') ? value : `/${value}`
  return `${SITE_URL}${path}`
}

function setMeta(name, content, attr = 'name') {
  if (!content) return
  let tag = document.head.querySelector(`meta[${attr}="${name}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, name)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function setCanonical(href) {
  const absolute = toAbsoluteUrl(href)
  if (!absolute) return
  let tag = document.head.querySelector('link[rel="canonical"]')
  if (!tag) {
    tag = document.createElement('link')
    tag.setAttribute('rel', 'canonical')
    document.head.appendChild(tag)
  }
  tag.setAttribute('href', absolute)
}

function setJsonLd(data) {
  const id = 'seo-jsonld'
  let script = document.getElementById(id)
  if (!script) {
    script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = id
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify(data)
}

function clearJsonLd() {
  document.getElementById('seo-jsonld')?.remove()
}

export default function SeoHead({ title, description, path = '/', image, type = 'website', jsonLd, robots = 'index,follow' }) {
  useEffect(() => {
    if (!title) return

    const absoluteUrl = toAbsoluteUrl(path)
    const absoluteImage = toAbsoluteUrl(image || '/brand/kingdom-drip-logo-only.png')

    document.title = title
    setCanonical(path)

    setMeta('description', description)
    setMeta('robots', robots)

    setMeta('og:type', type, 'property')
    setMeta('og:site_name', 'Kingdom Drip', 'property')
    setMeta('og:title', title, 'property')
    setMeta('og:description', description, 'property')
    setMeta('og:url', absoluteUrl, 'property')
    setMeta('og:image', absoluteImage, 'property')

    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', title)
    setMeta('twitter:description', description)
    setMeta('twitter:image', absoluteImage)

    if (jsonLd) {
      setJsonLd(jsonLd)
    } else {
      clearJsonLd()
    }
  }, [title, description, path, image, type, jsonLd, robots])

  return null
}
