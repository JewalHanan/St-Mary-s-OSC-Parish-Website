// Shared data store — uses API routes backed by Vercel Blob for cross-device persistence.
// All get* functions are async and fetch from /api/data/<collection>.
// All save* functions are async and PUT to /api/data/<collection>.

// ──── Interfaces (unchanged) ────────────────────────────────────

export interface SliderImage {
    id: number;
    image: string;
    title: string;
    caption: string;
}

export interface ChurchEvent {
    id: number;
    title: string;
    date: string;
    time: string;
    color: string;
    type: string;
    description?: string;
    location?: string;
    icon?: string;
}

export interface PrayerRequest {
    id: number;
    requester_name: string;
    target_name: string;
    category: string;
    date: string;
    status: string;
    email?: string;
    phone?: string;
    age?: number;
    reason?: string;
    notes?: string;
}

export interface BookSection {
    id: number;
    title: string;
    image?: string;
    books: BookItem[];
}

export interface BookItem {
    id: number;
    title: string;
    language: string;
    fileUrl: string;
    image?: string;
}

export interface ParishMember {
    id: number;
    name: string;
    role: string;
    area: string;
    email: string;
    phone: string;
    image?: string;
}

export interface SpecialDay {
    id: number;
    title: string;
    date: string;
    description: string;
    is_countdown_target: boolean;
    type: 'feast' | 'fast' | 'commemoration' | 'regular';
    image?: string;
}

export interface OrgBearer {
    id: number;
    name: string;
    position: string;
    contact: string;
    image?: string;
}

export interface Organisation {
    id: number;
    name: string;
    logo?: string;
    bearers: OrgBearer[];
}

export interface EventBannerImage {
    id: number;
    image: string;
    caption: string;
    order: number;
}

export interface SiteSettings {
    tickerOverride?: string;
    contact: {
        phone: string;
        email: string;
        addressLine1: string;
        addressLine2: string;
        serviceTimings: { label: string; time: string }[];
    };
    social: {
        facebook: string;
        instagram: string;
        whatsapp: string;
        youtube: string;
    };
}

export interface HistoryImage {
    id: number;
    url: string;
    caption?: string;
}

export interface ParishHistory {
    content: string;
    images?: HistoryImage[];
}

export interface GalleryImage {
    id: number;
    url: string;
    caption?: string;
}

export interface GallerySection {
    id: number;
    name: string;
    images: GalleryImage[];
}

export interface Publication {
    id: number;
    name: string;
    description: string;
    fileUrl: string;
    fileName?: string;
}

// ──── Default data (used as fallback when blob store is empty) ───

const DEFAULT_SITE_SETTINGS: SiteSettings = {
    tickerOverride: '',
    contact: {
        phone: '+91 7034756977',
        email: 'info@stmosc.org',
        addressLine1: 'Muthupilakkadu, Kollam',
        addressLine2: 'Kerala — 691 578, India',
        serviceTimings: [
            { label: 'Sunday Holy Qurbono', time: '8:30 AM' },
            { label: 'Wednesday Evening Prayer', time: '6:00 PM' },
            { label: 'Saturday Vespers', time: '5:30 PM' }
        ]
    },
    social: {
        facebook: 'https://facebook.com/',
        instagram: 'https://instagram.com/',
        whatsapp: 'https://wa.me/917034756977',
        youtube: 'https://youtube.com/'
    }
};

const DEFAULT_PARISH_HISTORY: ParishHistory = {
    content: `<p>Welcome to our parish history. This section is currently being updated.</p>
<p>Our church has a rich history spanning many years, established by the grace of God and the dedication of our founding fathers.</p>`,
    images: [],
};

const DEFAULT_SLIDER_IMAGES: SliderImage[] = [
    { id: 1, image: 'https://images.unsplash.com/photo-1548625361-ecaa842cebb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', title: 'Sacred Heritage', caption: 'Experience the beauty of Malankara Orthodox traditions.' },
    { id: 2, image: 'https://images.unsplash.com/photo-1514867175822-25807af1d0e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', title: 'Holy Qurbono', caption: 'Join us every Sunday for the Divine Liturgy.' },
    { id: 3, image: 'https://images.unsplash.com/photo-1438283173091-5dbf5c5a3206?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', title: 'Community Fellowship', caption: 'Growing together in faith and love.' },
];

