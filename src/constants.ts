import { Plant, Task, Space, Tip } from './types';

export const PLANTS: Plant[] = [
  {
    id: '1',
    name: 'Fiddle Leaf Fig',
    scientificName: 'Ficus lyrata',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDU4cVsoFk_q5wvRQ4Y7rQiGtb32SYYudCYosvcZ9q6nTBvPD8sosir7qTbvxggt6M5uc9bg_kr1gqc3Z-6e24LzamaQENDZrJzekyD6SjtCzBllPNOxg1FhcPgKDd0KdeqMH3uXWHE40BvGxBwp32hHtSrT3GWysiTtPjKJ-j-3bzOyYUAXNfzx_ACffUcf4hw9YfP4L4xIGvJTJdwvskqCpVYOBoQS-48cD9j-l7uOmA43Fw0H5h2KEoeOm_HsKJHXx544OLgYOY',
    description: 'Lush fiddle leaf fig plant with large glossy violin-shaped leaves.',
    vitality: 92,
    healthStatus: 'Healthy',
    light: 'Bright Light',
    watering: '7 Days',
    temp: '18-27°C',
    habitat: 'Indoor',
    tags: ['Trending']
  },
  {
    id: '2',
    name: 'Calathea Orbifolia',
    scientificName: 'Goeppertia orbifolia',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2psnNdfR1i4WJYgWrdNOP8ODaTsnCiHxSfoRuXZfVyvheNaZDjphy0BrFtTmJq_dDCDxHtgDT83DK87OMZmiESzAPn42FpGjIEBIFeOhyEsv3F72Zc1F6wrCr4tHA7n-lnNKZH6MsRYT_2qAGNAYVT10Cgkkg__4yxIW89MyE7G3Wwf_TJ6Ea8yRQyb9-0yK6-iu4x-cW_lAhS_uTfqxitsbNaDQHvtKCRtpcHY9FQuh_Dbv1mKhXCLSiDyF-kcef8muGB_25mrk',
    description: 'Silver and green pinstripe patterns.',
    vitality: 60,
    healthStatus: 'Needs Attention',
    light: 'Partial Sun',
    watering: '7 Days',
    temp: '18-27°C',
    habitat: 'Indoor',
    tags: ['Rare']
  },
  {
    id: '3',
    name: 'Bird of Paradise',
    scientificName: 'Strelitzia reginae',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiBDE521R6RoHnKKv2KgOVwiTYzcuewJLzXbL54eaI_b2vVXGS6TZU2n1W0M8joslHR4pvop4Tguhh3tjGU6g_N2pIabmOFSwIfz5Xu2HsIfHOwoZP64WRImLUk4fxAZOCoAa5Ye-M9ntwRXT1iiDWQXAGGnYGrbmqE1fTnLt9q6jhePw7AIo2AN5vbU3R_PyhnF6YCIrUmfo9Jl_ru5aj3CinGgFmpyr4qi-FpiQRHn1w1zSKNfvJyTjNXfOHevX_dJ3kL7YCbQQ',
    description: 'Large sculptural green leaves.',
    vitality: 85,
    healthStatus: 'Healthy',
    light: 'Bright Light',
    watering: '5 Days',
    temp: '20-30°C',
    habitat: 'Indoor'
  },
  {
    id: '4',
    name: 'Monstera Deliciosa',
    scientificName: 'Monstera deliciosa',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLw4eGKh4SOIxcNNBI2HDMYuO4c2vBBmCqpo864EmEDD3i34wO6iy2RMPpV_PiSWvo0_lB_hs7NcnqmAeHzjXQQ_Ztv4D1j9ChrEevRc07HPGITZmoaEEzsoW_I-7qbmCENfzQvia4xXMrhwKfYNJygL8Jh690PDDaAt9KPAluvnswz5_gb04H2na9xCA32YloTn4DVJo382sxyhxCQis_HC46g5WEW6RhY5QMB0BF3yykEKFJIXu2Y_ae3eom9woPWvTDgBVNJ-Q',
    description: 'Iconic Swiss cheese fenestrations.',
    vitality: 95,
    healthStatus: 'Healthy',
    light: 'Partial Sun',
    watering: '2 Days',
    temp: '18-27°C',
    habitat: 'Indoor'
  },
  {
    id: '5',
    name: 'Sansevieria',
    scientificName: 'Sansevieria trifasciata',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJ9lPFkXpyEQexDHt8qiEb-hynk3YSNZWMjVD9bTgoOaKerQkgiGhr5XTm5eiEW5_r0pt6aQrvwCLRuN2XPYdCXIUyhWYTTrWdPzk4zJQI4P93dfdfUXeuoqRazxpvTAh_GweVy7c93a9qfosYc-ed58Ztn8tBj4cAIoOdxj5d0r7wM5qUP6-HvS2ZJJF2sZuMkgwblCR0sqNd2NdV2R7dx55EWTkZc_oYkjLCZFx-P5Ft_S9t2_MIa2z5EVDPnY0oucL2ChVg4d8',
    description: 'Sleek vertical Snake Plant leaves.',
    vitality: 85,
    healthStatus: 'Healthy',
    light: 'Low Light',
    watering: '14 Days',
    temp: '15-25°C',
    habitat: 'Indoor'
  }
];

