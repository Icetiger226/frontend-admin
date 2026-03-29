import React, { useMemo } from 'react';
import { Box, Button, Chip, Stack } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const RoleNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = (typeof window !== 'undefined' && sessionStorage.getItem('authRole')) || null;

  const links = useMemo(() => {
    const common = [
      { label: 'Activités', to: '/activites' },
      { label: 'Actualités', to: '/actualites' },
      { label: 'Messages', to: '/messages' },
      { label: 'Newsletter', to: '/newsletter' }
    ];

    if (role === 'super_admin') {
      return [
        ...common,
        { label: 'Membres', to: '/membres' },
        { label: 'Témoignages', to: '/temoignages' },
        { label: 'Sponsors', to: '/sponsors' },
        { label: 'Gestion Admins', to: '/admin-users' },
        { label: 'Logs Système', to: '/admin-logs' },
        { label: "Logs d'Audit", to: '/audit-logs' }
      ];
    }

    return common;
  }, [role]);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 1 }}>
      <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
        {links.map(({ label, to }) => {
          const active = location.pathname.startsWith(to);
          return (
            <Button
              key={to}
              size="small"
              variant={active ? 'contained' : 'outlined'}
              color={active ? 'primary' : 'inherit'}
              onClick={() => navigate(to)}
            >
              {label}
            </Button>
          );
        })}
      </Stack>

      {role && (
        <Chip size="small" label={role === 'super_admin' ? 'Super Admin' : 'Admin Simple'} />
      )}
    </Box>
  );
};

export default RoleNav;


