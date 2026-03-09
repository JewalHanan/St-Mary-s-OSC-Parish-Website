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

// ──── Default data (used as fallback when blob store is empty) ───

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
    { id: 100, title: 'New Year / Circumcision of our Lord', date: '2026-01-01', type: 'feast', description: 'New Year. Circumcision of our Lord. Feast of St. Basil, St. Gregory & all Holy Fathers. Tone 1.', is_countdown_target: false },
    { id: 105, title: 'Epiphany / Denaha: Baptism of our Lord', date: '2026-01-06', type: 'feast', description: 'Epiphany — the Baptism of our Lord Jesus Christ. Tone 2.', is_countdown_target: false },
    { id: 400, title: 'Palm Sunday', date: '2026-03-29', type: 'feast', description: 'Hosanna / Palm Sunday — The triumphant entry of our Lord into Jerusalem.', is_countdown_target: true },
    { id: 405, title: 'Great Friday — Crucifixion of our Lord', date: '2026-04-03', type: 'commemoration', description: 'The Crucifixion, Death and Burial of our Lord Jesus Christ.', is_countdown_target: true },
    { id: 406, title: 'Easter / Resurrection of our Lord ✝️', date: '2026-04-05', type: 'feast', description: 'Kyomtho / Easter Sunday — The Glorious Resurrection of our Lord Jesus Christ!', is_countdown_target: true },
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

// ──── ID Generation (unchanged) ─────────────────────────────────

export function nextId(items: { id: number }[]): number {
    return items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
}