const DEFAULT_EVENTS: ChurchEvent[] = [
    { id: 1, title: 'Easter Sunday Service', date: '2026-04-12', time: '07:30 AM', color: '#F5A623', type: 'feast' },
    { id: 2, title: 'Youth Movement Meeting', date: '2026-05-03', time: '11:00 AM', color: '#1E90FF', type: 'meeting' },
];

const DEFAULT_PRAYER_REQUESTS: PrayerRequest[] = [
    { id: 1, requester_name: 'Abraham Mathew', target_name: 'Sara Mathew', category: 'SICK', date: '2026-03-10', status: 'PENDING' },
    { id: 2, requester_name: 'Reena Varghese', target_name: 'John Varghese', category: 'BIRTHDAY', date: '2026-03-15', status: 'COMPLETED' },
    { id: 3, requester_name: 'George Kutty', target_name: 'Annamma George', category: 'BLESSINGS', date: '2026-03-12', status: 'PENDING' },
];

const DEFAULT_BOOK_SECTIONS: BookSection[] = [
    {
        id: 1, title: 'Koodashas', books: [
            { id: 101, title: 'Koodasha Kramam (Malayalam)', language: 'Malayalam', fileUrl: '#' },
            { id: 102, title: 'Koodasha Order (English)', language: 'English', fileUrl: '#' },
        ]
    },
    {
        id: 2, title: 'Holy Qurbono', books: [
            { id: 201, title: 'Qurbono Kramam (Malayalam)', language: 'Malayalam', fileUrl: '#' },
            { id: 202, title: 'Qurbana Order (English)', language: 'English', fileUrl: '#' },
            { id: 203, title: 'Qurobo (Syriac)', language: 'Syriac', fileUrl: '#' },
        ]
    },
    {
        id: 3, title: 'Marriage', books: [
            { id: 301, title: 'Betrothal & Marriage (Malayalam)', language: 'Malayalam', fileUrl: '#' },
        ]
    },
    {
        id: 4, title: 'Holy Week', books: [
            { id: 401, title: 'Pesaha Service (Malayalam)', language: 'Malayalam', fileUrl: '#' },
            { id: 402, title: 'Good Friday (English)', language: 'English', fileUrl: '#' },
        ]
    },
    {
        id: 5, title: 'Baptism', books: [
            { id: 501, title: 'Baptism Kramam (Malayalam)', language: 'Malayalam', fileUrl: '#' },
        ]
    },
    {
        id: 6, title: 'Funeral', books: [
            { id: 601, title: 'Funeral Service (Malayalam)', language: 'Malayalam', fileUrl: '#' },
        ]
    },
    {
        id: 7, title: 'Daily Prayers', books: [
            { id: 701, title: 'Morning Prayer (Malayalam)', language: 'Malayalam', fileUrl: '#' },
            { id: 702, title: 'Evening Prayer (Malayalam)', language: 'Malayalam', fileUrl: '#' },
            { id: 703, title: 'Night Prayer (English)', language: 'English', fileUrl: '#' },
        ]
    },
];

const DEFAULT_PARISH_MEMBERS: ParishMember[] = [
    { id: 1, name: 'Fr. Thomas Varghese', role: 'Vicar', area: 'All', email: 'vicar@stmosc.org', phone: '+919876543210' },
    { id: 2, name: 'Jacob Mathew', role: 'Secretary', area: 'Muthupilakkadu North', email: 'sec@stmosc.org', phone: '+919876543212' },
];

const DEFAULT_ORGANISATIONS: Organisation[] = [
    {
        id: 1, name: 'OCYM (Orthodox Christian Youth Movement)', bearers: [
            { id: 1, name: 'Sample President', position: 'President', contact: '+91 9000000001' },
        ]
    },
    {
        id: 2, name: 'Sevika Sanghom', bearers: [
            { id: 1, name: 'Sample Secretary', position: 'Secretary', contact: '+91 9000000002' },
        ]
    },
    {
        id: 3, name: 'Sunday School', bearers: [
            { id: 1, name: 'Sample Headmaster', position: 'Headmaster', contact: '+91 9000000003' },
        ]
    },
];

