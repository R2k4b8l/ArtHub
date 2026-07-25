export const artworkCollection = async (queryParams = {}) => {
    const { search, category, status, sort, page, limit } = queryParams;
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    if (status) params.append('status', status);
    if (sort) params.append('sort', sort);
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);

    const queryString = params.toString();
    const url = queryString ? `${process.env.NEXT_PUBLIC_API_URL}?${queryString}` : (process.env.NEXT_PUBLIC_API_URL);
    const res = await fetch(url);
    const data = await res.json();
    return data;
}

export const artworkFilters = async () => {
    const backendUrl = process.env.NEXT_PUBLIC_FILTER_API_URL ;
    const res = await fetch(`${backendUrl}`);
    const data = await res.json();
    return data;
}

export const topArtists = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/artists/top`);
    if (!res.ok) {
        throw new Error("Failed to fetch top artists");
    }
    return await res.json();
}

export const deleteArtwork = async (id) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/${id}`,
    {
      method: "DELETE",
    }
  );

  return await res.json();
};
export const updateArtwork = async (id, artworkData) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(artworkData),
    }
  );

  return await res.json();
};

export const userDetails = async () =>{
    const res = await fetch (process.env.NEXT_PUBLIC_USER_API_URL);
    const data = await res.json();
    return data;
}


export const updateUserRole = async (id, role) => {

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_USER_API_URL}/${id}`,
    {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        role
      })
    }
  );

  return await res.json();
}


export const purchaseHistory = async (buyerId, artistId) => {
  const params = new URLSearchParams();

  if (buyerId) params.append("buyerId", buyerId);
  if (artistId) params.append("artistId", artistId);

  const url = `${process.env.NEXT_PUBLIC_SALES_HISTORY_API_URL}?${params.toString()}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed to fetch purchase history");
  }

  return await res.json();
};


export const updateSubscription = async (id, plan) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_USER_API_URL}/${id}/subscription`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        plan,
      }),
    }
  );

  return await res.json();
};


// Comment 
export const getArtworkComments = async (artworkId) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/comments/${artworkId}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch comments");
  }

  return await res.json();
};

export const addComment = async (commentData) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/comments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commentData),
    }
  );

  return await res.json();
};

export const getUserComments = async (userId) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/comments/user/${userId}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch user comments");
  }

  return await res.json();
};

export const getSubscriptionHistory = async (userId) => {
  const url = userId
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/subscription-history?userId=${userId}`
    : `${process.env.NEXT_PUBLIC_BACKEND_URL}/subscription-history`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed to fetch subscription history");
  }

  return await res.json();
};


export const getTransactions = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/transactions`);

  if (!res.ok) {
    throw new Error("Failed to fetch transactions");
  }

  return await res.json();
};


export const getDailyTransactions = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/transactions/daily`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch daily transactions");
  return await res.json();
};