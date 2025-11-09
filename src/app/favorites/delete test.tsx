// Function to handle the deletion of a liked dog profile
  const handleDelete = async (dogId: string) => {
    // Confirm deletion with the user (optional)
    if (!window.confirm('Are you sure you want to remove this dog from your liked list?')) {
      return;
    }

    const { error } = await supabase
      .from('liked_dogs')
      .delete()
      .eq('id', dogId); // Target the specific row by its ID

    if (error) {
      console.error('Error deleting dog:', error);
      alert('Failed to delete the dog profile.');
    } else {
      // Update the local state to remove the deleted item from the list immediately
      setLikedDogs(likedDogs.filter((dog) => dog.id !== dogId));
      alert('Dog profile removed successfully!');
    }
  };

  if (loading) return <p>Loading liked dogs...</p>;


return (
    <div>
      <h1>Your Liked Dog Profiles</h1>
      {likedDogs.length > 0 ? (
        <ul>
          {likedDogs.map((dog) => (
            <li key={dog.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{dog.name}</span>
              {/* Pass the dog's ID to the handleDelete function */}
              <button onClick={() => handleDelete(dog.id)} style={{ marginLeft: '20px', cursor: 'pointer' }}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No liked dogs found.</p>
      )}
    </div>
  );
}