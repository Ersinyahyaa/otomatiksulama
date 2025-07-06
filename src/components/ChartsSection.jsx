import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  BarChart3, 
  PieChart as PieChartIcon,
  Activity 
} from 'lucide-react';

const ChartsSection = ({ chartData, systemData }) => {
  // Renk paleti
  const colors = {
    primary: '#2563eb',
    secondary: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#06b6d4'
  };

  // Vana çalışma durumu için pie chart verisi
  const vanaData = [
    { 
      name: 'Vana 1', 
      value: systemData.vana1Durum ? 1 : 0, 
      color: systemData.vana1Durum ? colors.secondary : colors.danger 
    },
    { 
      name: 'Vana 2', 
      value: systemData.vana2Durum ? 1 : 0, 
      color: systemData.vana2Durum ? colors.secondary : colors.danger 
    },
    { 
      name: 'Hidrofor', 
      value: systemData.hidroforDurum ? 1 : 0, 
      color: systemData.hidroforDurum ? colors.secondary : colors.danger 
    }
  ];

  // Alarm durumları için bar chart verisi
  const alarmData = [
    { 
      name: 'Acil Durum', 
      value: systemData.acilDurum ? 1 : 0,
      color: colors.danger
    },
    { 
      name: 'Su Bitti', 
      value: systemData.alarmSuBitti ? 1 : 0,
      color: colors.warning
    },
    { 
      name: 'Taşma', 
      value: systemData.alarmTasma ? 1 : 0,
      color: colors.info
    },
    { 
      name: 'Buzzer', 
      value: systemData.buzzerUyariAcik ? 1 : 0,
      color: colors.primary
    }
  ];

  // Event log verisi için hazırlama
  const eventLogData = chartData.eventData || [];

  // Custom tooltip bileşeni
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{`Zaman: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}${entry.dataKey.includes('Yuzde') || entry.dataKey.includes('Nem') ? '%' : ''}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold flex items-center">
        <BarChart3 className="h-5 w-5 mr-2" />
        Veri Analizi ve Grafikler
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Su Seviyesi Zaman Serisi */}
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Su Seviyesi Değişimi</CardTitle>
            <TrendingUp className="h-4 w-4 ml-auto text-blue-500" />
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={chartData.suSeviyeleri}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time" 
                  fontSize={12}
                  tickFormatter={(value) => value.slice(0, 5)}
                />
                <YAxis fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke={colors.primary}
                  fill={colors.primary}
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Toprak Nem Zaman Serisi */}
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Toprak Nem Değişimi</CardTitle>
            <Activity className="h-4 w-4 ml-auto text-green-500" />
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData.toprakNemSeviyeleri}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time" 
                  fontSize={12}
                  tickFormatter={(value) => value.slice(0, 5)}
                />
                <YAxis fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={colors.secondary}
                  strokeWidth={2}
                  dot={{ fill: colors.secondary, strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Cihaz Durumları Pie Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Cihaz Durumları</CardTitle>
            <PieChartIcon className="h-4 w-4 ml-auto text-purple-500" />
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={vanaData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {vanaData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [
                    value ? 'Açık' : 'Kapalı', 
                    name
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-4 mt-4">
              {vanaData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alarm Durumları Bar Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Alarm Durumları</CardTitle>
            <BarChart3 className="h-4 w-4 ml-auto text-red-500" />
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={alarmData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis fontSize={12} />
                <Tooltip 
                  formatter={(value, name) => [
                    value ? 'Aktif' : 'Pasif', 
                    name
                  ]}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {alarmData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Event Log Grafiği */}
      {eventLogData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Event Log Aktivitesi</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={eventLogData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="events" 
                  fill={colors.info}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ChartsSection;

