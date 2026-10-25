import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import {
  User,
  FinancialTransaction,
  WithdrawalRequest,
  FinancialRecord,
  ClearanceDeal,
  NeighborhoodPost,
  WithdrawalNotification,
} from '../types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Persistent database path in workspace
const DB_PATH = path.resolve(__dirname, '../../cazaahorro.db');

export const db = new DatabaseSync(DB_PATH);

// Enable WAL for performance and reliability
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

// Password hashing helper using standard Node scrypt
export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const finalSalt = salt || crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, finalSalt, 64);
  return { hash: derivedKey.toString('hex'), salt: finalSalt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const derivedKey = crypto.scryptSync(password, salt, 64);
  const hashBuffer = Buffer.from(hash, 'hex');
  return crypto.timingSafeEqual(derivedKey, hashBuffer);
}

// Initialize tables
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      role TEXT NOT NULL,
      permissions_json TEXT NOT NULL,
      phone TEXT,
      city TEXT,
      country TEXT,
      premium_status TEXT,
      created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TEXT NOT NULL,
      expires_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS financial_ledger (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      concept TEXT NOT NULL,
      gross_amount REAL NOT NULL,
      fee_amount REAL NOT NULL,
      net_amount REAL NOT NULL,
      currency TEXT NOT NULL,
      source TEXT NOT NULL,
      status TEXT NOT NULL,
      reference TEXT UNIQUE NOT NULL,
      gateway TEXT NOT NULL,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS withdrawals (
      id TEXT PRIMARY KEY,
      idempotency_key TEXT UNIQUE NOT NULL,
      user_id TEXT NOT NULL REFERENCES users(id),
      user_name TEXT NOT NULL,
      user_email TEXT NOT NULL,
      user_role TEXT NOT NULL,
      amount REAL NOT NULL,
      currency TEXT NOT NULL,
      fee REAL NOT NULL,
      net_amount REAL NOT NULL,
      provider TEXT NOT NULL,
      account_details_json TEXT NOT NULL,
      status TEXT NOT NULL,
      requested_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      rejection_reason TEXT,
      rejection_fix_instructions TEXT,
      provider_reference TEXT,
      estimated_delivery_hours INTEGER DEFAULT 24,
      audit_trail_json TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      type TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      withdrawal_id TEXT
    );

    CREATE TABLE IF NOT EXISTS personal_records (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      amount REAL NOT NULL,
      currency TEXT NOT NULL,
      category TEXT NOT NULL,
      concept TEXT NOT NULL,
      date TEXT NOT NULL,
      is_recurrent INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS clearance_deals (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      store TEXT NOT NULL,
      location TEXT NOT NULL,
      original_price REAL NOT NULL,
      discount_price REAL NOT NULL,
      discount_percentage REAL NOT NULL,
      stock_remaining INTEGER NOT NULL,
      pickup_window TEXT NOT NULL,
      expires_in_hours INTEGER NOT NULL,
      verified INTEGER DEFAULT 1,
      reserved INTEGER DEFAULT 0,
      reserved_by TEXT
    );

    CREATE TABLE IF NOT EXISTS community_posts (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      author TEXT NOT NULL,
      sector TEXT NOT NULL,
      category TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      likes INTEGER DEFAULT 0,
      verified_community_user INTEGER DEFAULT 1
    );
  `);

  // Seed default owner account if not exists
  const ownerCheck = db.prepare('SELECT id FROM users WHERE email = ?').get('jeiishin75@gmail.com');
  if (!ownerCheck) {
    const { hash, salt } = hashPassword('Admin2026*');
    const ownerPermissions = JSON.stringify({
      canViewFinancials: true,
      canWithdraw: true,
      canManageUsers: true,
      canModerateContent: true,
      canPublishOffers: true,
    });

    db.prepare(`
      INSERT INTO users (id, name, email, password_hash, salt, role, permissions_json, phone, city, country, premium_status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'usr_owner_001',
      'Dueño / Creador Principal',
      'jeiishin75@gmail.com',
      hash,
      salt,
      'owner',
      ownerPermissions,
      '+1 (809) 555-0199',
      'Santo Domingo',
      'República Dominicana',
      'premium_annual',
      new Date().toISOString()
    );
  }

  // Seed initial ledger records if table is empty
  const ledgerCount = (db.prepare('SELECT COUNT(*) as count FROM financial_ledger').get() as any).count;
  if (ledgerCount === 0) {
    const seedTransactions = [
      {
        id: 'TX-2026-8901',
        date: '2026-10-25T04:15:00.000Z',
        concept: 'Suscripción Premium Anual — 10 Usuarios Pro',
        gross_amount: 14990.0,
        fee_amount: 449.7,
        net_amount: 14540.3,
        currency: 'DOP',
        source: 'subscriptions',
        status: 'confirmed',
        reference: 'CRD-SUB-890112',
        gateway: 'CardNet RD',
        notes: 'Liquidación confirmada vía CardNet RD',
      },
      {
        id: 'TX-2026-8902',
        date: '2026-10-24T18:30:00.000Z',
        concept: 'Publicidad Programática Google AdMob (Sept-Oct)',
        gross_amount: 38400.0,
        fee_amount: 0.0,
        net_amount: 38400.0,
        currency: 'DOP',
        source: 'ads',
        status: 'confirmed',
        reference: 'ADMOB-RD-554192',
        gateway: 'Google AdMob',
        notes: 'Pago recibido por transferencia internacional',
      },
      {
        id: 'TX-2026-8903',
        date: '2026-10-24T11:20:00.000Z',
        concept: 'Comisión ventas marketplace ÚltimaOferta (10%)',
        gross_amount: 8250.0,
        fee_amount: 247.5,
        net_amount: 8002.5,
        currency: 'DOP',
        source: 'commissions',
        status: 'confirmed',
        reference: 'AZUL-MKP-33921',
        gateway: 'Azul (Banco Popular)',
        notes: 'Comisión neta de la plataforma',
      },
      {
        id: 'TX-2026-8904',
        date: '2026-10-23T16:45:00.000Z',
        concept: 'Afiliación comercial CercaRD y verificación de colmados',
        gross_amount: 12500.0,
        fee_amount: 375.0,
        net_amount: 12125.0,
        currency: 'DOP',
        source: 'merchant_listings',
        status: 'confirmed',
        reference: 'BHD-DIR-77412',
        gateway: 'Direct Transfer',
        notes: 'Verificación anual de comercios certificados',
      },
      {
        id: 'TX-2026-8905',
        date: '2026-10-22T09:10:00.000Z',
        concept: 'Paquete de créditos IA ProfeIA y ViralLab',
        gross_amount: 5600.0,
        fee_amount: 168.0,
        net_amount: 5432.0,
        currency: 'DOP',
        source: 'in_app_purchases',
        status: 'confirmed',
        reference: 'CRD-IAP-11094',
        gateway: 'CardNet RD',
        notes: 'Compra de créditos en la app',
      },
      {
        id: 'TX-2026-8906',
        date: '2026-10-25T06:00:00.000Z',
        concept: 'Suscripciones mensuales pendientes de corte bancario',
        gross_amount: 9800.0,
        fee_amount: 294.0,
        net_amount: 9506.0,
        currency: 'DOP',
        source: 'subscriptions',
        status: 'pending_settlement',
        reference: 'AZUL-PEND-4401',
        gateway: 'Azul (Banco Popular)',
        notes: 'En proceso de liquidación 48 horas hábiles',
      },
    ];

    const insertLedgerStmt = db.prepare(`
      INSERT INTO financial_ledger (id, date, concept, gross_amount, fee_amount, net_amount, currency, source, status, reference, gateway, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const tx of seedTransactions) {
      insertLedgerStmt.run(
        tx.id,
        tx.date,
        tx.concept,
        tx.gross_amount,
        tx.fee_amount,
        tx.net_amount,
        tx.currency,
        tx.source,
        tx.status,
        tx.reference,
        tx.gateway,
        tx.notes
      );
    }
  }

  // Seed default clearance deals if empty
  // Seed default clearance deals (ensures multi-province deals are present)
  const seedDeals = [
    {
      id: 'deal_01',
      title: 'Pack de Queso Cheddar Madurado 2 lbs (Excedente de lote)',
      store: 'Supermercado Central Piantini',
      location: 'Av. Winston Churchill, Santo Domingo',
      original_price: 650.0,
      discount_price: 299.0,
      discount_percentage: 54,
      stock_remaining: 8,
      pickup_window: 'Hoy 4:00 PM - 8:30 PM',
      expires_in_hours: 6,
    },
    {
      id: 'deal_02',
      title: 'Lote Panadería Artesanal: 12 Croissants y Pan Campesino',
      store: 'La Baguette Panadería Bistró',
      location: 'Bella Vista, Santo Domingo',
      original_price: 720.0,
      discount_price: 320.0,
      discount_percentage: 55,
      stock_remaining: 4,
      pickup_window: 'Hoy 6:00 PM - 9:00 PM',
      expires_in_hours: 5,
    },
    {
      id: 'deal_03',
      title: 'Caja Frutas Frescas y Vegetales del Cibao (15 lbs)',
      store: 'Mercado Verde Orgánico',
      location: 'Santiago de los Caballeros (Santiago)',
      original_price: 850.0,
      discount_price: 425.0,
      discount_percentage: 50,
      stock_remaining: 6,
      pickup_window: 'Mañana 8:00 AM - 12:00 PM',
      expires_in_hours: 18,
    },
    {
      id: 'deal_04',
      title: 'Combo Gourmet Café Orgánico y Dulces Típicos',
      store: 'Deli del Este',
      location: 'Punta Cana, La Altagracia',
      original_price: 1100.0,
      discount_price: 490.0,
      discount_percentage: 55,
      stock_remaining: 5,
      pickup_window: 'Hoy 3:00 PM - 7:00 PM',
      expires_in_hours: 7,
    },
    {
      id: 'deal_05',
      title: 'Caja de Mariscos Frescos de la Costa Atlántica (8 lbs)',
      store: 'Pescadería El Malecón',
      location: 'San Felipe de Puerto Plata (Puerto Plata)',
      original_price: 1450.0,
      discount_price: 690.0,
      discount_percentage: 52,
      stock_remaining: 3,
      pickup_window: 'Hoy 5:00 PM - 8:00 PM',
      expires_in_hours: 4,
    },
    {
      id: 'deal_06',
      title: 'Caja Dulces Banilejos Tradicionales y Mangos',
      store: 'Dulcería El Caney',
      location: 'Baní, Peravia',
      original_price: 680.0,
      discount_price: 310.0,
      discount_percentage: 54,
      stock_remaining: 7,
      pickup_window: 'Mañana 9:00 AM - 1:00 PM',
      expires_in_hours: 20,
    },
  ];

  const insertDealStmt = db.prepare(`
    INSERT OR IGNORE INTO clearance_deals (id, title, store, location, original_price, discount_price, discount_percentage, stock_remaining, pickup_window, expires_in_hours, verified, reserved)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0)
  `);

    for (const d of seedDeals) {
      insertDealStmt.run(
        d.id,
        d.title,
        d.store,
        d.location,
        d.original_price,
        d.discount_price,
        d.discount_percentage,
        d.stock_remaining,
        d.pickup_window,
        d.expires_in_hours
      );
    }

  // Seed community posts (ensures multi-province posts are present)
  const seedPosts = [
    {
      id: 'post_01',
      author: 'Elena Martínez',
      sector: 'Bella Vista, Santo Domingo',
      category: 'objetos_perdidos',
      title: 'Gatito extraviado con collar azul cerca de la Av. Sarasota',
      content: 'Se extravió anoche un gato siamés de ojos claros. Lleva collar azul con placa. Si alguien lo vio por favor escribir por aquí.',
      timestamp: 'Hace 2 horas',
      likes: 14,
    },
    {
      id: 'post_02',
      author: 'Junta de Vecinos Gazcue',
      sector: 'Gazcue, Distrito Nacional',
      category: 'alerta',
      title: 'Aviso CAASD: Trabajos de mantenimiento en tubería central',
      content: 'La CAASD informa que el suministro de agua estará reducido el día de mañana de 9:00 AM a 3:00 PM por sustitución de válvulas.',
      timestamp: 'Hace 4 horas',
      likes: 38,
    },
    {
      id: 'post_03',
      author: 'Manuel Valdez',
      sector: 'Piantini, Distrito Nacional',
      category: 'recomendacion',
      title: 'Excelente servicio de Don Pedro A/C (Verificado en CercaRD)',
      content: 'Recomiendo 100% a Don Pedro para mantenimiento de aires. Llegó a la hora acordada, cobró el precio publicado y fue súper limpio.',
      timestamp: 'Hace 1 día',
      likes: 22,
    },
    {
      id: 'post_04',
      author: 'Ing. Carlos Peralta',
      sector: 'Los Jardines Metropolitanos, Santiago',
      category: 'alerta',
      title: 'CORAASAN: Mantenimiento acueducto Cibao Central',
      content: 'Aviso a las familias de Villa Olga y Los Jardines sobre baja presión temporal este jueves por limpieza de filtros.',
      timestamp: 'Hace 3 horas',
      likes: 29,
    },
    {
      id: 'post_05',
      author: 'Lucía Almonte',
      sector: 'Bávaro, La Altagracia',
      category: 'comunidad',
      title: 'Jornada de Limpieza de Playas y Concientización Ambiental',
      content: 'Nos reuniremos este sábado a las 7:30 AM en Playa Bibijagua para jornada comunitaria. Traer guantes y ropa fresca.',
      timestamp: 'Hace 5 horas',
      likes: 45,
    },
    {
      id: 'post_06',
      author: 'Roberto Ceballos',
      sector: 'Costambar, Puerto Plata',
      category: 'recomendacion',
      title: 'Servicio de cerrajería de emergencia 24/7 en Puerto Plata',
      content: 'Excelente atención de Cerrajero del Atlántico. Rápido y con tarifa justa.',
      timestamp: 'Hace 8 horas',
      likes: 19,
    },
  ];

  const insertPostStmt = db.prepare(`
    INSERT OR IGNORE INTO community_posts (id, author, sector, category, title, content, timestamp, likes, verified_community_user)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
  `);

  for (const p of seedPosts) {
    insertPostStmt.run(p.id, p.author, p.sector, p.category, p.title, p.content, p.timestamp, p.likes);
  }

  // Seed default withdrawals if empty
  const withCount = (db.prepare('SELECT COUNT(*) as count FROM withdrawals').get() as any).count;
  if (withCount === 0) {
    const seedWithdrawals = [
      {
        id: 'WD-2026-001',
        idempotency_key: 'idemp_seed_001',
        user_id: 'usr_owner_001',
        user_name: 'Dueño / Creador Principal',
        user_email: 'jeiishin75@gmail.com',
        user_role: 'owner',
        amount: 25000.0,
        currency: 'DOP',
        fee: 87.5,
        net_amount: 24912.5,
        provider: 'ACH_BANRESERVAS',
        account_details_json: JSON.stringify({
          bankName: 'Banco de Reservas',
          accountType: 'corriente',
          accountNumberMasked: '****-****-****-9012',
          accountHolderName: 'Corporación CazaAhorro SRL',
          cedulaOrRnc: '1-32-45892-1',
        }),
        status: 'completado',
        requested_at: '2026-10-10T10:00:00.000Z',
        updated_at: '2026-10-11T14:22:00.000Z',
        provider_reference: 'ACH-BR-20261011-88421',
        audit_trail_json: JSON.stringify([
          { timestamp: '2026-10-10T10:00:00.000Z', actor: 'jeiishin75@gmail.com', action: 'Solicitud creada con éxito' },
          { timestamp: '2026-10-10T12:00:00.000Z', actor: 'Sistema de Seguridad', action: 'Verificación de doble factor confirmada' },
          { timestamp: '2026-10-11T14:22:00.000Z', actor: 'SIPARD Banreservas', action: 'Transferencia ACH completada. Fondos acreditados' },
        ]),
      },
    ];

    const insertWithStmt = db.prepare(`
      INSERT INTO withdrawals (
        id, idempotency_key, user_id, user_name, user_email, user_role,
        amount, currency, fee, net_amount, provider, account_details_json,
        status, requested_at, updated_at, provider_reference, audit_trail_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const w of seedWithdrawals) {
      insertWithStmt.run(
        w.id,
        w.idempotency_key,
        w.user_id,
        w.user_name,
        w.user_email,
        w.user_role,
        w.amount,
        w.currency,
        w.fee,
        w.net_amount,
        w.provider,
        w.account_details_json,
        w.status,
        w.requested_at,
        w.updated_at,
        w.provider_reference,
        w.audit_trail_json
      );
    }
  }
}

