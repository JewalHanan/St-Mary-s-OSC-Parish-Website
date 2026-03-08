// Shared data store using localStorage for persistence across admin and public pages.
// This enables live updates: admin edits → localStorage → public pages read from it.

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
    icon?: string; // base64 image or emoji for event icon
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
    image?: string; // base64 square thumbnail (1:1)
}

export interface ParishMember {
    id: number;
    name: string;
    role: string;
    area: string;
    email: string;
    phone: string;
    image?: string; // base64 data URL for member photo
}

export interface SpecialDay {
    id: number;
    title: string;
    date: string;
    description: string;
    is_countdown_target: boolean;
    type: 'feast' | 'fast' | 'commemoration' | 'regular'; // visual category
    image?: string; // optional 1:1 base64 image
}

export interface OrgBearer {
    id: number;
    name: string;
    position: string;
    contact: string;
    image?: string; // base64 data URL
}

export interface Organisation {
    id: number;
    name: string;
    logo?: string; // uploaded symbol / logo image (base64)
    bearers: OrgBearer[];
}

export interface EventBannerImage {
    id: number;
    image: string;      // base64 or URL
    caption: string;    // caption shown under the image
    order: number;      // for drag-and-drop reordering
}

// Default data
const DEFAULT_SLIDER_IMAGES: SliderImage[] = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1548625361-ecaa842cebb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        title: 'Sacred Heritage',
        caption: 'Experience the beauty of Malankara Orthodox traditions.'
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1514867175822-25807af1d0e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        title: 'Holy Qurbono',
        caption: 'Join us every Sunday for the Divine Liturgy.'
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1438283173091-5dbf5c5a3206?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        title: 'Community Fellowship',
        caption: 'Growing together in faith and love.'
    }
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

