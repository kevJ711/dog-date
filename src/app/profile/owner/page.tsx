'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';


import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import { Footer } from '@/components/layout/footer';


export default function OwnerProfilePage() {
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    city: '',
    bio: '',
    preferredRadius: 10,
    allowMessages: true,
  });

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    if (type === 'checkbox') {
      setForm(f => ({ ...f, [name]: checked }));
    } else if (type === 'number') {
      setForm(f => ({ ...f, [name]: Number(value) }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Save owner profile →', form);
    alert('Owner profile saved! (connect to your API)');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Owner Profile</h1>
        <p className="text-gray-600 mb-8">Manage your personal information!</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <aside className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">Your Profile</h2>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 rounded-full overflow-hidden ring-2 ring-white bg-gray-100">
                    <Image
                      src="/avatars/default-dog-owner.png"
                      alt="Owner avatar"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-gray-900 font-medium">{form.name || 'Your Name'}</div>
                    <div className="text-gray-500">@{form.username || 'username'}</div>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Update Avatar</label>
                  <input type="file" accept="image/*" className="block w-full text-sm text-gray-700" />
                  <p className="text-xs text-gray-500 mt-1">PNG/JPG up to 2MB.</p>
                </div>

                <div className="mt-6 flex gap-3">
                  <Button className="w-full" onClick={onSave}>Save Changes</Button>
                  <Button variant="secondary" className="w-full" type="button">Preview</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Safety & Visibility</h3>
              </CardHeader>
              <CardContent>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="allowMessages"
                    checked={form.allowMessages}
                    onChange={onChange}
                    className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">Allow new messages from non-matches</span>
                </label>
                <p className="text-xs text-gray-500 mt-2">You can change this anytime.</p>
              </CardContent>
            </Card>
          </aside>

          <section className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
              </CardHeader>
              <CardContent>
                <form onSubmit={onSave} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      name="name"
                      value={form.name}
                      onChange={onChange}
                      placeholder="Your full name"
                    />
                    <Input
                      label="Username"
                      name="username"
                      value={form.username}
                      onChange={onChange}
                      placeholder="yourhandle"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Email"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={onChange}
                      placeholder="you@example.com"
                    />
                    <Input
                      label="Phone"
                      name="phone"
                      value={form.phone}
                      onChange={onChange}
                      placeholder="(555) 555-1234"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="City"
                      name="city"
                      value={form.city}
                      onChange={onChange}
                      placeholder="City, State"
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Match Radius (miles)</label>
                      <input
                        type="number"
                        name="preferredRadius"
                        min={1}
                        max={100}
                        value={form.preferredRadius}
                        onChange={onChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea
                      name="bio"
                      rows={4}
                      value={form.bio}
                      onChange={onChange}
                      placeholder="Tell other owners about you and your pup!"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <Button type="submit">Save Profile</Button>
                    <Button type="button" variant="secondary" onClick={() => history.back()}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">My Dogs</h2>
                  <Button size="sm" asChild>
                    <Link href="/dogs/new">Add Dog</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {[1, 2].map(i => (
                    <div key={i} className="border rounded-lg p-4 flex gap-3 bg-white">
                      <div className="relative h-16 w-16 rounded-md overflow-hidden bg-gray-100">
                        <Image src="/dogs/sample-dog.jpg" alt="Dog" fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">Nala</div>
                        <div className="text-sm text-gray-500">Golden Retriever • 3 yrs</div>
                        <div className="mt-2 flex gap-2">
                          <Button size="sm" variant="secondary" asChild>
                            <Link href={`/dogs/${i}`}>Edit</Link>
                          </Button>
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/dogs/${i}`}>View</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
