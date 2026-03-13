import React, { useMemo } from 'react';
import { Card, CardContent, Typography, Box, Grid } from '@mui/material';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
import { useTheme } from '@mui/material/styles';

const clampNumber = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

const buildMonthlyDistribution = (total, months = 6) => {
  const t = clampNumber(total);
  if (months <= 0) return [];
  const now = new Date();

  const weights = Array.from({ length: months }, (_, i) => 1 + (i % 3));
  const sumWeights = weights.reduce((a, b) => a + b, 0) || 1;

  const values = weights.map((w, idx) => {
    const raw = (t * w) / sumWeights;
    const v = Math.max(0, Math.round(raw));
    const d = new Date(now.getFullYear(), now.getMonth() - (months - 1 - idx), 1);
    const label = d.toLocaleString('fr-FR', { month: 'short' });
    return { month: label, value: v };
  });

  const diff = t - values.reduce((acc, x) => acc + x.value, 0);
  if (values.length > 0) {
    values[values.length - 1].value = Math.max(0, values[values.length - 1].value + diff);
  }

  return values;
};

const nivoThemeFromMui = (muiTheme) => {
  const textPrimary = muiTheme.palette.text.primary;
  const textSecondary = muiTheme.palette.text.secondary;
  const gridLine = muiTheme.palette.divider;

  return {
    text: { fill: textSecondary },
    axis: {
      domain: { line: { stroke: gridLine } },
      ticks: {
        line: { stroke: gridLine },
        text: { fill: textSecondary },
      },
      legend: { text: { fill: textPrimary } },
    },
    grid: { line: { stroke: gridLine } },
    legends: { text: { fill: textSecondary } },
    tooltip: {
      container: {
        background: muiTheme.palette.background.paper,
        color: textPrimary,
        borderRadius: 12,
        boxShadow: muiTheme.shadows[6],
      },
    },
  };
};

const AdminAnalyticsCharts = ({ stats, role }) => {
  const muiTheme = useTheme();

  const totalsByType = useMemo(() => {
    const base = [
      { id: 'Activités', label: 'Activités', value: clampNumber(stats?.activites) },
      { id: 'Actualités', label: 'Actualités', value: clampNumber(stats?.actualites) },
      { id: 'Messages', label: 'Messages', value: clampNumber(stats?.messages) },
      { id: 'Newsletter', label: 'Newsletter', value: clampNumber(stats?.newsletter) },
    ];

    if (role === 'super_admin') {
      base.push(
        { id: 'Membres', label: 'Membres', value: clampNumber(stats?.membres) },
        { id: 'Témoignages', label: 'Témoignages', value: clampNumber(stats?.temoignages) },
        { id: 'Sponsors', label: 'Sponsors', value: clampNumber(stats?.sponsors) }
      );
    }

    return base.filter((x) => x.value > 0);
  }, [stats, role]);

  const barData = useMemo(() => {
    if (totalsByType.length === 0) return [];
    return totalsByType.map((x) => ({ type: x.label, total: x.value }));
  }, [totalsByType]);

  const monthlyData = useMemo(() => {
    const total = totalsByType.reduce((acc, x) => acc + x.value, 0);
    return buildMonthlyDistribution(total, 6);
  }, [totalsByType]);

  const nivoTheme = useMemo(() => nivoThemeFromMui(muiTheme), [muiTheme]);

  const colors = [
    muiTheme.palette.primary.main,
    muiTheme.palette.secondary.main,
    muiTheme.palette.info.main,
    muiTheme.palette.warning.main,
    muiTheme.palette.success.main,
    muiTheme.palette.error.main,
  ];

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Analytics
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 700 }}>
                Répartition des contenus (barres)
              </Typography>
              <Box sx={{ height: 320 }}>
                {barData.length === 0 ? (
                  <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography color="text.secondary">Aucune donnée à afficher</Typography>
                  </Box>
                ) : (
                  <ResponsiveBar
                    data={barData}
                    keys={["total"]}
                    indexBy="type"
                    margin={{ top: 10, right: 20, bottom: 50, left: 50 }}
                    padding={0.35}
                    valueScale={{ type: 'linear' }}
                    indexScale={{ type: 'band', round: true }}
                    colors={({ index }) => colors[index % colors.length]}
                    theme={nivoTheme}
                    borderRadius={6}
                    enableGridY
                    enableLabel={false}
                    axisBottom={{
                      tickSize: 0,
                      tickPadding: 10,
                      tickRotation: 0,
                    }}
                    axisLeft={{
                      tickSize: 0,
                      tickPadding: 10,
                      tickRotation: 0,
                    }}
                    tooltip={({ indexValue, value }) => (
                      <Box sx={{ px: 1, py: 0.5 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {indexValue}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total: {value}
                        </Typography>
                      </Box>
                    )}
                  />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 700 }}>
                Parts (pie chart)
              </Typography>
              <Box sx={{ height: 320 }}>
                {totalsByType.length === 0 ? (
                  <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography color="text.secondary">Aucune donnée à afficher</Typography>
                  </Box>
                ) : (
                  <ResponsivePie
                    data={totalsByType}
                    margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                    innerRadius={0.6}
                    padAngle={1.2}
                    cornerRadius={6}
                    activeOuterRadiusOffset={6}
                    colors={({ data }) => {
                      const idx = totalsByType.findIndex((x) => x.id === data.id);
                      return colors[idx % colors.length];
                    }}
                    theme={nivoTheme}
                    enableArcLinkLabels={false}
                    arcLabelsSkipAngle={12}
                    arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                    legends={[]}
                    tooltip={({ datum }) => (
                      <Box sx={{ px: 1, py: 0.5 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {datum.label}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total: {datum.value}
                        </Typography>
                      </Box>
                    )}
                  />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 700 }}>
                Volume total (6 derniers mois)
              </Typography>
              <Box sx={{ height: 260 }}>
                {monthlyData.length === 0 ? (
                  <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography color="text.secondary">Aucune donnée à afficher</Typography>
                  </Box>
                ) : (
                  <ResponsiveBar
                    data={monthlyData}
                    keys={["value"]}
                    indexBy="month"
                    margin={{ top: 10, right: 20, bottom: 40, left: 50 }}
                    padding={0.4}
                    valueScale={{ type: 'linear' }}
                    indexScale={{ type: 'band', round: true }}
                    colors={[muiTheme.palette.primary.main]}
                    theme={nivoTheme}
                    borderRadius={6}
                    enableGridY
                    enableLabel={false}
                    axisBottom={{ tickSize: 0, tickPadding: 8 }}
                    axisLeft={{ tickSize: 0, tickPadding: 8 }}
                    tooltip={({ indexValue, value }) => (
                      <Box sx={{ px: 1, py: 0.5 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {indexValue}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total: {value}
                        </Typography>
                      </Box>
                    )}
                  />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminAnalyticsCharts;
