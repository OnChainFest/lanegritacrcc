"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Trophy, CreditCard, Mail, Phone, Globe, MapPin, Target } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { RegulationModal } from "@/components/regulation-modal"
import { FloatingQRButton } from "@/components/floating-qr-button"

export default function TorneoLaNegritaLanding() {
  const [language, setLanguage] = useState<"es" | "en">("es")

  const toggleLanguage = () => {
    setLanguage(language === "es" ? "en" : "es")
  }

  const content = {
    es: {
      hero: {
        title: "5ª Edición Torneo La Negrita 2025",
        subtitle: "El torneo de boliche más prestigioso de Costa Rica",
        dates: "2 al 9 de Agosto, 2025",
        location: "Costa Rica Country Club",
        mainCta: "Registrarse / Acceder",
        bracketsCta: "Ver Sistema de Llaves",
        legend:
          "Un evento de clase mundial que reúne a los mejores exponentes del boliche centroamericano. Con más de una década de tradición, La Negrita se ha consolidado como el torneo más prestigioso de la región, ofreciendo premios superiores a $10,000 y un nivel competitivo excepcional que atrae jugadores profesionales de toda América.",
      },
      info: {
        participation: "Sistema de registro digital con validación automática y seguimiento en tiempo real",
        prizes: "Premios en categorías Hándicap, Scratch, Senior, Maratón de Strikes y Desesperado",
        payments: "Pagos en colones y dólares con opciones para jugadores extranjeros",
      },
      testimonials: {
        title: "Lo que dicen los participantes",
        items: [
          {
            name: "Mateo Gordienko",
            country: "Costa Rica",
            text: "Este torneo es uno de los torneos más emocionantes del año. El formato del torneo hace que sea muy competitivo, y la organización es súper buena. ¡No tengo duda que volveré a participar este año!",
            rating: 5,
          },
          {
            name: "Antonio Trejos",
            country: "Costa Rica",
            text: "Siento que jugar el torneo de la negrita ha sido una experiencia muy divertida. Sin duda alguna estoy con ambición de dar mi mejor esfuerzo este año!",
            rating: 5,
          },
          {
            name: "Elena Weinstok",
            country: "Costa Rica",
            text: "La Negrita es uno de los torneos que mas espero cada año. Siempre la paso increíble, el ambiente me encanta y logro competir mientras disfruto con todos. ¡Nos vemos el próximo año!",
            rating: 5,
          },
        ],
      },
      pricing: {
        title: "Precios de Inscripción",
        national: "Jugadores Nacionales",
        international: "Jugadores Extranjeros",
        earlyBird: "Hasta el 19 de Julio",
        regular: "Después del 20 de Julio",
        includes: "Incluye 2 series de 3 juegos cada una",
      },
      sponsors: {
        title: "Patrocinadores",
      },
      contact: {
        language: "Cambiar Idioma",
      },
    },
    en: {
      hero: {
        title: "5th Edition La Negrita Tournament 2025",
        subtitle: "Costa Rica's most prestigious bowling tournament",
        dates: "August 2-9, 2025",
        location: "Costa Rica Country Club",
        mainCta: "Register / Access",
        bracketsCta: "View Bracket System",
        legend:
          "A world-class event that brings together the best bowling exponents in Central America. With over a decade of tradition, La Negrita has established itself as the most prestigious tournament in the region, offering prizes exceeding $10,000 and an exceptional competitive level that attracts professional players from all over America.",
      },
      info: {
        participation: "Digital registration system with automatic validation and real-time tracking",
        prizes: "Prizes in Handicap, Scratch, Senior, Strike Marathon and Desperate categories",
      },
      testimonials: {
        title: "What participants say",
        items: [
          {
            name: "Mateo Gordienko",
            country: "Costa Rica",
            text: "This tournament is one of the most exciting tournaments of the year. The tournament format makes it very competitive, and the organization is super good. I have no doubt I'll participate again this year!",
            rating: 5,
          },
          {
            name: "Antonio Trejos",
            country: "Costa Rica",
            text: "I feel that playing La Negrita tournament has been a very fun experience. Without a doubt I am ambitious to give my best effort this year!",
            rating: 5,
          },
          {
            name: "Elena Weinstok",
            country: "Costa Rica",
            text: "La Negrita is one of the tournaments I look forward to most each year. I always have an incredible time, I love the atmosphere and I get to compete while enjoying with everyone. See you next year!",
            rating: 5,
          },
        ],
      },
      pricing: {
        title: "Registration Prices",
        national: "National Players",
        international: "International Players",
        earlyBird: "Until July 19th",
        regular: "After July 20th",
        includes: "Includes 2 series of 3 games each",
      },
      sponsors: {
        title: "Sponsors",
      },
      contact: {
        language: "Change Language",
      },
    },
  }

  const t = content[language]

  const sponsors = [
    { name: "Valia & Trejos", src: "/images/sponsors/valia-trejos-large.png", large: true },
    { name: "BAC Credomatic", src: "/images/sponsors/bac-credomatic.png" },
    { name: "Honda", src: "/images/sponsors/honda.png" },
    { name: "FACO", src: "/images/sponsors/faco.png" },
    { name: "FIFCO", src: "/images/sponsors/fifco.png" },
    { name: "Subway", src: "/images/sponsors/subway.png" },
    { name: "PRO", src: "/images/sponsors/pro.png" },
    { name: "Quarzein Technologies", src: "/images/sponsors/quarzein.png", small: true },
    { name: "Delizia", src: "/images/sponsors/delizia.png" },
    { name: "Renovart", src: "/images/sponsors/renovart.png" },
    { name: "Müller JG", src: "/images/sponsors/muller-large.png", large: true },
    { name: "Sastrería Scaglietti", src: "/images/sponsors/scaglietti-large.png", large: true, extraLarge: true },
    { name: "Timsun", src: "/images/sponsors/timsun-2.png" },
    { name: "OnchainFest", src: "/images/sponsors/onchain-fest-3.png" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 relative">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none z-0">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url('/images/tournament-logo-bg.png')`,
            backgroundSize: "200px 150px",
            backgroundRepeat: "repeat",
            backgroundPosition: "0 0",
          }}
        />
      </div>

      {/* Floating QR Button */}
      <FloatingQRButton language={language} />

      {/* Header */}
      <header className="relative z-50 bg-gradient-to-r from-gray-900 via-black to-gray-900 backdrop-blur-md shadow-2xl border-b border-gray-600/30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Image
                  src="/images/country-club-logo-transparent.png"
                  alt="Country Club Costa Rica"
                  width={55}
                  height={55}
                  className="brightness-0 invert"
                />
              </div>
              <div>
                <h1 className="text-xl font-heading font-bold text-white tracking-tight">Country Club</h1>
                <p className="text-sm text-gray-300 font-body font-medium">Costa Rica</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/register">
                <Button className="bg-white hover:bg-gray-100 text-gray-900 px-6 py-2 font-body font-semibold shadow-lg">
                  {t.hero.mainCta}
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="text-gray-300 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-gray-600/30 font-accent"
              >
                <Globe className="w-4 h-4 mr-2" />
                {language === "es" ? "EN" : "ES"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/images/bowling-scene-1.png" alt="Bowling Tournament" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/70" />
        </div>

        <div className="relative z-10 container mx-auto px-4 flex-1 flex flex-col">
          {/* Top Section - Title and Info */}
          <div className="pt-16 pb-8">
            <div className="text-white max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-4 drop-shadow-lg text-balance">
                {t.hero.title}
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 mb-6 drop-shadow font-body font-medium text-balance">
                {t.hero.subtitle}
              </p>

              <div className="flex flex-col md:flex-row items-start gap-4 mb-8">
                <Badge variant="secondary" className="bg-red-600 text-white text-lg px-6 py-3 shadow-lg font-accent">
                  <Calendar className="w-5 h-5 mr-2" />
                  {t.hero.dates}
                </Badge>
                <Badge
                  variant="outline"
                  className="border-white/50 text-white text-lg px-6 py-3 bg-white/10 backdrop-blur-sm font-accent"
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  {t.hero.location}
                </Badge>
              </div>
            </div>
          </div>

          {/* Middle Section - Legend */}
          <div className="flex-1 flex items-end justify-end pb-8">
            <div className="max-w-md text-right">
              <div className="text-white">
                <p className="text-lg leading-relaxed text-gray-200 drop-shadow-lg font-body text-balance">
                  {t.hero.legend}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Section - Action Buttons */}
          <div className="pb-16">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <RegulationModal />
              <Link href="/brackets">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/50 text-white hover:bg-white/10 px-8 py-4 text-lg bg-white/10 backdrop-blur-sm font-body"
                >
                  <Target className="w-6 h-6 mr-2" />
                  {t.hero.bracketsCta}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Information Section */}
      <section className="py-16 bg-gray-50 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
                  </svg>
                </div>
                <h3 className="text-lg font-heading font-semibold text-gray-900 mb-2">
                  {language === "es" ? "Sistema Digital" : "Digital System"}
                </h3>
                <p className="text-gray-600 font-body">{t.info.participation}</p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="bg-yellow-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Trophy className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-lg font-heading font-semibold text-gray-900 mb-2">Múltiples Categorías</h3>
                <p className="text-gray-600 font-body">{t.info.prizes}</p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <CreditCard className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-heading font-semibold text-gray-900 mb-2">Pagos Flexibles</h3>
                <p className="text-gray-600 font-body">{t.info.payments}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section with Background */}
      <section className="py-16 relative overflow-hidden z-10">
        <div className="absolute inset-0 z-0">
          <Image src="/images/bowling-scene-2.png" alt="Bowling Background" fill className="object-cover" />
          <div className="absolute inset-0 bg-white/90" />
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 text-center mb-12 text-balance">
            {t.pricing.title}
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* National Players */}
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
              <CardContent className="p-8">
                <h3 className="text-2xl font-heading font-bold text-gray-900 mb-6 text-center">{t.pricing.national}</h3>

                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-heading font-semibold text-green-800 mb-2">{t.pricing.earlyBird}</h4>
                    <p className="text-gray-900 text-lg font-heading font-bold">₡36,000 - Inscripción básica</p>
                    <p className="text-gray-600 text-sm font-body">{t.pricing.includes}</p>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <h4 className="font-heading font-semibold text-orange-800 mb-2">{t.pricing.regular}</h4>
                    <p className="text-gray-900 text-lg font-heading font-bold">₡42,000 - Inscripción básica</p>
                    <p className="text-gray-600 text-sm font-body">{t.pricing.includes}</p>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-gray-500 text-sm font-body">Paquetes con reenganches disponibles</p>
                </div>
              </CardContent>
            </Card>

            {/* International Players */}
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
              <CardContent className="p-8">
                <h3 className="text-2xl font-heading font-bold text-gray-900 mb-6 text-center">
                  {t.pricing.international}
                </h3>

                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-heading font-semibold text-green-800 mb-2">{t.pricing.earlyBird}</h4>
                    <p className="text-gray-900 text-lg font-heading font-bold">$70 - Inscripción básica</p>
                    <p className="text-gray-600 text-sm font-body">{t.pricing.includes}</p>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <h4 className="font-heading font-semibold text-orange-800 mb-2">{t.pricing.regular}</h4>
                    <p className="text-gray-900 text-lg font-heading font-bold">$80 - Inscripción básica</p>
                    <p className="text-gray-600 text-sm font-body">{t.pricing.includes}</p>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-gray-500 text-sm font-body">Paquetes con reenganches disponibles</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50 relative z-10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 text-center mb-12 text-balance">
            {t.testimonials.title}
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.testimonials.items.map((testimonial, index) => (
              <Card
                key={index}
                className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow relative overflow-hidden"
              >
                <div className="absolute inset-0 opacity-5 flex items-center justify-center">
                  <Image src="/images/testimonial-bg.png" alt="" width={200} height={150} className="object-contain" />
                </div>
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center mb-4">
                    <div className="mr-4 flex items-center justify-center">
                      <span className="text-4xl">🎳</span>
                    </div>
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <div key={i} className="w-4 h-4 mr-1">
                          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-400">
                            <path d="M12 2L14 8H20L15 12L17 18L12 15L7 18L9 12L4 8H10L12 2Z" />
                          </svg>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4 italic font-body leading-relaxed">"{testimonial.text}"</p>
                  <div className="border-t pt-4">
                    <p className="font-heading font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600 font-body">{testimonial.country}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsors Section with Infinite Carousel */}
      <section className="py-16 bg-white overflow-hidden relative z-10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 text-center mb-12 text-balance">
            {t.sponsors.title}
          </h2>

          <div className="relative">
            {/* Gradient overlays for smooth edges */}
            <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

            <div className="sponsors-container">
              <div className="sponsors-track">
                {/* First set of sponsors */}
                {sponsors.map((sponsor, index) => (
                  <div key={`set1-${index}`} className="sponsor-slide">
                    <Image
                      src={sponsor.src || "/placeholder.svg"}
                      alt={sponsor.name}
                      width={sponsor.extraLarge ? 220 : sponsor.large ? 200 : sponsor.small ? 140 : 160}
                      height={sponsor.extraLarge ? 110 : sponsor.large ? 100 : sponsor.small ? 70 : 80}
                      className="sponsor-image"
                    />
                  </div>
                ))}
                {/* Second set for seamless loop */}
                {sponsors.map((sponsor, index) => (
                  <div key={`set2-${index}`} className="sponsor-slide">
                    <Image
                      src={sponsor.src || "/placeholder.svg"}
                      alt={sponsor.name}
                      width={sponsor.extraLarge ? 220 : sponsor.large ? 200 : sponsor.small ? 140 : 160}
                      height={sponsor.extraLarge ? 110 : sponsor.large ? 100 : sponsor.small ? 70 : 80}
                      className="sponsor-image"
                    />
                  </div>
                ))}
                {/* Third set for extra smoothness */}
                {sponsors.map((sponsor, index) => (
                  <div key={`set3-${index}`} className="sponsor-slide">
                    <Image
                      src={sponsor.src || "/placeholder.svg"}
                      alt={sponsor.name}
                      width={sponsor.extraLarge ? 220 : sponsor.large ? 200 : sponsor.small ? 140 : 160}
                      height={sponsor.extraLarge ? 110 : sponsor.large ? 100 : sponsor.small ? 70 : 80}
                      className="sponsor-image"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .sponsors-container {
            width: 100%;
            overflow: hidden;
            position: relative;
          }

          .sponsors-track {
            display: flex;
            width: fit-content;
            animation: infiniteScroll 60s linear infinite;
            will-change: transform;
          }

          .sponsor-slide {
            flex: 0 0 auto;
            width: 200px;
            height: 120px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 20px;
            transition: transform 0.3s ease;
          }

          .sponsor-slide:hover {
            transform: scale(1.05);
          }

          .sponsor-image {
            object-fit: contain;
            max-width: 100%;
            max-height: 80px;
            filter: grayscale(20%) opacity(0.8);
            transition: all 0.3s ease;
          }

          .sponsor-slide:hover .sponsor-image {
            filter: grayscale(0%) opacity(1);
          }

          @keyframes infiniteScroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(calc(-200px * 14 - 40px * 14)); /* width + margin per sponsor * number of sponsors */
            }
          }

          /* Responsive adjustments */
          @media (max-width: 768px) {
            .sponsor-slide {
              width: 150px;
              height: 100px;
              margin: 0 15px;
            }

            .sponsor-image {
              max-height: 60px;
            }

            @keyframes infiniteScroll {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(calc(-150px * 14 - 30px * 14));
              }
            }
          }

          @media (max-width: 480px) {
            .sponsor-slide {
              width: 120px;
              height: 80px;
              margin: 0 10px;
            }

            .sponsor-image {
              max-height: 50px;
            }

            @keyframes infiniteScroll {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(calc(-120px * 14 - 20px * 14));
              }
            }
          }

          /* Pause animation on hover for better UX */
          .sponsors-container:hover .sponsors-track {
            animation-play-state: paused;
          }

          /* Smooth performance optimizations */
          .sponsors-track {
            backface-visibility: hidden;
            perspective: 1000px;
            transform: translateZ(0);
          }
        `}</style>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-black to-gray-900 backdrop-blur-md text-white py-8 border-t border-gray-600/30 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            {/* Left - Logo and Country Club */}
            <div className="flex items-center space-x-2 justify-center md:justify-start">
              <div className="relative">
                <Image
                  src="/images/country-club-logo-transparent.png"
                  alt="Country Club Costa Rica"
                  width={50}
                  height={50}
                  className="brightness-0 invert"
                />
              </div>
              <div className="text-sm">
                <p className="font-heading font-semibold text-white">Country Club Costa Rica</p>
              </div>
            </div>

            {/* Center - Contact Info */}
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="flex items-center space-x-2 text-sm text-white">
                <Mail className="w-4 h-4" />
                <Link href="mailto:boliche@country.co.cr" className="hover:text-gray-300 font-body">
                  boliche@country.co.cr
                </Link>
              </div>
              <div className="flex items-center space-x-2 text-sm text-white">
                <Phone className="w-4 h-4" />
                <Link href="tel:+50622085027" className="hover:text-gray-300 font-body">
                  (+506) 2208-5027
                </Link>
              </div>
            </div>

            {/* Right - Copyright */}
            <div className="text-center md:text-right">
              <div className="text-xs text-white space-y-1 font-body">
                <p>© 2025 Torneo La Negrita, 5ª Edición.</p>
                <p>Arquitectura por OnchainFest.</p>
                <p>Todos los derechos reservados.</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