// User DAO
export function findUserByEmail(email: string): (User & { password_hash: string; salt: string }) | null {
  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim()) as any;
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    password_hash: row.password_hash,
    salt: row.salt,
    role: row.role,
    permissions: JSON.parse(row.permissions_json),
    phone: row.phone,
    city: row.city,
    country: row.country,
    premiumStatus: row.premium_status,
    createdAt: row.created_at,
  };
}

export function findUserById(id: string): User | null {
  const row = db.prepare('SELECT * FROM users WHERE id = ?').get(id) as any;
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    permissions: JSON.parse(row.permissions_json),
    phone: row.phone,
    city: row.city,
    country: row.country,
    premiumStatus: row.premium_status,
    createdAt: row.created_at,
  };
}

export function createSession(userId: string): string {
  const token = crypto.randomBytes(32).toString('hex');
  const now = new Date();
  const expires = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
  db.prepare('INSERT INTO sessions (token, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)').run(
    token,
    userId,
    now.toISOString(),
    expires.toISOString()
  );
  return token;
}

export function getUserBySessionToken(token: string): User | null {
  const session = db.prepare('SELECT user_id, expires_at FROM sessions WHERE token = ?').get(token) as any;
  if (!session) return null;
  if (new Date(session.expires_at).getTime() < Date.now()) {
    db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
    return null;
  }
  return findUserById(session.user_id);
}

export function deleteSession(token: string): void {
  db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
}
