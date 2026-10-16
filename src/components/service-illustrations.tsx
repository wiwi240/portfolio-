import type { Language } from '@/data/portfolio-content'

export type ServiceIllustrationKind =
  | 'landing' | 'showcase' | 'shop' | 'webapp' | 'business' | 'custom'
  | 'redesign' | 'features' | 'performance'
  | 'fixes' | 'updates' | 'support' | 'hosting'

const navy = '#0B1323'
const blue = '#0866E8'
const cyan = '#00BDEB'
const pale = '#EAF7FF'
const line = '#D6E7F6'
const muted = '#8CA7C5'

function Window({ x, y, w, h, id, children }: { x: number; y: number; w: number; h: number; id: string; children: React.ReactNode }) {
  return <g filter={`url(#${id}-shadow)`}>
    <rect x={x + .5} y={y + 2} width={w} height={h} rx="9" fill="#C9DDF0" opacity=".72" />
    <rect x={x} y={y} width={w} height={h} rx="9" fill={`url(#${id}-panel)`} stroke="#C9DFF3" strokeWidth=".8" />
    <path d={`M${x} ${y + 23}H${x + w}`} stroke={line} />
    <circle cx={x + 13} cy={y + 12} r="2.2" fill={cyan} /><circle cx={x + 21} cy={y + 12} r="2.2" fill={blue} /><circle cx={x + 29} cy={y + 12} r="2.2" fill="#B8D7F3" />
    <g transform={`translate(${x},${y + 23})`}>{children}</g>
  </g>
}

function Bar({ x, y, w, h = 5, color = '#C8DDF2' }: { x: number; y: number; w: number; h?: number; color?: string }) {
  return <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={color} />
}

function Button({ x, y, w, label }: { x: number; y: number; w: number; label: string }) {
  return <g><rect x={x} y={y} width={w} height="23" rx="5" fill={blue} /><text x={x + w / 2} y={y + 15} textAnchor="middle" fill="#fff" fontSize="8" fontWeight="700">{label}</text></g>
}

function Picture({ x, y, w, h, id }: { x: number; y: number; w: number; h: number; id: string }) {
  return <g><rect x={x} y={y} width={w} height={h} rx="5" fill={`url(#${id}-picture)`} /><path d={`M${x} ${y + h}L${x + w * .4} ${y + h * .42}L${x + w * .61} ${y + h * .7}L${x + w * .82} ${y + h * .3}L${x + w} ${y + h * .55}V${y + h}Z`} fill="#1277DA" opacity=".82" /><path d={`M${x} ${y + h}L${x + w * .28} ${y + h * .61}L${x + w * .48} ${y + h * .78}L${x + w * .7} ${y + h * .48}L${x + w} ${y + h * .9}V${y + h}Z`} fill="#7BDBF4" opacity=".86" /></g>
}

function BrandVisual({ x, y, w, h, id }: { x: number; y: number; w: number; h: number; id: string }) {
  return <g>
    <rect x={x} y={y} width={w} height={h} rx="5" fill="#EAF7FF" />
    <path d={`M${x + 9} ${y + h - 9}V${y + 9}h${w - 18}v${h - 18}z`} fill="#fff" />
    <circle cx={x + w * .34} cy={y + h * .47} r={Math.min(w, h) * .23} fill={`url(#${id}-accent)`} opacity=".92" />
    <path d={`M${x + w * .57} ${y + h * .7}l${w * .18} -${h * .34} ${w * .16} ${h * .34}z`} fill="#0B477F" />
    <path d={`M${x + 12} ${y + h - 12}h${w - 24}`} stroke="#B6D9F3" strokeWidth="2" />
    <circle cx={x + w * .34} cy={y + h * .47} r={Math.min(w, h) * .1} fill="#fff" opacity=".88" />
  </g>
}

