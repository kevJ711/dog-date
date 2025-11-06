import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('dogs')
      .select('*');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
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


    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (!existingProfile) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id, 
          name: user.email?.split('@')[0] || 'User',
          username: user.email?.split('@')[0] || null,
          email: user.email || null,
        });

      if (profileError) {
        return NextResponse.json({ 
          error: `Failed to create profile: ${profileError.message}` 
        }, { status: 500 });
      }
    }

    const body = await req.json();
    const { name, breed, age, size, temperament, vaccination_status, photo_url } = body;

    if (!name || !breed || !age) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('dogs')
      .insert({
        owner_id: user.id, 
        name,
        breed,
        age,
        size,
        temperament,
        vaccination_status,
        photo_url
      })
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data[0], { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, name, breed, age, size, temperament, vaccination_status, photo_url } = body;

    if (!id) {
      return NextResponse.json({ error: 'Dog ID required' }, { status: 400 });
    }

    // First check if the dog belongs to the authenticated user
    const { data: dog, error: fetchError } = await supabase
      .from('dogs')
      .select('owner_id')
      .eq('id', id)
      .single();

    if (fetchError || !dog) {
      return NextResponse.json({ error: 'Dog not found' }, { status: 404 });
    }

    if (dog.owner_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized to update this dog' }, { status: 403 });
    }

    // Build update object with only provided fields
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (breed !== undefined) updateData.breed = breed;
    if (age !== undefined) updateData.age = age;
    if (size !== undefined) updateData.size = size;
    if (temperament !== undefined) updateData.temperament = temperament;
    if (vaccination_status !== undefined) updateData.vaccination_status = vaccination_status;
    if (photo_url !== undefined) updateData.photo_url = photo_url;

    // Validate that at least one field is provided for update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'At least one field must be provided for update' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('dogs')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
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

    const { id } = await req.json();
    
    if (!id) {
      return NextResponse.json({ error: 'Dog ID required' }, { status: 400 });
    }

    // First check if the dog belongs to the authenticated user
    const { data: dog, error: fetchError } = await supabase
      .from('dogs')
      .select('owner_id')
      .eq('id', id)
      .single();

    if (fetchError || !dog) {
      return NextResponse.json({ error: 'Dog not found' }, { status: 404 });
    }

    if (dog.owner_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized to delete this dog' }, { status: 403 });
    }

    const { error } = await supabase
      .from('dogs')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Dog deleted successfully" });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

