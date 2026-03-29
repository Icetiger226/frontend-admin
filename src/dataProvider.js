import { API_URL, credFetch } from './apiConfig';

// Mapping React-Admin resources -> backend routes
// - Standard collections (CRUD): activites, actualites, membres, temoignages
// - Single collection name mismatch: backend uses "/mot-President"; we expose resource as "motpresident" in RA
// - Messages and Newsletter have custom admin endpoints for list/filtering

const httpClient = async (url, options = {}) => {
  const opts = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  };
  const res = await credFetch(url, opts);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  // Try to parse JSON safely
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return res.json();
  }
  return res.text();
};

// Helpers
const buildQueryParams = (paramsObj) => {
  const usp = new URLSearchParams();
  Object.entries(paramsObj).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    usp.set(k, String(v));
  });
  return usp.toString();
};

const sanitizeId = (doc) => {
  if (!doc) return doc;
  if (Array.isArray(doc)) return doc.map(sanitizeId);
  if (doc.id) return doc; // backend already transforms _id -> id
  if (doc._id) {
    const { _id, ...rest } = doc;
    return { id: String(_id), ...rest };
  }
  return doc;
};

const collectionPath = (resource) => {
  switch (resource) {
    case 'motpresident':
      return 'mot-President';
    case 'admin-users':
      return 'admin/users';
    default:
      return resource; // activites, actualites, membres, temoignages, newsletter, messages
  }
};

const adminPath = (resource) => {
  if (resource === 'messages') return 'admin/messages';
  if (resource === 'newsletter') return 'admin/newsletter/subscribers';
  if (resource === 'admin-users') return 'admin/users';
  return null;
};

