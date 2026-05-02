import { supabase } from '../../../../lib/supabase'
import { notFound } from 'next/navigation'
import CVPageClient from './CVPageClient'

interface PageProps {
  params: { slug: string }
}

export const dynamic = 'force-dynamic'

export default async function Page({ params }: PageProps) {
  const { data, error } = await supabase
    .from('cvs')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (error || !data) {
    return notFound()
  }

  return <CVPageClient cv={data} slug={params.slug} />
}
