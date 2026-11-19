import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const TEN_MIEN_EMAIL_AO = 'tutoan.example';

const KHOA_MAY_DUNG_CHUNG = 'tu_toan_chung_dao_may_dung_chung';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseKey = (
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  ''
).trim();

export const supabaseDaCauHinh = Boolean(supabaseUrl && supabaseKey);

// Bo luu tru phien dong: dung sessionStorage neu la may dung chung, nguoc lai localStorage
let cheDoMayDungChung =
  typeof window !== 'undefined' &&
  window.sessionStorage?.getItem(KHOA_MAY_DUNG_CHUNG) === '1';

const boLuuTruPhien = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return (
        (cheDoMayDungChung
          ? window.sessionStorage.getItem(key)
          : window.localStorage.getItem(key)) ??
        window.sessionStorage.getItem(key) ??
        window.localStorage.getItem(key)
      );
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    if (typeof window === 'undefined') return;
    try {
      if (cheDoMayDungChung) {
        window.sessionStorage.setItem(key, value);
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, value);
        window.sessionStorage.removeItem(key);
      }
    } catch {
      // Bo qua loi bo nho
    }
  },
  removeItem: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(key);
      window.sessionStorage.removeItem(key);
    } catch {
      // Bo qua
    }
  },
};

export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: boLuuTruPhien,
    },
  }
);

let clientPhu: SupabaseClient | null = null;

export async function datCheDoLuuPhien(mayDungChung: boolean): Promise<void> {
  cheDoMayDungChung = mayDungChung;
}

// Client Supabase phu khong luu phien, dung cho Quan tri vien tao tai khoan hang loat / cap thay the
// ma KHONG lam dang xuat phien cua Quan tri vien
export function laySupabasePhu(): SupabaseClient {
  if (!clientPhu) {
    clientPhu = createClient(
      supabaseUrl || 'https://placeholder.supabase.co',
      supabaseKey || 'placeholder-key',
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      }
    );
  }
  return clientPhu;
}

export async function kiemTraKetNoiSupabase(): Promise<boolean> {
  if (!supabaseDaCauHinh) {
    console.warn('Chưa cấu hình VITE_SUPABASE_URL hoặc VITE_SUPABASE_PUBLISHABLE_KEY.');
    return false;
  }
  try {
    const { error } = await supabase
      .from('cau_hinh')
      .select('tep')
      .eq('tep', 'congKhai')
      .maybeSingle();
    if (error && error.message?.toLowerCase().includes('fetch')) {
      console.error('Không thể kết nối máy chủ Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Không thể kết nối máy chủ Supabase:', err);
    return false;
  }
}
