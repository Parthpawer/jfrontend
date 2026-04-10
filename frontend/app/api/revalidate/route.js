import { revalidateTag, revalidatePath } from 'next/cache';

export async function POST(request) {
    try {
        const body = await request.json();
        const { secret, tag } = body;

        // This secret must match the one sent by Django
        if (secret !== process.env.REVALIDATION_SECRET) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        if (tag) {
            revalidateTag(tag);
        }
        
        // As a fallback, completely reconstruct the homepage cache
        revalidatePath('/');
        // Revalidate the overall products pages as well
        revalidatePath('/products');
        revalidatePath('/categories/[slug]', 'page');

        return new Response(JSON.stringify({
            revalidated: true,
            tag,
            now: Date.now()
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (err) {
        console.error('Revalidation error:', err);
        return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
    }
}
