import {
  Accessibility, Activity, Bell, BookOpen, Boxes, Briefcase, CalendarCheck, CalendarDays, CalendarRange, ChartColumn,
  CircleHelp, CircleUser, ClipboardCheck, Compass, Contact, CreditCard, FileSignature, FileText, Files, FolderKanban, Gift,
  History, House, Image, ImagePlus, Info, Languages, LayoutTemplate, LifeBuoy, ListChecks, MapPin, Mail, Megaphone, MessageCircle,
  MessageSquareQuote, MonitorX, Newspaper, PackageSearch, Palette, PartyPopper, Pencil, Percent, Plug, RefreshCw, Rocket,
  Search, Send, Server, ServerCog, Shield, ShoppingCart, Smartphone, Sparkles, Stethoscope, Tag, Tags, Truck,
  Upload, UserCog, Users, UsersRound, UtensilsCrossed, Workflow, Wrench, Zap, type LucideIcon,
} from 'lucide-react'

// One icon per guide option, keyed by the ids in project-configurator.ts. Unknown ids fall back to a neutral icon.
const icons: Record<string, LucideIcon> = {
  // present
  presentActivity: House, about: Info, services: Briefcase, staffProfiles: Users, portfolio: Image, testimonials: MessageSquareQuote,
  articles: Newspaper, faq: CircleHelp, location: MapPin, menu: UtensilsCrossed,
  // requests
  enquiries: Mail, quote: FileText, fileUpload: Upload, appointments: CalendarCheck, booking: CalendarDays, newsletter: Send,
  events: PartyPopper, eventSignup: CalendarRange,
  // sell
  catalog: BookOpen, productDetails: Tag, cart: ShoppingCart, payment: CreditCard, delivery: Truck, promotions: Percent, orderTracking: PackageSearch,
  // clients
  clientArea: CircleUser, documents: Files, messages: MessageCircle, tracking: Activity, history: History, notifications: Bell,
  // organize
  customerManagement: Contact, caseManagement: FolderKanban, quotesDocuments: FileSignature, planning: CalendarRange, tasks: ListChecks,
  roles: Shield, statuses: Tags, team: UsersRound, metrics: ChartColumn, automation: Workflow, connection: Plug, stock: Boxes,
  // content
  editTexts: Pencil, editImages: ImagePlus, manageOffers: Gift, publishNews: Megaphone, multilingual: Languages, administrators: UserCog,
  // improve
  appearance: Palette, navigation: Compass, mobile: Smartphone, newFeatures: Sparkles, speed: Zap, accessibility: Accessibility,
  seo: Search, technology: Server, review: ClipboardCheck, diagnosis: Stethoscope,
  // support
  broken: Wrench, display: MonitorX, updates: RefreshCw, ongoing: LifeBuoy, launch: Rocket, hosting: ServerCog,
}

export const guideIcon = (id: string): LucideIcon => icons[id] ?? LayoutTemplate