function MediaPreview({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return <g>
    <rect x={x} y={y} width={w} height={h} rx="5" fill="#F3F9FE" stroke={line} />
    <rect x={x + 6} y={y + 7} width={w * .53} height={h * .72} rx="3" fill="#D9F2FC" />
    <circle cx={x + w * .32} cy={y + h * .35} r={h * .13} fill="#55BDE7" />
    <path d={`M${x + 6} ${y + h * .7}q${w * .16} -${h * .28} ${w * .3} -${h * .1}t${w * .2} -${h * .08}v${h * .17}z`} fill="#1682CF" />
    <rect x={x + w * .66} y={y + 7} width={w * .26} height={h * .28} rx="2" fill="#B9E6F7" />
    <rect x={x + w * .66} y={y + h * .39} width={w * .26} height={h * .28} rx="2" fill="#84C4EA" />
    <rect x={x + 6} y={y + h * .82} width={w - 12} height={h * .1} rx="2" fill="#D4E5F3" />
  </g>
}

function Check({ x, y, color = cyan }: { x: number; y: number; color?: string }) {
  return <path d={`M${x} ${y + 5}l4 4 8-9`} fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
}

function SceneContent({ kind, id, language }: { kind: ServiceIllustrationKind; id: string; language: Language }) {
  const fr = language === 'fr'

  switch (kind) {
    case 'landing': return <>
      <Window x={25} y={24} w={306} h={166} id={id}><Bar x={15} y={13} w={68} h={5} color={blue} /><Bar x={180} y={13} w={28} h={3} /><Bar x={218} y={13} w={28} h={3} /><Bar x={256} y={13} w={28} h={3} /><text x="20" y="51" fill={navy} fontWeight="800" fontSize="19">{fr ? 'Votre projet' : 'Your project'}</text><text x="20" y="73" fill={navy} fontWeight="800" fontSize="19">{fr ? 'prend vie' : 'comes to life'}</text><Bar x={20} y={85} w={105} /><Bar x={20} y={95} w={84} /><Button x={20} y={113} w={92} label={fr ? 'Découvrir' : 'Explore'} /><path d="M195 66c14-13 31-13 44 1 8 8 8 18 0 25l-28 28c-9 9-25 9-34 0-9-9-9-22 0-31z" fill={`url(#${id}-accent)`} opacity=".9" /><path d="M226 88l22-26 31 31-22 25z" fill="#0A59D7" opacity=".9" /><circle cx="254" cy="105" r="15" fill="#7CE4FA" opacity=".78" /><rect x="202" y="123" width="57" height="8" rx="4" fill="#BCEBFA" /><rect x="265" y="123" width="18" height="8" rx="4" fill="#6BB8F0" /></Window>
    </>
    case 'showcase': return <>
      <Window x={20} y={29} w={231} h={159} id={id}><Bar x={13} y={12} w={34} h={5} color={navy} /><Bar x={84} y={12} w={25} h={3} /><Bar x={119} y={12} w={25} h={3} /><Bar x={154} y={12} w={25} h={3} /><text x="18" y="54" fontSize="14" fontWeight="800" fill={navy}>{fr ? 'Nos services' : 'Our services'}</text><text x="18" y="70" fontSize="14" fontWeight="800" fill={navy}>{fr ? 'pour votre réussite' : 'for your success'}</text><Bar x={18} y={79} w={105} /><Bar x={18} y={90} w={70} /><BrandVisual x={144} y={36} w={70} h={62} id={id} /><path d="M18 107h196" stroke={line} />{[22,87,152].map((x, index) => <g key={x}><rect x={x} y="116" width="53" height="27" rx="5" fill={pale} /><circle cx={x + 11} cy="127" r="5" fill={index === 1 ? cyan : blue} /><Bar x={x + 20} y={123} w={24} h={3} /><Bar x={x + 20} y={131} w={17} h={3} /></g>)}</Window>
      <Window x={262} y={19} w={78} h={82} id={id}><text x="9" y="16" fill={navy} fontSize="8" fontWeight="700">{fr ? 'Réalisations' : 'Work'}</text><rect x="9" y="23" width="27" height="28" rx="3" fill="#D9F2FC" /><circle cx="22" cy="36" r="7" fill={blue} /><rect x="42" y="23" width="27" height="28" rx="3" fill="#E7F3FC" /><path d="M46 45l8-12 5 6 5-5 5 11z" fill="#41ABD9" /><Bar x={10} y={50} w={54} h={3} /></Window>
      <Window x={262} y={110} w={78} h={78} id={id}><text x="9" y="16" fill={navy} fontSize="8" fontWeight="700">Contact</text><circle cx="16" cy="32" r="5" fill={cyan} /><Bar x={27} y={30} w={38} h={3} /><circle cx="16" cy="47" r="5" fill={blue} /><Bar x={27} y={45} w={31} h={3} /></Window>
    </>
    case 'shop': return <>
      <Window x={20} y={28} w={251} h={158} id={id}><Bar x={16} y={13} w={39} h={5} color={navy} /><Bar x={151} y={14} w={24} h={3} /><Bar x={183} y={14} w={24} h={3} /><Picture x={72} y={32} w={88} h={92} id={id} /><path d="M98 57c0-20 36-20 36 0" fill="none" stroke={blue} strokeWidth="10" strokeLinecap="round" /><rect x="88" y="58" width="17" height="39" rx="7" fill="#0555C3" /><rect x="128" y="58" width="17" height="39" rx="7" fill="#0555C3" /><Bar x={175} y={40} w={55} h={6} color={navy} /><Bar x={175} y={54} w={46} /><Bar x={175} y={65} w={52} /><Bar x={175} y={83} w={33} h={6} color={blue} /><Button x={174} y={111} w={67} label={fr ? 'Panier' : 'Cart'} />{[35,70,105].map((y) => <rect key={y} x="16" y={y} width="37" height="30" rx="5" fill={pale} stroke={line} />)}</Window>
      <Window x={258} y={67} w={86} h={112} id={id}><text x="10" y="17" fill={navy} fontSize="9" fontWeight="700">{fr ? 'Votre panier' : 'Your cart'}</text><rect x="10" y="24" width="22" height="22" rx="4" fill={pale} /><circle cx="21" cy="35" r="6" fill={blue} /><Bar x={39} y={27} w={34} h={4} /><Bar x={39} y={37} w={27} h={3} /><Bar x={10} y={54} w={64} h={4} /><Bar x={10} y={62} w={47} h={4} /><Button x={10} y={65} w={65} label={fr ? 'Commander' : 'Checkout'} /></Window>
    </>
    case 'webapp': return <>
      <Window x={18} y={25} w={247} h={163} id={id}><rect x="0" y="0" width="35" height="140" fill="#12365E" />{[19,48,77,106].map((y) => <g key={y}><rect x="8" y={y} width="20" height="20" rx="5" fill={y === 48 ? blue : '#24537E'} /><circle cx="18" cy={y + 10} r="4" fill={y === 48 ? '#fff' : '#A7DAF4'} /></g>)}<text x="49" y="25" fontWeight="800" fontSize="11" fill={navy}>{fr ? 'Réserver un rendez-vous' : 'Book an appointment'}</text><Bar x={49} y={37} w={106} /><rect x="49" y="49" width="137" height="78" rx="5" fill="#F8FBFF" stroke={line} />{Array.from({ length: 21 }, (_, n) => <g key={n}><rect x={55 + n % 7 * 18} y={56 + Math.floor(n / 7) * 22} width="14" height="14" rx="3" fill={n === 10 ? blue : '#E3F1FC'} /><text x={62 + n % 7 * 18} y={66 + Math.floor(n / 7) * 22} textAnchor="middle" fontSize="6" fill={n === 10 ? '#fff' : muted}>{n + 1}</text></g>)}<Bar x={197} y={51} w={37} h={5} color={navy} />{[68,87,106].map((y) => <rect key={y} x="197" y={y} width="42" height="15" rx="4" fill={y === 87 ? '#D4ECFF' : '#F3F8FD'} stroke={line} />)}<Button x={188} y={125} w={58} label={fr ? 'Réserver' : 'Book'} /></Window>
      <path d="M268 109h19m-6-6 6 6-6 6" fill="none" stroke={blue} strokeWidth="2" strokeLinecap="round" />
      <Window x={283} y={54} w={61} h={112} id={id}><circle cx="30" cy="31" r="17" fill={`url(#${id}-accent)`} /><Check x={24} y={26} color="#fff" /><text x="30" y="67" textAnchor="middle" fill={navy} fontSize="8" fontWeight="800">{fr ? 'Confirmé' : 'Confirmed'}</text><Bar x={10} y={77} w={40} h={4} /><Bar x={10} y={83} w={34} h={4} /></Window>
    </>
    case 'business': return <>
      <Window x={14} y={27} w={331} h={159} id={id}><rect x="0" y="0" width="37" height="136" fill="#14365D" /><circle cx="18" cy="20" r="8" fill={blue} />{[43,67,91,115].map((y) => <g key={y}><rect x="8" y={y} width="20" height="18" rx="4" fill={y === 43 ? '#2D679A' : '#1D4D7D'} /><circle cx="18" cy={y + 8} r="4" fill="#B3E2F4" /></g>)}<text x="51" y="21" fill={navy} fontSize="10" fontWeight="800">Clients</text><text x="183" y="21" fill={navy} fontSize="10" fontWeight="800">{fr ? 'Devis' : 'Quotes'}</text><rect x="49" y="31" width="119" height="62" rx="6" fill="#F7FBFF" stroke={line} /><rect x="181" y="31" width="135" height="62" rx="6" fill="#F7FBFF" stroke={line} />{[43,64].map((y) => <g key={y}><circle cx="62" cy={y + 4} r="7" fill={y === 43 ? '#72C8EA' : '#B4D8F3'} /><Bar x={75} y={y} w={50} h={4} color={navy} /><Bar x={75} y={y + 9} w={70} h={3} /></g>)}{[43,64].map((y) => <g key={y}><rect x="193" y={y - 4} width="15" height="17" rx="3" fill={pale} stroke={blue} /><Bar x={217} y={y} w={65} h={4} color={navy} /><Bar x={217} y={y + 9} w={81} h={3} /></g>)}<text x="50" y="103" fontSize="9" fontWeight="800" fill={navy}>{fr ? 'Planning' : 'Schedule'}</text><text x="246" y="103" fontSize="8" fontWeight="700" fill={blue}>{fr ? 'Dossiers' : 'Files'}</text>{[0,1,2,3].map((n) => <g key={n}><Bar x={50 + n * 65} y={113} w={40} h={3} /><rect x={50 + n * 65} y={121} width={45 + n % 2 * 12} height="9" rx="4" fill={n % 2 ? cyan : blue} opacity=".85" /></g>)}</Window>
    </>
    case 'custom': return <>
      <Window x={20} y={27} w={264} h={158} id={id}><rect x="0" y="0" width="33" height="135" fill="#F1F8FF" />{[24,51,78,105].map((y) => <g key={y}><rect x="7" y={y} width="19" height="18" rx="4" fill="#fff" stroke={line} /><rect x="13" y={y + 6} width="7" height="7" rx="2" fill={blue} /></g>)}<Bar x={49} y={16} w={122} h={4} /><Bar x={185} y={16} w={55} h={4} /><Picture x={60} y={40} w={144} h={67} id={id} /><rect x="56" y="36" width="152" height="75" rx="2" fill="none" stroke={blue} strokeWidth="1.7" strokeDasharray="4 3" />{[[56,36],[208,36],[56,111],[208,111]].map(([x,y]) => <rect key={`${x}-${y}`} x={x - 3} y={y - 3} width="6" height="6" rx="1" fill={blue} />)}<Bar x={58} y={121} w={110} h={5} /><Bar x={58} y={130} w={75} h={4} /><Picture x={185} y={111} w={61} h={22} id={id} /></Window><path d="M216 108l9 31 6-10 12-3z" fill={blue} stroke="#fff" strokeWidth="2" />
      <Window x={295} y={43} w={50} h={77} id={id}><text x="10" y="18" fontSize="8" fontWeight="700" fill={navy}>UI</text><rect x="10" y="29" width="30" height="11" rx="5" fill={blue} /><circle cx="18" cy="54" r="5" fill={cyan} /><Bar x={27} y={52} w={12} h={4} /></Window><Window x={297} y={129} w={47} h={49} id={id}><Picture x={7} y={8} w={33} h={25} id={id} /></Window>
    </>
    case 'redesign': return <>
      <Window x={23} y={27} w={257} h={158} id={id}><Picture x={17} y={28} w={99} h={76} id={id} /><Bar x={132} y={30} w={93} h={9} color="#A9D7FA" /><Bar x={132} y={46} w={76} h={6} /><Bar x={132} y={59} w={84} h={6} /><Bar x={17} y={119} w={208} h={6} /><Bar x={17} y={133} w={151} h={5} /><Picture x={132} y={77} w={45} h={31} id={id} /><Picture x={183} y={77} w={42} h={31} id={id} /></Window>
      <Window x={273} y={45} w={71} h={126} id={id}><text x="14" y="31" fontSize="27" fontWeight="800" fill={navy}>Aa</text><rect x="12" y="49" width="16" height="16" rx="4" fill="#FF8FCE" /><rect x="33" y="49" width="16" height="16" rx="4" fill={cyan} /><rect x="54" y="49" width="10" height="16" rx="4" fill={blue} /><rect x="12" y="75" width="21" height="21" rx="5" fill={pale} /><rect x="40" y="75" width="21" height="21" rx="5" fill="#D6EEFE" /><Bar x={12} y={98} w={47} h={4} /></Window>
    </>
    case 'features': return <>
      <Window x={24} y={33} w={243} h={150} id={id}><Bar x={18} y={18} w={77} h={9} color={blue} /><Bar x={122} y={20} w={27} h={4} /><Bar x={157} y={20} w={27} h={4} /><Bar x={192} y={20} w={27} h={4} />{[48,74,100].map((y) => <g key={y}><rect x="19" y={y} width="18" height="18" rx="4" fill="#DDEFFD" /><Bar x={48} y={y + 2} w={94} h={5} /><Bar x={48} y={y + 12} w={69} h={4} /></g>)}</Window>
      <circle cx="237" cy="111" r="23" fill={`url(#${id}-accent)`} filter={`url(#${id}-shadow)`} /><path d="M226 111h22m-11-11v22" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
      <Window x={262} y={53} w={82} h={116} id={id}><text x="10" y="17" fontSize="8" fontWeight="800" fill={navy}>{fr ? 'Réservation' : 'Booking'}</text><rect x="10" y="25" width="62" height="44" rx="4" fill={pale} />{[0,1,2,3,4,5].map(n => <rect key={n} x={16 + n % 3 * 18} y={32 + Math.floor(n / 3) * 15} width="12" height="10" rx="2" fill={n === 4 ? blue : '#B5DBF8'} />)}<Button x={10} y={78} w={62} label={fr ? 'Réserver' : 'Book'} /></Window>
    </>
    case 'performance': return <>
      <Window x={20} y={30} w={265} h={154} id={id}><MediaPreview x={15} y={33} w={95} h={85} /><Bar x={126} y={33} w={103} h={8} color="#A9D7FA" /><Bar x={126} y={49} w={87} h={6} /><Bar x={126} y={62} w={99} h={5} /><Bar x={126} y={75} w={72} h={5} /><Bar x={126} y={98} w={94} h={5} /><Bar x={15} y={127} w={210} h={4} /></Window>
      <Window x={277} y={58} w={68} h={113} id={id}><circle cx="34" cy="39" r="22" fill="none" stroke="#DDEFFA" strokeWidth="7" /><path d="M34 17a22 22 0 0 1 20 30" fill="none" stroke={blue} strokeWidth="7" strokeLinecap="round" /><path d="M54 47a22 22 0 0 1-39 1" fill="none" stroke={cyan} strokeWidth="7" strokeLinecap="round" /><Bar x={13} y={72} w={43} h={5} /><Bar x={13} y={82} w={34} h={5} /></Window>
    </>
    case 'fixes': return <>
      <Window x={27} y={31} w={239} h={148} id={id}><Bar x={17} y={18} w={77} h={5} /><Bar x={17} y={32} w={189} h={5} /><Bar x={17} y={46} w={151} h={5} /><rect x="17" y="69" width="109" height="53" rx="5" fill="#F8FBFF" stroke={line} /><path d="M60 83v22m-11-17 22 12m0-12-22 12" stroke="#F0444B" strokeWidth="4" strokeLinecap="round" /><circle cx="60" cy="94" r="9" fill="#F0444B" /><Bar x={142} y={78} w={57} h={5} /><Bar x={142} y={94} w={48} h={5} /></Window>
      <circle cx="278" cy="119" r="39" fill={`url(#${id}-accent)`} filter={`url(#${id}-shadow)`} /><path d="M260 139l26-26m-25-9 12 12-10 10-12-12m27 22 10 10 8-8-10-10" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="327" cy="164" r="13" fill="#fff" stroke={line} filter={`url(#${id}-shadow)`} /><Check x={321} y={158} color={blue} />
    </>
    case 'updates': return <>
      <Window x={28} y={35} w={251} h={147} id={id}><Bar x={18} y={20} w={81} h={6} color={blue} /><Bar x={18} y={37} w={165} h={5} /><Bar x={18} y={53} w={124} h={5} /><rect x="18" y="78" width="63" height="43" rx="6" fill={pale} /><rect x="96" y="78" width="63" height="43" rx="6" fill="#DAF3FE" /><rect x="174" y="78" width="54" height="43" rx="6" fill={pale} /><path d="M49 91v16m-7-8 7 8 7-8m70-7v15m-7-7 7 7 7-7m68-8v16m-7-8 7 8 7-8" fill="none" stroke={blue} strokeWidth="3" strokeLinecap="round" /></Window>
      <circle cx="255" cy="116" r="35" fill={`url(#${id}-accent)`} filter={`url(#${id}-shadow)`} /><path d="M236 118a20 20 0 0 1 32-17m-2-8 3 10-10 1m17 13a20 20 0 0 1-32 17m2 8-3-10 10-1" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m132 101 14-8 14 8-14 8zm0 0v15l14 8 14-8v-15m-14 8v15" fill="#fff" stroke={blue} strokeWidth="2" strokeLinejoin="round" />
      <rect x="298" y="48" width="43" height="39" rx="7" fill="#fff" stroke={line} filter={`url(#${id}-shadow)`} /><rect x="304" y="107" width="38" height="37" rx="7" fill="#fff" stroke={line} filter={`url(#${id}-shadow)`} /><rect x="305" y="157" width="37" height="30" rx="7" fill="#fff" stroke={line} filter={`url(#${id}-shadow)`} /><circle cx="319" cy="67" r="7" fill={cyan} /><circle cx="323" cy="125" r="7" fill={blue} /><circle cx="323" cy="171" r="6" fill={cyan} />
    </>
    case 'support': return <>
      <Window x={25} y={31} w={255} h={151} id={id}>{[27,55,83,111].map((y, i) => <g key={y}><rect x="18" y={y} width="17" height="17" rx="4" fill={i === 3 ? pale : cyan} /><Check x={21} y={y + 3} color={i === 3 ? blue : '#fff'} /><Bar x={46} y={y + 2} w={i === 1 ? 127 : 103} h={5} color={i === 1 ? '#A7D5F5' : '#C8DDF2'} /><Bar x={46} y={y + 12} w={i === 2 ? 70 : 91} h={4} /></g>)}</Window>
      <circle cx="282" cy="122" r="35" fill="#fff" stroke={line} filter={`url(#${id}-shadow)`} /><circle cx="282" cy="122" r="24" fill={blue} /><path d="M282 107v30m-15-15h30m-25-11 20 22m0-22-20 22" stroke="#fff" strokeWidth="5" strokeLinecap="round" /><circle cx="282" cy="122" r="8" fill={blue} stroke="#fff" strokeWidth="3" />
    </>
    case 'hosting': return <>
      <Window x={19} y={35} w={235} h={144} id={id}><Bar x={17} y={17} w={121} h={7} color={blue} /><Bar x={150} y={19} w={45} h={4} /><Picture x={16} y={38} w={109} h={75} id={id} /><Bar x={141} y={41} w={70} h={5} /><Bar x={141} y={54} w={56} h={5} /><Bar x={141} y={67} w={65} h={5} /><Button x={141} y={89} w={67} label={fr ? 'En ligne' : 'Live'} /></Window><text x="98" y="69" fontSize="9" fill={navy} fontWeight="700">example.com</text>
      <path d="M256 114h28m-7-7 7 7-7 7" fill="none" stroke={blue} strokeWidth="2" strokeLinecap="round" />
      <g filter={`url(#${id}-shadow)`}><rect x="291" y="94" width="53" height="24" rx="5" fill="#173B65" /><rect x="291" y="120" width="53" height="24" rx="5" fill="#13355D" /><rect x="291" y="146" width="53" height="24" rx="5" fill="#0F2B4F" />{[103,129,155].map(y => <g key={y}><circle cx="300" cy={y} r="2" fill={cyan} /><Bar x={310} y={y - 2} w={24} h={3} color="#8EABD0" /></g>)}</g>
      <path d="M291 85c-14-1-15-19-3-24 3-16 24-19 33-7 13-1 21 11 17 22-2 6-7 9-16 9z" fill={`url(#${id}-accent)`} filter={`url(#${id}-shadow)`} /><path d="M305 66v13m-5-5 5 5 5-5" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
    </>
  }
}

export function ServiceIllustration({ kind, language }: { kind: ServiceIllustrationKind; language: Language }) {
  const id = `service-${kind}`
  return <svg className="service-illustration" viewBox="0 0 360 210" role="presentation" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id={`${id}-accent`} x1="0" y1="0" x2="1" y2="1"><stop stopColor={cyan} /><stop offset="1" stopColor={blue} /></linearGradient>
      <linearGradient id={`${id}-panel`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#FFFFFF" /><stop offset="1" stopColor="#F7FBFF" /></linearGradient>
      <linearGradient id={`${id}-picture`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#E9FAFF" /><stop offset=".55" stopColor="#B8E4FC" /><stop offset="1" stopColor="#75B6F6" /></linearGradient>
      <filter id={`${id}-shadow`} x="-20%" y="-20%" width="145%" height="160%"><feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#173D67" floodOpacity=".13" /></filter>
    </defs>
    <SceneContent kind={kind} id={id} language={language} />
  </svg>
}
