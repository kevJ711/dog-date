import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function GET() {
  try {
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all dogs owned by the user
    const { data: userDogs, error: dogsError } = await supabase
      .from('dogs')
      .select('id')
      .eq('owner_id', user.id);

    if (dogsError) {
      return NextResponse.json({ error: dogsError.message }, { status: 500 });
    }

    if (!userDogs || userDogs.length === 0) {
      return NextResponse.json({ likes: [], matches: [] });
    }

    const dogIds = userDogs.map(dog => dog.id);

    // Get likes where user's dogs are the ones doing the liking
    const { data: likesGiven, error: likesGivenError } = await supabase
      .from('likes')
      .select(`
        *,
        to_dog:to_dog_id (
          id,
          name,
          breed,
          age,
          size,
          photo_url,
          owner:owner_id (
            id,
            name,
            username
          )
        )
      `)
      .in('from_dog_id', dogIds);

    if (likesGivenError) {
      return NextResponse.json({ error: likesGivenError.message }, { status: 500 });
    }

    // Get likes where user's dogs are the ones being liked
    const { data: likesReceived, error: likesReceivedError } = await supabase
      .from('likes')
      .select(`
        *,
        from_dog:from_dog_id (
          id,
          name,
          breed,
          age,
          size,
          photo_url,
          owner:owner_id (
            id,
            name,
            username
          )
        )
      `)
      .in('to_dog_id', dogIds);

    if (likesReceivedError) {
      return NextResponse.json({ error: likesReceivedError.message }, { status: 500 });
    }

    // Find matches (mutual likes)
    const matches = [];
    if (likesGiven && likesReceived) {
      for (const likeGiven of likesGiven) {
        for (const likeReceived of likesReceived) {
          if (likeGiven.to_dog_id === likeReceived.from_dog_id && 
              likeGiven.from_dog_id === likeReceived.to_dog_id) {
            matches.push({
              like_given: likeGiven,
              like_received: likeReceived
            });
          }
        }
      }
    }

    return NextResponse.json({
      likes_given: likesGiven || [],
      likes_received: likesReceived || [],
      matches: matches
    });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { from_dog_id, to_dog_id } = body;

    if (!from_dog_id || !to_dog_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify that the user owns the from_dog_id
    const { data: dog, error: dogError } = await supabase
      .from('dogs')
      .select('owner_id')
      .eq('id', from_dog_id)
      .single();

    if (dogError || !dog) {
      return NextResponse.json({ error: 'Dog not found' }, { status: 404 });
    }

    if (dog.owner_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized to like from this dog' }, { status: 403 });
    }

    // Check if like already exists
    const { data: existingLike, error: checkError } = await supabase
      .from('likes')
      .select('id')
      .eq('from_dog_id', from_dog_id)
      .eq('to_dog_id', to_dog_id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows found
      return NextResponse.json({ error: checkError.message }, { status: 500 });
    }

    if (existingLike) {
      return NextResponse.json({ error: 'Like already exists' }, { status: 409 });
    }

    // Create the like
    const { data, error } = await supabase
      .from('likes')
      .insert({
        from_dog_id,
        to_dog_id
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { from_dog_id, to_dog_id } = body;

    if (!from_dog_id || !to_dog_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify that the user owns the from_dog_id
    const { data: dog, error: dogError } = await supabase
      .from('dogs')
      .select('owner_id')
      .eq('id', from_dog_id)
      .single();

    if (dogError || !dog) {
      return NextResponse.json({ error: 'Dog not found' }, { status: 404 });
    }

    if (dog.owner_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized to unlike from this dog' }, { status: 403 });
    }

    // Delete the like
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('from_dog_id', from_dog_id)
      .eq('to_dog_id', to_dog_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Like removed successfully' });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
