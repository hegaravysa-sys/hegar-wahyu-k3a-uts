export interface PhoneVisualMeta {
  modelKey: string;
  officialColorName: string;
  accentColor: string;
  bgGradient: string;
  designHighlight: string;
  cameraLayoutDesc: string;
  badge: string;
}

export function getPhoneVisualMeta(name: string): PhoneVisualMeta {
  const n = name.toLowerCase();

  if (n.includes('s24 ultra')) {
    return {
      modelKey: 's24_ultra',
      officialColorName: 'Titanium Gray',
      accentColor: '#94a3b8',
      bgGradient: 'from-slate-700 to-slate-900',
      designHighlight: 'Bodi Titanium Datar & S-Pen Terintegrasi',
      cameraLayoutDesc: '4 Lensa Kamera Terapung (200MP + Periskop 5x + Tele 3x + Ultra-wide)',
      badge: 'Titanium AI Flagship',
    };
  }

  if (n.includes('iphone 15 pro')) {
    return {
      modelKey: 'iphone_15_pro_max',
      officialColorName: 'Natural Titanium',
      accentColor: '#cbd5e1',
      bgGradient: 'from-stone-600 to-stone-800',
      designHighlight: 'Titanium Aerospace & Tombol Action Kustom',
      cameraLayoutDesc: 'Plateau Kaca Kotak Segitiga 3 Lensa (48MP + 5x Telephoto + Ultrawide + LiDAR)',
      badge: 'A17 Pro Titanium',
    };
  }

  if (n.includes('pixel 8 pro')) {
    return {
      modelKey: 'pixel_8_pro',
      officialColorName: 'Bay Blue (Biru Langit)',
      accentColor: '#38bdf8',
      bgGradient: 'from-sky-500 to-sky-700',
      designHighlight: 'Visor Kamera Metalik Horizontal Penuh & Sensor Suhu',
      cameraLayoutDesc: 'Visor Bar Alumunium Memanjang dengan Pil Kaca 3 Lensa Kamera AI',
      badge: 'Google Tensor G3',
    };
  }

  if (n.includes('rog phone 8')) {
    return {
      modelKey: 'rog_8_pro',
      officialColorName: 'Phantom Black',
      accentColor: '#f43f5e',
      bgGradient: 'from-zinc-900 to-neutral-950',
      designHighlight: 'Layar Matriks LED AniMe Vision (341 Mini-LED)',
      cameraLayoutDesc: 'Modul Kamera Asimetris 5 Sisi dengan Ring Merah Gimbal OIS',
      badge: 'Gaming Beast 165Hz',
    };
  }

  if (n.includes('galaxy a55')) {
    return {
      modelKey: 'galaxy_a55',
      officialColorName: 'Awesome Iceblue',
      accentColor: '#67e8f9',
      bgGradient: 'from-cyan-400 to-blue-600',
      designHighlight: 'Desain Key Island & Bingkai Metalik Kokoh',
      cameraLayoutDesc: '3 Lensa Vertikal Terapung Minimalis Khas Samsung A-Series',
      badge: 'Exynos 1480 IP67',
    };
  }

  if (n.includes('redmi note 13 pro')) {
    return {
      modelKey: 'redmi_note_13_pro_plus',
      officialColorName: 'Aurora Purple Pastel',
      accentColor: '#c084fc',
      bgGradient: 'from-purple-300 via-sky-200 to-pink-200',
      designHighlight: 'Bodi Kaca Lengkung 3D Multi-Tone Pastel & Tahan Air IP68',
      cameraLayoutDesc: 'Lensa Terbuka Tanpa Bingkai Dekorasi pada Blok Warna Pastel (200MP OIS)',
      badge: '200MP 120W HyperCharge',
    };
  }

  if (n.includes('poco x6 pro')) {
    return {
      modelKey: 'poco_x6_pro',
      officialColorName: 'POCO Racing Yellow',
      accentColor: '#eab308',
      bgGradient: 'from-amber-400 to-yellow-500',
      designHighlight: 'Bodi Kulit Vegan Kuning POCO & Visor Hitam Besar',
      cameraLayoutDesc: 'Visor Persegi Hitam Mengkilap Besar dengan Logo POCO & 4 Ring Lensa',
      badge: 'Dimensity 8300-Ultra',
    };
  }

  if (n.includes('realme 12 pro')) {
    return {
      modelKey: 'realme_12_pro_plus',
      officialColorName: 'Submarine Blue',
      accentColor: '#fbbf24',
      bgGradient: 'from-blue-900 to-indigo-950',
      designHighlight: 'Dial Arloji Mewah Swiss (Bezel Fluted Emas) & Garis Jahitan 3D',
      cameraLayoutDesc: 'Lingkaran Dial Jam Emas dengan Lensa Periskop Prisma 120x SuperZoom',
      badge: 'Periscope Telephoto 3x',
    };
  }

  if (n.includes('redmi 13')) {
    return {
      modelKey: 'redmi_13',
      officialColorName: 'Ocean Blue Shimmer',
      accentColor: '#38bdf8',
      bgGradient: 'from-cyan-500 to-blue-600',
      designHighlight: 'Bodi Belakang Kaca Kristal Berpendar Motif Riak Ombak',
      cameraLayoutDesc: 'Dual Ring Kamera Besar 108MP dengan Cincin Aksen Mengkilap',
      badge: '108MP Glass Back',
    };
  }

  if (n.includes('galaxy a05s')) {
    return {
      modelKey: 'galaxy_a05s',
      officialColorName: 'Light Green Matte',
      accentColor: '#86efac',
      bgGradient: 'from-emerald-400 to-teal-600',
      designHighlight: 'Bodi Polikarbonat Ergonomis dengan Tekstur Halus',
      cameraLayoutDesc: 'Triple Kamera Vertikal Rapi 50MP dengan Flash Samping',
      badge: 'Snapdragon 680 90Hz',
    };
  }

  if (n.includes('infinix note 40')) {
    return {
      modelKey: 'infinix_note_40',
      officialColorName: 'Titan Gold',
      accentColor: '#f59e0b',
      bgGradient: 'from-amber-300 via-orange-300 to-amber-500',
      designHighlight: 'Lampu RGB Active Halo Berpendar & Wireless MagCharge 20W',
      cameraLayoutDesc: 'Modul Persegi Emas dengan Ring Lampu Nafas Halo Interaktif',
      badge: 'Active Halo MagCharge',
    };
  }

  if (n.includes('vivo y28')) {
    return {
      modelKey: 'vivo_y28',
      officialColorName: 'Agate Green',
      accentColor: '#10b981',
      bgGradient: 'from-emerald-600 to-teal-800',
      designHighlight: 'Bodi Ramping 7.99mm dengan Baterai Raksasa 6000mAh',
      cameraLayoutDesc: 'Modul Persegi dengan Star Halo Light Rim Dinamis untuk Notifikasi',
      badge: '6000mAh Ultra Slim',
    };
  }

  // Fallback
  return {
    modelKey: 'generic',
    officialColorName: 'Titanium Graphite',
    accentColor: '#6366f1',
    bgGradient: 'from-slate-800 to-slate-950',
    designHighlight: 'Smartphone Layar Lengkung Bezelless',
    cameraLayoutDesc: 'Multi-Lens AI Camera Module',
    badge: 'Smartphone Resmi',
  };
}

