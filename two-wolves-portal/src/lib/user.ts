
import { supabase } from './supabaseClient'
import type { User } from '@supabase/supabase-js'

export async function upsertSelf(user: User) {
  await supabase.from('users').upsert({ id: user.id, display_name: user.email?.split('@')[0] })
}
