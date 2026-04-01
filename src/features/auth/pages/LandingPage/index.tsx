import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from 'framer-motion';
import ReactLenis from 'lenis/react';
import {
  ArrowRight,
  BrainCircuit,
  LineChart,
  Check,
  Sparkles,
  Shield,
  Zap,
  Globe,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  Mail,
  ChevronRight,
} from 'lucide-react';

import LogoIconeBorda from '../../../../assets/logo-borda-s.svg';
import LetreiroSolaryz from '../../../../assets/letreiro-solaryz.svg';

// ─── TIPOS ──────────────────────────────────────────────────────────────────

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
  reverse?: boolean;
  badge?: string;
}

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlight?: boolean;
  badge?: string;
}

// ─── CONSTANTES ─────────────────────────────────────────────────────────────

const PRICING_PLANS: PricingPlan[] = [
  {
    name: 'Satélite',
    price: 'Grátis',
    period: 'para sempre',
    description: 'Comece sua jornada financeira com as ferramentas essenciais.',
    features: [
      'Até 3 contas bancárias',
      'Categorização automática',
      'Relatório mensal básico',
      'App iOS e Android',
    ],
  },
  {
    name: 'Solar',
    price: 'R$ 29',
    period: '/ mês',
    description: 'Para quem leva finanças a sério e quer visibilidade total.',
    features: [
      'Contas ilimitadas',
      'IA de análise avançada',
      'Carteira de investimentos',
      'Comparativo CDI/IBOV',
      'Alertas personalizados',
      'Suporte prioritário 24h',
    ],
    highlight: true,
    badge: 'Mais popular',
  },
  {
    name: 'Galáctico',
    price: 'R$ 79',
    period: '/ mês',
    description: 'A solução completa para patrimônios complexos e metas ambiciosas.',
    features: [
      'Tudo do Solar',
      'Multi-usuários (família)',
      'API de integrações',
      'Relatórios para IR',
      'Consultor dedicado',
      'White-label opcional',
    ],
  },
];

const TEAM = [
  {
    name: 'Aurora Silveira',
    role: 'CEO & Co-Fundadora',
    bio: 'Ex-XP Investimentos. 10 anos navegando mercados financeiros.',
    gradient: 'from-[#E94822] to-[#F2910A]',
  },
  {
    name: 'Leo Marchetti',
    role: 'CTO & Co-Fundador',
    bio: 'Engenheiro full-stack. Construiu sistemas para 5M+ usuários.',
    gradient: 'from-[#EFD510] to-[#F2910A]',
  },
  {
    name: 'Íris Nakamura',
    role: 'Head of Design',
    bio: 'Formada pela ESDI. Obcecada por interfaces que emocionam.',
    gradient: 'from-[#E94822] to-[#c0392b]',
  },
];

const STATS = [
  { value: '42k+', label: 'Usuários ativos' },
  { value: 'R$ 2,1B', label: 'Patrimônio gerenciado' },
  { value: '99,9%', label: 'Uptime garantido' },
  { value: '4,9 ★', label: 'Avaliação nas lojas' },
];

// ─── PARTÍCULAS DE ESTRELAS ──────────────────────────────────────────────────

const STARS = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  size: Math.random() * 1.8 + 0.4,
  top: Math.random() * 100,
  left: Math.random() * 100,
  duration: Math.random() * 4 + 2,
  delay: Math.random() * 4,
  depth: Math.random() * 0.6 + 0.2,
}));

function StarField() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 30, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 30, damping: 20 });

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 22);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 22);
    };
    window.addEventListener('mousemove', handle);
    return () => window.removeEventListener('mousemove', handle);
  }, [mouseX, mouseY]);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {STARS.map((star) => (
        <StarDot key={star.id} star={star} smoothX={smoothX} smoothY={smoothY} />
      ))}
    </div>
  );
}

function StarDot({ star, smoothX, smoothY }: any) {
  const x = useTransform(smoothX, (v: number) => v * star.depth);
  const y = useTransform(smoothY, (v: number) => v * star.depth);

  return (
    <motion.div
      className="absolute rounded-full bg-white"
      style={{
        width: star.size,
        height: star.size,
        top: `${star.top}%`,
        left: `${star.left}%`,
        x,
        y,
        boxShadow: star.size > 1.4 ? '0 0 6px rgba(255,255,255,0.6)' : 'none',
      }}
      animate={{ opacity: [0.1, star.depth > 0.5 ? 0.9 : 0.5, 0.1] }}
      transition={{
        duration: star.duration,
        repeat: Infinity,
        delay: star.delay,
        ease: 'easeInOut',
      }}
    />
  );
}

