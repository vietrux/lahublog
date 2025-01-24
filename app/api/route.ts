import { NextResponse } from 'next/server'
import { fetchPages, fetchBySlug, fetchPagesBlocks, searchPages, fetchSlugsOnly } from '@/lib/notion'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    
    switch (action) {
      case 'listSlugs':
        const slugs = await fetchSlugsOnly()
        return NextResponse.json(slugs)
        
      case 'list':
        const pages = await fetchPages()
        return NextResponse.json(pages)
      
      case 'search':
        const query = searchParams.get('q')
        if (!query) return NextResponse.json({ error: 'Query parameter required' }, { status: 400 })
        const results = await searchPages(query)
        return NextResponse.json(results)
      
      case 'getBySlug':
        const slug = searchParams.get('slug')
        if (!slug) return NextResponse.json({ error: 'Slug parameter required' }, { status: 400 })
        const page = await fetchBySlug(slug)
        return NextResponse.json(page || { error: 'Page not found' })
      
      case 'getBlocks':
        const pageId = searchParams.get('pageId')
        if (!pageId) return NextResponse.json({ error: 'PageId parameter required' }, { status: 400 })
        const blocks = await fetchPagesBlocks(pageId)
        return NextResponse.json(blocks)
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error: unknown) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}