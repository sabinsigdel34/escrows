import React, {
  Suspense,
  createContext,
  lazy,
  memo,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  HashRouter,
  Link,
  NavLink,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { SplitText } from 'gsap/SplitText'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Banknote,
  BarChart3,
  Bell,
  Briefcase,
  Building2,
  Car,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  Code2,
  Coins,
  Copy,
  CreditCard,
  Gauge,
  Gavel,
  Gem,
  Globe2,
  Hammer,
  Home,
  KeyRound,
  Landmark,
  Layers,
  LineChart as LineChartIcon,
  LockKeyhole,
  LogOut,
  Mail,
  Menu,
  Play,
  PlusCircle,
  Scale,
  Search,
  Send,
  ShieldCheck,
  Terminal,
  Timer,
  TrendingDown,
  TrendingUp,
  UserCircle,
  Users,
  Wallet,
  X,
  XCircle,
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText)

const AuthContext = createContext(null)
const DataContext = createContext(null)

const users = {
  buyer: {
    id: 'usr-buyer',
    name: 'Alex Morgan',
    role: 'buyer',
    email: 'alex@northstar.capital',
    avatarColor: '#2563EB',
  },
  seller: {
    id: 'usr-seller',
    name: 'Jordan Chen',
    role: 'seller',
    email: 'jordan@chen.studio',
    avatarColor: '#10B981',
  },
  admin: {
    id: 'usr-admin',
    name: 'Sam Rivera',
    role: 'admin',
    email: 'sam@escrowly.com',
    avatarColor: '#CC0000',
  },
}

const transactionsSeed = [
  {
    id: '2e9b7c9b-1fb2-4cb5-ae10-0101c8374a10',
    shortId: 'ESC-2401',
    title: 'Penthouse earnest deposit',
    type: 'Real Estate',
    buyer: 'Alex Morgan',
    seller: 'Jordan Chen',
    amount: 482000,
    currency: 'USD',
    status: 'Funded',
    progress: 64,
    deadline: 'May 4, 2026',
    roleAction: 'Confirm inspection',
  },
  {
    id: '6dbcb40d-b973-40ac-a25c-8b5d6284e31d',
    shortId: 'ESC-2402',
    title: 'SaaS licensing release',
    type: 'SaaS Licensing',
    buyer: 'Mira Patel',
    seller: 'OpenKey Labs',
    amount: 74200,
    currency: 'USDC',
    status: 'InProgress',
    progress: 48,
    deadline: 'May 11, 2026',
    roleAction: 'Review milestone',
  },
  {
    id: '76ef1134-09de-4043-a352-86ad12500ee1',
    shortId: 'ESC-2403',
    title: 'Vintage vehicle handoff',
    type: 'Vehicle Sales',
    buyer: 'Theo Clark',
    seller: 'Mason Imports',
    amount: 119900,
    currency: 'USD',
    status: 'Delivered',
    progress: 88,
    deadline: 'May 2, 2026',
    roleAction: 'Release funds',
  },
  {
    id: '3bdb6d97-fdd4-476d-a66b-87f29f3e66cd',
    shortId: 'ESC-2404',
    title: 'Domain transfer escrow',
    type: 'Domain & IP',
    buyer: 'Nova Systems',
    seller: 'Atlas Domains',
    amount: 365000,
    currency: 'USD',
    status: 'Disputed',
    progress: 52,
    deadline: 'May 6, 2026',
    roleAction: 'Open case file',
  },
  {
    id: '8bf5f4f3-6058-4fe2-b5f3-6f015c025f59',
    shortId: 'ESC-2405',
    title: 'Agency campaign milestone',
    type: 'Freelance',
    buyer: 'Kaito Retail',
    seller: 'Northline Studio',
    amount: 24840,
    currency: 'USD',
    status: 'Released',
    progress: 100,
    deadline: 'Apr 28, 2026',
    roleAction: 'Download receipt',
  },
  {
    id: 'd5776fa2-cfe0-4260-89e6-c8282fa7d9c7',
    shortId: 'ESC-2406',
    title: 'Construction draw schedule',
    type: 'Construction',
    buyer: 'Pier 18 Holdings',
    seller: 'Keystone Build',
    amount: 620000,
    currency: 'USD',
    status: 'Created',
    progress: 18,
    deadline: 'May 18, 2026',
    roleAction: 'Fund escrow',
  },
  {
    id: '22548220-2b19-42ba-8211-6afc6c6faf05',
    shortId: 'ESC-2407',
    title: 'M&A deposit holdback',
    type: 'M&A',
    buyer: 'Vector Group',
    seller: 'Helio Robotics',
    amount: 2400000,
    currency: 'USD',
    status: 'Funded',
    progress: 72,
    deadline: 'May 8, 2026',
    roleAction: 'Approve diligence',
  },
  {
    id: 'ab6cff84-62b2-430d-926c-48f02c4f72d7',
    shortId: 'ESC-2408',
    title: 'Private art acquisition',
    type: 'Art & Collectibles',
    buyer: 'Lena Park',
    seller: 'Aurum Gallery',
    amount: 188000,
    currency: 'EUR',
    status: 'Pending',
    progress: 34,
    deadline: 'May 14, 2026',
    roleAction: 'Invite curator',
  },
]

const disputesSeed = [
  {
    caseId: 'ESC-2024-001',
    transaction: 'Domain transfer escrow',
    status: 'Open',
    amount: '$365,000',
    owner: 'Nova Systems',
    nextStep: 'Evidence upload due in 18h',
    severity: 'High',
  },
  {
    caseId: 'ESC-2024-002',
    transaction: 'Vehicle title verification',
    status: 'UnderReview',
    amount: '$119,900',
    owner: 'Theo Clark',
    nextStep: 'Arbitrator review scheduled',
    severity: 'Medium',
  },
  {
    caseId: 'ESC-2024-003',
    transaction: 'Agency scope acceptance',
    status: 'Resolved',
    amount: '$24,840',
    owner: 'Northline Studio',
    nextStep: 'Funds released Apr 28',
    severity: 'Closed',
  },
]

const smartContractsSeed = [
  {
    id: 'SC-9001',
    address: '0xABCD92E1fA6214C090bE879f7F2D1A709aE83510',
    type: 'Milestone',
    value: '140.5 ETH',
    status: 'Deployed',
    block: 19770221,
    timestamp: '2 min ago',
  },
  {
    id: 'SC-9002',
    address: '0x6C5A7719dEaEfC079e98F67a73612eA09435E710',
    type: 'Simple',
    value: '88,200 USDC',
    status: 'Pending',
    block: 19770192,
    timestamp: '12 min ago',
  },
  {
    id: 'SC-9003',
    address: '0x73Ef12EAc880A7f1123Da700f71cF9E8215E6101',
    type: 'Arbitrated',
    value: '420,000 USDT',
    status: 'Deployed',
    block: 19770134,
    timestamp: '27 min ago',
  },
  {
    id: 'SC-9004',
    address: '0xD0E902B96Ec9B9dC5718d321F528E6aEBA989B61',
    type: 'TimeLocked',
    value: '55.8 ETH',
    status: 'Expired',
    block: 19769901,
    timestamp: '1 hr ago',
  },
]

const walletHistory = Array.from({ length: 30 }, (_, index) => {
  const wave = Math.sin(index / 2.8) * 950
  const drift = index * 190
  return {
    day: `D${index + 1}`,
    available: Math.round(18800 + drift + wave),
    locked: Math.round(56000 + index * 420 + Math.cos(index / 3) * 2100),
  }
})

const statusTone = {
  Created: 'muted',
  Pending: 'amber',
  Funded: 'gold',
  InProgress: 'blue',
  Delivered: 'emerald',
  Released: 'emerald',
  Disputed: 'red',
  Open: 'red',
  UnderReview: 'amber',
  Resolved: 'emerald',
  Deployed: 'emerald',
  Expired: 'muted',
}

const terminalLogs = [
  'escrowly deploy --template milestone',
  'Compiling Solidity source...',
  'Validating buyer and seller addresses...',
  'Estimating gas on Sepolia simulation...',
  'Broadcasting signed deployment transaction...',
  'Receipt confirmed in block 19770288',
  'Contract address: 0xABCD92E1fA6214C090bE879f7F2D1A709aE83510',
]

const faqTabs = ['General', 'Security', 'Fees', 'Disputes', 'Smart Contracts']

const bannerImages = {
  hero: '/banners/secure-deal.jpg',
  laptop: '/banners/friendly-laptop.jpg',
  workspace: '/banners/bright-workspace.jpg',
  handoff: '/banners/team-handoff.jpg',
  realEstate: '/banners/real-estate-agent.jpg',
  keys: '/banners/house-keys.jpg',
  art: '/banners/art-gallery.jpg',
  project: '/banners/project-cards.jpg',
  finance: '/banners/finance-dashboard.jpg',
  laptopPlan: '/banners/project-laptop.jpg',
  payment: '/banners/payment-card.jpg',
  team: '/banners/team-office.jpg',
}

function formatCurrency(value, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value)
}

function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(users.buyer)
  const [isAuthenticated, setIsAuthenticated] = useState(true)

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated,
      login: (role = 'buyer') => {
        setCurrentUser(users[role] || users.buyer)
        setIsAuthenticated(true)
      },
      logout: () => setIsAuthenticated(false),
      switchRole: (role) => setCurrentUser(users[role] || users.buyer),
    }),
    [currentUser, isAuthenticated],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function DataProvider({ children }) {
  const value = useMemo(
    () => ({
      users,
      transactions: transactionsSeed,
      wallet: {
        available: 24840,
        locked: 67200,
        history: walletHistory,
      },
      disputes: disputesSeed,
      smartContracts: smartContractsSeed,
    }),
    [],
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

function useAuth() {
  return useContext(AuthContext)
}

function useData() {
  return useContext(DataContext)
}

function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <DataProvider>
          <style>{styles}</style>
          <SmoothShell>
            <Suspense fallback={<LoadingScreen />}>
              <AnimatedRoutes />
            </Suspense>
          </SmoothShell>
        </DataProvider>
      </AuthProvider>
    </HashRouter>
  )
}

function SmoothShell({ children }) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const smoother = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1.5,
      effects: true,
      normalizeScroll: true,
      ignoreMobileResize: true,
    })

    return () => {
      smoother.kill()
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">{children}</div>
    </div>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  const pageRef = useRef(null)

  useEffect(() => {
    if (!pageRef.current) return undefined
    const ctx = gsap.context(() => {
      gsap.fromTo(
        pageRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' },
      )
    }, pageRef)

    window.scrollTo({ top: 0, behavior: 'instant' })
    return () => ctx.revert()
  }, [location.pathname])

  return (
    <div ref={pageRef} className="page-transition">
      <Routes location={location}>
        <Route
          path="/"
          element={
            <PublicLayout>
              <LandingPage />
            </PublicLayout>
          }
        />
        <Route
          path="/login"
          element={
            <PublicLayout compact>
              <LoginPage />
            </PublicLayout>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicLayout compact>
              <SignupPage />
            </PublicLayout>
          }
        />
        <Route
          path="/how-it-works"
          element={
            <PublicLayout>
              <HowItWorksPage />
            </PublicLayout>
          }
        />
        <Route
          path="/features"
          element={
            <PublicLayout>
              <FeaturesPage />
            </PublicLayout>
          }
        />
        <Route
          path="/use-cases"
          element={
            <PublicLayout>
              <UseCasesPage />
            </PublicLayout>
          }
        />
        <Route
          path="/smart-contract"
          element={
            <PublicLayout>
              <SmartContractPage />
            </PublicLayout>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardShell>
                <DashboardPage />
              </DashboardShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-escrow"
          element={
            <ProtectedRoute>
              <DashboardShell>
                <CreateEscrowPage />
              </DashboardShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/transaction/:id"
          element={
            <ProtectedRoute>
              <DashboardShell>
                <TransactionPage />
              </DashboardShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/wallet"
          element={
            <ProtectedRoute>
              <DashboardShell>
                <LazyWalletPage />
              </DashboardShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/disputes"
          element={
            <ProtectedRoute>
              <DashboardShell>
                <DisputesPage />
              </DashboardShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <DashboardShell>
                <LazyAdminPage />
              </DashboardShell>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  )
}

const LazyWalletPage = lazy(() => Promise.resolve({ default: WalletPage }))
const LazyAdminPage = lazy(() => Promise.resolve({ default: AdminPage }))
const SmartContractPage = lazy(() => Promise.resolve({ default: SmartContractView }))

function PublicLayout({ children, compact = false }) {
  return (
    <>
      <Navbar />
      <main className={compact ? 'public-main compact' : 'public-main'}>{children}</main>
      <Footer />
    </>
  )
}

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <Logo />
      <div className="loading-bar">
        <span />
      </div>
    </div>
  )
}

function Logo() {
  return (
    <Link to="/" className="logo" aria-label="Escrowly home">
      <span className="logo-mark">E</span>
      <span className="logo-word">ESCROWLY</span>
    </Link>
  )
}

function Navbar() {
  const [open, setOpen] = useState(false)
  const links = [
    ['HOW IT WORKS', '/how-it-works'],
    ['FEATURES', '/features'],
    ['USE CASES', '/use-cases'],
    ['SMART CONTRACT', '/smart-contract'],
  ]

  return (
    <header className="navbar">
      <Logo />
      <nav className="nav-links" aria-label="Primary navigation">
        {links.map(([label, to]) => (
          <NavLink key={to} to={to}>
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="nav-actions">
        <Button to="/dashboard" className="launch-btn">
          LAUNCH APP
        </Button>
        <button className="icon-button mobile-menu-button" type="button" onClick={() => setOpen(true)}>
          <Menu size={22} />
        </button>
      </div>
      {open && (
        <div className="mobile-overlay">
          <button className="icon-button overlay-close" type="button" onClick={() => setOpen(false)}>
            <X size={26} />
          </button>
          <Logo />
          <nav>
            {links.map(([label, to]) => (
              <NavLink key={to} to={to} onClick={() => setOpen(false)}>
                {label}
              </NavLink>
            ))}
          </nav>
          <Button to="/dashboard" onClick={() => setOpen(false)}>
            LAUNCH APP
          </Button>
        </div>
      )}
    </header>
  )
}

function Button({
  children,
  to,
  variant = 'primary',
  className = '',
  icon: Icon,
  type = 'button',
  onClick,
}) {
  const press = (event) => {
    gsap.to(event.currentTarget, { scale: 0.96, duration: 0.1, ease: 'power2.out' })
  }
  const release = (event) => {
    gsap.to(event.currentTarget, { scale: 1, duration: 0.32, ease: 'back.out(3)' })
  }
  const content = (
    <>
      {Icon && <Icon size={16} />}
      <span>{children}</span>
    </>
  )
  const props = {
    className: `btn btn-${variant} ${className}`,
    onMouseDown: press,
    onMouseUp: release,
    onMouseLeave: release,
    onClick,
  }

  if (to) {
    return (
      <Link to={to} {...props}>
        {content}
      </Link>
    )
  }

  return (
    <button type={type} {...props}>
      {content}
    </button>
  )
}

function ProgressiveReveal({ children, className = '', stagger = 0.1 }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return undefined
    const items = Array.from(ref.current.children)
    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: 'power3.out',
          stagger,
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 80%',
          },
        },
      )
    }, ref)
    return () => ctx.revert()
  }, [stagger])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