const DEFAULT_EVENT_BANNERS: EventBannerImage[] = [
    { id: 1, image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', caption: 'Parish Feast Day Celebrations', order: 0 },
    { id: 2, image: 'https://images.unsplash.com/photo-1548625361-ecaa842cebb0?w=800&h=600&fit=crop', caption: 'Holy Week Services & Prayers', order: 1 },
    { id: 3, image: 'https://images.unsplash.com/photo-1467803738586-46b7eb7b16a1?w=800&h=600&fit=crop', caption: 'Youth Movement Annual Gathering', order: 2 },
    { id: 4, image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop', caption: 'Community & Family Events', order: 3 },
];

// ──── API Helpers ────────────────────────────────────────────────

const API_BASE = '/api/data';

async function fetchCollection<T>(collection: string, defaultData: T): Promise<T> {
    try {
        const res = await fetch(`${API_BASE}/${collection}`, { cache: 'no-store' });
        if (!res.ok) return defaultData;
        const data = await res.json();
        // If blob store returned null (no data saved yet), use defaults
        if (data === null || data === undefined) return defaultData;
        return data as T;
    } catch {
        return defaultData;
    }
}

async function saveCollection<T>(collection: string, data: T): Promise<void> {
    const res = await fetch(`${API_BASE}/${collection}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Failed to save ${collection}: ${err}`);
    }
}

// ──── Slider Images ─────────────────────────────────────────────

export async function getSliderImages(): Promise<SliderImage[]> {
    return fetchCollection('slider-images', DEFAULT_SLIDER_IMAGES);
}
export async function saveSliderImages(images: SliderImage[]): Promise<void> {
    return saveCollection('slider-images', images);
}

// ──── Events ────────────────────────────────────────────────────

export async function getEvents(): Promise<ChurchEvent[]> {
    return fetchCollection('events', DEFAULT_EVENTS);
}
export async function saveEvents(events: ChurchEvent[]): Promise<void> {
    return saveCollection('events', events);
}

// ──── Prayer Requests ───────────────────────────────────────────

export async function getPrayerRequests(): Promise<PrayerRequest[]> {
    return fetchCollection('prayer-requests', DEFAULT_PRAYER_REQUESTS);
}
export async function savePrayerRequests(requests: PrayerRequest[]): Promise<void> {
    return saveCollection('prayer-requests', requests);
}

// ──── Book Sections ─────────────────────────────────────────────

export async function getBookSections(): Promise<BookSection[]> {
    return fetchCollection('book-sections', DEFAULT_BOOK_SECTIONS);
}
export async function saveBookSections(sections: BookSection[]): Promise<void> {
    return saveCollection('book-sections', sections);
}

// ──── Parish Committee Members ──────────────────────────────────

export async function getParishMembers(): Promise<ParishMember[]> {
    return fetchCollection('parish-members', DEFAULT_PARISH_MEMBERS);
}
export async function saveParishMembers(members: ParishMember[]): Promise<void> {
    return saveCollection('parish-members', members);
}

// ──── Calendar / Special Days ───────────────────────────────────

// Note: The full liturgical calendar defaults are very large (~200 entries).
// They are loaded from the blob store. If blob is empty, defaults are used.
const DEFAULT_SPECIAL_DAYS: SpecialDay[] = [
    // ── January ──
    { id: 100, title: 'New Year / Circumcision of our Lord', date: '2026-01-01', type: 'feast', description: 'New Year. Circumcision of our Lord. Feast of St. Basil, St. Gregory & all Holy Fathers.', is_countdown_target: false },
    { id: 101, title: 'Epiphany / Denaha: Baptism of our Lord', date: '2026-01-06', type: 'feast', description: 'Epiphany — the Baptism of our Lord Jesus Christ in the River Jordan.', is_countdown_target: true },
    { id: 102, title: 'Feast of St. Basil', date: '2026-01-14', type: 'commemoration', description: 'Commemoration of St. Basil the Great, Archbishop of Caesarea.', is_countdown_target: false },

    // ── February ──
    { id: 200, title: 'Presentation of our Lord (Mayaltho)', date: '2026-02-02', type: 'feast', description: 'Presentation of our Lord Jesus Christ in the Temple — 40 days after Nativity.', is_countdown_target: false },
    { id: 201, title: 'Start of Lent (Great Fast)', date: '2026-02-16', type: 'fast', description: 'Beginning of the 50-day Great Lent leading up to Easter.', is_countdown_target: true },

    // ── March ──
    { id: 300, title: 'Annunciation (Suboro)', date: '2026-03-25', type: 'feast', description: 'The Annunciation to the Blessed Virgin Mary by the Archangel Gabriel.', is_countdown_target: false },
    { id: 301, title: 'Lazarus Saturday', date: '2026-03-28', type: 'feast', description: 'Commemoration of the resurrection of Lazarus by our Lord.', is_countdown_target: false },
    { id: 302, title: 'Palm Sunday (Hosanna)', date: '2026-03-29', type: 'feast', description: 'Hosanna / Palm Sunday — The triumphant entry of our Lord into Jerusalem.', is_countdown_target: true },
    { id: 303, title: 'Great Monday', date: '2026-03-30', type: 'commemoration', description: 'Great Monday of Holy Week — Cursing of the fig tree.', is_countdown_target: false },
    { id: 304, title: 'Great Tuesday', date: '2026-03-31', type: 'commemoration', description: 'Great Tuesday of Holy Week — Parables and teachings.', is_countdown_target: false },

    // ── April ──
    { id: 400, title: 'Great Wednesday', date: '2026-04-01', type: 'commemoration', description: 'Great Wednesday — Anointing at Bethany, Judas\'s betrayal.', is_countdown_target: false },
    { id: 401, title: 'Pesaha (Maundy Thursday)', date: '2026-04-02', type: 'feast', description: 'Pesaha — Institution of the Holy Eucharist, washing of the feet.', is_countdown_target: true },
    { id: 402, title: 'Great Friday — Crucifixion', date: '2026-04-03', type: 'commemoration', description: 'The Crucifixion, Death and Burial of our Lord Jesus Christ.', is_countdown_target: true },
    { id: 403, title: 'Great Saturday', date: '2026-04-04', type: 'commemoration', description: 'The Burial of our Lord. Descent into Hades.', is_countdown_target: false },
    { id: 404, title: 'Easter / Resurrection ✝️', date: '2026-04-05', type: 'feast', description: 'Kyomtho / Easter Sunday — The Glorious Resurrection of our Lord Jesus Christ!', is_countdown_target: true },
    { id: 405, title: 'New Sunday (Thomas Sunday)', date: '2026-04-12', type: 'feast', description: 'New Sunday — Commemoration of the appearance to St. Thomas the Apostle.', is_countdown_target: false },

    // ── May ──
    { id: 500, title: 'Ascension of our Lord', date: '2026-05-14', type: 'feast', description: 'Suloko / Ascension — Our Lord\'s glorious ascension into heaven, 40 days after Easter.', is_countdown_target: true },
    { id: 501, title: 'Pentecost (Whitsunday)', date: '2026-05-24', type: 'feast', description: 'Pentecost — The descent of the Holy Spirit upon the Apostles.', is_countdown_target: true },
    { id: 502, title: 'Apostles\' Fast begins', date: '2026-05-25', type: 'fast', description: 'Beginning of the Apostles\' Fast (Sleeha Nombu), ends June 29.', is_countdown_target: false },

    // ── June ──
    { id: 600, title: 'Nativity of St. John the Baptist', date: '2026-06-24', type: 'feast', description: 'Birth of St. John the Baptist, the Forerunner of our Lord.', is_countdown_target: false },
    { id: 601, title: 'Feast of Sts. Peter & Paul', date: '2026-06-29', type: 'feast', description: 'Feast of the Holy Apostles Peter and Paul. End of Apostles\' Fast.', is_countdown_target: false },

    // ── July ──
    { id: 700, title: 'Feast of St. Thomas the Apostle', date: '2026-07-03', type: 'feast', description: 'Commemoration of the martyrdom of St. Thomas the Apostle, the Apostle of India.', is_countdown_target: false },

    // ── August ──
    { id: 800, title: 'Transfiguration of our Lord', date: '2026-08-06', type: 'feast', description: 'The Transfiguration of our Lord on Mount Tabor.', is_countdown_target: false },
    { id: 801, title: '15-Day Lent (Shunoyo Fast)', date: '2026-08-01', type: 'fast', description: 'Beginning of the 15-day fast before the Assumption of the Blessed Virgin Mary.', is_countdown_target: false },
    { id: 802, title: 'Assumption of the Blessed Virgin Mary', date: '2026-08-15', type: 'feast', description: 'Shoonoyo — The Assumption/Dormition of the Blessed Virgin Mary.', is_countdown_target: true },

    // ── September ──
    { id: 900, title: 'Nativity of the Blessed Virgin Mary', date: '2026-09-08', type: 'feast', description: 'Birthday of the Blessed Virgin Mary, Mother of God.', is_countdown_target: false },
    { id: 901, title: 'Feast of the Holy Cross (Sleeba Perunnal)', date: '2026-09-14', type: 'feast', description: 'Exaltation of the Holy Cross — the Finding of the True Cross by St. Helena.', is_countdown_target: true },

    // ── October ──
    { id: 1000, title: 'Feast of St. Gregorios of Parumala', date: '2026-11-02', type: 'feast', description: 'Commemoration of Parumala Thirumeni — St. Gregorios of Parumala, first saint canonized by the Malankara Orthodox Church.', is_countdown_target: true },

    // ── November ──
    { id: 1100, title: '25-Day Lent (Advent) begins', date: '2026-12-01', type: 'fast', description: 'Beginning of the 25-day Advent Lent leading to Christmas.', is_countdown_target: false },
    { id: 1101, title: 'Feast of St. Baselios Yeldho', date: '2026-10-18', type: 'feast', description: 'Commemoration of Baselios Yeldho Bava, Catholicose of the East.', is_countdown_target: false },

    // ── December ──
    { id: 1200, title: 'Christmas — Nativity of our Lord 🎄', date: '2026-12-25', type: 'feast', description: 'Yeldho — The Nativity of our Lord and Saviour Jesus Christ.', is_countdown_target: true },
    { id: 1201, title: 'Feast of St. Stephen', date: '2026-12-26', type: 'commemoration', description: 'Commemoration of St. Stephen, the first Christian martyr.', is_countdown_target: false },
    { id: 1202, title: 'Holy Innocents', date: '2026-12-28', type: 'commemoration', description: 'Commemoration of the Holy Innocents martyred by King Herod.', is_countdown_target: false },
];

export async function getSpecialDays(): Promise<SpecialDay[]> {
    const stored = await fetchCollection<SpecialDay[]>('special-days', []);
    if (!stored || stored.length === 0) return DEFAULT_SPECIAL_DAYS;
    return stored.map(d => ({ ...d, type: (d.type ?? 'feast') as SpecialDay['type'] }));
}
export async function saveSpecialDays(days: SpecialDay[]): Promise<void> {
    return saveCollection('special-days', days);
}

// ──── Organisations ─────────────────────────────────────────────

export async function getOrganisations(): Promise<Organisation[]> {
    return fetchCollection('organisations', DEFAULT_ORGANISATIONS);
}
export async function saveOrganisations(orgs: Organisation[]): Promise<void> {
    return saveCollection('organisations', orgs);
}

// ──── Event Banner Images ───────────────────────────────────────

export async function getEventBanners(): Promise<EventBannerImage[]> {
    const stored = await fetchCollection('event-banners', DEFAULT_EVENT_BANNERS);
    return [...stored].sort((a, b) => a.order - b.order);
}
export async function saveEventBanners(banners: EventBannerImage[]): Promise<void> {
    return saveCollection('event-banners', banners);
}

// ──── Site Settings ───────────────────────────────────────────────

export async function getSiteSettings(): Promise<SiteSettings> {
    return fetchCollection('site-settings', DEFAULT_SITE_SETTINGS);
}
export async function saveSiteSettings(settings: SiteSettings): Promise<void> {
    return saveCollection('site-settings', settings);
}

// ──── Parish History ──────────────────────────────────────────────

export async function getParishHistory(): Promise<ParishHistory> {
    return fetchCollection('parish-history', DEFAULT_PARISH_HISTORY);
}
export async function saveParishHistory(history: ParishHistory): Promise<void> {
    return saveCollection('parish-history', history);
}

// ──── Gallery Sections ───────────────────────────────────────────

const DEFAULT_GALLERY_SECTIONS: GallerySection[] = [];

export async function getGallerySections(): Promise<GallerySection[]> {
    return fetchCollection('gallery-sections', DEFAULT_GALLERY_SECTIONS);
}
export async function saveGallerySections(sections: GallerySection[]): Promise<void> {
    return saveCollection('gallery-sections', sections);
}

// ──── Publications ────────────────────────────────────────────────

const DEFAULT_PUBLICATIONS: Publication[] = [];

export async function getPublications(): Promise<Publication[]> {
    return fetchCollection('publications', DEFAULT_PUBLICATIONS);
}
export async function savePublications(pubs: Publication[]): Promise<void> {
    return saveCollection('publications', pubs);
}

// ──── ID Generation (unchanged) ─────────────────────────────────

export function nextId(items: { id: number }[]): number {
    return items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
}