const DEFAULT_SPECIAL_DAYS: SpecialDay[] = [
    // ── JANUARY 2026 ──
    { id: 101, title: 'New Year — Circumcision of our Lord', date: '2026-01-01', type: 'feast', description: 'Feast of the Circumcision of our Lord, Tone 1. Beginning of the civil new year.', is_countdown_target: false },
    { id: 102, title: 'Feast of St. Basil, St. Gregory & All Holy Fathers', date: '2026-01-01', type: 'feast', description: 'Commemoration of St. Basil the Great, St. Gregory and all the Holy Fathers of the Church.', is_countdown_target: false },
    { id: 103, title: '62nd Commemoration of H.H. Baselios Geevarghese II Catholicos', date: '2026-01-03', type: 'commemoration', description: 'Commemorated at Catholicate Aramana, Devalokam.', is_countdown_target: false },
    { id: 104, title: 'Memorial Day of Oath of Koonan Cross', date: '2026-01-03', type: 'commemoration', description: 'Memorial day at St. George Church, Mattanchery.', is_countdown_target: false },
    { id: 105, title: 'Epiphany / Denaha — Baptism of our Lord Jesus Christ', date: '2026-01-06', type: 'feast', description: 'The Feast of the Epiphany — Baptism of our Lord in the River Jordan by St. John the Baptist. Tone 2.', is_countdown_target: false },
    { id: 106, title: 'Feast Commemorating the Beheading of St. John the Baptist', date: '2026-01-07', type: 'feast', description: 'Commemoration of the martyrdom of St. John the Baptist. Tone 8.', is_countdown_target: false },
    { id: 107, title: 'Feast Commemorating the Martyrdom of St. Stephen', date: '2026-01-08', type: 'feast', description: 'Commemoration of St. Stephen, the first Christian martyr. Tone 8.', is_countdown_target: false },
    { id: 108, title: 'Feast of St. Mary for Seeds', date: '2026-01-15', type: 'feast', description: 'Feast of St. Mary for Seeds — blessing of seeds and crops. Commemoration of Paul the Monk.', is_countdown_target: false },
    { id: 109, title: 'Feast of St. Samuel, St. Simon & St. Antony', date: '2026-01-18', type: 'feast', description: 'Commemoration of St. Samuel, St. Simon and St. Antony the Monks. Tone 4.', is_countdown_target: false },
    { id: 110, title: '17th Commemoration of H.G. Philipose Mar Eusebius Metropolitan', date: '2026-01-21', type: 'commemoration', description: 'Commemorated at St. Basil Dayara, Pathanamthitta.', is_countdown_target: false },
    { id: 111, title: '210th Commemoration of Marthoma VIII', date: '2026-01-22', type: 'commemoration', description: 'Commemorated at Puthencavu Cathedral.', is_countdown_target: false },
    { id: 112, title: 'Feast of St. Augen the Monk', date: '2026-01-23', type: 'feast', description: 'Commemoration of St. Augen, the Monk and Father of Monasticism in the East.', is_countdown_target: false },
    { id: 113, title: 'Sunday before Nineveh Lent (Pethurtho)', date: '2026-01-25', type: 'fast', description: 'Sunday before Nineveh Lent. Commemoration of All Departed Fathers and Malpans. Tone 6.', is_countdown_target: false },
    { id: 114, title: 'Monday of Nineveh Lent — Start of Fast', date: '2026-01-26', type: 'fast', description: 'Beginning of Nineveh Lent. Republic Day. 20th Commemoration of H.H. Baselios Marthoma Mathews II Catholicos (Mount Horeb Ashram, Sasthamcotta).', is_countdown_target: false },
    { id: 115, title: 'End of Nineveh Lent — Feast of Prophet Jonah', date: '2026-01-29', type: 'feast', description: 'End of the Nineveh Lent. Feast of the Prophet Jonah and St. Severus, Patriarch of Antioch. Tone 6.', is_countdown_target: false },

    // ── FEBRUARY 2026 ──
    { id: 201, title: 'Commemoration Departed Priests (Kohne Sunday)', date: '2026-02-01', type: 'commemoration', description: 'Special Sunday for commemorating all departed priests of the church. Tone 7.', is_countdown_target: false },
    { id: 202, title: 'Mayaltho — Entry of our Lord into the Temple', date: '2026-02-02', type: 'feast', description: 'Presentation of our Lord in the Temple. Feast of St. Simeon and Anna (Elder\'s Day). Tone 3.', is_countdown_target: false },
    { id: 203, title: 'Feast of St. Bar Souma — Chief Among Mourners & Mar Kauma', date: '2026-02-03', type: 'feast', description: 'Commemoration of St. Bar Souma and Mar Kauma.', is_countdown_target: false },
    { id: 204, title: 'Commemoration of All Departed Faithful (Anide Sunday)', date: '2026-02-08', type: 'commemoration', description: 'General commemoration of all the departed faithful. Tone 8.', is_countdown_target: false },
    { id: 205, title: '17th Commemoration of H.G. Mathews Mar Epiphanios Metropolitan', date: '2026-02-09', type: 'commemoration', description: 'Commemorated at St. Thomas Cathedral, Kollam.', is_countdown_target: false },
    { id: 206, title: '94th Commemoration of Patriarch Ignatius Elias III', date: '2026-02-13', type: 'commemoration', description: 'Commemorated at Manjinikkara Dayara.', is_countdown_target: false },
    { id: 207, title: 'First Sunday of Great Lent (Kothine Sunday)', date: '2026-02-15', type: 'fast', description: 'First Sunday of the Holy Great Lent. Tone 1.', is_countdown_target: false },
    { id: 208, title: 'Beginning of Great Lent — Service of Reconciliation', date: '2026-02-16', type: 'fast', description: 'The beginning of Great Lent. Shubqono (Service of Reconciliation). 14th Commemoration of H.G. Dr. Geevarghese Mar Osthathios Metropolitan.', is_countdown_target: false },
    { id: 209, title: 'Feast of St. Ephrem & St. Theodore', date: '2026-02-21', type: 'feast', description: 'Feast of St. Ephrem the Syrian and St. Theodore, commemorated on the first Saturday of Great Lent.', is_countdown_target: false },
    { id: 210, title: 'Second Sunday of Great Lent (Garbo Sunday)', date: '2026-02-22', type: 'fast', description: 'Second Sunday of Great Lent. Tone 2. Feast of St. Polycarp of Smyrna.', is_countdown_target: false },
    { id: 211, title: 'Feast of St. Geevarghese Mar Dionysius Vattasseril (Malankara Sabha Bhasuran)', date: '2026-02-23', type: 'feast', description: '92nd Feast of the Malankara Sabha Bhasuran. Old Seminary, Kottayam.', is_countdown_target: false },
    { id: 212, title: 'Feast of St. Matthew the Evangelist', date: '2026-02-24', type: 'feast', description: 'Commemoration of St. Matthew the Apostle and Evangelist.', is_countdown_target: false },

    // ── MARCH 2026 ──
    { id: 301, title: 'Third Sunday of Great Lent (M\'sharyo Sunday)', date: '2026-03-01', type: 'fast', description: 'Third Sunday of the Great Lent. Tone 3.', is_countdown_target: false },
    { id: 302, title: 'Fourth Sunday of Great Lent (Knanayto Sunday)', date: '2026-03-08', type: 'fast', description: 'Fourth Sunday of the Great Lent. Tone 4.', is_countdown_target: false },
    { id: 303, title: 'Feast of the Forty Martyrs of Sebastia', date: '2026-03-09', type: 'feast', description: 'Commemoration of the 40 soldiers of Christ martyred at the frozen lake of Sebastia.', is_countdown_target: false },
    { id: 304, title: 'Mid-Lent', date: '2026-03-11', type: 'fast', description: 'mid-point of Great Lent. Tone 8.', is_countdown_target: false },
    { id: 305, title: 'Fifth Sunday of Great Lent (Kfiftho Sunday)', date: '2026-03-15', type: 'fast', description: 'Fifth Sunday of Great Lent. Tone 5.', is_countdown_target: false },
    { id: 306, title: 'Sixth Sunday of Great Lent (Samyo Sunday) — Malankara Orthodox Church Day', date: '2026-03-22', type: 'feast', description: 'Sixth Sunday of Great Lent. Tone 6. Malankara Orthodox Church Day / Catholicate Day.', is_countdown_target: false },
    { id: 307, title: 'Vachanippu / Suboro — Annunciation to St. Mary', date: '2026-03-25', type: 'feast', description: 'The Annunciation to the Most Holy Theotokos. Tone 4. 298th Commemoration of Marthoma IV (Kandanadu Cathedral).', is_countdown_target: false },
    { id: 308, title: '40th Friday of Great Lent', date: '2026-03-27', type: 'fast', description: '40th Friday of Great Lent — special fasting service. Tone 2.', is_countdown_target: false },
    { id: 309, title: 'Lazarus Saturday', date: '2026-03-28', type: 'feast', description: 'Commemoration of the raising of Lazarus from the dead. Tone 8.', is_countdown_target: false },
    { id: 310, title: 'Palm Sunday (Boys and Girls Day)', date: '2026-03-29', type: 'feast', description: 'The Triumphal Entry of our Lord into Jerusalem. Boys and Girls Day. Tone 7.', is_countdown_target: false },
    { id: 311, title: 'Monday of Holy Week', date: '2026-03-30', type: 'fast', description: 'Beginning of Holy Week. Special services begin.', is_countdown_target: false },
    { id: 312, title: 'Tuesday of Holy Week', date: '2026-03-31', type: 'fast', description: 'Second day of Holy Week.', is_countdown_target: false },

    // ── APRIL 2026 (Holy Week & Pascha) ──
    { id: 401, title: 'Wednesday of Holy Week', date: '2026-04-01', type: 'fast', description: 'Service of the Unction of the Sick (Holy Wednesday).', is_countdown_target: false },
    { id: 402, title: 'Thursday of the Mysteries (Maundy Thursday)', date: '2026-04-02', type: 'feast', description: 'Institution of the Holy Eucharist — the Mystical Supper. Pesaha service.', is_countdown_target: false },
    { id: 403, title: 'Great and Holy Friday', date: '2026-04-03', type: 'fast', description: 'The Crucifixion, death and burial of our Lord Jesus Christ. Day of solemn fasting.', is_countdown_target: false },
    { id: 404, title: 'Saturday of Good Tidings (Holy Saturday)', date: '2026-04-04', type: 'feast', description: 'The descent of our Lord into Hades. Evening: Resurrection Qurbono begins.', is_countdown_target: false },
    { id: 405, title: 'The Great and Holy Resurrection (Qymtho)', date: '2026-04-05', type: 'feast', description: 'The Great Feast of the Resurrection of our Lord Jesus Christ! Tone 8 (Evening), then Tone 1. 61st Commemoration of H.G. Kuriakose Mar Gregorios Metropolitan (Pampady Dayara).', is_countdown_target: true },
    { id: 406, title: 'Bright Monday', date: '2026-04-06', type: 'feast', description: 'First day after the Resurrection. Tone 2.', is_countdown_target: false },
    { id: 407, title: 'Bright Tuesday', date: '2026-04-07', type: 'feast', description: 'Second day after the Resurrection. Tone 3. 218th Commemoration of Valiya Mar Dionysius Metropolitan (Marthoma VI) at Puthencavu Cathedral.', is_countdown_target: false },
    { id: 408, title: 'Bright Wednesday', date: '2026-04-08', type: 'feast', description: 'Third bright day of Resurrection week. Tone 4.', is_countdown_target: false },
    { id: 409, title: 'Bright Thursday', date: '2026-04-09', type: 'feast', description: 'Fourth bright day. Tone 5.', is_countdown_target: false },
    { id: 410, title: 'Bright Friday', date: '2026-04-10', type: 'feast', description: 'Fifth bright day. Tone 6.', is_countdown_target: false },
    { id: 411, title: 'Bright Saturday', date: '2026-04-11', type: 'feast', description: 'Sixth bright day. Tone 7.', is_countdown_target: false },
    { id: 412, title: 'New Sunday (First Sunday After Resurrection)', date: '2026-04-12', type: 'feast', description: 'Thomas Sunday — appearance of Christ to the doubting Thomas. Tone 8 / Tone 1. 13th Commemoration of H.G. Geevarghese Mar Ivanios Metropolitan (Njaliakuzhy).', is_countdown_target: false },
    { id: 413, title: '330th Commemoration of Marthoma II', date: '2026-04-14', type: 'commemoration', description: 'Commemorated at Niranam Valiyapally.', is_countdown_target: false },
    { id: 414, title: 'Feast of St. George the Martyr', date: '2026-04-23', type: 'feast', description: 'Feast of the Great Martyr St. George the Victory-Bearer.', is_countdown_target: false },
    { id: 415, title: 'Feast of St. Mark the Evangelist', date: '2026-04-25', type: 'feast', description: 'Commemoration of St. Mark the Apostle and Evangelist.', is_countdown_target: false },
    { id: 416, title: 'Feast of Mar Sabor & Mar Afroth', date: '2026-04-29', type: 'feast', description: 'Commemoration of Mar Sabor and Mar Afroth, the Holy Martyrs.', is_countdown_target: false },

    // ── MAY 2026 ──
    { id: 501, title: 'Feast of St. James the Apostle (Son of Zebedee)', date: '2026-05-01', type: 'feast', description: 'Commemoration of St. James, son of Zebedee, the Apostle and Martyr.', is_countdown_target: false },
    { id: 502, title: '113th Commemoration of H.H. Baselios Paulose I Catholicos', date: '2026-05-03', type: 'commemoration', description: 'Commemorated at Pampakuda Cheriyapally.', is_countdown_target: false },
    { id: 503, title: 'Feast of St. John the Apostle', date: '2026-05-08', type: 'feast', description: 'Feast of St. John the Beloved Apostle and Evangelist.', is_countdown_target: false },
    { id: 504, title: 'Feast of St. Simon the Zealot', date: '2026-05-10', type: 'feast', description: 'Commemoration of St. Simon the Zealot, Apostle.', is_countdown_target: false },
    { id: 505, title: 'The Ascension of our Lord Jesus Christ', date: '2026-05-14', type: 'feast', description: 'The Feast of the Holy Ascension — our Lord\'s ascent to Heaven 40 days after the Resurrection. Tone 5.', is_countdown_target: false },
    { id: 506, title: 'Feast of St. Mary for Good Crops & Harvest', date: '2026-05-15', type: 'feast', description: 'Feast of St. Mary for Good Crops and Harvest. Tone 1. Start of Days of Waiting for the Holy Spirit (Pentecost).', is_countdown_target: false },
    { id: 507, title: '36th Commemoration of H.G. Yuhanon Mar Severios Metropolitan', date: '2026-05-16', type: 'commemoration', description: 'Commemorated at Zion Seminary, Koratty.', is_countdown_target: false },
    { id: 508, title: 'Feast of King Constantine and Queen Helen', date: '2026-05-20', type: 'feast', description: 'Feast of the Holy Equals-to-the-Apostles King Constantine and Queen Helen. Also feast of the 4 Evangelists and all Fathers of the 3 Ecumenical Synods.', is_countdown_target: false },
    { id: 509, title: 'Pentecost — Descent of the Holy Spirit', date: '2026-05-24', type: 'feast', description: 'The Great Feast of Pentecost — coming of the Holy Spirit upon the Holy Apostles. Founding of the Church. Tone 7.', is_countdown_target: false },
    { id: 510, title: 'Feast of St. Aaron the Ascetic', date: '2026-05-25', type: 'feast', description: 'Commemoration of St. Aaron the Ascetic.', is_countdown_target: false },
    { id: 511, title: '12th Commemoration of H.H. Baselios Marthoma Didymus I Catholicos', date: '2026-05-26', type: 'commemoration', description: 'Commemorated at Mount Tabor Dayara, Pathanapuram.', is_countdown_target: false },
    { id: 512, title: 'Golden Friday', date: '2026-05-29', type: 'feast', description: 'Golden Friday — special commemorative Friday after Pentecost.', is_countdown_target: false },
    { id: 513, title: 'First Sunday after Pentecost', date: '2026-05-31', type: 'feast', description: 'First Sunday after the Feast of Pentecost. Tone 8.', is_countdown_target: false },

    // ── JUNE 2026 ──
    { id: 601, title: 'World Environment Day', date: '2026-06-05', type: 'regular', description: 'World Environment Day — prayers for the protection of God\'s creation.', is_countdown_target: false },
    { id: 602, title: 'Feast of St. Bartholomew the Apostle', date: '2026-06-11', type: 'feast', description: 'Commemoration of St. Bartholomew (Nathanael), the Apostle and Martyr.', is_countdown_target: false },
    { id: 603, title: 'Feast of St. Mary — Establishment of First Church in St. Mary\'s Name', date: '2026-06-15', type: 'feast', description: 'Feast of St. Mary commemorating the establishment of the first church in her holy name. Tone 1.', is_countdown_target: false },
    { id: 604, title: 'Beginning of the Apostles\' Fast (13-Day Fast)', date: '2026-06-16', type: 'fast', description: 'Beginning of the Holy Apostles\' Fast — 13 days of fasting before the Feast of Sts. Peter & Paul.', is_countdown_target: false },
    { id: 605, title: 'Feast of St. James, Brother of Jesus & First Bishop of Jerusalem', date: '2026-06-19', type: 'feast', description: 'Commemoration of St. James the Less, brother of our Lord and first Bishop of Jerusalem.', is_countdown_target: false },
    { id: 606, title: 'Feast of the Birth of St. John the Baptist', date: '2026-06-24', type: 'feast', description: 'Nativity of the Holy Forerunner and Prophet St. John the Baptist.', is_countdown_target: false },
    { id: 607, title: 'Feast of Sts. Peter & Paul — End of Apostles\' Fast', date: '2026-06-29', type: 'feast', description: 'Feast of the Holy Chief Apostles Peter and Paul. End of the Apostles\' Fast. Tone 5.', is_countdown_target: false },
    { id: 608, title: 'Feast of the Apostles', date: '2026-06-30', type: 'feast', description: 'General feast of all the Holy Apostles. Tone 8.', is_countdown_target: false },

    // ── JULY 2026 ──
    { id: 701, title: 'Dukhrono of St. Thomas the Apostle', date: '2026-07-03', type: 'feast', description: 'Feast of St. Thomas the Apostle who brought Christianity to India. Tone 8.', is_countdown_target: false },
    { id: 702, title: 'Feast of the Seventy-Two Evangelists', date: '2026-07-05', type: 'feast', description: 'Commemoration of the 72 Disciples sent out by our Lord.', is_countdown_target: false },
    { id: 703, title: 'Feast St. Kuriakose the Martyr, Morth Yulithi & St. Abhai of Nicea', date: '2026-07-15', type: 'feast', description: 'Feast of St. Kuriakose (Cyricus) and his mother Yulithi (Julitta), Holy Martyrs.', is_countdown_target: false },
    { id: 704, title: 'Feast of Prophet Mar Elijah', date: '2026-07-20', type: 'feast', description: 'Feast of the Holy Prophet Elijah (Elias) the Tishbite.', is_countdown_target: false },
    { id: 705, title: 'Feast of St. Mary Magdalene', date: '2026-07-22', type: 'feast', description: 'Feast of the Holy Equal-to-the-Apostles and Myrrh-bearer Mary Magdalene.', is_countdown_target: false },
    { id: 706, title: '27th Commemoration of H.G. Geevarghese Mar Dioscoros Metropolitan', date: '2026-07-23', type: 'commemoration', description: 'Commemorated at Holy Trinity Ashram, Ranni.', is_countdown_target: false },
    { id: 707, title: 'Feast of Mar Epiphanios of Cyprus', date: '2026-07-25', type: 'feast', description: 'Commemoration of St. Epiphanios, Bishop of Cyprus and Father of the Church.', is_countdown_target: false },
    { id: 708, title: 'Feast of St. Simon the Stylite', date: '2026-07-27', type: 'feast', description: 'Commemoration of St. Simon the Stylite, Ascetic and Pillar-dweller.', is_countdown_target: false },
    { id: 709, title: '740th Commemoration of Mor Gregorios Bar Hebraeus', date: '2026-07-31', type: 'commemoration', description: 'Commemoration of the great Maphrian, theologian and scholar Mor Gregorios Bar Hebraeus.', is_countdown_target: false },

    // ── AUGUST 2026 ──
    { id: 801, title: 'Beginning of Dormition (Shoonoyo) Fast — 15 Days', date: '2026-08-01', type: 'fast', description: 'Start of the 15-day Shoonoyo Fast before the Feast of the Assumption of St. Mary. Feast of Martyrs Morth Shmuni, her 7 children and Eleazar.', is_countdown_target: false },
    { id: 802, title: 'Feast of the Transfiguration (Koodara Perunal)', date: '2026-08-06', type: 'feast', description: 'The Holy Feast of the Transfiguration of our Lord on Mount Tabor. Tone 6.', is_countdown_target: false },
    { id: 803, title: 'Feast of St. Demetrios of Thessaloniki', date: '2026-08-07', type: 'feast', description: 'Feast of the Great Martyr St. Demetrios of Thessaloniki.', is_countdown_target: false },
    { id: 804, title: 'Feast of St. Azazayel the Martyr', date: '2026-08-10', type: 'feast', description: 'Commemoration of the Holy Martyr St. Azazayel.', is_countdown_target: false },
    { id: 805, title: 'Festival of the Assumption of St. Mary (Shoonoyo Perunal)', date: '2026-08-15', type: 'feast', description: 'The Great Feast of the Assumption / Dormition of the Most Holy Theotokos. Indian Independence Day. Tone 7.', is_countdown_target: false },
    { id: 806, title: 'First Sunday after the Dormition of St. Mary', date: '2026-08-16', type: 'feast', description: 'First Sunday after the Feast of the Assumption of St. Mary. Tone 3.', is_countdown_target: false },
    { id: 807, title: 'Feast of All Prophets & St. Labbaeus the Apostle', date: '2026-08-19', type: 'feast', description: 'Feast of All Holy Prophets and St. Labbaeus (Thaddeus) the Apostle.', is_countdown_target: false },
    { id: 808, title: 'Feast of St. Matthias the Apostle', date: '2026-08-24', type: 'feast', description: 'Commemoration of St. Matthias, the Apostle chosen to replace Judas.', is_countdown_target: false },
    { id: 809, title: 'Feast of the Beheading of St. John the Baptist', date: '2026-08-29', type: 'fast', description: 'Strict fasting day commemorating the martyrdom of St. John the Baptist.', is_countdown_target: false },

    // ── SEPTEMBER 2026 ──
    { id: 901, title: 'Feast of the Birth of St. Mary, the Mother of God', date: '2026-09-08', type: 'feast', description: 'Feast of the Nativity of the Most Holy Theotokos. Tone 1.', is_countdown_target: false },
    { id: 902, title: 'Feast of St. Mary\'s Parents — Joachim and Anna', date: '2026-09-09', type: 'feast', description: 'Commemoration of the holy parents of the Theotokos, St. Joachim and St. Anna.', is_countdown_target: false },
    { id: 903, title: 'Feast of the Holy Cross (Sleeba Perunal)', date: '2026-09-14', type: 'feast', description: 'The Exaltation of the Holy Cross — second most important feast in the Malankara Church. 114th Anniversary of Catholicate in Malankara (Sep 15).', is_countdown_target: false },
    { id: 904, title: 'Feast of St. Dimeth of Persia', date: '2026-09-24', type: 'feast', description: 'Commemoration of St. Dimeth of Persia, Holy Martyr.', is_countdown_target: false },
    { id: 905, title: '28th Commemoration of H.G. Philipose Mar Theophilos Metropolitan', date: '2026-09-28', type: 'commemoration', description: 'Commemorated at Aluva Thrikkunathu Seminary.', is_countdown_target: false },

    // ── OCTOBER 2026 ──
    { id: 1001, title: 'Feast of Evangelist Adai, Abahai the Martyr & Mar Malke', date: '2026-10-01', type: 'feast', description: 'Commemoration of the Apostle Adai (Thaddeus), Abahai the Martyr and Mar Malke.', is_countdown_target: false },
    { id: 1002, title: '341st Feast of St. Baselios Yeldho Catholicos', date: '2026-10-03', type: 'feast', description: 'Feast of St. Baselios Yeldho Catholicos commemorated at Kothamangalam Cheriyapally.', is_countdown_target: false },
    { id: 1003, title: 'Feast of St. Sergius & St. Bacchus the Martyrs', date: '2026-10-07', type: 'feast', description: 'Feast of the Holy Martyrs St. Sergius and St. Bacchus.', is_countdown_target: false },
    { id: 1004, title: 'Commemoration of St. Athanasius of Alexandria', date: '2026-10-14', type: 'commemoration', description: 'Commemoration of St. Athanasius the Great, Patriarch of Alexandria and Defender of Orthodoxy.', is_countdown_target: false },
    { id: 1005, title: '5th Anniversary of Enthronement of H.H. Baselios Marthoma Mathews III Catholicos', date: '2026-10-15', type: 'commemoration', description: 'Fifth anniversary of the enthronement of the current Catholicos. Feast of St. Osyo the Ascetic.', is_countdown_target: false },
    { id: 1006, title: 'Feast of St. Luke the Evangelist', date: '2026-10-18', type: 'feast', description: 'Feast of St. Luke the Apostle, Evangelist and Physician. Tone 5.', is_countdown_target: false },
    { id: 1007, title: 'Feast of St. James the Apostle, Son of Alphaeus', date: '2026-10-22', type: 'feast', description: 'Commemoration of St. James the Less, Apostle and Martyr.', is_countdown_target: false },
    { id: 1008, title: 'Feast of St. Demetrios of Thessaloniki (October)', date: '2026-10-26', type: 'feast', description: 'October feast of the Great Martyr St. Demetrios.', is_countdown_target: false },

    // ── NOVEMBER 2026 ──
    { id: 1101, title: 'Koodosh Eetho Sunday — Feast of All Saints', date: '2026-11-01', type: 'feast', description: 'Sanctification Sunday — Feast of All Saints of the Church. Tone 1. 124th Commemoration of St. Geevarghese Mar Gregorios of Parumala (Parumala Seminary).', is_countdown_target: false },
    { id: 1102, title: 'Hoodosh Eetho Sunday (Dedication)', date: '2026-11-08', type: 'feast', description: 'Dedication Sunday — Tone 2. 30th Commemoration of H.H. Baselios Marthoma Mathews I Catholicos (Catholicate Aramana, Devalokam).', is_countdown_target: false },
    { id: 1103, title: 'Feast of St. John Chrysostom', date: '2026-11-13', type: 'feast', description: 'Feast of St. John Chrysostom, Archbishop of Constantinople, Doctor of the Church.', is_countdown_target: false },
    { id: 1104, title: 'Feast of St. Philip the Apostle', date: '2026-11-14', type: 'feast', description: 'Commemoration of St. Philip the Apostle.', is_countdown_target: false },
    { id: 1105, title: 'Sunday of Revelation to Zachariah', date: '2026-11-15', type: 'feast', description: 'Sunday of the Revelation to Zachariah, father of John the Baptist. Tone 3.', is_countdown_target: false },
    { id: 1106, title: 'Commemorating the Entry of St. Mary to the Temple', date: '2026-11-21', type: 'feast', description: 'Entry of the Holy Theotokos St. Mary into the Temple of Jerusalem.', is_countdown_target: false },
    { id: 1107, title: 'Sunday of Annunciation to St. Mary', date: '2026-11-22', type: 'feast', description: 'Sunday of the Annunciation of the birth of our Lord. Tone 4.', is_countdown_target: false },
    { id: 1108, title: 'Feast of Mar Jacob Baradaeus & Mar Dionysius Bar Salibi', date: '2026-11-28', type: 'feast', description: 'Commemoration of Mar Jacob Baradaeus and Mar Dionysius Bar Salibi, great pillars of the Syriac Church.', is_countdown_target: false },
    { id: 1109, title: 'Sunday of St. Mary\'s Journey to Elizabeth', date: '2026-11-29', type: 'feast', description: 'Sunday commemorating the Visitation of St. Mary to Elizabeth. Feast of Mar Jacob of Serugh. Tone 5.', is_countdown_target: false },
    { id: 1110, title: 'Feast of St. Andrew the Apostle', date: '2026-11-30', type: 'feast', description: 'Feast of St. Andrew the First-Called Apostle.', is_countdown_target: false },

    // ── DECEMBER 2026 ──
    { id: 1201, title: 'Beginning of the Fast of the Nativity (25-Day Fast)', date: '2026-12-01', type: 'fast', description: 'The 25-day fast before the Feast of the Nativity of our Lord.', is_countdown_target: false },
    { id: 1202, title: 'Feast of Martyrs Morth Barbara and Morth Juliana', date: '2026-12-04', type: 'feast', description: 'Feast of the Holy Martyrs St. Barbara and St. Juliana.', is_countdown_target: false },
    { id: 1203, title: 'Sunday of Birth of John the Baptist (Children\'s Day)', date: '2026-12-06', type: 'feast', description: 'Intercession Day. Feast of St. Nicholas, Bishop of Myra. Children\'s Day. Tone 6.', is_countdown_target: false },
    { id: 1204, title: 'Feast of the Martyrs St. Behanam, St. Sarah & Co-Martyrs', date: '2026-12-10', type: 'feast', description: 'Feast of the Holy Martyrs St. Behanam, his sister St. Sarah, and their companions. Feast of Mar Philoxenos of Mabbug.', is_countdown_target: false },
    { id: 1205, title: 'Sunday of Revelation to St. Joseph', date: '2026-12-13', type: 'feast', description: 'Sunday of the Angel\'s Revelation to St. Joseph. Tone 7.', is_countdown_target: false },
    { id: 1206, title: 'Feast of St. Thomas the Apostle (Stabbing by Spear)', date: '2026-12-18', type: 'feast', description: 'Commemoration of the day St. Thomas the Apostle was martyred by being stabbed by a spear.', is_countdown_target: false },
    { id: 1207, title: 'Sunday before Christmas (Genealogy Sunday)', date: '2026-12-20', type: 'feast', description: 'Genealogy Sunday — reading of the genealogy of our Lord. Feast of Mar Ignatius Noorono of Antioch. Tone 8.', is_countdown_target: false },
    { id: 1208, title: 'Dukhrono of St. Thomas the Apostle', date: '2026-12-21', type: 'feast', description: 'Commemoration of St. Thomas the Apostle. Tone 7.', is_countdown_target: false },
    { id: 1209, title: 'Yeldho — Incarnation of our Lord (Christmas)', date: '2026-12-25', type: 'feast', description: 'The Holy Feast of the Nativity of our Lord, God and Saviour Jesus Christ. Tone 1.', is_countdown_target: false },
    { id: 1210, title: 'Feast of the Exaltation of St. Mary, Mother of God', date: '2026-12-26', type: 'feast', description: 'Feast of the glorification of the Most Holy Theotokos. Tone 1.', is_countdown_target: false },
    { id: 1211, title: 'First Sunday after Christmas — Feast of Slaughter of the Infants', date: '2026-12-27', type: 'feast', description: 'First Sunday after Christmas. Commemoration of the Holy Innocents martyred by Herod. Tone 1.', is_countdown_target: false },
];