function Counter({ value, prefix = '', suffix = '', decimals = 0 }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return undefined
    const state = { value: 0 }
    const ctx = gsap.context(() => {
      gsap.to(state, {
        value,
        duration: 1.8,
        ease: 'power2.out',
        onUpdate: () => setDisplay(Number(state.value.toFixed(decimals))),
        scrollTrigger: { trigger: ref.current, start: 'top 85%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [decimals, value])

  return (
    <span ref={ref} className="counter-value">
      {prefix}
      {display.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  )
}

function ChipGroup({ options, value, onChange, className = '' }) {
  return (
    <div className={`chip-group ${className}`} role="tablist">
      {options.map((option) => (
        <button
          type="button"
          key={option}
          className={value === option ? 'chip active' : 'chip'}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  )
}

function StatusBadge({ status }) {
  return <span className={`status-badge ${statusTone[status] || 'muted'}`}>{status}</span>
}

function AvatarPair({ left, right }) {
  return (
    <div className="avatar-pair">
      <span style={{ '--avatar-bg': '#2563EB' }}>{left.slice(0, 1)}</span>
      <span style={{ '--avatar-bg': '#10B981' }}>{right.slice(0, 1)}</span>
    </div>
  )
}

function LandingPage() {
  const titleRef = useRef(null)

  useEffect(() => {
    if (!titleRef.current) return undefined
    const split = new SplitText(titleRef.current, { type: 'words' })
    const ctx = gsap.context(() => {
      gsap.from(split.words, {
        y: 60,
        opacity: 0,
        duration: 0.75,
        ease: 'power3.out',
        stagger: 0.08,
      })
      gsap.to('.hero-float-card', {
        y: 8,
        rotateX: 2,
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
      gsap.to('.hero-blob', {
        yPercent: -16,
        xPercent: 8,
        duration: 7,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
    })
    return () => {
      ctx.revert()
      split.revert()
    }
  }, [])

  return (
    <>
      <section className="hero-section">
        <div className="noise-layer" />
        <div className="dot-grid" />
        <div className="hero-blob blob-one" data-speed="0.85" />
        <div className="hero-blob blob-two" data-speed="1.15" />
        <div className="hero-copy">
          <p className="eyebrow">SAFE PAYMENTS FOR REAL DEALS</p>
          <h1 ref={titleRef}>HOLD FUNDS SAFELY UNTIL EVERYONE IS HAPPY</h1>
          <p className="hero-subtext">
            Escrowly helps buyers and sellers agree on terms, lock money in escrow, track progress, and
            release payment only when the work is complete.
          </p>
          <div className="hero-actions">
            <Button to="/create-escrow" icon={ArrowRight}>
              START A SAFE PAYMENT
            </Button>
            <Button to="/how-it-works" variant="ghost">
              SEE HOW IT WORKS
            </Button>
          </div>
          <div className="hero-stats">
            <span>
              <strong>$2.4B</strong> Secured
            </span>
            <span>
              <strong>98K</strong> Transactions
            </span>
            <span>
              <strong>99.8%</strong> Success
            </span>
          </div>
        </div>
        <div className="hero-media-stack" data-speed="1.05">
          <img className="hero-photo-main" src={bannerImages.hero} alt="People shaking hands after signing a safe escrow deal" />
          <img className="hero-photo-small" src={bannerImages.laptop} alt="Person reviewing a payment on a laptop" />
          <div className="hero-float-card">
            <div className="mini-card-top">
              <span>LIVE ESCROW</span>
              <StatusBadge status="Funded" />
            </div>
            <div className="mini-amount">$482,000</div>
            <div className="mini-progress">
              <span style={{ width: '64%' }} />
            </div>
            <div className="mini-row">
              <span>Inspection</span>
              <strong>64%</strong>
            </div>
            <div className="mini-timeline">
              <span />
              <span />
              <span className="active" />
              <span />
            </div>
          </div>
        </div>
      </section>

      <TrustStrip />
      <ImageMosaic
        images={[
          {
            src: bannerImages.workspace,
            alt: 'A person using a laptop in a bright workspace',
            label: 'Simple setup',
          },
          {
            src: bannerImages.realEstate,
            alt: 'A real estate agent helping a customer with keys and paperwork',
            label: 'Real-world handoffs',
          },
          {
            src: bannerImages.payment,
            alt: 'A friendly payment card transaction moment',
            label: 'Clear payment flow',
          },
        ]}
      />
      <LandingHowItWorks />
      <LandingFeatures />
      <PictureBanner
        image={bannerImages.handoff}
        eyebrow="BUILT AROUND PEOPLE"
        title="LESS GUESSWORK. MORE CONFIDENCE."
        text="Every screen is written for normal buyers, sellers, freelancers, and operators, with plain next steps and fewer finance buzzwords."
        alt="Two people completing a professional handoff"
      />
      <SmartContractTeaser />
      <Testimonials />
      <StatsBanner />
      <UseCasesPreview />
      <FAQSection />
      <FinalCTA />
    </>
  )
}

function TrustStrip() {
  const badges = [
    '256-bit SSL',
    'SOC 2 Type II',
    'Bank-Grade Security',
    'Escrow.com Verified',
    'FDIC Insured',
    'Zero Chargebacks',
  ]
  return (
    <section className="trust-strip">
      <div className="marquee">
        {[...badges, ...badges].map((badge, index) => (
          <span key={`${badge}-${index}`}>
            {badge}
            <i />
          </span>
        ))}
      </div>
    </section>
  )
}

function LandingHowItWorks() {
  const steps = [
    ['01', 'Create the escrow', 'Define parties, milestones, deadlines, documents, and release logic.'],
    ['02', 'Fund securely', 'Buyer deposits into a locked account with transparent settlement status.'],
    ['03', 'Release with confidence', 'Confirm delivery, resolve edge cases, and release funds instantly.'],
  ]

  return (
    <section className="section">
      <SectionHeader
        eyebrow="HOW IT WORKS"
        title="A CLEAN CONTROL ROOM FOR EVERY DEAL"
        text="Escrowly keeps counterparties aligned from invite to final release."
      />
      <ProgressiveReveal className="landing-steps">
        {steps.map(([number, title, text]) => (
          <div className="step-card card" key={title}>
            <span className="step-number">{number}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
        ))}
      </ProgressiveReveal>
      <svg className="dash-connector" viewBox="0 0 900 90" aria-hidden="true">
        <path d="M40 48 C 220 10, 310 90, 450 48 S 680 10, 860 48" />
      </svg>
    </section>
  )
}

function LandingFeatures() {
  const features = [
    [LockKeyhole, 'Bank-grade vaulting', 'Layered permissions, audit trails, cold storage policies, and settlement controls.'],
    [ClipboardCheck, 'Milestone releases', 'Split complex deals into clear deliverables with acceptance windows.'],
    [Scale, 'Dispute workflows', 'Evidence vaults, neutral arbitration, SLA tracking, and case summaries.'],
    [Code2, 'Smart contract rails', 'Deploy mock on-chain escrow templates with gas estimates and event logs.'],
    [Wallet, 'Multi-currency wallet', 'Track available, locked, released, and incoming balances in one place.'],
    [Bell, 'Real-time signals', 'Email, SMS, push, webhook, and dashboard notifications for every event.'],
  ]

  return (
    <section className="section section-alt">
      <SectionHeader
        eyebrow="FEATURES"
        title="SECURITY, CONTROL, AND MOMENTUM"
        text="Purpose-built for transactions where trust is valuable and mistakes are expensive."
      />
      <ProgressiveReveal className="feature-grid">
        {features.map(([Icon, title, text]) => (
          <div className="feature-card card" key={title}>
            <span className="icon-orb">
              <Icon size={24} />
            </span>
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
        ))}
      </ProgressiveReveal>
    </section>
  )
}

function SmartContractTeaser() {
  return (
    <section className="smart-teaser">
      <div>
        <p className="eyebrow">SMART CONTRACT RAILS</p>
        <h2>TRUSTLESS ESCROW ON THE BLOCKCHAIN</h2>
        <p>
          Build mock Solidity escrow logic, simulate deploy logs, and inspect recent contract events from
          a premium transaction cockpit.
        </p>
        <Button to="/smart-contract" icon={ArrowRight}>
          EXPLORE SMART CONTRACTS
        </Button>
      </div>
      <CodeBlock
        compact
        lines={[
          'contract EscrowlyMilestone {',
          '  address public buyer;',
          '  address public seller;',
          '  uint256 public lockedValue;',
          '  function release(uint step) external onlyBuyer {',
          '    _settle(step, seller);',
          '  }',
          '}',
        ]}
      />
    </section>
  )
}

function Testimonials() {
  const testimonials = [
    ['Aurum Gallery', 'Escrowly gave our collectors the confidence to close seven-figure acquisitions without procedural drag.'],
    ['Vector Group', 'The milestone view made diligence holdbacks visible to legal, finance, and operators in one shared timeline.'],
    ['Northline Studio', 'We stopped chasing invoices. Clients fund the escrow first, then every milestone has a clean release path.'],
  ]
  const [active, setActive] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => setActive((current) => (current + 1) % testimonials.length), 4000)
    return () => window.clearInterval(timer)
  }, [testimonials.length])

  return (
    <section className="section">
      <SectionHeader eyebrow="TESTIMONIALS" title="TRUSTED BY OPERATORS WHO MOVE REAL MONEY" />
      <div className="testimonial-shell">
        {testimonials.map(([company, quote], index) => (
          <article className={index === active ? 'testimonial active' : 'testimonial'} key={company}>
            <div className="avatar-placeholder">{company.slice(0, 1)}</div>
            <p>{quote}</p>
            <strong>{company}</strong>
          </article>
        ))}
      </div>
    </section>
  )
}

function StatsBanner() {
  return (
    <section className="stats-banner">
      <div>
        <Counter prefix="$" value={2400} suffix="M+" />
        <span>Protected volume</span>
      </div>
      <div>
        <Counter value={98} suffix="K" />
        <span>Verified transactions</span>
      </div>
      <div>
        <Counter value={27} suffix=" min" />
        <span>Median release time</span>
      </div>
    </section>
  )
}

function UseCasesPreview() {
  const preview = [
    [Building2, 'Real Estate'],
    [Briefcase, 'Freelance'],
    [Car, 'Vehicle Sales'],
    [Globe2, 'Domain & IP'],
    [Gem, 'Art Deals'],
  ]
  return (
    <section className="section section-alt">
      <SectionHeader eyebrow="USE CASES" title="DESIGNED FOR SERIOUS TRANSACTIONS" />
      <div className="use-preview-row">
        {preview.map(([Icon, label]) => (
          <Link to="/use-cases" className="use-mini card" key={label}>
            <Icon size={24} />
            <span>{label}</span>
          </Link>
        ))}
        <Link to="/use-cases" className="use-mini all card">
          <ArrowRight size={24} />
          <span>See All Use Cases</span>
        </Link>
      </div>
    </section>
  )
}

function FAQSection() {
  const items = [
    ['What is Escrowly?', 'Escrowly is a frontend-only premium UI prototype for managing escrow transactions, wallets, disputes, and mock smart contracts.'],
    ['Is money actually moved?', 'No. Every balance, release, and deployment is simulated client-side for product demonstration purposes.'],
    ['Can milestones be customized?', 'Yes. The UI models staged deliverables, acceptance windows, arbitrator options, and release conditions.'],
    ['How are disputes handled?', 'Cases include evidence, severity, review state, next action, and neutral arbitration status.'],
    ['Does smart contract deploy use a chain?', 'No. The smart contract builder generates mock Solidity and simulated terminal logs only.'],
  ]
  return <FAQBlock items={items} title="QUESTIONS, ANSWERED" />
}

function FAQBlock({ items, title = 'FAQ' }) {
  const [open, setOpen] = useState(0)
  return (
    <section className="section faq-section">
      <SectionHeader eyebrow="FAQ" title={title} />
      <div className="faq-list">
        {items.map(([question, answer], index) => (
          <div className={open === index ? 'faq-item open' : 'faq-item'} key={question}>
            <button type="button" onClick={() => setOpen(open === index ? -1 : index)}>
              <span>{question}</span>
              <ChevronDown size={18} />
            </button>
            <div className="faq-answer">
              <p>{answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function FinalCTA() {
  return (
    <section className="final-cta">
      <p className="eyebrow">READY WHEN THE DEAL IS</p>
      <h2>START YOUR FIRST ESCROW</h2>
      <Button to="/dashboard" icon={ArrowRight}>
        LAUNCH APP
      </Button>
    </section>
  )
}

function SectionHeader({ eyebrow, title, text }) {
  return (
    <div className="section-header">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  )
}

function PictureBanner({ image, eyebrow, title, text, alt, reverse = false }) {
  return (
    <section className={reverse ? 'picture-banner reverse' : 'picture-banner'}>
      <div className="picture-copy">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
        {text && <p>{text}</p>}
      </div>
      <div className="picture-frame">
        <img src={image} alt={alt} loading="lazy" />
      </div>
    </section>
  )
}

function ImageMosaic({ images }) {
  return (
    <div className="image-mosaic" aria-label="Escrowly customer moments">
      {images.map(({ src, alt, label }) => (
        <figure key={src}>
          <img src={src} alt={alt} loading="lazy" />
          <figcaption>{label}</figcaption>
        </figure>
      ))}
    </div>
  )
}

function AppBanner({ image, title, text, alt, action }) {
  return (
    <section className="app-banner">
      <img src={image} alt={alt} loading="lazy" />
      <div>
        <p className="eyebrow">QUICK GUIDE</p>
        <h2>{title}</h2>
        <p>{text}</p>
        {action && <Button to={action.to}>{action.label}</Button>}
      </div>
    </section>
  )
}

function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const submit = (event) => {
    event.preventDefault()
    login('buyer')
    navigate('/dashboard')
  }

  return (
    <AuthScreen
      mode="login"
      title="WELCOME BACK"
      text="Mock authentication for the frontend prototype. Choose a role once inside the dashboard."
      onSubmit={submit}
    />
  )
}

function SignupPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const submit = (event) => {
    event.preventDefault()
    login('buyer')
    navigate('/dashboard')
  }

  return (
    <AuthScreen
      mode="signup"
      title="CREATE YOUR ESCROWLY ACCOUNT"
      text="Open a simulated workspace with buyer, seller, and admin personas already seeded."
      onSubmit={submit}
    />
  )
}

function AuthScreen({ mode, title, text, onSubmit }) {
  return (
    <section className="auth-screen">
      <div className="auth-card card">
        <p className="eyebrow">{mode === 'login' ? 'SECURE ACCESS' : 'REGISTRATION'}</p>
        <h1>{title}</h1>
        <p>{text}</p>
        <form onSubmit={onSubmit}>
          <label>
            Email
            <input type="email" defaultValue="alex@northstar.capital" />
          </label>
          <label>
            Password
            <input type="password" defaultValue="escrowly-demo" />
          </label>
          {mode === 'signup' && (
            <label>
              Company
              <input type="text" defaultValue="Northstar Capital" />
            </label>
          )}
          <Button type="submit" className="full-width">
            {mode === 'login' ? 'ENTER DASHBOARD' : 'CREATE WORKSPACE'}
          </Button>
        </form>
        <Link to={mode === 'login' ? '/signup' : '/login'} className="auth-switch">
          {mode === 'login' ? 'Need an account? Create one' : 'Already have an account? Sign in'}
        </Link>
      </div>
      <div className="auth-visual">
        <img src={bannerImages.laptopPlan} alt="A bright desk with a laptop and transaction planning notes" />
        <div>
          <strong>Demo workspace ready</strong>
          <span>No real login, no payment API, no backend setup.</span>
        </div>
      </div>
    </section>
  )
}

function SmartContractView() {
  const { smartContracts } = useData()
  const [contractType, setContractType] = useState('Milestone')
  const [token, setToken] = useState('ETH')
  const [condition, setCondition] = useState(['Manual', 'Oracle'])
  const [simulating, setSimulating] = useState(false)
  const [complete, setComplete] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [expanded, setExpanded] = useState(null)
  const pathRef = useRef(null)

  useEffect(() => {
    if (!pathRef.current) return undefined
    const path = pathRef.current
    const length = path.getTotalLength()
    path.style.strokeDasharray = length
    path.style.strokeDashoffset = length
    const ctx = gsap.context(() => {
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 1.4,
        ease: 'power2.out',
        scrollTrigger: { trigger: path, start: 'top 78%' },
      })
    })
    return () => ctx.revert()
  }, [])

  const codeLines = [
    `contract Escrowly${contractType.replace('-', '')} {`,
    '  address public buyer = 0xA11ce...9210;',
    '  address public seller = 0x5e11er...4421;',
    `  uint256 public amount = 42 ${token};`,
    `  string public releaseMode = "${condition.join(' + ')}";`,
    '  event Funded(address indexed buyer, uint256 value);',
    '  event Released(address indexed seller, uint256 value);',
    '  function release() external onlyApproved {',
    '    payable(seller).transfer(address(this).balance);',
    '  }',
    '}',
  ]

  const filteredContracts = smartContracts.filter((contract) => {
    const matchesFilter = filter === 'All' || contract.type === filter
    const matchesSearch =
      contract.address.toLowerCase().includes(search.toLowerCase()) ||
      contract.id.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const toggleCondition = (item) => {
    setCondition((current) =>
      current.includes(item) ? current.filter((value) => value !== item) : [...current, item],
    )
  }

  const simulate = () => {
    setComplete(false)
    setSimulating(true)
    window.setTimeout(() => setComplete(true), 4500)
  }

  return (
    <>
      <section className="contract-hero">
        <div className="dot-grid" />
        <p className="eyebrow">AUTOMATED AGREEMENTS</p>
        <h1>SMART CONTRACTS WITHOUT THE MYSTERY</h1>
        <p>Build escrow rules, preview the logic, and simulate deployment in a friendly guided flow.</p>
        <div className="hero-actions centered">
          <Button to="#builder">BUILD A CONTRACT</Button>
          <Button variant="ghost">READ THE GUIDE</Button>
        </div>
      </section>

      <PictureBanner
        image={bannerImages.finance}
        eyebrow="VISUAL CONTRACT REVIEW"
        title="SEE WHAT WILL HAPPEN BEFORE YOU SIMULATE"
        text="Clear previews, gas estimates, terminal logs, and event details help non-technical users understand the transaction path."
        alt="Financial charts displayed on a laptop screen"
      />

      <section id="builder" className="section">
        <SectionHeader
          eyebrow="CONTRACT BUILDER"
          title="CONFIGURE, PREVIEW, SIMULATE"
          text="All values are mock inputs, but the workflow mirrors a serious escrow deployment desk."
        />
        <div className="contract-builder">
          <div className="builder-panel card">
            <div className="builder-step">
              <span>STEP 1</span>
              <h3>Select contract type</h3>
              <ChipGroup
                options={['Simple', 'Milestone', 'Arbitrated', 'Time-locked']}
                value={contractType}
                onChange={setContractType}
              />
            </div>
            <div className="builder-step">
              <span>STEP 2</span>
              <h3>Configure parameters</h3>
              <div className="form-grid">
                <label>
                  Buyer address
                  <input defaultValue="0xA11ce0291f07C1e1992Ff5D5b43b10A910" />
                </label>
                <label>
                  Seller address
                  <input defaultValue="0x5e11er9f842A1dF771B0c9aAB4984421" />
                </label>
                <label>
                  Amount
                  <input defaultValue="42.00" />
                </label>
                <label>
                  Token
                  <select value={token} onChange={(event) => setToken(event.target.value)}>
                    <option>ETH</option>
                    <option>USDC</option>
                    <option>USDT</option>
                  </select>
                </label>
              </div>
              <div className="check-row">
                {['Manual', 'Oracle', 'Time-based'].map((item) => (
                  <label className="check-chip" key={item}>
                    <input
                      type="checkbox"
                      checked={condition.includes(item)}
                      onChange={() => toggleCondition(item)}
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
              <label>
                Arbitrator address
                <input defaultValue="0xA7b1trA709FAAbC91000009" />
              </label>
            </div>
            <div className="builder-step">
              <span>STEP 4</span>
              <h3>Gas and deployment</h3>
              <div className="gas-card">
                <span>Estimated gas fee</span>
                <strong>0.021 ETH</strong>
                <small>Priority lane, Sepolia simulation</small>
              </div>
              <Button onClick={simulate} icon={Terminal}>
                SIMULATE DEPLOY
              </Button>
            </div>
          </div>
          <div className="builder-preview">
            <CodeBlock lines={codeLines} animated />
            <TerminalOutput active={simulating} complete={complete} />
            {complete && (
              <div className="success-box card">
                <CheckCircle2 size={22} />
                <div>
                  <strong>Contract deployed</strong>
                  <span>0xABCD...3510 locked and ready for funding</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <SectionHeader eyebrow="FLOW" title="HOW SMART CONTRACT ESCROW WORKS" />
        <div className="contract-flow">
          {[
            ['01', 'Buyer deposits funds', 'Funds move into the generated contract address.'],
            ['02', 'Seller delivers', 'Goods, files, keys, or services are tracked against conditions.'],
            ['03', 'Buyer confirms', 'Approval, oracle signal, or time-lock unlocks release logic.'],
            ['04', 'Contract releases', 'Funds settle directly to the seller according to contract rules.'],
          ].map(([number, title, text]) => (
            <div className="flow-card card" key={title}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
          <svg viewBox="0 0 920 140" className="flow-path" aria-hidden="true">
            <path ref={pathRef} d="M40 72 C 220 10, 290 130, 460 72 S 700 8, 880 72" />
          </svg>
        </div>
      </section>

      <section className="section">
        <SectionHeader eyebrow="EXPLORER" title="LIVE CONTRACT EXPLORER" />
        <div className="table-tools">
          <label className="search-box">
            <Search size={18} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search contracts" />
          </label>
          <ChipGroup
            options={['All', 'Simple', 'Milestone', 'Arbitrated', 'TimeLocked']}
            value={filter}
            onChange={setFilter}
          />
        </div>
        <div className="data-table card">
          <div className="table-row table-head">
            <span>Contract ID</span>
            <span>Type</span>
            <span>Value</span>
            <span>Status</span>
            <span>Block</span>
            <span>Timestamp</span>
          </div>
          {filteredContracts.map((contract) => (
            <React.Fragment key={contract.id}>
              <button
                type="button"
                className="table-row"
                onClick={() => setExpanded(expanded === contract.id ? null : contract.id)}
              >
                <span className="mono">{contract.id}</span>
                <span>{contract.type}</span>
                <span>{contract.value}</span>
                <StatusBadge status={contract.status} />
                <span>{contract.block}</span>
                <span>{contract.timestamp}</span>
              </button>
              {expanded === contract.id && (
                <div className="contract-drawer">
                  <p className="mono">{contract.address}</p>
                  <div>
                    <strong>ABI</strong>
                    <code>fund(), release(), dispute(), settleMilestone(uint256)</code>
                  </div>
                  <div>
                    <strong>Events</strong>
                    <code>Funded - MilestoneApproved - ReleaseQueued</code>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      <section className="section section-alt">
        <SectionHeader eyebrow="AUDITS" title="SECURITY AUDIT BADGES" />
        <ProgressiveReveal className="audit-grid">
          {[
            ['CertiK', 'Feb 12, 2026'],
            ['Trail of Bits', 'Mar 4, 2026'],
            ['OpenZeppelin', 'Mar 20, 2026'],
            ['Quantstamp', 'Apr 8, 2026'],
          ].map(([name, date]) => (
            <AuditBadge key={name} name={name} date={date} />
          ))}
        </ProgressiveReveal>
      </section>
    </>
  )
}

function CodeBlock({ lines, animated = false, compact = false }) {
  const ref = useRef(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!animated || !ref.current) return undefined
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.code-line',
        { opacity: 0, x: -16 },
        { opacity: 1, x: 0, duration: 0.35, stagger: 0.07, ease: 'power2.out' },
      )
    }, ref)
    return () => ctx.revert()
  }, [animated, lines])

  const copy = () => {
    navigator.clipboard?.writeText(lines.join('\n'))
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div ref={ref} className={compact ? 'code-block compact' : 'code-block'}>
      <button type="button" className="copy-button" onClick={copy}>
        <Copy size={15} />
        {copied ? 'Copied' : 'Copy'}
      </button>
      <pre>
        {lines.map((line, index) => (
          <span className="code-line" key={`${line}-${index}`}>
            <i>{index + 1}</i>
            <code>{line}</code>
          </span>
        ))}
      </pre>
    </div>
  )
}

function TerminalOutput({ active, complete }) {
  return (
    <div className="terminal card">
      <div className="terminal-bar">
        <Terminal size={16} />
        <span>deployment terminal</span>
      </div>
      {!active && <p className="muted">Run simulation to stream deployment logs.</p>}
      {active &&
        terminalLogs.map((log, index) => (
          <p className="terminal-line" style={{ animationDelay: `${index * 0.45}s` }} key={log}>
            <span>$</span> {log}
          </p>
        ))}
      {complete && <strong className="terminal-success">SUCCESS</strong>}
    </div>
  )
}

function AuditBadge({ name, date }) {
  return (
    <div className="audit-badge card">
      <ShieldCheck size={30} />
      <h3>{name}</h3>
      <span>{date}</span>
      <StatusBadge status="Deployed" />
    </div>
  )
}

function UseCasesPage() {
  const cases = [
    [Building2, 'Real Estate', 'Property purchases, earnest deposits, inspection windows, and closing coordination.'],
    [Briefcase, 'Freelance & Agencies', 'Milestone-based work contracts for retainers, campaigns, launches, and deliverables.'],
    [Car, 'Vehicle Sales', 'Private car sales, collector vehicles, cross-border title review, and delivery acceptance.'],
    [Globe2, 'Domain & IP', 'Digital asset transfers with registrar verification, DNS checks, and ownership handoff.'],
    [Landmark, 'M&A Transactions', 'Acquisition deposit management, holdbacks, diligence milestones, and legal review.'],
    [Gem, 'Art & Collectibles', 'Provenance, insurance, condition reports, and payment release after curator approval.'],
    [Hammer, 'Construction', 'Draw-schedule milestone payments with progress verification and lien waiver tracking.'],
    [KeyRound, 'SaaS Licensing', 'Software key release, enterprise license escrow, and activation on payment.'],
    [Scale, 'Legal Settlements', 'Neutral fund holding with clear release terms and case-document visibility.'],
  ]

  return (
    <>
      <section className="subpage-hero floating-icons">
        <p className="eyebrow">USE CASES</p>
        <h1>EVERY DEAL. EVERY INDUSTRY.</h1>
        <p>Pick your situation, follow the steps, and keep both sides protected from the first deposit to final release.</p>
        <div className="industry-icons" aria-hidden="true">
          {[Building2, Car, Briefcase, Globe2, Landmark, Gem].map((Icon, index) => (
            <span key={index}>
              <Icon size={24} />
            </span>
          ))}
        </div>
      </section>

      <PictureBanner
        image={bannerImages.keys}
        eyebrow="MADE FOR HANDOFFS"
        title="FROM HOUSE KEYS TO SOFTWARE KEYS"
        text="Use Escrowly whenever one side needs proof, the other side needs payment confidence, and everyone needs a clear finish line."
        alt="House keys on a bright real estate desk"
      />

      <section className="section">
        <ProgressiveReveal className="industry-grid">
          {cases.map(([Icon, title, text]) => (
            <IndustryCard key={title} icon={Icon} title={title} text={text} />
          ))}
        </ProgressiveReveal>
      </section>

      <CaseStudy
        title="How a $2.4M Real Estate Deal Closed in 48 Hours"
        challenge="Private buyer, overseas seller, and two legal teams needed one shared transaction source."
        solution="Escrowly modeled inspection, deposit, closing docs, and final release as visible milestones."
        stats={[
          ['48h', 'Close time'],
          ['$2.4M', 'Protected'],
          ['7', 'Approvals'],
        ]}
        image={bannerImages.realEstate}
        imageAlt="Real estate agent handing over keys at a desk"
      />
      <CaseStudy
        flipped
        title="Freelancer Gets Paid on Time, Every Time"
        challenge="A studio had recurring scope disputes and slow payment cycles after delivery."
        solution="Clients funded each milestone upfront, then releases followed acceptance windows and evidence logs."
        stats={[
          ['92%', 'Faster release'],
          ['0', 'Late invoices'],
          ['4', 'Milestones'],
        ]}
        image={bannerImages.project}
        imageAlt="Project planning cards arranged on a bright table"
      />

      <section className="industry-stats">
        {['Real estate volume up 38%', 'Freelance disputes down 72%', 'Digital assets settled in minutes'].map((item) => (
          <span key={item}>{item}</span>
        ))}
      </section>
    </>
  )
}

function IndustryCard({ icon: Icon, title, text }) {
  return (
    <article className="industry-card card">
      <span className="icon-orb">
        <Icon size={24} />
      </span>
      <h3>{title}</h3>
      <p>{text}</p>
      <Link to="/how-it-works">
        See how it works <ArrowRight size={15} />
      </Link>
    </article>
  )
}

function CaseStudy({ title, challenge, solution, stats, image, imageAlt, flipped = false }) {
  return (
    <section className={flipped ? 'case-study flipped' : 'case-study'}>
      <div className="case-visual">
        <img src={image} alt={imageAlt} loading="lazy" />
      </div>
      <div className="case-copy">
        <p className="eyebrow">CASE STUDY</p>
        <h2>{title}</h2>
        <dl>
          <dt>Challenge</dt>
          <dd>{challenge}</dd>
          <dt>Solution</dt>
          <dd>{solution}</dd>
        </dl>
        <div className="case-stats">
          {stats.map(([value, label]) => (
            <div key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeaturesPage() {
  const features = [
    [ShieldCheck, 'Bank-Grade Security', 'AES-256 encryption, 2FA controls, cold storage policies, and hardened role permissions.', ['AES-256', '2FA', 'Cold storage']],
    [Layers, 'Milestone Payments', 'Split complex deals into staged deliverables with acceptance windows and conditional release.', ['Stage release', 'Acceptance rules', 'Progress audit']],
    [Gavel, 'Dispute Resolution', 'Three-party arbitration keeps evidence, statements, deadlines, and rulings in one workspace.', ['Evidence vault', 'SLA timers', 'Neutral arbitration']],
    [Code2, 'Smart Contract Integration', 'Generate mock Solidity templates for trustless release logic and event-driven settlement.', ['Solidity templates', 'Gas estimates', 'Event logs']],
    [Coins, 'Multi-Currency Support', 'Model USD, EUR, GBP, ETH, and stablecoin balances without payment API dependencies.', ['USD', 'EUR', 'ETH/USDC']],
    [Bell, 'Real-Time Notifications', 'Keep parties aligned through email, SMS, push, webhook, and dashboard notifications.', ['Email', 'SMS', 'Webhook']],
  ]

  return (
    <>
      <section className="subpage-hero angled-hero">
        <p className="eyebrow">FEATURES</p>
        <h1>POWERFUL FEATURES, PLAIN LANGUAGE</h1>
        <p>Everything is designed to answer the question users actually have: what happens next?</p>
      </section>

      <PictureBanner
        image={bannerImages.team}
        eyebrow="FRIENDLY BY DEFAULT"
        title="HELPFUL CONTEXT ON EVERY STEP"
        text="Statuses, checklists, cards, and plain-language actions make high-value transactions feel manageable."
        alt="A team collaborating in a bright office"
      />

      {features.map(([Icon, title, text, bullets], index) => (
        <FeatureDeepDive
          key={title}
          icon={Icon}
          title={title}
          text={text}
          bullets={bullets}
          image={[
            bannerImages.finance,
            bannerImages.project,
            bannerImages.handoff,
            bannerImages.laptop,
            bannerImages.payment,
            bannerImages.workspace,
          ][index]}
          flipped={index % 2 === 1}
        />
      ))}

      <section className="section section-alt">
        <SectionHeader eyebrow="COMPARISON" title="ESCROWLY VS. THE USUAL OPTIONS" />
        <ComparisonTable />
      </section>

      <section className="section">
        <SectionHeader eyebrow="PRICING" title="SIMPLE FEES FOR COMPLEX DEALS" />
        <div className="pricing-grid">
          <PricingCard title="Starter" price="2.9%" features={['Up to $50K per deal', 'Standard dispute workflow', 'Wallet history']} />
          <PricingCard popular title="Professional" price="1.9%" features={['Up to $1M per deal', 'Milestone automations', 'Priority arbitration']} />
          <PricingCard title="Enterprise" price="Custom" features={['Unlimited deal value', 'Custom workflows', 'Dedicated success desk']} />
        </div>
      </section>
    </>
  )
}

function FeatureDeepDive({ icon: Icon, title, text, bullets, image, flipped }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return undefined
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current.querySelectorAll('.feature-copy, .mock-ui-shot'),
        { opacity: 0, y: 38 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 78%' },
        },
      )
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className={flipped ? 'feature-deep flipped' : 'feature-deep'}>
      <div className="feature-copy">
        <span className="icon-orb large">
          <Icon size={32} />
        </span>
        <h2>{title}</h2>
        <p>{text}</p>
        <div className="check-list">
          {bullets.map((bullet) => (
            <span key={bullet}>
              <Check size={15} /> {bullet}
            </span>
          ))}
        </div>
      </div>
      <div className="mock-ui-shot card">
        <img src={image} alt={`${title} customer example`} loading="lazy" />
        <div className="shot-overlay">
          <StatusBadge status="Funded" />
          <strong>{title}</strong>
          <span>Clear guidance for every participant</span>
        </div>
      </div>
    </section>
  )
}

function ComparisonTable() {
  const rows = [
    ['Funds held neutrally', true, false, 'Limited', false],
    ['Milestone workflows', true, false, false, false],
    ['Dispute arbitration', true, false, 'Limited', false],
    ['Smart contract options', true, false, false, true],
    ['Chargeback exposure', 'Low', 'Medium', 'High', 'Varies'],
    ['Enterprise audit trail', true, 'Limited', 'Limited', false],
  ]

  return (
    <div className="comparison-table card">
      <div className="comparison-row head">
        <span>Capability</span>
        <span>Escrowly</span>
        <span>Wire Transfer</span>
        <span>PayPal</span>
        <span>Crypto Raw</span>
      </div>
      {rows.map((row) => (
        <div className="comparison-row" key={row[0]}>
          {row.map((cell, index) => (
            <span key={`${row[0]}-${index}`} className={index === 1 ? 'highlight' : ''}>
              {typeof cell === 'boolean' ? cell ? <CheckCircle2 size={18} /> : <XCircle size={18} /> : cell}
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}

function PricingCard({ title, price, features, popular = false }) {
  return (
    <article className={popular ? 'pricing-card card popular' : 'pricing-card card'}>
      {popular && <span className="popular-badge">Most popular</span>}
      <h3>{title}</h3>
      <strong>{price}</strong>
      <p>{price === 'Custom' ? 'Contact sales' : 'Per transaction'}</p>
      <div className="check-list vertical">
        {features.map((feature) => (
          <span key={feature}>
            <Check size={15} /> {feature}
          </span>
        ))}
      </div>
      <Button variant={popular ? 'primary' : 'ghost'}>SELECT TIER</Button>
    </article>
  )
}

function HowItWorksPage() {
  const steps = [
    ['01', 'Create Your Escrow', 'Form fields animate into a transaction packet with parties, amount, milestones, and terms.', FormIllustration],
    ['02', 'Invite Counterparty', 'A secure invitation brings the other party into the same deal room with role-based actions.', InviteIllustration],
    ['03', 'Fund the Escrow', 'The buyer deposits funds into the simulated wallet, moving value from available to locked.', FundIllustration],
    ['04', 'Complete the Deal', 'Delivery evidence, approvals, and confirmations are tracked before release.', CompleteIllustration],
    ['05', 'Release Funds', 'Funds are released after approval, settlement logic, or arbitration resolution.', ReleaseIllustration],
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.walk-step').forEach((step) => {
        gsap.fromTo(
          step.querySelector('.walk-visual'),
          { opacity: 0.35, y: 50 },
          {
            opacity: 1,
            y: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: step,
              start: 'top 65%',
              end: 'bottom 35%',
              scrub: 1,
            },
          },
        )
      })
    })
    return () => ctx.revert()
  }, [])

  const faqItems = [
    ['How long does escrow setup take?', 'Most mock transactions can be configured in under five minutes from the wizard.'],
    ['Who can release funds?', 'Release actions depend on the selected rules, role, and any dispute/arbitration state.'],
    ['Are fees charged in this demo?', 'No. Fees are displayed for UI completeness only.'],
    ['Can I invite external parties?', 'The interface simulates invitations; no real email is sent.'],
    ['What happens if there is a dispute?', 'The transaction moves into the dispute workspace with evidence and review timelines.'],
    ['Is data persisted?', 'State is seeded in memory for the current frontend session.'],
    ['Does wallet funding use payment rails?', 'No payment APIs or banking connections are present.'],
    ['Can smart contracts replace normal escrow?', 'The page demonstrates mock trustless logic for technical deal types.'],
    ['Can admins see all deals?', 'The admin route is role-gated and uses the seeded admin persona.'],
    ['Is this production-ready?', 'It is a polished frontend prototype, not a backend or compliance system.'],
  ]

  return (
    <>
      <section className="subpage-hero">
        <p className="eyebrow">HOW IT WORKS</p>
        <h1>FIVE SIMPLE STEPS TO A SAFER DEAL</h1>
        <p>Start with an agreement, invite the other side, fund securely, finish the work, and release with confidence.</p>
      </section>
      <PictureBanner
        image={bannerImages.workspace}
        eyebrow="NO FINANCE DEGREE REQUIRED"
        title="A CALMER WAY TO MOVE MONEY"
        text="Plain instructions, familiar progress steps, and visual confirmations keep the experience approachable."
        alt="A person working comfortably on a laptop"
      />
      <section className="walkthrough">
        {steps.map(([number, title, text, Illustration]) => (
          <div className="walk-step" key={title}>
            <div className="walk-copy">
              <span>{number}</span>
              <h2>{title}</h2>
              <p>{text}</p>
            </div>
            <div className="walk-visual card">
              <Illustration />
            </div>
          </div>
        ))}
      </section>
      <section className="section section-alt">
        <SectionHeader eyebrow="EXPLAINER" title="A VIDEO-STYLE VIEW OF THE FLOW" />
        <div className="video-card card">
          <button type="button" className="play-button">
            <Play size={28} />
          </button>
          <div className="video-lines">
            <span />
            <span />
            <span />
          </div>
        </div>
        <div className="chapters">
          {steps.map(([number, title]) => (
            <a href={`#step-${number}`} key={title}>
              {number} {title}
            </a>
          ))}
        </div>
      </section>
      <FAQTabs items={faqItems} />
    </>
  )
}

function FormIllustration() {
  return (
    <div className="illustration form-illustration">
      <span />
      <span />
      <span />
      <Button>CREATE</Button>
    </div>
  )
}

function InviteIllustration() {
  return (
    <div className="illustration invite-illustration">
      <Mail size={34} />
      <Send size={28} />
      <span>alex invites jordan</span>
    </div>
  )
}

function FundIllustration() {
  return (
    <div className="illustration fund-illustration">
      <CreditCard size={36} />
      <div>
        <span style={{ height: '68%' }} />
      </div>
      <strong>$482K</strong>
    </div>
  )
}

function CompleteIllustration() {
  return (
    <div className="illustration complete-illustration">
      <CheckCircle2 size={46} />
      <p>Delivery confirmed</p>
      <StatusBadge status="Delivered" />
    </div>
  )
}

function ReleaseIllustration() {
  return (
    <div className="illustration release-illustration">
      <Banknote size={32} />
      <svg viewBox="0 0 250 120">
        <path d="M25 92 C 92 10, 154 10, 225 92" />
        <circle cx="225" cy="92" r="8" />
      </svg>
      <Wallet size={32} />
    </div>
  )
}

function FAQTabs({ items }) {
  const [tab, setTab] = useState('General')
  const visible = useMemo(() => {
    const start = faqTabs.indexOf(tab) * 2
    return items.slice(start, start + 2)
  }, [items, tab])

  return (
    <section className="section faq-section">
      <SectionHeader eyebrow="FAQ" title="DEEPER ANSWERS BY CATEGORY" />
      <TabGroup tabs={faqTabs} active={tab} onChange={setTab} />
      <FAQBlock items={visible.length ? visible : items.slice(0, 2)} title={tab} />
    </section>
  )
}

function TabGroup({ tabs, active, onChange }) {
  return (
    <div className="tab-group">
      {tabs.map((tab) => (
        <button key={tab} type="button" className={active === tab ? 'active' : ''} onClick={() => onChange(tab)}>
          {tab}
        </button>
      ))}
    </div>
  )
}

function DashboardShell({ children }) {
  const [collapsed, setCollapsed] = useState(false)
  const { currentUser, switchRole, logout } = useAuth()
  const nav = [
    [Home, 'Dashboard', '/dashboard'],
    [PlusCircle, 'Create Escrow', '/create-escrow'],
    [Wallet, 'Wallet', '/wallet'],
    [Gavel, 'Disputes', '/disputes'],
    [Code2, 'Smart Contract', '/smart-contract'],
    [BarChart3, 'Admin', '/admin'],
  ]

  useEffect(() => {
    gsap.to('.sidebar', { width: collapsed ? 60 : 240, duration: 0.3, ease: 'power2.out' })
    gsap.to('.sidebar-label, .sidebar .logo-word, .profile-copy', {
      opacity: collapsed ? 0 : 1,
      duration: 0.16,
      ease: 'power2.out',
    })
  }, [collapsed])

  return (
    <div className={collapsed ? 'app-shell collapsed' : 'app-shell'}>
      <aside className="sidebar">
        <div className="side-top">
          <Logo />
          <button className="icon-button collapse-button" type="button" onClick={() => setCollapsed((value) => !value)}>
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
        <nav>
          {nav.map(([Icon, label, to]) => (
            <NavLink key={to} to={to}>
              <Icon size={20} />
              <span className="sidebar-label">{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="side-profile">
          <span className="profile-avatar" style={{ '--avatar-bg': currentUser.avatarColor }}>
            {currentUser.name.slice(0, 1)}
          </span>
          <div className="profile-copy">
            <strong>{currentUser.name}</strong>
            <span>{currentUser.role}</span>
          </div>
        </div>
      </aside>
      <div className="app-content">
        <header className="app-header">
          <label className="search-box">
            <Search size={18} />
            <input placeholder="Search escrows, parties, IDs" />
          </label>
          <div className="header-actions">
            <select value={currentUser.role} onChange={(event) => switchRole(event.target.value)}>
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
              <option value="admin">Admin</option>
            </select>
            <button className="icon-button notification" type="button">
              <Bell size={19} />
              <span>3</span>
            </button>
            <button className="profile-chip" type="button" onClick={logout}>
              <UserCircle size={20} />
              <span>{currentUser.name}</span>
              <LogOut size={15} />
            </button>
          </div>
        </header>
        <main>{children}</main>
        <BottomTabs />
      </div>
    </div>
  )
}

function BottomTabs() {
  const tabs = [
    [Home, '/dashboard'],
    [PlusCircle, '/create-escrow'],
    [Wallet, '/wallet'],
    [Gavel, '/disputes'],
    [UserCircle, '/admin'],
  ]
  return (
    <nav className="bottom-tabs">
      {tabs.map(([Icon, to]) => (
        <NavLink key={to} to={to}>
          <Icon size={20} />
        </NavLink>
      ))}
    </nav>
  )
}

function DashboardPage() {
  const { transactions, wallet } = useData()
  const [filter, setFilter] = useState('All')
  const [sort, setSort] = useState('Deadline')

  const filtered = useMemo(() => {
    const items = filter === 'All' ? transactions : transactions.filter((transaction) => transaction.status === filter)
    return [...items].sort((a, b) => (sort === 'Amount' ? b.amount - a.amount : a.deadline.localeCompare(b.deadline)))
  }, [filter, sort, transactions])

  return (
    <div className="dashboard-page">
      <PageTitle eyebrow="DASHBOARD" title="Command Center" text="Monitor active escrows, liquidity, risk, and release actions." />
      <AppBanner
        image={bannerImages.finance}
        title="Your safest next step is always highlighted"
        text="Use the dashboard to see what needs attention, what is waiting on someone else, and what is ready to release."
        alt="Analytics dashboard on a laptop"
        action={{ to: '/create-escrow', label: 'START A NEW ESCROW' }}
      />
      <div className="stat-grid">
        <StatCard icon={CircleDollarSign} label="Available Balance" value={formatCurrency(wallet.available)} delta="+12.4%" tone="up" />
        <StatCard icon={LockKeyhole} label="Locked In Escrow" value={formatCurrency(wallet.locked)} delta="+8.1%" tone="up" />
        <StatCard icon={ClipboardCheck} label="Active Deals" value="6" delta="+2 this week" tone="up" />
        <StatCard icon={AlertTriangle} label="Risk Queue" value="3" delta="-1 today" tone="down" />
      </div>
      <div className="dashboard-grid">
        <div className="card chart-card">
          <div className="card-heading">
            <h3>Wallet Movement</h3>
            <LineChartIcon size={20} />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={wallet.history}>
              <defs>
                <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#CC0000" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#CC0000" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="day" stroke="#555" tickLine={false} />
              <YAxis stroke="#555" tickLine={false} />
              <Tooltip contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)' }} />
              <Area type="monotone" dataKey="available" stroke="#CC0000" fill="url(#balanceGradient)" strokeWidth={2} />
              <Line type="monotone" dataKey="locked" stroke="#D4A843" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="card risk-card">
          <h3>Settlement Queue</h3>
          {transactions.slice(0, 4).map((transaction) => (
            <div className="queue-item" key={transaction.id}>
              <span>{transaction.shortId}</span>
              <strong>{transaction.progress}%</strong>
              <StatusBadge status={transaction.status} />
            </div>
          ))}
        </div>
      </div>
      <section className="card escrow-list">
        <div className="list-heading">
          <div>
            <h3>Escrows</h3>
            <p>Filter, sort, and act on seeded mock transactions.</p>
          </div>
          <div className="list-tools">
            <ChipGroup
              options={['All', 'Created', 'Funded', 'InProgress', 'Delivered', 'Released', 'Disputed']}
              value={filter}
              onChange={setFilter}
            />
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option>Deadline</option>
              <option>Amount</option>
            </select>
          </div>
        </div>
        <div className="escrow-card-list">
          {filtered.map((transaction) => (
            <EscrowCard key={transaction.id} transaction={transaction} />
          ))}
        </div>
      </section>
    </div>
  )
}

function PageTitle({ eyebrow, title, text }) {
  return (
    <div className="page-title">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      {text && <p>{text}</p>}
    </div>
  )
}

function StatCard({ icon: Icon, label, value, delta, tone }) {
  return (
    <article className="stat-card card">
      <div>
        <Icon size={22} />
        <span className={tone === 'down' ? 'delta down' : 'delta'}>
          {tone === 'down' ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
          {delta}
        </span>
      </div>
      <strong>{value}</strong>
      <p>{label}</p>
    </article>
  )
}

const EscrowCard = memo(function EscrowCard({ transaction }) {
  return (
    <article className="escrow-card">
      <div className="escrow-main">
        <AvatarPair left={transaction.buyer} right={transaction.seller} />
        <div>
          <Link to={`/transaction/${transaction.id}`}>{transaction.title}</Link>
          <span>
            {transaction.shortId} · {transaction.type}
          </span>
        </div>
      </div>
      <div className="amount-block">
        <strong>{formatCurrency(transaction.amount, transaction.currency === 'USDC' ? 'USD' : transaction.currency)}</strong>
        <span>{transaction.currency}</span>
      </div>
      <StatusBadge status={transaction.status} />
      <div className="progress-cell">
        <div className="progress-track">
          <span style={{ width: `${transaction.progress}%` }} />
        </div>
        <small>{transaction.progress}% complete</small>
      </div>
      <div className="deadline">
        <Timer size={15} />
        <span>{transaction.deadline}</span>
      </div>
      <Button to={`/transaction/${transaction.id}`} variant="ghost">
        {transaction.roleAction}
      </Button>
    </article>
  )
})

function CreateEscrowPage() {
  const steps = ['Parties', 'Terms', 'Milestones', 'Funding', 'Review']
  const [step, setStep] = useState(0)

  return (
    <div>
      <PageTitle eyebrow="CREATE ESCROW" title="New Secure Transaction" text="A five-step mock wizard for high-value deal setup." />
      <AppBanner
        image={bannerImages.handoff}
        title="Create the deal room before money moves"
        text="Add the parties, terms, milestones, and funding rules so both sides understand the plan."
        alt="Two people completing a professional handoff"
      />
      <div className="wizard card">
        <div className="wizard-steps">
          {steps.map((label, index) => (
            <button key={label} type="button" className={index <= step ? 'active' : ''} onClick={() => setStep(index)}>
              <span>{index + 1}</span>
              {label}
            </button>
          ))}
        </div>
        <div className="wizard-body">
          <h2>{steps[step]}</h2>
          <WizardStep step={step} />
          <div className="wizard-actions">
            <Button variant="ghost" onClick={() => setStep(Math.max(0, step - 1))}>
              BACK
            </Button>
            <Button onClick={() => setStep(Math.min(steps.length - 1, step + 1))}>
              {step === steps.length - 1 ? 'CREATE ESCROW' : 'CONTINUE'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function WizardStep({ step }) {
  const content = [
    ['Buyer and seller', ['Buyer: Alex Morgan', 'Seller: Jordan Chen', 'Arbitrator: Escrowly Neutral Desk']],
    ['Transaction terms', ['Asset: Penthouse deposit', 'Amount: $482,000', 'Deadline: May 4, 2026']],
    ['Milestone schedule', ['Inspection approved', 'Title verified', 'Closing documents signed']],
    ['Funding method', ['Wallet balance available', 'Bank transfer simulated', 'Smart contract optional']],
    ['Review packet', ['Parties verified', 'Terms locked', 'Invitations ready']],
  ]
  const [heading, rows] = content[step]
  return (
    <div className="wizard-content">
      <p>{heading}</p>
      <div className="form-grid">
        {rows.map((row) => (
          <label key={row}>
            {row.split(':')[0]}
            <input defaultValue={row.split(':')[1]?.trim() || row} />
          </label>
        ))}
      </div>
    </div>
  )
}

function TransactionPage() {
  const { transactions } = useData()
  const { id } = useParams()
  const transaction = transactions.find((item) => item.id === id) || transactions[0]

  return (
    <div>
      <PageTitle eyebrow={transaction.shortId} title={transaction.title} text={`${transaction.buyer} and ${transaction.seller}`} />
      <AppBanner
        image={bannerImages.secureDeal || bannerImages.hero}
        title="Everyone can see the same live status"
        text="The transaction page keeps deposits, evidence, milestones, deadlines, and release actions in one place."
        alt="People shaking hands over signed paperwork"
      />
      <div className="transaction-grid">
        <section className="card transaction-summary">
          <div className="summary-top">
            <AvatarPair left={transaction.buyer} right={transaction.seller} />
            <StatusBadge status={transaction.status} />
          </div>
          <strong className="big-money">{formatCurrency(transaction.amount, transaction.currency === 'USDC' ? 'USD' : transaction.currency)}</strong>
          <div className="progress-track large">
            <span style={{ width: `${transaction.progress}%` }} />
          </div>
          <p>{transaction.progress}% of deal lifecycle complete. Deadline: {transaction.deadline}.</p>
          <div className="transaction-actions">
            <Button>APPROVE NEXT STEP</Button>
            <Button variant="ghost">OPEN DISPUTE</Button>
          </div>
        </section>
        <section className="card">
          <h3>Live Timeline</h3>
          {['Escrow created', 'Buyer funded wallet', 'Seller uploaded evidence', 'Inspection pending', 'Release queued'].map((item, index) => (
            <div className="timeline-item" key={item}>
              <span>{index + 1}</span>
              <div>
                <strong>{item}</strong>
                <p>{index + 1}h ago</p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}

function WalletPage() {
  const { wallet } = useData()
  return (
    <div>
      <PageTitle eyebrow="WALLET" title="Balance & History" text="Track available, locked, and recently released escrow funds." />
      <AppBanner
        image={bannerImages.payment}
        title="Know which money is free and which money is protected"
        text="Available funds can be used now. Locked funds are safely reserved for active escrow agreements."
        alt="A card payment moment at a desk"
      />
      <div className="stat-grid">
        <StatCard icon={Wallet} label="Available" value={formatCurrency(wallet.available)} delta="+4.2%" tone="up" />
        <StatCard icon={LockKeyhole} label="Locked" value={formatCurrency(wallet.locked)} delta="+9.6%" tone="up" />
        <StatCard icon={Banknote} label="Released 30d" value="$184K" delta="+18%" tone="up" />
        <StatCard icon={Gauge} label="Average Fee" value="1.9%" delta="-0.4%" tone="down" />
      </div>
      <section className="card chart-card tall">
        <div className="card-heading">
          <h3>30-Day Wallet History</h3>
          <Wallet size={20} />
        </div>
        <ResponsiveContainer width="100%" height={330}>
          <RechartsLineChart data={wallet.history}>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="day" stroke="#555" />
            <YAxis stroke="#555" />
            <Tooltip contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)' }} />
            <Line dataKey="available" stroke="#10B981" strokeWidth={2} dot={false} />
            <Line dataKey="locked" stroke="#CC0000" strokeWidth={2} dot={false} />
          </RechartsLineChart>
        </ResponsiveContainer>
      </section>
      <section className="card wallet-history">
        <h3>Recent Ledger</h3>
        {['Released to Northline Studio', 'Locked for Penthouse Deposit', 'Fee collected', 'Incoming buyer deposit'].map((item, index) => (
          <div className="ledger-row" key={item}>
            <span>{item}</span>
            <strong>{index % 2 ? '-$24,000' : '+$12,400'}</strong>
          </div>
        ))}
      </section>
    </div>
  )
}

function DisputesPage() {
  const { disputes } = useData()
  return (
    <div>
      <PageTitle eyebrow="DISPUTES" title="Resolution Desk" text="Track case state, evidence windows, and arbitrator next actions." />
      <AppBanner
        image={bannerImages.project}
        title="Disputes are easier when the facts are organized"
        text="Every case shows the owner, next step, deadline, and supporting evidence so users know what to do next."
        alt="Planning cards arranged for a project review"
      />
      <div className="dispute-grid">
        {disputes.map((dispute) => (
          <article className="card dispute-card" key={dispute.caseId}>
            <div>
              <span className="mono">{dispute.caseId}</span>
              <StatusBadge status={dispute.status} />
            </div>
            <h3>{dispute.transaction}</h3>
            <p>{dispute.nextStep}</p>
            <div className="case-meta">
              <span>{dispute.amount}</span>
              <span>{dispute.owner}</span>
              <span>{dispute.severity}</span>
            </div>
            <Button variant="ghost">OPEN CASE</Button>
          </article>
        ))}
      </div>
    </div>
  )
}

function AdminPage() {
  const { currentUser, switchRole } = useAuth()
  const { transactions, disputes } = useData()
  const statusData = Object.entries(
    transactions.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1
      return acc
    }, {}),
  ).map(([name, value]) => ({ name, value }))

  if (currentUser.role !== 'admin') {
    return (
      <div>
        <PageTitle eyebrow="ADMIN" title="Role-Gated Panel" text="Switch into the seeded admin persona to view platform analytics." />
        <AppBanner
          image={bannerImages.team}
          title="Admin tools are available in the demo role switcher"
          text="Switch to Sam Rivera to review platform activity, volume, risk, and smart contract counts."
          alt="A team collaborating in a bright office"
        />
        <section className="card access-card">
          <ShieldCheck size={42} />
          <h2>Admin access required</h2>
          <p>The route is protected by the mock auth context. No backend auth is involved.</p>
          <Button onClick={() => switchRole('admin')}>ASSUME ADMIN ROLE</Button>
        </section>
      </div>
    )
  }

  return (
    <div>
      <PageTitle eyebrow="ADMIN" title="Platform Intelligence" text="Mock analytics for volume, risk, disputes, and contract activity." />
      <AppBanner
        image={bannerImages.team}
        title="A friendlier view of platform health"
        text="High-level metrics and charts show what is active, what needs review, and where risk is changing."
        alt="A team collaborating in a bright office"
      />
      <div className="stat-grid">
        <StatCard icon={Activity} label="Platform Volume" value="$3.9M" delta="+24%" tone="up" />
        <StatCard icon={Users} label="Active Parties" value="1,248" delta="+6%" tone="up" />
        <StatCard icon={Gavel} label="Open Disputes" value={String(disputes.length)} delta="-2" tone="down" />
        <StatCard icon={Code2} label="Contracts" value="4" delta="+1h" tone="up" />
      </div>
      <div className="admin-grid">
        <section className="card chart-card">
          <h3>Transaction Status</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={statusData} dataKey="value" innerRadius={58} outerRadius={92} paddingAngle={4}>
                {statusData.map((entry, index) => (
                  <Cell key={entry.name} fill={['#CC0000', '#D4A843', '#10B981', '#F59E0B', '#555'][index % 5]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)' }} />
            </PieChart>
          </ResponsiveContainer>
        </section>
        <section className="card chart-card">
          <h3>Monthly Settlement Volume</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={walletHistory.slice(18)}>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="day" stroke="#555" />
              <YAxis stroke="#555" />
              <Tooltip contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)' }} />
              <Bar dataKey="locked" fill="#CC0000" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>
      </div>
    </div>
  )
}

function Footer() {
  const groups = [
    ['Product', ['Dashboard', 'Wallet', 'Smart Contracts', 'Disputes']],
    ['Company', ['About', 'Security', 'Careers', 'Press']],
    ['Legal', ['Privacy', 'Terms', 'Compliance', 'Licenses']],
    ['Connect', ['LinkedIn', 'X', 'Support', 'Status']],
  ]
  return (
    <footer className="footer">
      <Logo />
      <div className="footer-grid">
        {groups.map(([title, links]) => (
          <div key={title}>
            <h3>{title}</h3>
            {links.map((link) => (
              <a href="/" key={link}>
                {link}
              </a>
            ))}
          </div>
        ))}
      </div>
      <div className="footer-bottom">
        <span>© 2026 Escrowly UI Prototype</span>
        <span>SOC 2 Type II · Bank-Grade Security · Zero Backend</span>
      </div>
    </footer>
  )
}

const styles = `
:root {
  --bg-void: #F8FAFC;
  --bg-surface: #FFFFFF;
  --bg-elevated: #FFFFFF;
  --bg-overlay: #F1F5F9;
  --accent-red: #CC0000;
  --accent-red-hot: #FF1A1A;
  --accent-gold: #B7791F;
  --accent-emerald: #10B981;
  --accent-amber: #F59E0B;
  --text-primary: #111827;
  --text-secondary: #5B6472;
  --text-muted: #8A94A6;
  --border-subtle: rgba(17,24,39,0.1);
  --border-glow: rgba(204,0,0,0.22);
  --glass-bg: rgba(255,255,255,0.72);
  --glass-border: rgba(17,24,39,0.12);
  --font-display: 'Bebas Neue', sans-serif;
  --font-body: 'DM Sans', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --elevation-1: 0 1px 3px rgba(15,23,42,0.08), 0 1px 2px rgba(15,23,42,0.06);
  --elevation-2: 0 8px 24px rgba(15,23,42,0.08), 0 2px 8px rgba(15,23,42,0.05);
  --elevation-3: 0 18px 48px rgba(15,23,42,0.14), 0 8px 18px rgba(15,23,42,0.08);
  color-scheme: light;
  background: var(--bg-void);
}

* {
  box-sizing: border-box;
}

html {
  background: var(--bg-void);
  scroll-behavior: smooth;
}

body {
  margin: 0;
  min-width: 320px;
  background: var(--bg-void);
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.55;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}

button,
input,
select,
textarea {
  font: inherit;
}

button {
  cursor: pointer;
}

a {
  color: inherit;
  text-decoration: none;
}

p {
  color: var(--text-secondary);
  margin: 0;
}

h1,
h2,
h3 {
  margin: 0;
  color: var(--text-primary);
  font-weight: 400;
}

h1,
h2,
.logo-word,
.btn,
.nav-links a,
.eyebrow {
  font-family: var(--font-display);
  letter-spacing: 0.12em;
}

h1 {
  font-size: clamp(4.4rem, 10vw, 6rem);
  line-height: 0.9;
}

h2 {
  font-size: clamp(2.4rem, 6vw, 4.2rem);
  line-height: 0.95;
}

h3 {
  font-size: 1.05rem;
  font-weight: 600;
  font-family: var(--font-body);
}

#smooth-wrapper,
#smooth-content,
.page-transition {
  min-height: 100vh;
  background: var(--bg-void);
}

.public-main {
  overflow: hidden;
}

.public-main.compact {
  min-height: 72vh;
  display: grid;
  place-items: center;
  padding-top: 96px;
}

.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  min-height: 74px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 24px;
  padding: 0 36px;
  background: rgba(10,10,10,0.95);
  border-bottom: 1px solid var(--border-subtle);
  backdrop-filter: blur(20px);
}

.logo {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  width: fit-content;
}

.logo-mark {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  background: var(--accent-red);
  color: #fff;
  font-family: var(--font-display);
  font-size: 24px;
  letter-spacing: 0.04em;
  box-shadow: 0 0 28px rgba(204,0,0,0.25);
}

.logo-word {
  font-size: 1.35rem;
  color: #fff;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 34px;
}

.nav-links a,
.mobile-overlay nav a {
  color: var(--text-secondary);
  font-size: 0.92rem;
  transition: color 0.3s ease;
}

.nav-links a:hover,
.nav-links a.active,
.mobile-overlay nav a:hover,
.mobile-overlay nav a.active {
  color: #fff;
}

.nav-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
}

.btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  min-height: 42px;
  padding: 10px 24px;
  border: 1px solid transparent;
  border-radius: 4px;
  background: var(--accent-red);
  color: #fff;
  font-size: 0.94rem;
  letter-spacing: 0.1em;
  overflow: hidden;
  transition: background 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.btn::after,
.icon-button::after,
.chip::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(255,255,255,0.28) 0%, transparent 55%);
  transform: scale(0);
  opacity: 0;
  pointer-events: none;
}

.btn:active::after,
.icon-button:active::after,
.chip:active::after {
  animation: ripple 0.45s ease-out;
}

@keyframes ripple {
  0% { transform: scale(0); opacity: 0.55; }
  100% { transform: scale(2.8); opacity: 0; }
}

.btn:hover {
  background: var(--accent-red-hot);
  box-shadow: 0 0 24px rgba(204,0,0,0.4);
}

.btn-ghost {
  background: rgba(255,255,255,0.02);
  border-color: var(--glass-border);
  color: #fff;
}

.btn-ghost:hover {
  background: rgba(255,255,255,0.07);
  border-color: rgba(255,255,255,0.18);
  box-shadow: none;
}

.launch-btn {
  border-radius: 2px;
  min-height: 40px;
}

.icon-button {
  position: relative;
  display: inline-grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border: 1px solid var(--glass-border);
  border-radius: 4px;
  background: var(--glass-bg);
  color: #fff;
  overflow: hidden;
}

.mobile-menu-button {
  display: none;
}

.mobile-overlay {
  position: fixed;
  inset: 0;
  z-index: 150;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
  background: rgba(10,10,10,0.98);
  backdrop-filter: blur(20px);
}

.mobile-overlay nav {
  display: grid;
  gap: 28px;
  text-align: center;
}

.mobile-overlay nav a {
  font-size: 2rem;
}

.overlay-close {
  position: absolute;
  top: 24px;
  right: 24px;
}

.hero-section {
  position: relative;
  min-height: calc(100vh - 74px);
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 460px);
  align-items: center;
  gap: 48px;
  padding: 120px clamp(24px, 6vw, 88px) 72px;
  overflow: hidden;
  background:
    linear-gradient(115deg, rgba(204,0,0,0.1), transparent 34%),
    radial-gradient(circle at 82% 60%, rgba(204,0,0,0.18), transparent 28%),
    var(--bg-void);
}

.noise-layer {
  position: absolute;
  inset: 0;
  opacity: 0.09;
  background-image:
    linear-gradient(115deg, transparent, rgba(255,255,255,0.06), transparent),
    repeating-linear-gradient(45deg, rgba(255,255,255,0.08) 0 1px, transparent 1px 7px);
  mix-blend-mode: overlay;
  pointer-events: none;
}

.dot-grid {
  position: absolute;
  inset: 0;
  opacity: 0.28;
  background-image: radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px);
  background-size: 26px 26px;
  animation: dotPulse 4s ease-in-out infinite;
  pointer-events: none;
}

@keyframes dotPulse {
  0%, 100% { opacity: 0.18; }
  50% { opacity: 0.34; }
}

.hero-blob {
  position: absolute;
  width: 320px;
  height: 320px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(204,0,0,0.42), transparent 68%);
  filter: blur(18px);
  opacity: 0.56;
}

.blob-one {
  left: -110px;
  top: 18%;
}

.blob-two {
  right: 12%;
  bottom: -110px;
  background: radial-gradient(circle, rgba(212,168,67,0.24), transparent 66%);
}

.hero-copy,
.subpage-hero,
.contract-hero {
  position: relative;
  z-index: 2;
}

.eyebrow {
  color: var(--accent-red-hot);
  font-size: 0.9rem;
  margin-bottom: 16px;
}

.hero-subtext {
  max-width: 720px;
  margin-top: 22px;
  font-size: 1.14rem;
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 32px;
  flex-wrap: wrap;
}

.hero-actions.centered {
  justify-content: center;
}

.hero-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 26px;
  margin-top: 38px;
  color: var(--text-secondary);
}

.hero-stats strong {
  color: var(--accent-gold);
  font-family: var(--font-mono);
  display: block;
}

.hero-float-card {
  position: relative;
  z-index: 2;
  min-height: 340px;
  padding: 28px;
  border: 1px solid rgba(204,0,0,0.24);
  border-radius: 8px;
  background: linear-gradient(145deg, rgba(26,26,26,0.96), rgba(12,12,12,0.88));
  box-shadow: 0 34px 80px rgba(0,0,0,0.65), 0 0 48px rgba(204,0,0,0.16);
  transform: perspective(1000px) rotateY(-9deg) rotateX(5deg);
}

.mini-card-top,
.mini-row,
.summary-top,
.card-heading,
.list-heading,
.table-tools {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
}

.mini-card-top span,
.muted {
  color: var(--text-muted);
}

.mini-amount {
  margin-top: 34px;
  font-family: var(--font-mono);
  font-size: 3.1rem;
  color: var(--accent-gold);
}

.mini-progress,
.progress-track {
  width: 100%;
  height: 8px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(255,255,255,0.08);
}

.mini-progress span,
.progress-track span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--accent-red), var(--accent-emerald));
}

.mini-row {
  margin-top: 18px;
}

.mini-timeline {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-top: 38px;
}

.mini-timeline span {
  height: 52px;
  border-radius: 6px;
  background: rgba(255,255,255,0.06);
}

.mini-timeline .active {
  background: rgba(204,0,0,0.4);
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.12);
}

.trust-strip {
  border-top: 1px solid var(--border-subtle);
  border-bottom: 1px solid var(--border-subtle);
  overflow: hidden;
  background: #090909;
}

.marquee {
  display: flex;
  width: max-content;
  animation: marquee 28s linear infinite;
}

.marquee span {
  display: inline-flex;
  align-items: center;
  gap: 22px;
  padding: 18px 18px;
  color: var(--text-secondary);
  white-space: nowrap;
  font-family: var(--font-mono);
  font-size: 0.86rem;
}

.marquee i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent-red);
}

@keyframes marquee {
  to { transform: translateX(-50%); }
}

.section {
  position: relative;
  padding: 108px clamp(22px, 6vw, 88px);
  background: var(--bg-void);
}

.section-alt {
  background: #0d0d0d;
}

.section-header {
  max-width: 760px;
  margin-bottom: 44px;
}

.section-header p:last-child {
  margin-top: 14px;
  font-size: 1.04rem;
}

.landing-steps,
.feature-grid,
.industry-grid,
.pricing-grid,
.audit-grid,
.stat-grid,
.dispute-grid {
  display: grid;
  gap: 20px;
}

.landing-steps {
  grid-template-columns: repeat(3, 1fr);
}

.feature-grid,
.industry-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.card {
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  padding: 24px;
  box-shadow: var(--elevation-2);
  transition: box-shadow 0.25s, border-color 0.25s, transform 0.25s;
}

.card:hover {
  box-shadow: var(--elevation-3);
  border-color: rgba(204,0,0,0.2);
}

.step-number {
  display: block;
  color: var(--accent-red);
  font-family: var(--font-display);
  font-size: 3rem;
  letter-spacing: 0.08em;
  margin-bottom: 20px;
}

.step-card p,
.feature-card p,
.industry-card p,
.pricing-card p,
.dispute-card p {
  margin-top: 10px;
}

.dash-connector {
  width: min(100%, 900px);
  margin-top: -10px;
}

.dash-connector path,
.flow-path path,
.release-illustration path {
  fill: none;
  stroke: rgba(204,0,0,0.58);
  stroke-width: 2;
  stroke-dasharray: 10 12;
}

.icon-orb {
  display: inline-grid;
  place-items: center;
  width: 48px;
  height: 48px;
  margin-bottom: 18px;
  border: 1px solid rgba(204,0,0,0.26);
  border-radius: 50%;
  background: rgba(204,0,0,0.1);
  color: var(--accent-red-hot);
}

.icon-orb.large {
  width: 72px;
  height: 72px;
}

.smart-teaser {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(320px, 1fr);
  gap: 36px;
  align-items: center;
  padding: 100px clamp(22px, 6vw, 88px);
  background:
    linear-gradient(110deg, rgba(204,0,0,0.22), transparent 42%),
    radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px),
    #090909;
  background-size: auto, 28px 28px, auto;
}

.smart-teaser p:not(.eyebrow) {
  margin: 18px 0 28px;
}

.code-block {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 8px;
  background: #080808;
  box-shadow: var(--elevation-3);
}

.code-block.compact {
  min-height: 260px;
}

.code-block pre {
  margin: 0;
  padding: 54px 20px 24px;
  overflow-x: auto;
}

.code-line {
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr);
  gap: 14px;
  min-height: 24px;
  font-family: var(--font-mono);
  font-size: 0.9rem;
  white-space: pre;
}

.code-line i {
  color: var(--text-muted);
  font-style: normal;
  text-align: right;
  user-select: none;
}

.code-line code {
  color: #d6d6d6;
  font-family: inherit;
}

.copy-button {
  position: absolute;
  top: 12px;
  right: 12px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 4px;
  background: rgba(255,255,255,0.05);
  color: var(--text-secondary);
  padding: 7px 10px;
  font-size: 0.82rem;
}

.testimonial-shell {
  position: relative;
  min-height: 250px;
}

.testimonial {
  position: absolute;
  inset: 0;
  display: grid;
  align-content: center;
  gap: 18px;
  max-width: 760px;
  padding: 30px;
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  background: var(--bg-elevated);
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.45s ease, transform 0.45s ease;
}

.testimonial.active {
  opacity: 1;
  transform: translateY(0);
}

.testimonial strong {
  color: var(--accent-gold);
}

.avatar-placeholder {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(204,0,0,0.25);
  color: #fff;
  font-family: var(--font-display);
  font-size: 1.5rem;
}

.stats-banner {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  padding: 0 clamp(22px, 6vw, 88px);
  background: linear-gradient(90deg, rgba(204,0,0,0.46), transparent);
  border-left: 6px solid var(--accent-red);
}

.stats-banner div {
  padding: 44px 28px;
  background: rgba(10,10,10,0.78);
}

.counter-value {
  display: block;
  color: #fff;
  font-family: var(--font-display);
  font-size: 3.6rem;
  line-height: 1;
  letter-spacing: 0.06em;
}

.stats-banner span:last-child {
  color: var(--text-secondary);
}

.use-preview-row {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 12px;
}

.use-mini {
  min-width: 190px;
  display: grid;
  gap: 12px;
  color: #fff;
}

.use-mini svg {
  color: var(--accent-red-hot);
}

.faq-list {
  max-width: 920px;
  display: grid;
  gap: 10px;
}

.faq-item {
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  background: var(--bg-elevated);
  overflow: hidden;
}

.faq-item button {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 20px 22px;
  border: 0;
  background: transparent;
  color: #fff;
  text-align: left;
}

.faq-item svg {
  transition: transform 0.25s ease;
}

.faq-item.open svg {
  transform: rotate(180deg);
}

.faq-answer {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.25s ease;
}

.faq-answer p {
  overflow: hidden;
  padding: 0 22px;
}

.faq-item.open .faq-answer {
  grid-template-rows: 1fr;
}

.faq-item.open .faq-answer p {
  padding-bottom: 22px;
}

.final-cta {
  text-align: center;
  padding: 96px 22px;
  background: linear-gradient(135deg, rgba(204,0,0,0.38), rgba(212,168,67,0.18), #0A0A0A);
}

.final-cta .btn {
  margin-top: 24px;
}

.footer {
  padding: 54px clamp(22px, 6vw, 88px) 28px;
  border-top: 1px solid var(--border-subtle);
  background: #0A0A0A;
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 28px;
  margin-top: 40px;
}

.footer-grid div {
  display: grid;
  gap: 10px;
}

.footer-grid h3 {
  color: #fff;
}

.footer-grid a,
.footer-bottom {
  color: var(--text-secondary);
  font-size: 0.92rem;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  margin-top: 42px;
  padding-top: 24px;
  border-top: 1px solid var(--border-subtle);
}

.subpage-hero,
.contract-hero {
  position: relative;
  display: grid;
  place-items: center;
  min-height: 66vh;
  padding: 130px 22px 80px;
  text-align: center;
  overflow: hidden;
  background:
    radial-gradient(circle at 50% 18%, rgba(204,0,0,0.18), transparent 36%),
    var(--bg-void);
}

.subpage-hero p:not(.eyebrow),
.contract-hero p:not(.eyebrow) {
  max-width: 670px;
  margin-top: 18px;
  font-size: 1.1rem;
}

.contract-hero h1 {
  font-size: clamp(4rem, 9vw, 5.8rem);
}

.contract-builder {
  display: grid;
  grid-template-columns: minmax(320px, 0.92fr) minmax(340px, 1.08fr);
  gap: 24px;
  align-items: start;
}

.builder-panel,
.builder-preview {
  display: grid;
  gap: 18px;
}

.builder-step {
  display: grid;
  gap: 16px;
  padding-bottom: 22px;
  border-bottom: 1px solid var(--border-subtle);
}

.builder-step:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}

.builder-step > span {
  color: var(--accent-red-hot);
  font-family: var(--font-mono);
  font-size: 0.78rem;
}

.chip-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  position: relative;
  overflow: hidden;
  min-height: 34px;
  padding: 7px 13px;
  border: 1px solid var(--glass-border);
  border-radius: 999px;
  background: rgba(255,255,255,0.035);
  color: var(--text-secondary);
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}

.chip.active,
.chip:hover {
  border-color: rgba(204,0,0,0.42);
  background: rgba(204,0,0,0.12);
  color: #fff;
}

label {
  display: grid;
  gap: 8px;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

input,
select {
  width: 100%;
  min-height: 43px;
  border: 1px solid var(--glass-border);
  border-radius: 4px;
  background: #0d0d0d;
  color: #fff;
  padding: 10px 12px;
  outline: none;
}

input:focus,
select:focus {
  border-color: var(--border-glow);
  box-shadow: 0 0 0 3px rgba(204,0,0,0.14);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.check-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.check-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid var(--glass-border);
  border-radius: 999px;
  background: rgba(255,255,255,0.03);
}

.check-chip input {
  width: auto;
  min-height: auto;
  accent-color: var(--accent-red);
}

.gas-card {
  display: grid;
  gap: 3px;
  padding: 16px;
  border: 1px solid rgba(212,168,67,0.25);
  border-radius: 8px;
  background: rgba(212,168,67,0.06);
}

.gas-card strong {
  color: var(--accent-gold);
  font-family: var(--font-mono);
  font-size: 1.4rem;
}

.terminal {
  min-height: 230px;
  background: #070707;
}

.terminal-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--accent-emerald);
  margin-bottom: 16px;
  font-family: var(--font-mono);
  font-size: 0.86rem;
}

.terminal p {
  font-family: var(--font-mono);
  font-size: 0.84rem;
  margin: 8px 0;
}

.terminal-line {
  opacity: 0;
  transform: translateY(6px);
  animation: terminalLine 0.28s ease-out forwards;
}

@keyframes terminalLine {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.terminal p span,
.terminal-success {
  color: var(--accent-emerald);
}

.success-box {
  display: flex;
  gap: 14px;
  align-items: center;
  border-color: rgba(16,185,129,0.28);
}

.success-box svg,
.success-box strong {
  color: var(--accent-emerald);
}

.success-box span {
  display: block;
  color: var(--text-secondary);
}

.contract-flow {
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}

.flow-card {
  position: relative;
  z-index: 2;
}

.flow-card span {
  display: block;
  color: var(--accent-red);
  font-family: var(--font-display);
  font-size: 2.4rem;
}

.flow-path {
  position: absolute;
  left: 0;
  right: 0;
  top: 48px;
  width: 100%;
  z-index: 1;
  opacity: 0.8;
}

.table-tools {
  margin-bottom: 16px;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
  min-width: min(100%, 360px);
}

.search-box svg {
  position: absolute;
  left: 12px;
  color: var(--text-muted);
}

.search-box input {
  padding-left: 40px;
}

.data-table {
  overflow-x: auto;
  padding: 0;
}

.table-row {
  display: grid;
  grid-template-columns: 1.1fr 0.8fr 0.9fr 0.8fr 0.8fr 0.8fr;
  width: 100%;
  gap: 16px;
  align-items: center;
  padding: 17px 20px;
  border: 0;
  border-bottom: 1px solid var(--border-subtle);
  background: transparent;
  color: #fff;
  text-align: left;
}

.table-row:nth-child(odd):not(.table-head) {
  background: rgba(255,255,255,0.015);
}

.table-head {
  color: var(--text-muted);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.contract-drawer {
  display: grid;
  gap: 12px;
  padding: 18px 20px;
  background: rgba(204,0,0,0.06);
  border-bottom: 1px solid var(--border-subtle);
}

.contract-drawer code {
  display: block;
  margin-top: 5px;
  color: var(--text-secondary);
  font-family: var(--font-mono);
}

.mono {
  font-family: var(--font-mono);
}

.audit-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.audit-badge {
  text-align: center;
}

.audit-badge svg {
  color: var(--accent-emerald);
}

.audit-badge span {
  display: block;
  color: var(--text-secondary);
  margin: 8px 0 12px;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  min-height: 28px;
  padding: 5px 10px;
  border: 1px solid currentColor;
  border-radius: 999px;
  color: var(--text-secondary);
  font-size: 0.76rem;
  font-weight: 700;
  background: rgba(255,255,255,0.03);
}

.status-badge.red { color: var(--accent-red-hot); background: rgba(204,0,0,0.1); }
.status-badge.gold { color: var(--accent-gold); background: rgba(212,168,67,0.1); }
.status-badge.emerald { color: var(--accent-emerald); background: rgba(16,185,129,0.1); }
.status-badge.amber { color: var(--accent-amber); background: rgba(245,158,11,0.1); }
.status-badge.blue { color: #60A5FA; background: rgba(96,165,250,0.1); }
.status-badge.muted { color: var(--text-muted); }

.floating-icons .industry-icons {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.industry-icons span {
  position: absolute;
  display: grid;
  place-items: center;
  width: 62px;
  height: 62px;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 50%;
  background: rgba(255,255,255,0.04);
  color: var(--accent-red-hot);
  animation: floatIcon 6s ease-in-out infinite;
}

.industry-icons span:nth-child(1) { left: 12%; top: 26%; }
.industry-icons span:nth-child(2) { right: 18%; top: 22%; animation-delay: -1s; }
.industry-icons span:nth-child(3) { left: 21%; bottom: 20%; animation-delay: -2s; }
.industry-icons span:nth-child(4) { right: 28%; bottom: 18%; animation-delay: -3s; }
.industry-icons span:nth-child(5) { left: 50%; top: 18%; animation-delay: -4s; }
.industry-icons span:nth-child(6) { right: 8%; bottom: 38%; animation-delay: -5s; }

@keyframes floatIcon {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-14px) rotate(4deg); }
}

.industry-card {
  position: relative;
  border-left: 3px solid transparent;
}

.industry-card:hover {
  transform: translateY(-8px);
  border-left-color: var(--accent-red);
}

.industry-card:hover .icon-orb {
  transform: rotate(-8deg) scale(1.07);
}

.industry-card a {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-top: 20px;
  color: #fff;
}

.case-study {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 44px;
  align-items: center;
  padding: 96px clamp(22px, 6vw, 88px);
  background: #0c0c0c;
}

.case-study.flipped .case-visual {
  order: 2;
}

.case-visual {
  min-height: 360px;
  display: grid;
  place-items: center;
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgba(204,0,0,0.14), transparent),
    var(--bg-elevated);
}

.deal-diagram {
  position: relative;
  width: 76%;
  height: 230px;
}

.deal-diagram span {
  position: absolute;
  display: block;
  width: 120px;
  height: 74px;
  border-radius: 8px;
  background: rgba(255,255,255,0.08);
  border: 1px solid var(--glass-border);
}

.deal-diagram span:nth-child(1) { left: 0; top: 0; }
.deal-diagram span:nth-child(2) { right: 0; top: 72px; }
.deal-diagram span:nth-child(3) { left: 22%; bottom: 0; background: rgba(204,0,0,0.18); }
.deal-diagram i {
  position: absolute;
  inset: 42px 70px;
  border: 1px dashed rgba(204,0,0,0.6);
  border-radius: 50%;
}

.case-copy dl {
  display: grid;
  gap: 8px;
  margin: 24px 0;
}

.case-copy dt {
  color: #fff;
  font-weight: 700;
}

.case-copy dd {
  margin: 0 0 12px;
  color: var(--text-secondary);
}

.case-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.case-stats div {
  padding: 16px;
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  background: rgba(255,255,255,0.03);
}

.case-stats strong {
  display: block;
  color: var(--accent-gold);
  font-family: var(--font-display);
  font-size: 2rem;
}

.case-stats span {
  color: var(--text-secondary);
}

.industry-stats {
  display: flex;
  justify-content: center;
  gap: 1px;
  background: var(--accent-red);
}

.industry-stats span {
  flex: 1;
  padding: 22px;
  background: #0c0c0c;
  color: #fff;
  text-align: center;
  font-family: var(--font-mono);
}

.angled-hero {
  background:
    linear-gradient(155deg, rgba(204,0,0,0.28) 0 42%, transparent 42%),
    radial-gradient(circle at 70% 20%, rgba(212,168,67,0.14), transparent 36%),
    var(--bg-void);
}

.feature-deep {
  display: grid;
  grid-template-columns: minmax(0, 0.92fr) minmax(320px, 1.08fr);
  align-items: center;
  gap: 44px;
  padding: 104px clamp(22px, 6vw, 88px);
  border-top: 1px solid var(--border-subtle);
}

.feature-deep.flipped .feature-copy {
  order: 2;
}

.feature-copy p {
  margin: 18px 0 22px;
  max-width: 620px;
}

.check-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.check-list.vertical {
  display: grid;
}

.check-list span {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 10px;
  border: 1px solid rgba(204,0,0,0.24);
  border-radius: 999px;
  background: rgba(204,0,0,0.08);
  color: #fff;
  font-size: 0.9rem;
}

.check-list svg {
  color: var(--accent-red-hot);
}

.mock-ui-shot {
  min-height: 360px;
  display: grid;
  gap: 22px;
  align-content: center;
  overflow: hidden;
}

.shot-top {
  display: flex;
  gap: 8px;
}

.shot-top span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--accent-red);
}

.shot-bars {
  display: grid;
  gap: 14px;
}

.shot-bars i {
  display: block;
  height: 18px;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(255,255,255,0.18), rgba(255,255,255,0.04));
  animation: shimmer 2.1s linear infinite;
}

.shot-bars i:nth-child(2) { width: 72%; }
.shot-bars i:nth-child(3) { width: 54%; }

.shot-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.shot-grid span {
  min-height: 86px;
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  background: rgba(255,255,255,0.04);
}

@keyframes shimmer {
  0% { transform: translateX(-20px); opacity: 0.45; }
  50% { opacity: 1; }
  100% { transform: translateX(20px); opacity: 0.45; }
}

.comparison-table {
  padding: 0;
  overflow-x: auto;
}

.comparison-row {
  display: grid;
  grid-template-columns: 1.2fr repeat(4, minmax(130px, 1fr));
  min-width: 760px;
}

.comparison-row span {
  padding: 18px;
  border-bottom: 1px solid var(--border-subtle);
  color: var(--text-secondary);
}

.comparison-row:nth-child(even) span {
  background: rgba(255,255,255,0.018);
}

.comparison-row.head span {
  color: #fff;
  font-weight: 700;
}

.comparison-row .highlight {
  border-left: 3px solid var(--accent-red);
  background: rgba(204,0,0,0.08);
  color: #fff;
}

.comparison-row svg {
  color: var(--accent-emerald);
}

.comparison-row svg.lucide-circle-x {
  color: var(--accent-red-hot);
}

.pricing-grid {
  grid-template-columns: repeat(3, 1fr);
}

.pricing-card {
  position: relative;
  display: grid;
  gap: 16px;
}

.pricing-card.popular {
  border-color: rgba(212,168,67,0.55);
  box-shadow: 0 0 34px rgba(212,168,67,0.14);
}

.pricing-card > strong {
  color: #fff;
  font-family: var(--font-display);
  font-size: 3rem;
  letter-spacing: 0.08em;
}

.popular-badge {
  position: absolute;
  top: 14px;
  right: 14px;
  color: var(--accent-gold);
  font-size: 0.8rem;
}

.walkthrough {
  background: #0A0A0A;
}

.walk-step {
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(260px, 0.7fr) minmax(320px, 1fr);
  gap: 44px;
  align-items: center;
  padding: 84px clamp(22px, 6vw, 88px);
}

.walk-copy {
  position: sticky;
  top: 110px;
  align-self: start;
  padding-top: 44px;
}

.walk-copy span {
  color: var(--accent-red);
  font-family: var(--font-display);
  font-size: 4rem;
}

.walk-copy p {
  margin-top: 14px;
}

.walk-visual {
  min-height: 430px;
  display: grid;
  place-items: center;
}

.illustration {
  width: min(100%, 420px);
  min-height: 260px;
  display: grid;
  place-items: center;
  gap: 18px;
}

.form-illustration span {
  width: 86%;
  height: 42px;
  border-radius: 6px;
  border: 1px solid var(--glass-border);
  background: rgba(255,255,255,0.06);
  animation: slideField 2.4s ease-in-out infinite;
}

.form-illustration span:nth-child(2) { width: 74%; animation-delay: -0.3s; }
.form-illustration span:nth-child(3) { width: 62%; animation-delay: -0.6s; }

@keyframes slideField {
  0%, 100% { transform: translateX(0); opacity: 0.7; }
  50% { transform: translateX(12px); opacity: 1; }
}

.invite-illustration,
.complete-illustration {
  color: var(--accent-red-hot);
}

.invite-illustration span,
.complete-illustration p {
  color: #fff;
  font-family: var(--font-mono);
}

.fund-illustration div {
  width: 120px;
  height: 210px;
  display: flex;
  align-items: flex-end;
  padding: 8px;
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  background: rgba(255,255,255,0.04);
}

.fund-illustration div span {
  width: 100%;
  border-radius: 8px;
  background: linear-gradient(180deg, var(--accent-red), var(--accent-gold));
  animation: fillAmount 2.2s ease-in-out infinite;
}

@keyframes fillAmount {
  0%, 100% { height: 45%; }
  50% { height: 82%; }
}

.release-illustration {
  grid-template-columns: auto 1fr auto;
}

.release-illustration svg {
  width: 250px;
}

.release-illustration circle {
  fill: var(--accent-gold);
  animation: flyDot 2.4s ease-in-out infinite;
}

@keyframes flyDot {
  0%, 100% { transform: translateX(-190px); opacity: 0.2; }
  50% { transform: translateX(0); opacity: 1; }
}

.video-card {
  position: relative;
  min-height: 420px;
  display: grid;
  place-items: center;
  background:
    linear-gradient(135deg, rgba(204,0,0,0.18), transparent),
    radial-gradient(circle at center, rgba(255,255,255,0.05), transparent 36%),
    var(--bg-elevated);
}

.play-button {
  display: grid;
  place-items: center;
  width: 86px;
  height: 86px;
  border: 1px solid rgba(255,255,255,0.16);
  border-radius: 50%;
  background: var(--accent-red);
  color: #fff;
  box-shadow: 0 0 34px rgba(204,0,0,0.4);
}

.video-lines {
  position: absolute;
  bottom: 28px;
  left: 28px;
  right: 28px;
  display: grid;
  gap: 10px;
}

.video-lines span {
  height: 8px;
  border-radius: 999px;
  background: rgba(255,255,255,0.08);
}

.video-lines span:first-child {
  background: linear-gradient(90deg, var(--accent-red) 42%, rgba(255,255,255,0.08) 42%);
}

.chapters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
}

.chapters a {
  padding: 8px 12px;
  border: 1px solid var(--glass-border);
  border-radius: 999px;
  color: var(--text-secondary);
}

.tab-group {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 5px;
  margin-bottom: 22px;
  border: 1px solid var(--glass-border);
  border-radius: 999px;
  background: rgba(255,255,255,0.03);
}

.tab-group button {
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--text-secondary);
  padding: 9px 14px;
}

.tab-group button.active {
  background: var(--accent-red);
  color: #fff;
}

.auth-screen {
  width: 100%;
  min-height: 74vh;
  display: grid;
  place-items: center;
  padding: 40px 22px 90px;
  background:
    radial-gradient(circle at 45% 25%, rgba(204,0,0,0.18), transparent 32%),
    var(--bg-void);
}

.auth-card {
  width: min(100%, 480px);
}

.auth-card h1 {
  font-size: 3.8rem;
}

.auth-card form {
  display: grid;
  gap: 16px;
  margin-top: 26px;
}

.full-width {
  width: 100%;
}

.auth-switch {
  display: inline-block;
  margin-top: 20px;
  color: var(--accent-gold);
}

.app-shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  background: var(--bg-void);
}

.sidebar {
  position: sticky;
  top: 0;
  height: 100vh;
  width: 240px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-right: 1px solid var(--border-subtle);
  background: var(--bg-surface);
}

.side-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-height: 76px;
  padding: 18px;
  border-bottom: 1px solid var(--border-subtle);
}

.collapse-button {
  width: 34px;
  height: 34px;
}

.sidebar nav {
  display: grid;
  gap: 4px;
  padding: 14px 0;
}

.sidebar nav a {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 48px;
  padding: 0 18px;
  border-left: 3px solid transparent;
  color: var(--text-secondary);
  transition: background 0.2s, color 0.2s, border-color 0.2s;
  white-space: nowrap;
}

.sidebar nav a.active,
.sidebar nav a:hover {
  border-left-color: var(--accent-red);
  background: rgba(204,0,0,0.08);
  color: #fff;
}

.side-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: auto;
  padding: 18px;
  border-top: 1px solid var(--border-subtle);
}

.profile-avatar,
.avatar-pair span {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  flex: 0 0 auto;
  border-radius: 50%;
  background: var(--avatar-bg);
  color: #fff;
  font-weight: 800;
}

.profile-copy {
  min-width: 130px;
  display: grid;
}

.profile-copy strong {
  color: #fff;
}

.profile-copy span {
  color: var(--text-secondary);
  font-size: 0.82rem;
  text-transform: capitalize;
}

.app-content {
  min-width: 0;
}

.app-header {
  position: sticky;
  top: 0;
  z-index: 80;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  min-height: 76px;
  padding: 16px 24px;
  border-bottom: 1px solid var(--border-subtle);
  background: rgba(10,10,10,0.88);
  backdrop-filter: blur(16px);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-actions select {
  width: 112px;
}

.notification {
  position: relative;
}

.notification span {
  position: absolute;
  top: -6px;
  right: -6px;
  display: grid;
  place-items: center;
  width: 19px;
  height: 19px;
  border-radius: 50%;
  background: var(--accent-red);
  color: #fff;
  font-size: 0.68rem;
  font-weight: 800;
}

.profile-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 42px;
  border: 1px solid var(--glass-border);
  border-radius: 999px;
  background: rgba(255,255,255,0.04);
  color: #fff;
  padding: 0 12px;
}

.app-content main {
  padding: 28px;
}

.page-title {
  margin-bottom: 26px;
}

.page-title h1 {
  font-size: clamp(3rem, 6vw, 4.6rem);
}

.page-title p:last-child {
  max-width: 760px;
  margin-top: 8px;
}

.stat-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-bottom: 22px;
}

.stat-card {
  display: grid;
  gap: 18px;
}

.stat-card > div {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-card svg {
  color: var(--accent-red-hot);
}

.stat-card strong {
  font-family: var(--font-display);
  font-size: 2.5rem;
  letter-spacing: 0.08em;
  line-height: 1;
}

.delta {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--accent-emerald);
  font-size: 0.8rem;
}

.delta.down {
  color: var(--accent-amber);
}

.dashboard-grid,
.transaction-grid,
.admin-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(300px, 0.65fr);
  gap: 22px;
  margin-bottom: 22px;
}

.chart-card {
  min-height: 330px;
}

.chart-card.tall {
  min-height: 420px;
  margin-bottom: 22px;
}

.risk-card {
  display: grid;
  gap: 14px;
  align-content: start;
}

.queue-item,
.ledger-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 13px 0;
  border-bottom: 1px solid var(--border-subtle);
}

.queue-item strong,
.ledger-row strong {
  color: var(--accent-gold);
  font-family: var(--font-mono);
}

.escrow-list {
  overflow: hidden;
}

.list-heading {
  margin-bottom: 18px;
}

.list-heading h3 {
  font-size: 1.35rem;
}

.list-tools {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.list-tools select {
  width: 132px;
}

.escrow-card-list {
  display: grid;
  gap: 12px;
}

.escrow-card {
  display: grid;
  grid-template-columns: minmax(230px, 1.35fr) 150px 110px minmax(130px, 0.8fr) 132px auto;
  gap: 16px;
  align-items: center;
  padding: 16px;
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  background: rgba(255,255,255,0.025);
}

.escrow-main {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.escrow-main a {
  display: block;
  color: #fff;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.escrow-main span,
.amount-block span,
.progress-cell small,
.deadline,
.case-meta span {
  color: var(--text-secondary);
  font-size: 0.84rem;
}

.avatar-pair {
  display: flex;
  flex: 0 0 auto;
}

.avatar-pair span + span {
  margin-left: -10px;
  box-shadow: 0 0 0 3px var(--bg-elevated);
}

.amount-block {
  display: grid;
}

.amount-block strong,
.big-money {
  color: var(--accent-gold);
  font-family: var(--font-mono);
}

.deadline {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--accent-amber);
}

.wizard {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  gap: 24px;
}

.wizard-steps {
  display: grid;
  gap: 8px;
  align-content: start;
}

.wizard-steps button {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 48px;
  border: 1px solid var(--glass-border);
  border-radius: 6px;
  background: rgba(255,255,255,0.03);
  color: var(--text-secondary);
  padding: 0 12px;
  text-align: left;
}

.wizard-steps button.active {
  border-color: var(--border-glow);
  background: rgba(204,0,0,0.1);
  color: #fff;
}

.wizard-steps span {
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: rgba(204,0,0,0.22);
}

.wizard-body {
  display: grid;
  gap: 18px;
}

.wizard-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.transaction-summary {
  display: grid;
  gap: 22px;
}

.big-money {
  display: block;
  font-size: clamp(2.4rem, 5vw, 4rem);
}

.progress-track.large {
  height: 12px;
}

.transaction-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.timeline-item {
  display: flex;
  gap: 14px;
  padding: 16px 0;
  border-bottom: 1px solid var(--border-subtle);
}

.timeline-item > span {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(204,0,0,0.18);
  color: var(--accent-red-hot);
  font-family: var(--font-mono);
}

.wallet-history {
  display: grid;
  gap: 4px;
}

.dispute-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.dispute-card {
  display: grid;
  gap: 16px;
}

.dispute-card > div:first-child,
.case-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: space-between;
}

.access-card {
  max-width: 620px;
  display: grid;
  justify-items: start;
  gap: 16px;
}

.access-card svg {
  color: var(--accent-red-hot);
}

.bottom-tabs {
  display: none;
}

.loading-screen {
  min-height: 100vh;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 24px;
  background: var(--bg-void);
}

.loading-bar {
  width: 220px;
  height: 4px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(255,255,255,0.08);
}

.loading-bar span {
  display: block;
  width: 45%;
  height: 100%;
  background: var(--accent-red);
  animation: loadingSlide 1.2s ease-in-out infinite;
}

@keyframes loadingSlide {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(240%); }
}

/* Light, end-user-friendly theme overrides */
.navbar {
  background: rgba(255,255,255,0.94);
  box-shadow: 0 10px 30px rgba(15,23,42,0.06);
}

.logo-word,
.nav-links a:hover,
.nav-links a.active,
.mobile-overlay nav a:hover,
.mobile-overlay nav a.active {
  color: var(--text-primary);
}

.nav-links a,
.mobile-overlay nav a {
  color: #667085;
}

.logo-mark {
  border-radius: 8px;
}

.icon-button,
.profile-chip {
  background: #fff;
  color: var(--text-primary);
}

.hero-section {
  background:
    radial-gradient(circle at 82% 12%, rgba(204,0,0,0.1), transparent 28%),
    linear-gradient(135deg, #fff 0%, #fff7f7 52%, #f8fafc 100%);
}

.dot-grid {
  opacity: 0.18;
  background-image: radial-gradient(rgba(204,0,0,0.16) 1px, transparent 1px);
}

.hero-media-stack {
  position: relative;
  z-index: 2;
  min-height: 560px;
}

.hero-photo-main,
.hero-photo-small,
.picture-frame img,
.image-mosaic img,
.case-visual img,
.mock-ui-shot img,
.app-banner img,
.auth-visual img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.hero-photo-main {
  position: absolute;
  inset: 0 0 auto auto;
  height: 430px;
  border-radius: 24px;
  box-shadow: var(--elevation-3);
}

.hero-photo-small {
  position: absolute;
  left: -28px;
  bottom: 22px;
  width: 48%;
  height: 190px;
  border: 8px solid #fff;
  border-radius: 18px;
  box-shadow: var(--elevation-3);
}

.hero-float-card {
  position: absolute;
  right: -10px;
  bottom: 0;
  width: min(78%, 380px);
  min-height: auto;
  background: rgba(255,255,255,0.92);
  border-color: rgba(204,0,0,0.16);
  color: var(--text-primary);
  backdrop-filter: blur(16px);
  transform: none;
}

.mini-timeline span {
  background: #EEF2F7;
}

.trust-strip {
  background: #fff;
  border-color: var(--border-subtle);
}

.marquee span {
  color: #667085;
}

.section,
.subpage-hero,
.contract-hero,
.walkthrough,
.auth-screen {
  background: var(--bg-void);
}

.section-alt,
.case-study,
.smart-teaser,
.footer,
.final-cta {
  background: #FFFFFF;
}

.card,
.testimonial,
.faq-item,
.sidebar,
.app-header,
.bottom-tabs {
  background: rgba(255,255,255,0.94);
  color: var(--text-primary);
}

.card:hover {
  box-shadow: var(--elevation-3);
  border-color: rgba(204,0,0,0.18);
}

.picture-banner {
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) minmax(340px, 1.15fr);
  gap: 34px;
  align-items: center;
  padding: 86px clamp(22px, 6vw, 88px);
  background: #fff;
}

.picture-banner.reverse .picture-copy {
  order: 2;
}

.picture-copy p:not(.eyebrow) {
  margin-top: 16px;
  max-width: 620px;
}

.picture-frame {
  min-height: 380px;
  overflow: hidden;
  border-radius: 24px;
  box-shadow: var(--elevation-3);
}

.image-mosaic {
  display: grid;
  grid-template-columns: 1fr 1.15fr 1fr;
  gap: 18px;
  padding: 28px clamp(22px, 6vw, 88px) 86px;
  background: linear-gradient(180deg, #fff7f7, var(--bg-void));
}

.image-mosaic figure {
  position: relative;
  min-height: 260px;
  margin: 0;
  overflow: hidden;
  border-radius: 22px;
  box-shadow: var(--elevation-2);
}

.image-mosaic figure:nth-child(2) {
  min-height: 320px;
}

.image-mosaic figcaption {
  position: absolute;
  left: 14px;
  bottom: 14px;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(255,255,255,0.9);
  color: var(--text-primary);
  font-weight: 700;
  box-shadow: var(--elevation-1);
}

.subpage-hero,
.contract-hero {
  background:
    linear-gradient(135deg, rgba(255,255,255,0.92), rgba(255,247,247,0.9)),
    radial-gradient(circle at 50% 18%, rgba(204,0,0,0.12), transparent 36%);
}

.angled-hero {
  background:
    linear-gradient(155deg, rgba(204,0,0,0.12) 0 42%, transparent 42%),
    linear-gradient(135deg, #fff, #f8fafc);
}

.feature-card,
.industry-card,
.step-card,
.flow-card,
.pricing-card,
.stat-card,
.dispute-card,
.audit-badge {
  background: #fff;
}

.smart-teaser {
  background:
    linear-gradient(110deg, rgba(204,0,0,0.12), rgba(255,255,255,0.86) 44%),
    radial-gradient(rgba(204,0,0,0.12) 1px, transparent 1px),
    #fff;
  background-size: auto, 28px 28px, auto;
}

.testimonial strong,
.mini-amount,
.amount-block strong,
.big-money,
.queue-item strong,
.ledger-row strong,
.case-stats strong {
  color: var(--accent-gold);
}

.stats-banner {
  background: linear-gradient(90deg, rgba(204,0,0,0.18), rgba(255,255,255,0));
}

.stats-banner div {
  background: rgba(255,255,255,0.82);
}

.counter-value {
  color: var(--text-primary);
}

.footer {
  border-top-color: var(--border-subtle);
}

.footer-grid a,
.footer-bottom {
  color: #667085;
}

.footer-grid h3,
.list-heading h3,
.timeline-item strong,
.profile-copy strong {
  color: var(--text-primary);
}

.case-visual {
  overflow: hidden;
  padding: 0;
  min-height: 420px;
  background: #fff;
}

.feature-deep {
  background: #fff;
}

.mock-ui-shot {
  position: relative;
  min-height: 400px;
  padding: 0;
  overflow: hidden;
}

.mock-ui-shot img {
  position: absolute;
  inset: 0;
}

.shot-overlay {
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: 20px;
  display: grid;
  gap: 8px;
  padding: 18px;
  border-radius: 16px;
  background: rgba(255,255,255,0.92);
  box-shadow: var(--elevation-2);
  backdrop-filter: blur(14px);
}

.shot-overlay strong {
  color: var(--text-primary);
}

.shot-overlay span {
  color: var(--text-secondary);
}

.walk-step:nth-child(even),
.feature-deep:nth-child(even) {
  background: #fff7f7;
}

.walk-visual {
  background: #fff;
}

.illustration span,
.shot-grid span {
  background: #EEF2F7;
}

.form-illustration span,
.video-lines span {
  background: #E5E7EB;
}

.auth-screen {
  grid-template-columns: minmax(320px, 480px) minmax(320px, 560px);
  gap: 28px;
  padding-left: 22px;
  padding-right: 22px;
}

.auth-visual {
  position: relative;
  min-height: 540px;
  overflow: hidden;
  border-radius: 24px;
  box-shadow: var(--elevation-3);
}

.auth-visual div {
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: 20px;
  display: grid;
  gap: 4px;
  padding: 18px;
  border-radius: 16px;
  background: rgba(255,255,255,0.92);
  box-shadow: var(--elevation-2);
}

.auth-visual strong {
  color: var(--text-primary);
}

.auth-visual span {
  color: var(--text-secondary);
}

.app-shell {
  background: var(--bg-void);
}

.sidebar {
  border-right-color: var(--border-subtle);
}

.sidebar nav a,
.profile-copy span,
.escrow-main span,
.amount-block span,
.progress-cell small,
.deadline,
.case-meta span,
.queue-item span,
.ledger-row span {
  color: #667085;
}

.sidebar nav a.active,
.sidebar nav a:hover {
  color: var(--text-primary);
}

.app-header {
  background: rgba(255,255,255,0.9);
  box-shadow: 0 10px 28px rgba(15,23,42,0.05);
}

input,
select {
  background: #fff;
  color: var(--text-primary);
}

.escrow-card {
  background: #fff;
}

.app-banner {
  position: relative;
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 22px;
  align-items: center;
  overflow: hidden;
  margin-bottom: 22px;
  padding: 18px;
  border: 1px solid var(--border-subtle);
  border-radius: 18px;
  background: #fff;
  box-shadow: var(--elevation-2);
}

.app-banner img {
  height: 170px;
  border-radius: 14px;
}

.app-banner h2 {
  font-size: clamp(2rem, 4vw, 3.1rem);
}

.app-banner p:not(.eyebrow) {
  max-width: 680px;
  margin: 6px 0 16px;
}

.comparison-row span,
.contract-drawer,
.faq-answer p,
.terminal .muted {
  color: var(--text-secondary);
}

.mobile-overlay {
  background: rgba(255,255,255,0.98);
}

.code-block,
.terminal {
  background: #080808;
  color: #fff;
}

.code-line code {
  color: #d6d6d6;
}

.btn-ghost,
.btn-ghost:hover,
.use-mini,
.faq-item button,
.table-row,
.industry-card a,
.case-copy dt,
.check-list span,
.comparison-row.head span,
.comparison-row .highlight,
.pricing-card > strong,
.invite-illustration span,
.complete-illustration p,
.sidebar nav a.active,
.sidebar nav a:hover,
.profile-copy strong,
.profile-chip,
.footer-grid h3 {
  color: var(--text-primary);
}

.chip.active,
.chip:hover {
  color: var(--text-primary);
}

.industry-stats span {
  background: #fff;
  color: var(--text-primary);
}

.btn-primary,
.launch-btn,
.tab-group button.active,
.play-button,
.logo-mark,
.profile-avatar,
.avatar-pair span,
.notification span {
  color: #fff;
}

@media (max-width: 1180px) {
  .nav-links {
    gap: 20px;
  }

  .hero-section,
  .smart-teaser,
  .contract-builder,
  .picture-banner,
  .feature-deep,
  .case-study,
  .walk-step,
  .dashboard-grid,
  .transaction-grid,
  .admin-grid {
    grid-template-columns: 1fr;
  }

  .hero-float-card {
    max-width: 520px;
  }

  .hero-media-stack {
    min-height: 620px;
    max-width: 680px;
  }

  .stat-grid,
  .feature-grid,
  .industry-grid,
  .pricing-grid,
  .audit-grid,
  .dispute-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .contract-flow,
  .landing-steps {
    grid-template-columns: repeat(2, 1fr);
  }

  .escrow-card {
    grid-template-columns: 1fr 150px 110px;
  }

  .deadline,
  .progress-cell,
  .escrow-card .btn {
    grid-column: span 1;
  }
}

@media (max-width: 900px) {
  .navbar {
    grid-template-columns: 1fr auto;
    padding: 0 18px;
  }

  .nav-links,
  .launch-btn {
    display: none;
  }

  .mobile-menu-button {
    display: inline-grid;
  }

  .hero-section,
  .section,
  .smart-teaser,
  .picture-banner,
  .feature-deep,
  .case-study,
  .walk-step {
    padding-left: 20px;
    padding-right: 20px;
  }

  h1 {
    font-size: clamp(3.4rem, 15vw, 5rem);
  }

  .app-shell {
    display: block;
  }

  .sidebar {
    display: none;
  }

  .app-header {
    padding: 14px 16px;
  }

  .app-header .search-box {
    display: none;
  }

  .profile-chip span,
  .profile-chip .lucide-log-out {
    display: none;
  }

  .app-content main {
    padding: 20px 16px 92px;
  }

  .bottom-tabs {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 95;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    border-top: 1px solid var(--border-subtle);
    background: rgba(255,255,255,0.95);
    backdrop-filter: blur(18px);
  }

  .bottom-tabs a {
    display: grid;
    place-items: center;
    min-height: 62px;
    color: var(--text-secondary);
  }

  .bottom-tabs a.active {
    color: var(--accent-red-hot);
  }

  .wizard {
    grid-template-columns: 1fr;
  }

  .wizard-steps {
    display: flex;
    overflow-x: auto;
  }

  .wizard-steps button {
    min-width: 150px;
  }
}

@media (max-width: 720px) {
  .hero-section {
    min-height: auto;
    padding-top: 86px;
  }

  .hero-media-stack {
    min-height: 520px;
  }

  .hero-photo-main {
    height: 360px;
  }

  .hero-photo-small {
    left: 12px;
    width: 56%;
    height: 150px;
  }

  .hero-float-card {
    right: 8px;
    width: 84%;
  }

  .hero-actions,
  .hero-stats,
  .footer-bottom,
  .table-tools,
  .list-heading,
  .app-header,
  .industry-stats {
    align-items: stretch;
    flex-direction: column;
  }

  .stats-banner,
  .landing-steps,
  .feature-grid,
  .industry-grid,
  .image-mosaic,
  .picture-banner,
  .app-banner,
  .pricing-grid,
  .audit-grid,
  .stat-grid,
  .contract-flow,
  .dispute-grid,
  .footer-grid,
  .case-stats,
  .form-grid {
    grid-template-columns: 1fr;
  }

  .picture-frame,
  .case-visual,
  .auth-visual {
    min-height: 280px;
  }

  .app-banner img {
    height: 190px;
  }

  .auth-screen {
    grid-template-columns: 1fr;
  }

  .stats-banner {
    padding: 0;
  }

  .case-study.flipped .case-visual,
  .feature-deep.flipped .feature-copy {
    order: initial;
  }

  .walk-copy {
    position: static;
    padding-top: 0;
  }

  .walk-visual,
  .video-card {
    min-height: 300px;
  }

  .escrow-card {
    grid-template-columns: 1fr;
  }

  .escrow-card .btn {
    width: 100%;
  }

  .table-row {
    min-width: 760px;
  }

  .contract-flow .flow-path {
    display: none;
  }

  .mobile-overlay nav a {
    font-size: 1.6rem;
  }
}
`

export default App
