"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Wallet,
  Trophy,
  Shield,
  Zap,
  Users,
  ChevronDown,
  CheckCircle2,
  XCircle,
  Clock,
  Target,
  Coins,
  BarChart3,
  Smartphone,
  Lock,
  TrendingUp,
  ArrowRight,
  ChevronRight,
  Sparkles,
} from "lucide-react"
import Link from "next/link"

export default function PadelFlowLanding() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    element?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-navy/95 backdrop-blur-md border-b border-cyan/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan to-cyan-dark rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-navy" />
              </div>
              <span className="text-2xl font-heading font-bold text-white">
                Padel<span className="text-cyan">Flow</span>
              </span>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="text-gray-300 hover:text-cyan transition-colors font-body"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="text-gray-300 hover:text-cyan transition-colors font-body"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("pricing")}
                className="text-gray-300 hover:text-cyan transition-colors font-body"
              >
                Pricing
              </button>
              <button
                onClick={() => scrollToSection("faq")}
                className="text-gray-300 hover:text-cyan transition-colors font-body"
              >
                FAQ
              </button>
            </nav>

            <div className="flex items-center space-x-4">
              <Button
                onClick={() => scrollToSection("pricing")}
                className="bg-gradient-to-r from-cyan to-cyan-dark hover:from-cyan-dark hover:to-cyan text-navy font-heading font-bold shadow-lg shadow-cyan/25"
              >
                Start a Tournament
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-navy via-navy-light to-navy">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(36, 208, 230, 0.4) 1px, transparent 0)`,
            backgroundSize: '48px 48px'
          }} />
        </div>

        {/* Gradient Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-dark/10 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-cyan/10 text-cyan border-cyan/30 px-4 py-2 text-sm font-accent">
              <Sparkles className="w-4 h-4 mr-2 inline" />
              Powered by Smart Contracts
            </Badge>

            <h1 className="text-5xl md:text-7xl font-heading font-bold text-white mb-6 leading-tight">
              Create Padel Tournaments in Minutes.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan to-cyan-light">
                Power Them with Web3.
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed font-body max-w-3xl mx-auto">
              Smart-wallet onboarding, automated prize distribution, and trustless results — all in one platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={() => scrollToSection("pricing")}
                size="lg"
                className="bg-gradient-to-r from-cyan to-cyan-dark hover:from-cyan-dark hover:to-cyan text-navy font-heading font-bold text-lg px-8 py-6 shadow-xl shadow-cyan/30 group"
              >
                Start a Tournament
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                onClick={() => scrollToSection("how-it-works")}
                size="lg"
                variant="outline"
                className="border-cyan/50 text-cyan hover:bg-cyan/10 font-heading text-lg px-8 py-6"
              >
                See How It Works
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-heading font-bold text-cyan">100%</div>
                <div className="text-sm text-gray-400 font-body">Automated</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-heading font-bold text-cyan">$0</div>
                <div className="text-sm text-gray-400 font-body">Setup Fee</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-heading font-bold text-cyan">&lt;5min</div>
                <div className="text-sm text-gray-400 font-body">To Launch</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-heading font-bold text-cyan">Instant</div>
                <div className="text-sm text-gray-400 font-body">Payouts</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-cyan" />
        </div>
      </section>

      {/* Problem / Value Proposition Section */}
      <section className="py-20 bg-gray-50" id="problems">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-navy mb-4">
              Traditional Tournaments Are Broken
            </h2>
            <p className="text-xl text-gray-600 font-body max-w-2xl mx-auto">
              Organizers waste hours on manual tasks, players wait days for payouts, and trust issues plague every event.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="border-2 border-red-100 bg-white hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-heading font-bold text-navy mb-3">Manual Organization</h3>
                <p className="text-gray-600 font-body leading-relaxed">
                  Hours spent on spreadsheets, manual bracket updates, and chasing down player registrations. One mistake can ruin the entire tournament.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-red-100 bg-white hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                  <Clock className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-heading font-bold text-navy mb-3">Delayed Payments</h3>
                <p className="text-gray-600 font-body leading-relaxed">
                  Players wait days or weeks for prize money. Bank transfers, cash handling, and payment disputes create friction and distrust.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-red-100 bg-white hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                  <Shield className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-heading font-bold text-navy mb-3">Zero Transparency</h3>
                <p className="text-gray-600 font-body leading-relaxed">
                  No visibility into prize pools, unclear fee structures, and no proof of fair distribution. Trust is earned manually, if at all.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Solution Highlight */}
          <div className="relative bg-gradient-to-br from-cyan to-cyan-dark rounded-3xl p-12 text-center overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                backgroundSize: '32px 32px'
              }} />
            </div>
            <div className="relative z-10">
              <CheckCircle2 className="w-16 h-16 text-navy mx-auto mb-6" />
              <h3 className="text-3xl md:text-4xl font-heading font-bold text-navy mb-4">
                PadelFlow Solves All of This with Smart Contracts
              </h3>
              <p className="text-lg text-navy-light font-body max-w-3xl mx-auto">
                Automated organization, instant on-chain payouts, and complete transparency. Your tournament runs itself while you focus on what matters: the game.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white" id="how-it-works">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-navy mb-4">
              Tournament Creation in 3 Simple Steps
            </h2>
            <p className="text-xl text-gray-600 font-body max-w-2xl mx-auto">
              Launch your padel tournament in under 5 minutes. No technical knowledge required.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
              <div className="flex-1 order-2 md:order-1">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-cyan to-cyan-dark text-navy font-heading font-bold text-xl mb-4">
                  1
                </div>
                <h3 className="text-3xl font-heading font-bold text-navy mb-4">Create Tournament</h3>
                <p className="text-lg text-gray-600 font-body leading-relaxed mb-4">
                  Select your tournament format, set entry fees, define prize distribution, and configure brackets. Our smart contract deploys automatically.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-cyan mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-700 font-body">Choose single/double elimination or round-robin</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-cyan mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-700 font-body">Set entry fees in crypto or fiat</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-cyan mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-700 font-body">Define prize split (winner takes X%, runner-up Y%)</span>
                  </li>
                </ul>
              </div>
              <div className="flex-1 order-1 md:order-2">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 h-80 flex items-center justify-center border-2 border-gray-300">
                  <div className="text-center">
                    <Target className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-500 font-body">/images/mockup-dashboard.png</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Connector */}
            <div className="flex justify-center mb-16">
              <ChevronDown className="w-8 h-8 text-cyan" />
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
              <div className="flex-1">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 h-80 flex items-center justify-center border-2 border-gray-300">
                  <div className="text-center">
                    <Wallet className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-500 font-body">/images/wallet-connection.png</p>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-cyan to-cyan-dark text-navy font-heading font-bold text-xl mb-4">
                  2
                </div>
                <h3 className="text-3xl font-heading font-bold text-navy mb-4">Invite Players</h3>
                <p className="text-lg text-gray-600 font-body leading-relaxed mb-4">
                  Share your tournament link. Players register and connect their wallets seamlessly using Coinbase Smart Wallets — no crypto experience needed.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-cyan mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-700 font-body">One-click wallet creation for new users</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-cyan mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-700 font-body">Support for Base, XRPL, and more chains</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-cyan mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-700 font-body">Automatic entry fee collection</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Connector */}
            <div className="flex justify-center mb-16">
              <ChevronDown className="w-8 h-8 text-cyan" />
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 order-2 md:order-1">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-cyan to-cyan-dark text-navy font-heading font-bold text-xl mb-4">
                  3
                </div>
                <h3 className="text-3xl font-heading font-bold text-navy mb-4">
                  Smart Contract Distributes Prizes
                </h3>
                <p className="text-lg text-gray-600 font-body leading-relaxed mb-4">
                  When you input final results, our smart contract instantly distributes prizes to winners' wallets. No delays, no disputes, no trust required.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-cyan mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-700 font-body">Instant on-chain payouts in seconds</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-cyan mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-700 font-body">Immutable audit trail for transparency</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-cyan mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-700 font-body">Zero risk of human error or fraud</span>
                  </li>
                </ul>
              </div>
              <div className="flex-1 order-1 md:order-2">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 h-80 flex items-center justify-center border-2 border-gray-300">
                  <div className="text-center">
                    <Coins className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-500 font-body">/images/prize-distribution.png</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-20 bg-gradient-to-br from-navy via-navy-light to-navy" id="features">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
              Everything You Need to Run Professional Tournaments
            </h2>
            <p className="text-xl text-gray-300 font-body max-w-2xl mx-auto">
              Built for organizers who demand reliability, transparency, and speed.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <Card className="bg-navy-light/50 backdrop-blur border-cyan/20 hover:border-cyan/50 transition-all hover:scale-105">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan to-cyan-dark rounded-lg flex items-center justify-center mb-4">
                  <Wallet className="w-6 h-6 text-navy" />
                </div>
                <h3 className="text-lg font-heading font-bold text-white mb-2">Smart Wallet Login</h3>
                <p className="text-gray-300 font-body text-sm leading-relaxed">
                  Seamless onboarding via Coinbase Smart Wallets SDK. Players create wallets in one click — no seed phrases, no friction.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="bg-navy-light/50 backdrop-blur border-cyan/20 hover:border-cyan/50 transition-all hover:scale-105">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan to-cyan-dark rounded-lg flex items-center justify-center mb-4">
                  <Trophy className="w-6 h-6 text-navy" />
                </div>
                <h3 className="text-lg font-heading font-bold text-white mb-2">Automated Prize Pool</h3>
                <p className="text-gray-300 font-body text-sm leading-relaxed">
                  Entry fees automatically accumulate in a smart contract escrow. Prize distribution happens instantly on tournament completion.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="bg-navy-light/50 backdrop-blur border-cyan/20 hover:border-cyan/50 transition-all hover:scale-105">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan to-cyan-dark rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-navy" />
                </div>
                <h3 className="text-lg font-heading font-bold text-white mb-2">On-Chain Audit Trail</h3>
                <p className="text-gray-300 font-body text-sm leading-relaxed">
                  Every transaction is recorded on-chain. Players can independently verify prize pools and payouts — complete transparency.
                </p>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="bg-navy-light/50 backdrop-blur border-cyan/20 hover:border-cyan/50 transition-all hover:scale-105">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan to-cyan-dark rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-navy" />
                </div>
                <h3 className="text-lg font-heading font-bold text-white mb-2">Instant Payouts</h3>
                <p className="text-gray-300 font-body text-sm leading-relaxed">
                  No waiting. When results are submitted, smart contracts execute payouts in seconds. Winners get paid immediately.
                </p>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card className="bg-navy-light/50 backdrop-blur border-cyan/20 hover:border-cyan/50 transition-all hover:scale-105">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan to-cyan-dark rounded-lg flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6 text-navy" />
                </div>
                <h3 className="text-lg font-heading font-bold text-white mb-2">Anti-Fraud Logic</h3>
                <p className="text-gray-300 font-body text-sm leading-relaxed">
                  Smart contracts prevent double-entries, enforce entry fees, and lock prize pools until verified results are submitted.
                </p>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card className="bg-navy-light/50 backdrop-blur border-cyan/20 hover:border-cyan/50 transition-all hover:scale-105">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan to-cyan-dark rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-navy" />
                </div>
                <h3 className="text-lg font-heading font-bold text-white mb-2">Web Dashboard</h3>
                <p className="text-gray-300 font-body text-sm leading-relaxed">
                  Real-time tournament management dashboard. Update brackets, view registrations, and submit results from any browser.
                </p>
              </CardContent>
            </Card>

            {/* Feature 7 */}
            <Card className="bg-navy-light/50 backdrop-blur border-cyan/20 hover:border-cyan/50 transition-all hover:scale-105">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan to-cyan-dark rounded-lg flex items-center justify-center mb-4">
                  <Smartphone className="w-6 h-6 text-navy" />
                </div>
                <h3 className="text-lg font-heading font-bold text-white mb-2">Multi-Device Support</h3>
                <p className="text-gray-300 font-body text-sm leading-relaxed">
                  Fully responsive design. Manage tournaments from desktop, tablet, or mobile. Players register from any device.
                </p>
              </CardContent>
            </Card>

            {/* Feature 8 */}
            <Card className="bg-navy-light/50 backdrop-blur border-cyan/20 hover:border-cyan/50 transition-all hover:scale-105">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan to-cyan-dark rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-navy" />
                </div>
                <h3 className="text-lg font-heading font-bold text-white mb-2">Multi-Chain Support</h3>
                <p className="text-gray-300 font-body text-sm leading-relaxed">
                  Deploy on Base, XRPL, or other EVM-compatible chains. Choose the blockchain that fits your community best.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* UI Showcase Section */}
      <section className="py-20 bg-gray-50" id="showcase">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-navy mb-4">
              Simple, Powerful Dashboard
            </h2>
            <p className="text-xl text-gray-600 font-body max-w-2xl mx-auto">
              Designed for organizers who want to focus on the game, not the paperwork.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Mockup 1 */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-gray-200">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-64 flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-20 h-20 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 font-body">Dashboard View</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-heading font-bold text-navy mb-2">Tournament Dashboard</h3>
                <p className="text-gray-600 font-body text-sm">
                  Track registrations, monitor prize pool growth, and manage brackets in real-time.
                </p>
              </div>
            </div>

            {/* Mockup 2 */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-gray-200">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-64 flex items-center justify-center">
                <div className="text-center">
                  <Wallet className="w-20 h-20 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 font-body">Wallet Connection</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-heading font-bold text-navy mb-2">One-Click Wallet Setup</h3>
                <p className="text-gray-600 font-body text-sm">
                  Players connect wallets in seconds using Coinbase Smart Wallets — no extensions needed.
                </p>
              </div>
            </div>

            {/* Mockup 3 */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-gray-200">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-64 flex items-center justify-center">
                <div className="text-center">
                  <Trophy className="w-20 h-20 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 font-body">Prize Distribution</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-heading font-bold text-navy mb-2">Instant Prize Confirmation</h3>
                <p className="text-gray-600 font-body text-sm">
                  Submit results and watch smart contracts distribute prizes in real-time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white" id="pricing">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-navy mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 font-body max-w-2xl mx-auto">
              Start for free. Scale as you grow. No hidden fees.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Tier */}
            <Card className="border-2 border-gray-200 hover:shadow-xl transition-all">
              <CardContent className="p-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-heading font-bold text-navy mb-2">Free</h3>
                  <div className="flex items-baseline mb-2">
                    <span className="text-5xl font-heading font-bold text-navy">$0</span>
                    <span className="text-gray-500 ml-2 font-body">/tournament</span>
                  </div>
                  <p className="text-sm text-gray-600 font-body">Perfect to get started</p>
                </div>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-cyan mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 font-body">Up to 1 tournament</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-cyan mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 font-body">Up to 16 players</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-cyan mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 font-body">Smart contract payouts</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-cyan mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 font-body">Basic dashboard</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-cyan mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 font-body">Community support</span>
                  </li>
                </ul>

                <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-heading">
                  Get Started Free
                </Button>
              </CardContent>
            </Card>

            {/* Pro Tier */}
            <Card className="border-2 border-cyan bg-gradient-to-br from-white to-cyan-light/5 hover:shadow-2xl transition-all relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-cyan to-cyan-dark text-navy font-heading font-bold px-4 py-1">
                  Most Popular
                </Badge>
              </div>
              <CardContent className="p-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-heading font-bold text-navy mb-2">Pro Organizer</h3>
                  <div className="flex items-baseline mb-2">
                    <span className="text-5xl font-heading font-bold text-navy">$49</span>
                    <span className="text-gray-500 ml-2 font-body">/month</span>
                  </div>
                  <p className="text-sm text-gray-600 font-body">For serious organizers</p>
                </div>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-cyan mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 font-body">Unlimited tournaments</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-cyan mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 font-body">Unlimited players</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-cyan mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 font-body">Advanced analytics</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-cyan mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 font-body">Custom branding</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-cyan mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 font-body">Priority support</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-cyan mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 font-body">Multi-chain support</span>
                  </li>
                </ul>

                <Button className="w-full bg-gradient-to-r from-cyan to-cyan-dark hover:from-cyan-dark hover:to-cyan text-navy font-heading font-bold">
                  Start Pro Trial
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Tier */}
            <Card className="border-2 border-gray-200 hover:shadow-xl transition-all">
              <CardContent className="p-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-heading font-bold text-navy mb-2">Clubs & Federations</h3>
                  <div className="flex items-baseline mb-2">
                    <span className="text-5xl font-heading font-bold text-navy">Custom</span>
                  </div>
                  <p className="text-sm text-gray-600 font-body">For organizations at scale</p>
                </div>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-cyan mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 font-body">Everything in Pro</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-cyan mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 font-body">REST API access</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-cyan mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 font-body">White-label solution</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-cyan mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 font-body">Dedicated account manager</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-cyan mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 font-body">Custom smart contracts</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-cyan mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 font-body">SLA & uptime guarantee</span>
                  </li>
                </ul>

                <Button
                  variant="outline"
                  className="w-full border-navy text-navy hover:bg-navy hover:text-white font-heading"
                >
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>

          <p className="text-center text-gray-600 font-body mt-8">
            All plans include smart contract deployment, gas fee optimization, and 24/7 platform uptime.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50" id="faq">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-navy mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 font-body max-w-2xl mx-auto">
              Everything you need to know about running Web3-powered tournaments.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {/* FAQ 1 */}
            <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === 1 ? null : 1)}
                className="w-full px-6 py-5 flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg font-heading font-bold text-navy text-left">
                  Do players need crypto knowledge to participate?
                </span>
                <ChevronRight
                  className={`w-5 h-5 text-cyan transition-transform ${openFaq === 1 ? "rotate-90" : ""}`}
                />
              </button>
              {openFaq === 1 && (
                <div className="px-6 pb-5 text-gray-600 font-body">
                  No. PadelFlow uses Coinbase Smart Wallets, which allow players to create wallets in one click — no seed phrases, no extensions, no technical knowledge. They sign up with email or social login, and their wallet is created automatically. The experience feels like any modern web app.
                </div>
              )}
            </div>

            {/* FAQ 2 */}
            <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === 2 ? null : 2)}
                className="w-full px-6 py-5 flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg font-heading font-bold text-navy text-left">How do payouts work?</span>
                <ChevronRight
                  className={`w-5 h-5 text-cyan transition-transform ${openFaq === 2 ? "rotate-90" : ""}`}
                />
              </button>
              {openFaq === 2 && (
                <div className="px-6 pb-5 text-gray-600 font-body">
                  When you create a tournament, entry fees are collected and held in a smart contract escrow. Once you submit final results, the smart contract automatically distributes prizes to winners' wallets based on the prize split you defined. Payouts happen in seconds, and all transactions are recorded on-chain for transparency.
                </div>
              )}
            </div>

            {/* FAQ 3 */}
            <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === 3 ? null : 3)}
                className="w-full px-6 py-5 flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg font-heading font-bold text-navy text-left">
                  Is the system audited and secure?
                </span>
                <ChevronRight
                  className={`w-5 h-5 text-cyan transition-transform ${openFaq === 3 ? "rotate-90" : ""}`}
                />
              </button>
              {openFaq === 3 && (
                <div className="px-6 pb-5 text-gray-600 font-body">
                  Yes. Our smart contracts are audited by leading blockchain security firms and follow industry best practices for escrow and payment distribution. All code is open-source and verifiable on-chain. We also use battle-tested libraries like OpenZeppelin to minimize security risks.
                </div>
              )}
            </div>

            {/* FAQ 4 */}
            <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === 4 ? null : 4)}
                className="w-full px-6 py-5 flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg font-heading font-bold text-navy text-left">
                  What blockchains are supported?
                </span>
                <ChevronRight
                  className={`w-5 h-5 text-cyan transition-transform ${openFaq === 4 ? "rotate-90" : ""}`}
                />
              </button>
              {openFaq === 4 && (
                <div className="px-6 pb-5 text-gray-600 font-body">
                  PadelFlow supports Base (Coinbase's Layer 2), XRPL (Ripple), and all EVM-compatible chains including Ethereum mainnet, Polygon, Arbitrum, and Optimism. You can choose the blockchain that best fits your community's needs and budget (gas fees vary by chain).
                </div>
              )}
            </div>

            {/* FAQ 5 */}
            <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === 5 ? null : 5)}
                className="w-full px-6 py-5 flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg font-heading font-bold text-navy text-left">
                  Can I accept both crypto and fiat payments?
                </span>
                <ChevronRight
                  className={`w-5 h-5 text-cyan transition-transform ${openFaq === 5 ? "rotate-90" : ""}`}
                />
              </button>
              {openFaq === 5 && (
                <div className="px-6 pb-5 text-gray-600 font-body">
                  Yes. Players can pay entry fees in crypto (USDC, ETH, etc.) or fiat via credit/debit card. Fiat payments are automatically converted to stablecoins and deposited into the tournament smart contract. This gives players flexibility while maintaining the benefits of blockchain-based payouts.
                </div>
              )}
            </div>

            {/* FAQ 6 */}
            <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === 6 ? null : 6)}
                className="w-full px-6 py-5 flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg font-heading font-bold text-navy text-left">
                  What happens if there's a dispute about results?
                </span>
                <ChevronRight
                  className={`w-5 h-5 text-cyan transition-transform ${openFaq === 6 ? "rotate-90" : ""}`}
                />
              </button>
              {openFaq === 6 && (
                <div className="px-6 pb-5 text-gray-600 font-body">
                  Tournament organizers have full control over result submission. However, for added trust, you can enable multi-sig approval where multiple designated admins must confirm results before payouts execute. This prevents unilateral decisions and adds an extra layer of fairness to high-stakes tournaments.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-navy via-navy-light to-navy">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
            Ready to Launch Your First Tournament?
          </h2>
          <p className="text-xl text-gray-300 font-body mb-10 max-w-2xl mx-auto">
            Join organizers who are already running transparent, efficient tournaments powered by smart contracts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => scrollToSection("pricing")}
              size="lg"
              className="bg-gradient-to-r from-cyan to-cyan-dark hover:from-cyan-dark hover:to-cyan text-navy font-heading font-bold text-lg px-8 py-6 shadow-xl shadow-cyan/30"
            >
              Start Free Today
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-cyan/50 text-cyan hover:bg-cyan/10 font-heading text-lg px-8 py-6"
              asChild
            >
              <a href="mailto:hello@padelflow.xyz">Contact Sales</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-dark text-white py-12 border-t border-cyan/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan to-cyan-dark rounded-lg flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-navy" />
                </div>
                <span className="text-2xl font-heading font-bold text-white">
                  Padel<span className="text-cyan">Flow</span>
                </span>
              </div>
              <p className="text-gray-400 font-body text-sm">
                Web3-powered tournament management for the modern sports organizer.
              </p>
            </div>

            {/* Product */}
            <div>
              <h3 className="text-white font-heading font-bold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => scrollToSection("features")}
                    className="text-gray-400 hover:text-cyan transition-colors font-body text-sm"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("pricing")}
                    className="text-gray-400 hover:text-cyan transition-colors font-body text-sm"
                  >
                    Pricing
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("how-it-works")}
                    className="text-gray-400 hover:text-cyan transition-colors font-body text-sm"
                  >
                    How It Works
                  </button>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-cyan transition-colors font-body text-sm">
                    API Docs
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-white font-heading font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-cyan transition-colors font-body text-sm">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-cyan transition-colors font-body text-sm">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-cyan transition-colors font-body text-sm">
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:hello@padelflow.xyz"
                    className="text-gray-400 hover:text-cyan transition-colors font-body text-sm"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-white font-heading font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-cyan transition-colors font-body text-sm">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-cyan transition-colors font-body text-sm">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-cyan transition-colors font-body text-sm">
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-cyan transition-colors font-body text-sm">
                    Smart Contract Audit
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 font-body text-sm mb-4 md:mb-0">
              © 2025 PadelFlow. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-cyan transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