// Helper: read from localStorage with fallback
function readStore<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback;
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : fallback;
    } catch {
        return fallback;
    }
}

function writeStore<T>(key: string, data: T): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(data));
    // StorageEvent only fires in OTHER tabs. For same-tab reactivity, dispatch a custom event.
    window.dispatchEvent(new CustomEvent('stmosc-store-update', { detail: { key } }));
}

// ──── Slider Images ────
export function getSliderImages(): SliderImage[] {
    return readStore('stmosc_slider_images', DEFAULT_SLIDER_IMAGES);
}
export function saveSliderImages(images: SliderImage[]): void {
    writeStore('stmosc_slider_images', images);
}

// ──── Events ────
export function getEvents(): ChurchEvent[] {
    return readStore('stmosc_events', DEFAULT_EVENTS);
}
export function saveEvents(events: ChurchEvent[]): void {
    writeStore('stmosc_events', events);
}

// ──── Prayer Requests ────
export function getPrayerRequests(): PrayerRequest[] {
    return readStore('stmosc_prayer_requests', DEFAULT_PRAYER_REQUESTS);
}
export function savePrayerRequests(requests: PrayerRequest[]): void {
    writeStore('stmosc_prayer_requests', requests);
}

// ──── Book Sections ────
export function getBookSections(): BookSection[] {
    return readStore('stmosc_book_sections', DEFAULT_BOOK_SECTIONS);
}
export function saveBookSections(sections: BookSection[]): void {
    writeStore('stmosc_book_sections', sections);
}

