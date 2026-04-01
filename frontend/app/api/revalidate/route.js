import { revalidateTag } from 'next/cache';

export async function POST(request) {
    try {
        const body = await request.json();
        const { secret, tag } = body;

        // This secret must match the one sent by Django
        if (secret !== process.env.REVALIDATION_SECRET) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        if (!tag) {
            return new Response(JSON.stringify({ error: 'Missing cache tag' }), { status: 400 });
        }

        // Purge the cache!
        revalidateTag(tag);

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
