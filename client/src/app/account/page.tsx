import { getAuthSession } from '@/lib/auth';

import React from 'react';

async function Page() {
  const session = await getAuthSession();

  return <div>User Page</div>;
}

export default Page;