// ──── Parish Committee Members ────
export function getParishMembers(): ParishMember[] {
    return readStore('stmosc_parish_members', DEFAULT_PARISH_MEMBERS);
}
export function saveParishMembers(members: ParishMember[]): void {
    writeStore('stmosc_parish_members', members);
}

// ──── Calendar / Special Days ────
export function getSpecialDays(): SpecialDay[] {
    const stored = readStore<SpecialDay[]>('stmosc_special_days', []);
    if (!stored || stored.length === 0) return DEFAULT_SPECIAL_DAYS;

    // Migration: if any entries lack `type`, the schema is old.
    // Check if ALL entries are missing type — if so, wipe cache and use new defaults.
    const allMissingType = stored.every(d => !d.type);
    if (allMissingType) {
        // Wipe stale cache and return the new rich defaults
        writeStore('stmosc_special_days', DEFAULT_SPECIAL_DAYS);
        return DEFAULT_SPECIAL_DAYS;
    }

    // Partial migration: backfill any individual entries that are missing `type`
    return stored.map(d => ({ ...d, type: (d.type ?? 'feast') as SpecialDay['type'] }));
}
export function saveSpecialDays(days: SpecialDay[]): void {
    writeStore('stmosc_special_days', days);
}

// ──── Organisations ────
const DEFAULT_ORGANISATIONS: Organisation[] = [
    {
        id: 1, name: 'OCYM (Orthodox Christian Youth Movement)',
        bearers: [
            { id: 1, name: 'Sample President', position: 'President', contact: '+91 9000000001' },
        ]
    },
    {
        id: 2, name: 'Sevika Sanghom',
        bearers: [
            { id: 1, name: 'Sample Secretary', position: 'Secretary', contact: '+91 9000000002' },
        ]
    },
    {
        id: 3, name: 'Sunday School',
        bearers: [
            { id: 1, name: 'Sample Headmaster', position: 'Headmaster', contact: '+91 9000000003' },
        ]
    },
];

export function getOrganisations(): Organisation[] {
    return readStore('stmosc_organisations', DEFAULT_ORGANISATIONS);
}
export function saveOrganisations(orgs: Organisation[]): void {
    writeStore('stmosc_organisations', orgs);
}

// ──── Event Banner Images ────
const DEFAULT_EVENT_BANNERS: EventBannerImage[] = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
        caption: 'Parish Feast Day Celebrations',
        order: 0,
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1548625361-ecaa842cebb0?w=800&h=600&fit=crop',
        caption: 'Holy Week Services & Prayers',
        order: 1,
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1467803738586-46b7eb7b16a1?w=800&h=600&fit=crop',
        caption: 'Youth Movement Annual Gathering',
        order: 2,
    },
    {
        id: 4,
        image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop',
        caption: 'Community & Family Events',
        order: 3,
    },
];

export function getEventBanners(): EventBannerImage[] {
    const stored = readStore('stmosc_event_banners', DEFAULT_EVENT_BANNERS);
    return [...stored].sort((a, b) => a.order - b.order);
}
export function saveEventBanners(banners: EventBannerImage[]): void {
    writeStore('stmosc_event_banners', banners);
}

// ──── ID Generation ────
export function nextId(items: { id: number }[]): number {
    return items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
}
