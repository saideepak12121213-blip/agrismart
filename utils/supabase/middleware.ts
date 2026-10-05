import { createServerClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://abclpnoierouoilfffct.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_DLWxWj_3-TuqqAxWFoQq9g_cFoqQKOZ";

export const createClient = (request: any) => {
  let supabaseResponse = {
    headers: request.headers,
    cookies: {
      set: (_name: string, _value: string, _options?: any) => {},
    },
  };

  const supabase = createServerClient(
    supabaseUrl!,
    supabaseKey!,
    {
      cookies: {
        getAll() {
          return request.cookies?.getAll?.() || [];
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies?.set?.(name, value));
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies?.set(name, value, options)
          );
        },
      },
    },
  );

  return { supabase, supabaseResponse };
};