const dataProvider = {
  // GET_LIST
  getList: async (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort || {};
    const filters = params.filter || {};

    // Admin log files (combined/error/etc.)
    if (resource === 'admin-logs') {
      const query = {
        page,
        limit: perPage,
        ...(filters.type ? { type: filters.type } : {}),
        ...(filters.level ? { level: filters.level } : {}),
        ...(filters.q ? { q: filters.q } : {}),
        ...(filters.date ? { date: filters.date } : {}),
      };
      const url = `${API_URL}/admin/logs?${buildQueryParams(query)}`;
      const data = await httpClient(url);
      const payload = data?.data || data;
      const entries = Array.isArray(payload?.entries) ? payload.entries : [];
      const records = entries.map((e, idx) => ({ id: `${payload.file || 'log'}-${(page - 1) * perPage + idx + 1}`, ...e }));
      const total = payload?.pagination?.total ?? records.length;
      return { data: records, total };
    }

    // Audit trail (DB)
    if (resource === 'audit-logs') {
      const query = {
        page,
        limit: perPage,
        ...(filters.action ? { action: filters.action } : {}),
        ...(filters.resource ? { resource: filters.resource } : {}),
        ...(filters.actorId ? { actorId: filters.actorId } : {}),
        ...(filters.targetId ? { targetId: filters.targetId } : {}),
        ...(filters.from ? { from: filters.from } : {}),
        ...(filters.to ? { to: filters.to } : {}),
        ...(filters.q ? { q: filters.q } : {}),
      };
      const url = `${API_URL}/admin/logs/audit?${buildQueryParams(query)}`;
      const data = await httpClient(url);
      const payload = data?.data || data;
      const entries = Array.isArray(payload?.entries) ? payload.entries : [];
      const records = sanitizeId(entries);
      const total = payload?.pagination?.total ?? records.length;
      return { data: records, total };
    }

    // Messages & newsletter via endpoints admin custom avec pagination
    const adminEndpoint = adminPath(resource);
    if (adminEndpoint) {
      const query = {
        page,
        limit: perPage,
        ...(filters || {}),
      };
      // Map RA SearchInput 'q' to backend 'search'
      if (filters.q && !query.search) {
        query.search = filters.q;
      }
      const url = `${API_URL}/${adminEndpoint}?${buildQueryParams(query)}`;
      const data = await httpClient(url);
      const payload = data?.data || data; // admin-users returns {success, data: {users, pagination, stats}}
      const records = sanitizeId(payload.messages || payload.subscribers || payload.users || []);
      const total = payload.pagination?.total ?? records.length;
      return { data: records, total };
    }

    // Collections standard
    const base = `${API_URL}/${collectionPath(resource)}`;
    const data = await httpClient(base);
    let items = sanitizeId(Array.isArray(data) ? data : []);
    // client-side search (q)
    if (filters.q) {
      const q = String(filters.q).toLowerCase();
      const candidateFields = ['titre', 'nom', 'auteur', 'commentaire', 'lieu', 'contenu', 'email', 'poste'];
      items = items.filter((it) =>
        candidateFields.some((f) => typeof it[f] === 'string' && it[f].toLowerCase().includes(q))
      );
    }
    // simple client-side sort/paginate since backend returns arrays
    if (field) {
      items = items.slice().sort((a, b) => {
        const av = a[field];
        const bv = b[field];
        if (av === bv) return 0;
        const comp = av > bv ? 1 : -1;
        return order === 'ASC' ? comp : -1 * comp;
      });
    }
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return { data: items.slice(start, end), total: items.length };
  },

  // GET_ONE
  getOne: async (resource, params) => {
    // Messages: backend n'expose pas GET /api/admin/messages/:id → utiliser la route publique
    if (resource === 'messages') {
      const url = `${API_URL}/messages/${params.id}`; // public route supports get by id
      const data = await httpClient(url);
      const payload = data?.data || data;
      return { data: sanitizeId(payload) };
    }
    // Newsletter: tenter l'endpoint admin puis fallback public
    if (resource === 'newsletter') {
      try {
        const url = `${API_URL}/admin/newsletter/subscribers/${params.id}`;
        const data = await httpClient(url);
        const payload = data?.data || data;
        return { data: sanitizeId(payload) };
      } catch (e) {
        // Fallback sur la route publique si jamais l'admin n'est pas dispo
        const fallbackUrl = `${API_URL}/newsletter/${params.id}`;
        const data = await httpClient(fallbackUrl);
        const payload = data?.data || data;
        return { data: sanitizeId(payload) };
      }
    }
    // Admin endpoints for other resources (e.g., admin-users)
    const adminEndpoint = adminPath(resource);
    if (adminEndpoint) {
      const url = `${API_URL}/${adminEndpoint}/${params.id}`;
      const data = await httpClient(url);
      const payload = data?.data || data;
      return { data: sanitizeId(payload) };
    }
    const base = `${API_URL}/${collectionPath(resource)}/${params.id}`;
    const data = await httpClient(base);
    const payload = data?.data || data;
    return { data: sanitizeId(payload) };
  },

  // GET_MANY
  getMany: async (resource, params) => {
    const base = `${API_URL}/${collectionPath(resource)}`;
    const data = await httpClient(base);
    const items = sanitizeId(Array.isArray(data) ? data : []);
    const map = new Map(items.map((i) => [String(i.id), i]));
    const selected = params.ids.map((id) => map.get(String(id))).filter(Boolean);
    return { data: selected };
  },

  // CREATE
  create: async (resource, params) => {
    // Newsletter create via admin endpoint
    if (resource === 'newsletter') {
      const url = `${API_URL}/admin/newsletter/subscribers`;
      const data = await httpClient(url, {
        method: 'POST',
        body: JSON.stringify(params.data),
      });
      return { data: sanitizeId(data) };
    }
    const url = `${API_URL}/${collectionPath(resource)}`;
    const data = await httpClient(url, {
      method: 'POST',
      body: JSON.stringify(params.data),
    });
    return { data: sanitizeId(data) };
  },

  // UPDATE
  update: async (resource, params) => {
    // Messages: support custom status transitions
    if (resource === 'messages' && params.data && params.data._action) {
      const { _action, ...payload } = params.data;
      let endpoint = '';
      if (_action === 'read') endpoint = 'read';
      else if (_action === 'reply') endpoint = 'reply';
      else if (_action === 'status') endpoint = 'status';
      const url = `${API_URL}/admin/messages/${params.id}/${endpoint}`;
      const data = await httpClient(url, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      return { data: sanitizeId(data) };
    }
    // Newsletter edit via admin endpoint
    if (resource === 'newsletter') {
      const url = `${API_URL}/admin/newsletter/subscribers/${params.id}`;
      const data = await httpClient(url, {
        method: 'PUT',
        body: JSON.stringify(params.data),
      });
      return { data: sanitizeId(data) };
    }
    const url = `${API_URL}/${collectionPath(resource)}/${params.id}`;
    const data = await httpClient(url, {
      method: 'PUT',
      body: JSON.stringify(params.data),
    });
    return { data: sanitizeId(data) };
  },

  // DELETE
  delete: async (resource, params) => {
    // Newsletter delete via admin endpoint
    if (resource === 'newsletter') {
      const url = `${API_URL}/admin/newsletter/subscribers/${params.id}`;
      await httpClient(url, { method: 'DELETE' });
      return { data: { id: params.id } };
    }
    const url = `${API_URL}/${collectionPath(resource)}/${params.id}`;
    await httpClient(url, { method: 'DELETE' });
    return { data: { id: params.id } };
  },

  // DELETE_MANY (bulk)
  deleteMany: async (resource, params) => {
    const ids = params.ids || [];
    await Promise.all(
      ids.map((id) => {
        if (resource === 'newsletter') {
          const url = `${API_URL}/admin/newsletter/subscribers/${id}`;
          return httpClient(url, { method: 'DELETE' });
        }
        const url = `${API_URL}/${collectionPath(resource)}/${id}`;
        return httpClient(url, { method: 'DELETE' });
      })
    );
    return { data: ids };
  },

  // UPDATE_MANY (bulk)
  updateMany: async (resource, params) => {
    const ids = params.ids || [];
    const results = await Promise.all(
      ids.map((id) => {
        if (resource === 'newsletter') {
          const url = `${API_URL}/admin/newsletter/subscribers/${id}`;
          return httpClient(url, { method: 'PUT', body: JSON.stringify(params.data) });
        }
        const url = `${API_URL}/${collectionPath(resource)}/${id}`;
        return httpClient(url, { method: 'PUT', body: JSON.stringify(params.data) });
      })
    );
    const records = sanitizeId(results);
    return { data: records.map((r) => r.id) };
  },
};

export default dataProvider;