export const TASKS: Task[] = [
  {
    id: 't1',
    type: 'water',
    title: 'Water 3 plants',
    subtitle: 'Fiddle Leaf, Snake Plant, Ivy',
    completed: false
  },
  {
    id: 't2',
    type: 'mist',
    title: 'Mist 1 plant',
    subtitle: 'Calathea Ornata',
    completed: false
  }
];

export const SPACES: Space[] = [
  {
    id: 's1',
    name: 'Living Room',
    plantCount: 12,
    status: 'Lush',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaHoKr8QpphbmHuSew2xP4CCTHQjtjpSWzVv2CxCNe7fhg3MRP2b3PKO_tEkbLeJvxs4Ukf3lJ4gkS_1m38Z-JtETt4IQ7HTv1NCdl3bL2ViXIqYVPFP3u3sTN5I2tI1Thqs6LmWoVFeTabX_cjNrD1ZArS690_UCV-ioXG_EpSyTOPV-qkSRnu4W0TJ13jAEcf55qCaiLCHOqsh4g_SDg8_GD2YBF5bIuWCD_XHrKhU0g0fDmmQfgXLyaM5QcbFbM7x_3kN1x6Og',
    alert: 'Low Humidity Alert'
  },
  {
    id: 's2',
    name: 'Backyard',
    plantCount: 34,
    status: 'Stable',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTSdNZIbcU6u2mOHqdEz2hkdH8lYNpKUdxG6IbPGOvKH69b8d1bkn0b_vShwa6Wak6nu7HXdIMTZY_O4wXi-iWYdAWCggIiso6oUTpfn_1ADfoaSVbIxCc8QDdpVQbMC6KbpAHFKQKeyzWzVmoyL2ZbwQDaKIJP8XRlxztkDIw0L-1niJ4FTgiljRB3wdP_UBPKRomkGJh37dQ6WAmW-4SAqS1dukm5bGsJFEQrjKX3GjSU09_Acl-LBh7wT-aykkLasJGQM0ECy0'
  },
  {
    id: 's3',
    name: 'Office',
    plantCount: 5,
    status: 'Dry Soil',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1RaQrNSZsivrWu7DSWWWhf1liqp0OAoQxnV2TWVxrPv7IPtAFV1i545oAMgaRzO61SV76ETbjV1vh1XKdN366idV3-Ik7cyOKMihh1cpoxfO2iicG5OjKJG2kNHHCZE3DldkQpo8HseVJYlIEZqZfgnoc-xGh525Q6fI0hxAeeEHZpAz_cDIoA6iqNyzUE_BnyeEim54PL2b_NQZiCgrAEe82nLsyMv0LbK8-bAhq_rkD_f4VgZk7zeZQQrXBnOOUx-f8XQsz4H4',
    alert: 'Need watering soon'
  }
];

export const TIPS: Tip[] = [
  {
    id: 'tip1',
    title: 'Winter Lighting',
    content: 'Move your succulents closer to south-facing windows as daylight hours decrease.',
    icon: 'Sun',
    color: 'bg-tertiary-fixed'
  },
  {
    id: 'tip2',
    title: 'Pest Control',
    content: 'Wipe down monstera leaves with a damp cloth once a week to prevent dust and spider mites.',
    icon: 'Leaf',
    color: 'bg-primary-fixed'
  }
];
