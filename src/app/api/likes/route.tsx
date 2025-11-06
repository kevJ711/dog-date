import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    let token: string | null = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.replace('Bearer ', '');
    } else {
      const cookies = req.cookies.getAll();
      const sessionCookie = cookies.find(c => c.name.includes('sb-') && c.name.includes('-auth-token'));
      if (sessionCookie) {
        try {
          const sessionData = JSON.parse(sessionCookie.value);
          token = sessionData?.access_token || null;
        } catch (e) {
        }
      }
    }
    
    // Create Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }
    
    // Create Supabase client with auth token if available
    const supabase = token 
      ? createClient(supabaseUrl, supabaseAnonKey, {
          global: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        })
      : createClient(supabaseUrl, supabaseAnonKey);
    
    // Get authenticated user
    const { data: { user }, error: authError } = token 
      ? await supabase.auth.getUser(token)
      : await supabase.auth.getUser();
    
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
      return NextResponse.json({ 
        likes_given: [], 
        likes_received: [], 
        matches: [] 
      });
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
          temperament,
          vaccination_status,
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
      console.error('Error fetching likes given:', likesGivenError);
      return NextResponse.json({ error: likesGivenError.message }, { status: 500 });
    }

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
          temperament,
          vaccination_status,
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

    // Find matches - where two dog owners have liked each other's dogs
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
  } catch (err: any) {
    console.error('Error in GET /api/likes:', err);
    return NextResponse.json({ 
      error: err?.message || 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? err?.stack : undefined
    }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // Get auth token from Authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized - No token provided' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Create Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }
    
    // Create Supabase client with auth token
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });
    

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
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

    if (checkError && checkError.code !== 'PGRST116') {
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
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized - No token provided' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { from_dog_id, to_dog_id } = body;

    console.log('DELETE request received:', { from_dog_id, to_dog_id, user_id: user.id });

    if (!from_dog_id || !to_dog_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data: dog, error: dogError } = await supabase
      .from('dogs')
      .select('owner_id')
      .eq('id', from_dog_id)
      .single();

    if (dogError || !dog) {
      console.error('Dog not found:', dogError);
      return NextResponse.json({ error: 'Dog not found' }, { status: 404 });
    }

    if (dog.owner_id !== user.id) {
      console.error('Unauthorized:', { dog_owner: dog.owner_id, user_id: user.id });
      return NextResponse.json({ error: 'Unauthorized to unlike from this dog' }, { status: 403 });
    }

    const { data: existingLike, error: checkError } = await supabase
      .from('likes')
      .select('*')
      .eq('from_dog_id', from_dog_id)
      .eq('to_dog_id', to_dog_id)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking like:', checkError);
      return NextResponse.json({ error: checkError.message }, { status: 500 });
    }

    if (!existingLike) {
      console.log('Like does not exist (may have been deleted already or never existed)');

      return NextResponse.json({ 
        message: 'Like does not exist (already deleted or never existed)', 
        deleted: [],
        alreadyDeleted: true
      });
    }

    console.log('Like found, deleting:', existingLike.id);

    // Delete the like
    const { data, error } = await supabase
      .from('likes')
      .delete()
      .eq('from_dog_id', from_dog_id)
      .eq('to_dog_id', to_dog_id)
      .select();

    if (error) {
      console.error('Error deleting like:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Verify deletion worked
    if (!data || data.length === 0) {
      // Check if the like actually existed
      const { data: existingLike } = await supabase
        .from('likes')
        .select('id')
        .eq('from_dog_id', from_dog_id)
        .eq('to_dog_id', to_dog_id)
        .single();
      
      if (existingLike) {
        return NextResponse.json({ error: 'Like deletion failed' }, { status: 500 });
      }
      // Like didn't exist, but that's okay - return success
    }

    return NextResponse.json({ message: 'Like removed successfully', deleted: data });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