// ─── BOTÃO MAGNÉTICO ─────────────────────────────────────────────────────────

function MagneticButton({
  children,
  className,
  strength = 0.35,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 180, damping: 14 });
  const y = useSpring(0, { stiffness: 180, damping: 14 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── FEATURE ITEM ────────────────────────────────────────────────────────────

function FeatureItem({ icon, title, desc, color, reverse = false, badge }: FeatureItemProps) {
  const colorMap: Record<string, string> = {
    'solar-orange': '#E94822',
    'solar-yellow': '#EFD510',
  };
  const hex = colorMap[color] ?? '#E94822';

  return (
    <motion.div
      initial={{ opacity: 0, x: reverse ? 60 : -60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-16`}
    >
      <div className="flex-1 space-y-5">
        {badge && (
          <span
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full border"
            style={{ background: `${hex}18`, color: hex, borderColor: `${hex}33` }}
          >
            <Sparkles size={11} /> {badge}
          </span>
        )}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center border"
          style={{ background: `${hex}18`, borderColor: `${hex}33`, color: hex }}
        >
          {icon}
        </div>
        <h2 className="text-4xl font-extrabold leading-tight">{title}</h2>
        <p className="text-gray-400 text-lg leading-relaxed">{desc}</p>
      </div>

      <div className="flex-1 w-full aspect-square max-w-sm mx-auto relative flex items-center justify-center">
        <div className="absolute inset-0 rounded-3xl border" style={{ background: `${hex}08`, borderColor: `${hex}15` }} />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="w-3/4 h-3/4 border-2 border-dashed rounded-full"
          style={{ borderColor: `${hex}25` }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute w-1/2 h-1/2 border border-dotted rounded-full"
          style={{ borderColor: `${hex}35` }}
        />
        <div className="absolute w-1/3 h-1/3 rounded-full blur-[50px]" style={{ background: `${hex}30` }} />
        <div className="absolute w-10 h-10 rounded-full blur-sm opacity-80" style={{ background: hex, boxShadow: `0 0 20px ${hex}` }} />
      </div>
    </motion.div>
  );
}

// ─── PRICING CARD ────────────────────────────────────────────────────────────

function PricingCard({ plan, index }: { plan: PricingPlan; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.3 } }}
      className={`relative flex flex-col bg-[#0A0A0C] rounded-3xl p-8 border transition-all duration-300 ${
        plan.highlight
          ? 'border-[#F2910A]/60 shadow-[0_0_60px_rgba(242,145,10,0.12)] scale-105'
          : 'border-white/[0.08] hover:border-white/20'
      }`}
    >
      {plan.badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#E94822] to-[#F2910A] text-black text-xs font-bold uppercase tracking-widest whitespace-nowrap">
          {plan.badge}
        </div>
      )}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-300 mb-3">{plan.name}</h3>
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-4xl font-extrabold">{plan.price}</span>
          <span className="text-gray-500 text-sm">{plan.period}</span>
        </div>
        <p className="text-gray-500 text-sm leading-relaxed">{plan.description}</p>
      </div>
      <div className="h-px bg-white/[0.08] mb-6" />
      <ul className="space-y-3 mb-8 flex-1">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-gray-400">
            <Check size={14} className="mt-0.5 shrink-0" style={{ color: plan.highlight ? '#F2910A' : '#6b7280' }} />
            {f}
          </li>
        ))}
      </ul>
      <button
        className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200 ${
          plan.highlight
            ? 'bg-gradient-to-r from-[#E94822] to-[#F2910A] text-black shadow-[0_0_20px_rgba(242,145,10,0.25)] hover:shadow-[0_0_30px_rgba(242,145,10,0.4)] hover:scale-[1.02]'
            : 'bg-white/[0.08] text-white hover:bg-white/[0.15] border border-white/10'
        }`}
      >
        {plan.highlight ? 'Começar agora' : 'Selecionar plano'}
      </button>
    </motion.div>
  );
}

// ─── NAVBAR ──────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled ? 'border-b border-white/[0.08] bg-black/70 backdrop-blur-xl py-3' : 'border-b border-transparent bg-transparent py-5'
      }`}
    >
      <div className="flex items-center justify-between px-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5">
          <img src={LogoIconeBorda} alt="Solaryz" className="w-8 h-8" />
          <img src={LetreiroSolaryz} alt="Solaryz" className="h-5 hidden sm:block" />
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-500">
          <a href="#features" className="hover:text-white transition-colors">Recursos</a>
          <a href="#pricing" className="hover:text-white transition-colors">Planos</a>
          <a href="#about" className="hover:text-white transition-colors">Empresa</a>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Entrar</Link>
          <Link to="/register" className="px-5 py-2.5 text-sm font-bold bg-white/[0.08] hover:bg-[#E94822]/20 border border-white/10 hover:border-[#E94822]/30 rounded-xl transition-all duration-200">
            Criar conta
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}

// ─── RODAPÉ ──────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="relative z-20 border-t border-white/5 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-2.5">
              <img src={LogoIconeBorda} alt="Solaryz" className="w-9 h-9" />
              <img src={LetreiroSolaryz} alt="Solaryz" className="h-5" />
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              A plataforma de finanças pessoais que usa IA para iluminar seus gastos e expandir seu universo financeiro.
            </p>
            <div className="flex gap-3">
              {[Twitter, Instagram, Linkedin, Github].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-white/5 border border-white/[0.08] flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200">
                  <Icon size={15} />
                </a>
              ))}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Mail size={12} />contato@solaryz.app
            </div>
          </div>

          {[
            { title: 'Produto', links: ['Recursos', 'Planos', 'Segurança', 'API', 'Changelog'] },
            { title: 'Empresa', links: ['Sobre nós', 'Blog', 'Carreiras', 'Imprensa', 'Parceiros'] },
            { title: 'Legal', links: ['Termos de Uso', 'Privacidade', 'Cookies', 'LGPD', 'Conformidade'] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-5">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors flex items-center gap-1 group">
                      {item}
                      <ChevronRight size={12} className="opacity-0 -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0 transition-all" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div>
            <h4 className="font-bold text-white mb-1">Fique em órbita</h4>
            <p className="text-sm text-gray-500">Novidades, dicas financeiras e releases direto no seu e-mail.</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <input
              type="email"
              placeholder="seu@email.com"
              className="flex-1 md:w-64 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#E94822]/50 transition-colors"
            />
            <button className="px-5 py-2.5 bg-gradient-to-r from-[#E94822] to-[#F2910A] text-black text-sm font-bold rounded-xl hover:shadow-[0_0_20px_rgba(242,145,10,0.3)] transition-all duration-200 shrink-0">
              Inscrever
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-600 border-t border-white/5 pt-8">
          <span>© 2025 Solaryz Tecnologia LTDA. CNPJ 12.345.678/0001-90. Todos os direitos reservados.</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><Shield size={11} className="text-[#E94822]" /> Dados com criptografia AES-256</span>
            <span className="flex items-center gap-1.5"><Globe size={11} /> Hospedado no Brasil</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── LANDING PAGE ────────────────────────────────────────────────────────────

export function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 420]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -840]);
  const heroScale = useTransform(scrollYProgress, [0, 0.35], [1, 1.18]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.35], [0, 70]);

  return (
    <ReactLenis root options={{ lerp: 0.08, duration: 1.8, smoothWheel: true }}>
      <div
        ref={containerRef}
        className="min-h-screen bg-[#060608] text-white selection:bg-[#E94822]/30 relative overflow-x-hidden"
        style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}
      >
        <StarField />
        <Navbar />

        {/* ── HERO ── */}
        <section className="relative w-full min-h-screen flex flex-col items-center justify-center pt-24 overflow-hidden">
          <motion.div
            style={{ scale: heroScale, opacity: heroOpacity, y: heroY }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="absolute w-[700px] h-[700px] bg-[#E94822]/10 rounded-full blur-[160px]" />
            <motion.div style={{ rotate: rotate1 }} className="absolute w-[480px] h-[480px] rounded-full border-t-[3px] border-r-[6px] border-[#E94822] opacity-50 blur-[1.5px]" />
            <motion.div style={{ rotate: rotate2 }} className="absolute w-[560px] h-[560px] rounded-full border-b-[5px] border-l-[2px] border-[#EFD510] opacity-25 blur-[3px]" />
            <div className="absolute w-[380px] h-[380px] rounded-full border border-white/5" />
            <div className="absolute w-[280px] h-[280px] bg-[#060608] rounded-full border border-white/10 shadow-[inset_0_0_80px_black,0_0_80px_rgba(0,0,0,0.8)]" />
            <div className="absolute w-4 h-4 bg-white rounded-full blur-sm opacity-70 shadow-[0_0_20px_white]" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-20 text-center px-6 max-w-5xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black border border-[#E94822]/30 text-[#E94822] text-xs font-semibold uppercase tracking-widest mb-8"
            >
              <Sparkles size={13} />
              O centro da sua galáxia financeira
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-[1.08] tracking-tight">
              A força gravitacional que{' '}
              <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-[#E94822] via-[#F2910A] to-[#EFD510] bg-clip-text text-transparent">
                organiza seu dinheiro.
              </span>
            </h1>

            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Puxe todas as suas contas para um único sistema. Deixe a IA iluminar seus gastos e evite o buraco negro financeiro.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <MagneticButton className="inline-block">
                <Link to="/register" className="group flex items-center gap-2 px-8 py-4 text-base bg-gradient-to-r from-[#E94822] to-[#F2910A] text-white font-bold rounded-2xl shadow-[0_0_50px_rgba(233,72,34,0.35)] hover:shadow-[0_0_70px_rgba(233,72,34,0.5)] transition-shadow">
                  Começar minha órbita <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </MagneticButton>
              <a href="#features" className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors">
                Ver como funciona <ArrowRight size={14} />
              </a>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-12 flex flex-wrap gap-6 justify-center text-xs text-gray-600"
            >
              {['Sem cartão de crédito', 'Cancele quando quiser', 'Dados criptografados com AES-256'].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <Check size={12} className="text-[#E94822]" /> {t}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* ── STATS ── */}
        <section className="relative z-20 py-16 border-y border-white/5 bg-white/[0.015]">
          <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10">
            {STATS.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-[#E94822] to-[#EFD510] bg-clip-text text-transparent mb-1">{s.value}</div>
                <div className="text-sm text-gray-500 font-medium">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── DASHBOARD PREVIEW 3D REVEAL ── */}
        <section className="relative z-30 max-w-6xl mx-auto px-6 py-24">
          <motion.div
            initial={{ rotateX: 22, y: 80, opacity: 0, scale: 0.94 }}
            whileInView={{ rotateX: 0, y: 0, opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformPerspective: 1200 }}
            className="w-full aspect-video bg-[#0A0A0C] rounded-3xl border border-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.9)] overflow-hidden relative"
          >
            <div className="h-10 border-b border-white/[0.08] flex items-center px-4 gap-2 bg-white/[0.03]">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
              <div className="flex-1 flex justify-center"><div className="w-48 h-4 bg-white/5 rounded-md" /></div>
            </div>
            <div className="p-6 grid grid-cols-12 gap-4 h-[calc(100%-2.5rem)]">
              <div className="col-span-2 flex flex-col gap-3">
                <div className="h-6 w-2/3 bg-white/[0.08] rounded-md" />
                <div className="space-y-2 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={`h-8 rounded-lg ${i === 0 ? 'bg-[#E94822]/20 border border-[#E94822]/20' : 'bg-white/[0.04]'}`} />
                  ))}
                </div>
              </div>
              <div className="col-span-10 flex flex-col gap-4">
                <div className="grid grid-cols-3 gap-3">
                  {[{ c: '#E94822', w: '60%' }, { c: '#EFD510', w: '45%' }, { c: '#3b82f6', w: '75%' }].map((k, i) => (
                    <div key={i} className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4">
                      <div className="h-3 w-16 bg-white/10 rounded mb-2" />
                      <div className="h-7 w-24 rounded-md mb-3" style={{ background: `${k.c}22` }} />
                      <div className="h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: k.w }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, delay: 0.5 + i * 0.1, ease: 'easeOut' }}
                          className="h-full rounded-full"
                          style={{ background: k.c }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex-1 bg-[#E94822]/5 rounded-xl border border-[#E94822]/15 p-4 relative overflow-hidden">
                  <div className="h-3 w-20 bg-white/10 rounded mb-3" />
                  <div className="flex items-end gap-1 absolute bottom-4 left-4 right-4" style={{ height: '60%' }}>
                    {[40, 55, 35, 70, 50, 80, 60, 90, 65, 75, 85, 95].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${h}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.8 + i * 0.05, ease: 'easeOut' }}
                        className="flex-1 rounded-t-sm"
                        style={{ background: 'linear-gradient(to top, #E94822aa, #EFD51044)' }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/[0.04] via-transparent to-transparent" />
          </motion.div>
        </section>

        {/* ── FEATURES ── */}
        <section id="features" className="py-24 max-w-7xl mx-auto px-6 flex flex-col gap-40 relative z-20">
          <FeatureItem
            icon={<BrainCircuit size={26} />}
            title="Luz nos seus gastos obscuros."
            desc="A IA do Solaryz categoriza cada centavo automaticamente e mostra exatamente onde seu patrimônio está sendo sugado. Sem planilhas. Sem surpresas."
            color="solar-orange"
            badge="Powered by IA"
          />
          <FeatureItem
            icon={<LineChart size={26} />}
            title="Expanda seu universo."
            desc="Consolide toda a sua carteira em um único painel. Acompanhe rentabilidade, compare com CDI e IBOV em tempo real e tome decisões com dados, não com achismos."
            color="solar-yellow"
            reverse
            badge="Tempo real"
          />
          <FeatureItem
            icon={<Shield size={26} />}
            title="Segurança gravitacional."
            desc="Criptografia bancária AES-256, autenticação em dois fatores e conformidade total com a LGPD. Seus dados orbitam protegidos, sempre."
            color="solar-orange"
            badge="Nível bancário"
          />
        </section>

        {/* ── PREÇOS ── */}
        <section id="pricing" className="py-32 bg-white/[0.015] border-y border-white/5 relative z-20">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#E94822] mb-4">
                <Zap size={12} /> Planos
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4">Escolha sua órbita</h2>
              <p className="text-gray-500 max-w-xl mx-auto">Comece grátis e escale conforme seu universo financeiro cresce. Sem pegadinhas.</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-center">
              {PRICING_PLANS.map((plan, i) => <PricingCard key={plan.name} plan={plan} index={i} />)}
            </div>
          </div>
        </section>

        {/* ── QUEM SOMOS ── */}
        <section id="about" className="py-32 max-w-7xl mx-auto px-6 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#E94822] mb-4">
              <Globe size={12} /> Nossa missão
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 max-w-3xl mx-auto">
              Construídos para democratizar a inteligência financeira.
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
              A Solaryz nasceu em 2023 com uma crença simples:{' '}
              <strong className="text-white">todo brasileiro merece clareza sobre o próprio dinheiro</strong>, não apenas quem pode pagar por um assessor financeiro.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {TEAM.map((person, i) => (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -4 }}
                className="bg-[#0A0A0C] border border-white/[0.08] rounded-3xl p-8 hover:border-white/20 transition-all duration-300"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${person.gradient} mb-5 flex items-center justify-center text-black font-extrabold text-2xl`}>
                  {person.name.charAt(0)}
                </div>
                <h3 className="font-bold text-lg mb-0.5">{person.name}</h3>
                <p className="text-xs text-[#E94822] font-semibold mb-3">{person.role}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{person.bio}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Sparkles size={20} />, title: 'Transparência radical', desc: 'Sem letras miúdas. Sem cobranças surpresa. Mostramos tudo, sempre.' },
              { icon: <Shield size={20} />, title: 'Privacidade em primeiro lugar', desc: 'Seus dados são seus. Nunca vendemos, nunca compartilhamos com terceiros.' },
              { icon: <Zap size={20} />, title: 'Inovação contínua', desc: 'Lançamos melhorias toda semana. Nossos usuários moldam o produto.' },
            ].map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08]"
              >
                <div className="w-10 h-10 bg-[#E94822]/10 border border-[#E94822]/20 rounded-xl flex items-center justify-center text-[#E94822] shrink-0">
                  {v.icon}
                </div>
                <div>
                  <h4 className="font-semibold mb-1">{v.title}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section className="py-40 text-center relative z-20 px-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            whileInView={{ scale: 1, opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl mx-auto px-8 py-24 rounded-[3rem] border border-[#E94822]/20 bg-gradient-to-b from-[#E94822]/8 via-[#F2910A]/4 to-transparent relative overflow-hidden"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#E94822]/15 blur-[100px] rounded-full" />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative z-10"
            >
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#E94822] mb-6">
                <Sparkles size={12} /> Comece agora
              </span>
              <h2 className="text-4xl md:text-6xl font-extrabold mb-5 leading-tight">
                Pronto para alinhar seus planetas?
              </h2>
              <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
                Junte-se a mais de 42 mil pessoas que já colocaram seu universo financeiro em ordem.
              </p>
              <MagneticButton className="inline-block" strength={0.4}>
                <Link
                  to="/register"
                  className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[#E94822] to-[#F2910A] text-black font-extrabold rounded-2xl text-xl shadow-[0_0_50px_rgba(242,145,10,0.35)] hover:shadow-[0_0_80px_rgba(242,145,10,0.55)] transition-all duration-300"
                >
                  Iniciar Missão Agora
                  <ArrowRight size={22} className="group-hover:translate-x-1.5 transition-transform" />
                </Link>
              </MagneticButton>
            </motion.div>
          </motion.div>
        </section>

        <Footer />
      </div>
    </ReactLenis>
  );
}