// Generate exact high-definition SVG Data URL matching the exact phone physical back design
export function getPhoneSvgDataUrl(name: string): string {
  const meta = getPhoneVisualMeta(name);

  let innerSvg = '';

  switch (meta.modelKey) {
    case 's24_ultra':
      // Samsung Galaxy S24 Ultra: Boxy sharp corners, Titanium Gray, individual floating lenses
      innerSvg = `
        <defs>
          <linearGradient id="s24Body" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#475569" />
            <stop offset="50%" stop-color="#334155" />
            <stop offset="100%" stop-color="#1e293b" />
          </linearGradient>
          <linearGradient id="lensRing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#94a3b8" />
            <stop offset="100%" stop-color="#475569" />
          </linearGradient>
          <radialGradient id="lensGlass" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#0284c7" />
            <stop offset="60%" stop-color="#0f172a" />
            <stop offset="100%" stop-color="#020617" />
          </radialGradient>
        </defs>
        <!-- Background Studio -->
        <rect width="600" height="600" fill="#f8fafc" />
        <circle cx="300" cy="300" r="240" fill="#e2e8f0" opacity="0.6" />
        
        <!-- S24 Ultra Phone Body (Sharp 90-degree rectangle with subtle radius) -->
        <rect x="180" y="70" width="240" height="460" rx="6" fill="url(#s24Body)" stroke="#64748b" stroke-width="4" filter="drop-shadow(0 25px 25px rgba(0,0,0,0.25))" />
        <!-- Titanium Edge Highlight -->
        <rect x="184" y="74" width="232" height="452" rx="4" fill="none" stroke="#94a3b8" stroke-width="1.5" opacity="0.4" />

        <!-- Floating Camera Rings -->
        <!-- 1. Top Left 200MP Main Lens -->
        <circle cx="230" cy="130" r="24" fill="url(#lensRing)" stroke="#cbd5e1" stroke-width="2" />
        <circle cx="230" cy="130" r="18" fill="url(#lensGlass)" />
        <circle cx="225" cy="125" r="5" fill="#ffffff" opacity="0.4" />
        
        <!-- 2. Middle Left 12MP Ultra-wide Lens -->
        <circle cx="230" cy="190" r="24" fill="url(#lensRing)" stroke="#cbd5e1" stroke-width="2" />
        <circle cx="230" cy="190" r="18" fill="url(#lensGlass)" />
        <circle cx="225" cy="185" r="5" fill="#ffffff" opacity="0.4" />

        <!-- 3. Bottom Left 50MP Periscope 5x Lens (with rectangular prism) -->
        <circle cx="230" cy="250" r="24" fill="url(#lensRing)" stroke="#cbd5e1" stroke-width="2" />
        <circle cx="230" cy="250" r="18" fill="#0f172a" />
        <rect x="221" y="243" width="18" height="14" rx="2" fill="#0284c7" stroke="#38bdf8" stroke-width="1" />

        <!-- 4. Top Right Laser AF / Flash -->
        <circle cx="280" cy="130" r="14" fill="#1e293b" stroke="#64748b" stroke-width="1.5" />
        <circle cx="280" cy="130" r="6" fill="#fef08a" />
        
        <!-- 5. Middle Right 10MP Tele 3x Lens -->
        <circle cx="280" cy="190" r="18" fill="url(#lensRing)" stroke="#cbd5e1" stroke-width="1.5" />
        <circle cx="280" cy="190" r="13" fill="url(#lensGlass)" />
        <circle cx="277" cy="187" r="3" fill="#ffffff" opacity="0.4" />

        <!-- S-Pen Slot Indicator at bottom left -->
        <rect x="195" y="522" width="16" height="4" rx="2" fill="#94a3b8" />
        
        <!-- Samsung Logo -->
        <text x="300" y="470" font-family="sans-serif" font-size="11" font-weight="900" fill="#94a3b8" letter-spacing="4" text-anchor="middle">SAMSUNG</text>
        <text x="300" y="490" font-family="sans-serif" font-size="9" font-weight="bold" fill="#64748b" letter-spacing="2" text-anchor="middle">GALAXY S24 ULTRA</text>
      `;
      break;

    case 'iphone_15_pro_max':
      // iPhone 15 Pro Max: Rounded corners, Natural Titanium, square plateau with 3 triangular lenses
      innerSvg = `
        <defs>
          <linearGradient id="iphoneBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#9ca3af" />
            <stop offset="50%" stop-color="#6b7280" />
            <stop offset="100%" stop-color="#4b5563" />
          </linearGradient>
          <linearGradient id="plateauGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#d1d5db" stop-opacity="0.3" />
            <stop offset="100%" stop-color="#4b5563" stop-opacity="0.3" />
          </linearGradient>
        </defs>
        <rect width="600" height="600" fill="#f8fafc" />
        <circle cx="300" cy="300" r="240" fill="#f1f5f9" />
        
        <!-- Phone Body (Curved corners) -->
        <rect x="180" y="70" width="240" height="460" rx="38" fill="url(#iphoneBody)" stroke="#9ca3af" stroke-width="4" filter="drop-shadow(0 25px 25px rgba(0,0,0,0.2))" />

        <!-- Camera Island Plateau (Rounded square) -->
        <rect x="195" y="85" width="115" height="115" rx="26" fill="url(#plateauGrad)" stroke="#cbd5e1" stroke-width="2" />

        <!-- 3 Triangular Lenses -->
        <!-- Top Lens -->
        <circle cx="230" cy="118" r="20" fill="#374151" stroke="#e5e7eb" stroke-width="3" />
        <circle cx="230" cy="118" r="14" fill="#111827" />
        <circle cx="228" cy="115" r="4" fill="#38bdf8" opacity="0.6" />

        <!-- Bottom Lens -->
        <circle cx="230" cy="168" r="20" fill="#374151" stroke="#e5e7eb" stroke-width="3" />
        <circle cx="230" cy="168" r="14" fill="#111827" />
        <circle cx="228" cy="165" r="4" fill="#38bdf8" opacity="0.6" />

        <!-- Right Lens -->
        <circle cx="275" cy="143" r="20" fill="#374151" stroke="#e5e7eb" stroke-width="3" />
        <circle cx="275" cy="143" r="14" fill="#111827" />
        <circle cx="273" cy="140" r="4" fill="#38bdf8" opacity="0.6" />

        <!-- Flash & LiDAR -->
        <circle cx="275" cy="105" r="7" fill="#fef08a" stroke="#d1d5db" stroke-width="1.5" />
        <circle cx="275" cy="180" r="5" fill="#1f2937" stroke="#4b5563" stroke-width="1" />

        <!-- Apple Mirror Logo -->
        <g transform="translate(290, 280) scale(1.1)">
          <path d="M15.2 12.9c0-2.6 2.1-3.9 2.2-4-1.2-1.8-3.1-2-3.8-2.1-1.6-.2-3.1.9-3.9.9-.8 0-2.1-.9-3.4-.9-1.8 0-3.4 1-4.3 2.6-1.8 3.2-.5 8 1.3 10.6.9 1.3 1.9 2.7 3.3 2.6 1.3-.1 1.9-.9 3.5-.9 1.6 0 2 .9 3.4.9 1.4 0 2.3-1.3 3.2-2.6 1-1.5 1.4-3 1.5-3.1-.1 0-2.9-1.1-2.9-4zM12.4 4.8c.7-.9 1.2-2.1 1-3.3-1 0-2.3.7-3 1.5-.6.7-1.2 2-1 3.1 1.2.1 2.3-.5 3-.1.3z" fill="#e5e7eb" opacity="0.85" />
        </g>
        <text x="300" y="480" font-family="sans-serif" font-size="9" font-weight="bold" fill="#d1d5db" letter-spacing="2" text-anchor="middle">IPHONE 15 PRO MAX</text>
      `;
      break;

    case 'pixel_8_pro':
      // Google Pixel 8 Pro: Bay Blue, iconic horizontal metallic camera bar
      innerSvg = `
        <defs>
          <linearGradient id="pixelBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#38bdf8" />
            <stop offset="100%" stop-color="#0284c7" />
          </linearGradient>
          <linearGradient id="visorBar" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#cbd5e1" />
            <stop offset="50%" stop-color="#f8fafc" />
            <stop offset="100%" stop-color="#94a3b8" />
          </linearGradient>
        </defs>
        <rect width="600" height="600" fill="#f8fafc" />
        <circle cx="300" cy="300" r="240" fill="#e0f2fe" />

        <!-- Phone Body -->
        <rect x="180" y="70" width="240" height="460" rx="36" fill="url(#pixelBody)" stroke="#0ea5e9" stroke-width="3" filter="drop-shadow(0 25px 25px rgba(2,132,199,0.3))" />

        <!-- Iconic Camera Visor (spans full width of phone) -->
        <rect x="175" y="120" width="250" height="60" rx="14" fill="url(#visorBar)" stroke="#94a3b8" stroke-width="2" filter="drop-shadow(0 8px 12px rgba(0,0,0,0.15))" />

        <!-- Black Pill with Triple Lenses -->
        <rect x="195" y="132" width="145" height="36" rx="18" fill="#0f172a" />
        <!-- 3 Lenses inside Pill -->
        <circle cx="220" cy="150" r="12" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5" />
        <circle cx="255" cy="150" r="12" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5" />
        <circle cx="300" cy="150" r="12" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5" />

        <!-- Flash & Thermometer Sensor on the right of visor -->
        <circle cx="380" cy="142" r="6" fill="#fef08a" />
        <circle cx="380" cy="158" r="5" fill="#334155" stroke="#64748b" stroke-width="1" />

        <!-- Google 'G' Logo -->
        <circle cx="300" cy="320" r="16" fill="#ffffff" opacity="0.9" />
        <text x="300" y="326" font-family="sans-serif" font-size="18" font-weight="black" fill="#0284c7" text-anchor="middle">G</text>
        <text x="300" y="475" font-family="sans-serif" font-size="9" font-weight="bold" fill="#ffffff" letter-spacing="2" text-anchor="middle">PIXEL 8 PRO</text>
      `;
      break;

    case 'rog_8_pro':
      // ASUS ROG Phone 8 Pro: Cyberpunk black, off-center camera, AniMe Vision LED matrix
      innerSvg = `
        <defs>
          <linearGradient id="rogBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#18181b" />
            <stop offset="50%" stop-color="#09090b" />
            <stop offset="100%" stop-color="#18181b" />
          </linearGradient>
        </defs>
        <rect width="600" height="600" fill="#f8fafc" />
        <circle cx="300" cy="300" r="240" fill="#f43f5e" opacity="0.1" />

        <!-- Phone Body -->
        <rect x="180" y="70" width="240" height="460" rx="28" fill="url(#rogBody)" stroke="#e11d48" stroke-width="2.5" filter="drop-shadow(0 25px 25px rgba(225,29,72,0.25))" />
        
        <!-- Cyberpunk Slash Lines -->
        <line x1="180" y1="260" x2="420" y2="290" stroke="#27272a" stroke-width="3" />
        <line x1="280" y1="70" x2="420" y2="160" stroke="#3f3f46" stroke-width="1.5" stroke-dasharray="4,4" />

        <!-- Off-Center 5-Sided Camera Island -->
        <polygon points="195,90 320,90 335,140 280,185 195,170" fill="#27272a" stroke="#e11d48" stroke-width="2" />
        <!-- Main Lens with Red Gimbal Ring -->
        <circle cx="230" cy="130" r="22" fill="#09090b" stroke="#f43f5e" stroke-width="2.5" />
        <circle cx="230" cy="130" r="14" fill="#0369a1" />
        <!-- Secondary Lenses -->
        <circle cx="280" cy="120" r="12" fill="#09090b" stroke="#71717a" stroke-width="1.5" />
        <circle cx="270" cy="155" r="10" fill="#09090b" stroke="#71717a" stroke-width="1.5" />

        <!-- AniMe Vision Matrix (Grid of white LED dots at bottom) -->
        <g fill="#ffffff" opacity="0.85">
          <circle cx="260" cy="380" r="2" /><circle cx="270" cy="380" r="2" /><circle cx="280" cy="380" r="2" /><circle cx="290" cy="380" r="2" /><circle cx="300" cy="380" r="2" /><circle cx="310" cy="380" r="2" /><circle cx="320" cy="380" r="2" />
          <circle cx="260" cy="390" r="2" /><circle cx="280" cy="390" r="3" fill="#f43f5e" /><circle cx="300" cy="390" r="3" fill="#f43f5e" /><circle cx="320" cy="390" r="2" />
          <circle cx="270" cy="400" r="3" fill="#f43f5e" /><circle cx="290" cy="400" r="3" fill="#f43f5e" /><circle cx="310" cy="400" r="3" fill="#f43f5e" />
          <circle cx="280" cy="410" r="2" /><circle cx="290" cy="410" r="3" fill="#f43f5e" /><circle cx="300" cy="410" r="2" />
          <circle cx="290" cy="420" r="2" />
        </g>

        <text x="300" y="460" font-family="monospace" font-size="10" font-weight="bold" fill="#f43f5e" letter-spacing="3" text-anchor="middle">REPUBLIC OF GAMERS</text>
        <text x="300" y="475" font-family="sans-serif" font-size="8" fill="#71717a" letter-spacing="1" text-anchor="middle">ROG PHONE 8 PRO</text>
      `;
      break;

    case 'poco_x6_pro':
      // POCO X6 Pro: Signature Racing Yellow, giant black camera visor, POCO logo
      innerSvg = `
        <defs>
          <linearGradient id="pocoBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#facc15" />
            <stop offset="100%" stop-color="#eab308" />
          </linearGradient>
        </defs>
        <rect width="600" height="600" fill="#f8fafc" />
        <circle cx="300" cy="300" r="240" fill="#fef08a" opacity="0.6" />

        <!-- Phone Body (Yellow Leather texture) -->
        <rect x="180" y="70" width="240" height="460" rx="30" fill="url(#pocoBody)" stroke="#ca8a04" stroke-width="3" filter="drop-shadow(0 25px 25px rgba(202,138,4,0.3))" />
        <!-- Subtle racing stripe down center -->
        <rect x="296" y="210" width="8" height="320" fill="#ca8a04" opacity="0.25" />

        <!-- Big Bold Black Visor across the top third -->
        <rect x="185" y="80" width="230" height="125" rx="16" fill="#09090b" stroke="#27272a" stroke-width="2" />

        <!-- 4 Circular Rings on Left of Visor -->
        <circle cx="225" cy="115" r="18" fill="#18181b" stroke="#eab308" stroke-width="1.5" />
        <circle cx="225" cy="115" r="11" fill="#0284c7" />
        <circle cx="270" cy="115" r="18" fill="#18181b" stroke="#eab308" stroke-width="1.5" />
        <circle cx="270" cy="115" r="11" fill="#0284c7" />

        <circle cx="225" cy="160" r="18" fill="#18181b" stroke="#71717a" stroke-width="1" />
        <circle cx="270" cy="160" r="18" fill="#18181b" stroke="#fef08a" stroke-width="1" />
        <circle cx="270" cy="160" r="6" fill="#fef08a" /> <!-- Flash -->

        <!-- Big Yellow POCO Logo on Right of Visor -->
        <text x="355" y="135" font-family="sans-serif" font-size="22" font-weight="900" fill="#facc15" letter-spacing="1" text-anchor="middle">POCO</text>
        <text x="355" y="155" font-family="sans-serif" font-size="9" font-weight="bold" fill="#a1a1aa" text-anchor="middle">64MP OIS</text>

        <text x="300" y="480" font-family="sans-serif" font-size="10" font-weight="black" fill="#854d0e" letter-spacing="2" text-anchor="middle">POCO X6 PRO 5G</text>
      `;
      break;

    case 'realme_12_pro_plus':
      // Realme 12 Pro+: Luxury Swiss watch circular dial, fluted golden bezel, center zipper seam
      innerSvg = `
        <defs>
          <linearGradient id="realmeBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#1e3a8a" />
            <stop offset="100%" stop-color="#172554" />
          </linearGradient>
          <radialGradient id="sunburst" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#1e40af" />
            <stop offset="100%" stop-color="#0f172a" />
          </radialGradient>
        </defs>
        <rect width="600" height="600" fill="#f8fafc" />
        <circle cx="300" cy="300" r="240" fill="#dbeafe" opacity="0.6" />

        <!-- Phone Body (Submarine Blue Leather) -->
        <rect x="180" y="70" width="240" height="460" rx="34" fill="url(#realmeBody)" stroke="#1d4ed8" stroke-width="3" filter="drop-shadow(0 25px 25px rgba(23,37,84,0.4))" />

        <!-- Golden 3D Zipper Seam dividing the center -->
        <line x1="300" y1="70" x2="300" y2="530" stroke="#f59e0b" stroke-width="3" stroke-dasharray="2,3" />

        <!-- Luxury Chronograph Watch Dial Camera Module -->
        <circle cx="300" cy="180" r="65" fill="#f59e0b" stroke="#fbbf24" stroke-width="4" filter="drop-shadow(0 10px 15px rgba(0,0,0,0.3))" />
        <!-- Fluted Bezel teeth ring -->
        <circle cx="300" cy="180" r="60" fill="none" stroke="#d97706" stroke-width="3" stroke-dasharray="3,3" />
        <!-- Dial Glass Face -->
        <circle cx="300" cy="180" r="54" fill="url(#sunburst)" stroke="#1e293b" stroke-width="2" />

        <!-- Periscope Telephoto Prism (Rectangular cut) at bottom of dial -->
        <rect x="286" y="196" width="28" height="20" rx="4" fill="#0284c7" stroke="#38bdf8" stroke-width="1.5" />
        <!-- Top 2 Camera Lenses -->
        <circle cx="275" cy="155" r="16" fill="#09090b" stroke="#f59e0b" stroke-width="1.5" />
        <circle cx="275" cy="155" r="9" fill="#0369a1" />
        <circle cx="325" cy="155" r="16" fill="#09090b" stroke="#f59e0b" stroke-width="1.5" />
        <circle cx="325" cy="155" r="9" fill="#0369a1" />

        <text x="300" y="186" font-family="sans-serif" font-size="8" font-weight="bold" fill="#fbbf24" text-anchor="middle">120X</text>

        <!-- realme logo -->
        <text x="300" y="470" font-family="sans-serif" font-size="12" font-weight="black" fill="#fbbf24" letter-spacing="2" text-anchor="middle">realme</text>
        <text x="300" y="488" font-family="sans-serif" font-size="8" font-weight="bold" fill="#93c5fd" letter-spacing="1" text-anchor="middle">12 PRO+ 5G</text>
      `;
      break;

    case 'galaxy_a55':
      // Samsung Galaxy A55: Awesome Iceblue, Key Island ridge, triple floating vertical cameras
      innerSvg = `
        <defs>
          <linearGradient id="a55Body" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#bae6fd" />
            <stop offset="100%" stop-color="#7dd3fc" />
          </linearGradient>
        </defs>
        <rect width="600" height="600" fill="#f8fafc" />
        <circle cx="300" cy="300" r="240" fill="#e0f2fe" />

        <!-- Key Island Contour on Right Edge -->
        <path d="M 420 170 Q 428 175 428 220 Q 428 265 420 270 Z" fill="#38bdf8" />

        <!-- Phone Body -->
        <rect x="180" y="70" width="240" height="460" rx="32" fill="url(#a55Body)" stroke="#38bdf8" stroke-width="3" filter="drop-shadow(0 20px 20px rgba(56,189,248,0.25))" />

        <!-- 3 Vertical Floating Cameras -->
        <circle cx="230" cy="130" r="20" fill="#e0f2fe" stroke="#0284c7" stroke-width="3" />
        <circle cx="230" cy="130" r="13" fill="#0f172a" />
        <circle cx="227" cy="127" r="4" fill="#38bdf8" />

        <circle cx="230" cy="185" r="20" fill="#e0f2fe" stroke="#0284c7" stroke-width="3" />
        <circle cx="230" cy="185" r="13" fill="#0f172a" />
        <circle cx="227" cy="182" r="4" fill="#38bdf8" />

        <circle cx="230" cy="240" r="18" fill="#e0f2fe" stroke="#0284c7" stroke-width="3" />
        <circle cx="230" cy="240" r="11" fill="#0f172a" />

        <!-- LED Flash -->
        <circle cx="275" cy="130" r="7" fill="#fef08a" stroke="#bae6fd" stroke-width="1.5" />

        <text x="300" y="470" font-family="sans-serif" font-size="11" font-weight="900" fill="#0369a1" letter-spacing="4" text-anchor="middle">SAMSUNG</text>
        <text x="300" y="488" font-family="sans-serif" font-size="8" font-weight="bold" fill="#0284c7" letter-spacing="2" text-anchor="middle">GALAXY A55 5G</text>
      `;
      break;

    case 'redmi_note_13_pro_plus':
      // Redmi Note 13 Pro+: Curved 3D back with tri-tone pastel blocks
      innerSvg = `
        <defs>
          <linearGradient id="redmi13p" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#e9d5ff" />
            <stop offset="50%" stop-color="#c4b5fd" />
            <stop offset="100%" stop-color="#ddd6fe" />
          </linearGradient>
        </defs>
        <rect width="600" height="600" fill="#f8fafc" />
        <circle cx="300" cy="300" r="240" fill="#f3e8ff" />

        <!-- Curved Body -->
        <rect x="180" y="70" width="240" height="460" rx="36" fill="url(#redmi13p)" stroke="#a855f7" stroke-width="2.5" filter="drop-shadow(0 20px 20px rgba(168,85,247,0.25))" />
        <!-- Pastel Block Divisions -->
        <rect x="180" y="70" width="130" height="150" fill="#fbcfe8" opacity="0.6" rx="30" />
        <rect x="310" y="70" width="110" height="90" fill="#ccfbf1" opacity="0.6" rx="20" />

        <!-- 2 Large Floating Ring Lenses -->
        <circle cx="235" cy="130" r="24" fill="#581c87" stroke="#ffffff" stroke-width="3" />
        <circle cx="235" cy="130" r="16" fill="#0f172a" />
        <circle cx="230" cy="125" r="5" fill="#38bdf8" />

        <circle cx="235" cy="195" r="24" fill="#581c87" stroke="#ffffff" stroke-width="3" />
        <circle cx="235" cy="195" r="16" fill="#0f172a" />

        <!-- 200MP Badge -->
        <text x="350" y="125" font-family="sans-serif" font-size="12" font-weight="900" fill="#6b21a8">200MP</text>
        <text x="350" y="140" font-family="sans-serif" font-size="9" font-weight="bold" fill="#7e22ce">OIS</text>

        <text x="300" y="470" font-family="sans-serif" font-size="12" font-weight="black" fill="#581c87" letter-spacing="2" text-anchor="middle">Redmi</text>
        <text x="300" y="488" font-family="sans-serif" font-size="8" font-weight="bold" fill="#7e22ce" letter-spacing="1" text-anchor="middle">NOTE 13 PRO+ 5G</text>
      `;
      break;

    case 'infinix_note_40':
      // Infinix Note 40: Titan Gold, Active Halo pulsing LED ring
      innerSvg = `
        <defs>
          <linearGradient id="infinixBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fef08a" />
            <stop offset="50%" stop-color="#fde047" />
            <stop offset="100%" stop-color="#ca8a04" />
          </linearGradient>
        </defs>
        <rect width="600" height="600" fill="#f8fafc" />
        <circle cx="300" cy="300" r="240" fill="#fef9c3" />

        <!-- Phone Body -->
        <rect x="180" y="70" width="240" height="460" rx="30" fill="url(#infinixBody)" stroke="#ca8a04" stroke-width="3" filter="drop-shadow(0 20px 20px rgba(202,138,4,0.3))" />

        <!-- Big Rectangular Gold Camera Island -->
        <rect x="195" y="85" width="210" height="120" rx="16" fill="#eab308" stroke="#ca8a04" stroke-width="2" />

        <!-- Active Halo Glowing Ring (Right side of island) -->
        <circle cx="355" cy="145" r="26" fill="#854d0e" stroke="#38bdf8" stroke-width="4" filter="drop-shadow(0 0 8px #38bdf8)" />
        <circle cx="355" cy="145" r="16" fill="#0f172a" />
        <circle cx="355" cy="145" r="8" fill="#fef08a" />

        <!-- 2 Large Camera Rings on Left -->
        <circle cx="240" cy="125" r="20" fill="#1e293b" stroke="#fef08a" stroke-width="2.5" />
        <circle cx="240" cy="125" r="12" fill="#0284c7" />

        <circle cx="240" cy="170" r="18" fill="#1e293b" stroke="#fef08a" stroke-width="2.5" />
        <circle cx="240" cy="170" r="10" fill="#0284c7" />

        <text x="300" y="470" font-family="sans-serif" font-size="12" font-weight="900" fill="#854d0e" letter-spacing="3" text-anchor="middle">Infinix</text>
        <text x="300" y="488" font-family="sans-serif" font-size="8" font-weight="bold" fill="#713f12" letter-spacing="1" text-anchor="middle">NOTE 40 ACTIVE HALO</text>
      `;
      break;

    case 'vivo_y28':
      // Vivo Y28: Agate Green, Star Halo square module
      innerSvg = `
        <defs>
          <linearGradient id="vivoBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#34d399" />
            <stop offset="100%" stop-color="#059669" />
          </linearGradient>
        </defs>
        <rect width="600" height="600" fill="#f8fafc" />
        <circle cx="300" cy="300" r="240" fill="#d1fae5" />

        <!-- Phone Body (Ultra-Slim 7.99mm feel) -->
        <rect x="180" y="70" width="240" height="460" rx="32" fill="url(#vivoBody)" stroke="#059669" stroke-width="3" filter="drop-shadow(0 20px 20px rgba(5,150,105,0.3))" />

        <!-- Star Halo Square Camera Module -->
        <rect x="195" y="85" width="115" height="115" rx="22" fill="#064e3b" stroke="#a7f3d0" stroke-width="2.5" />

        <!-- 2 Lenses with Star Halo Ring -->
        <circle cx="252" cy="118" r="18" fill="#022c22" stroke="#6ee7b7" stroke-width="2" />
        <circle cx="252" cy="118" r="10" fill="#0284c7" />

        <circle cx="252" cy="165" r="18" fill="#022c22" stroke="#6ee7b7" stroke-width="2" />
        <circle cx="252" cy="165" r="10" fill="#0284c7" />

        <text x="300" y="470" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ffffff" letter-spacing="2" text-anchor="middle">vivo</text>
        <text x="300" y="488" font-family="sans-serif" font-size="8" font-weight="bold" fill="#a7f3d0" letter-spacing="1" text-anchor="middle">Y28 STAR HALO</text>
      `;
      break;

    case 'redmi_13':
      // Xiaomi Redmi 13: Shimmering Ocean Blue crystal glass
      innerSvg = `
        <defs>
          <linearGradient id="r13Body" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#7dd3fc" />
            <stop offset="50%" stop-color="#38bdf8" />
            <stop offset="100%" stop-color="#0284c7" />
          </linearGradient>
        </defs>
        <rect width="600" height="600" fill="#f8fafc" />
        <circle cx="300" cy="300" r="240" fill="#e0f2fe" />

        <rect x="180" y="70" width="240" height="460" rx="28" fill="url(#r13Body)" stroke="#0284c7" stroke-width="3" filter="drop-shadow(0 20px 20px rgba(2,132,199,0.3))" />
        <!-- Ocean crystal light ripple reflection lines -->
        <path d="M 180 300 Q 300 340 420 300 Q 300 260 180 300 Z" fill="#ffffff" opacity="0.2" />

        <!-- Dual 108MP Rings -->
        <circle cx="230" cy="130" r="22" fill="#0f172a" stroke="#ffffff" stroke-width="3" />
        <circle cx="230" cy="130" r="14" fill="#0369a1" />

        <circle cx="230" cy="190" r="22" fill="#0f172a" stroke="#ffffff" stroke-width="3" />
        <circle cx="230" cy="190" r="14" fill="#0369a1" />

        <circle cx="280" cy="130" r="10" fill="#fef08a" stroke="#ffffff" stroke-width="2" />

        <text x="300" y="470" font-family="sans-serif" font-size="12" font-weight="black" fill="#ffffff" letter-spacing="2" text-anchor="middle">Redmi</text>
        <text x="300" y="488" font-family="sans-serif" font-size="8" font-weight="bold" fill="#e0f2fe" letter-spacing="1" text-anchor="middle">13 108MP GLASS</text>
      `;
      break;

    case 'galaxy_a05s':
    default:
      // Samsung Galaxy A05s: Clean Light Green matte finish
      innerSvg = `
        <defs>
          <linearGradient id="a05Body" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#a7f3d0" />
            <stop offset="100%" stop-color="#6ee7b7" />
          </linearGradient>
        </defs>
        <rect width="600" height="600" fill="#f8fafc" />
        <circle cx="300" cy="300" r="240" fill="#ecfdf5" />

        <rect x="180" y="70" width="240" height="460" rx="30" fill="url(#a05Body)" stroke="#10b981" stroke-width="3" filter="drop-shadow(0 20px 20px rgba(16,185,129,0.25))" />

        <!-- 3 Vertical Floating Camera Cutouts -->
        <circle cx="225" cy="130" r="18" fill="#064e3b" stroke="#ffffff" stroke-width="2.5" />
        <circle cx="225" cy="130" r="10" fill="#0284c7" />

        <circle cx="225" cy="180" r="18" fill="#064e3b" stroke="#ffffff" stroke-width="2.5" />
        <circle cx="225" cy="180" r="10" fill="#0284c7" />

        <circle cx="225" cy="230" r="16" fill="#064e3b" stroke="#ffffff" stroke-width="2.5" />

        <circle cx="265" cy="130" r="6" fill="#fef08a" stroke="#ffffff" stroke-width="1.5" />

        <text x="300" y="470" font-family="sans-serif" font-size="11" font-weight="900" fill="#064e3b" letter-spacing="4" text-anchor="middle">SAMSUNG</text>
        <text x="300" y="488" font-family="sans-serif" font-size="8" font-weight="bold" fill="#047857" letter-spacing="2" text-anchor="middle">GALAXY A05s</text>
      `;
      break;
  }

  const fullSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">${innerSvg}</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(fullSvg.trim())}`;
}
