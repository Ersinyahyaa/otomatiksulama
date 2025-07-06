import { useState, useEffect } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { database } from '../lib/firebase';
import StatusCards from './StatusCards';
import ChartsSection from './ChartsSection';
import LogsTable from './LogsTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Droplets, Thermometer } from 'lucide-react';

const Dashboard = () => {
  const [systemData, setSystemData] = useState({
    vana1Durum: false,
    vana2Durum: false,
    hidroforDurum: false,
    artezyenDurum: false,
    suYuzdesi: 0,
    suLitresi: 0,
    toprakNem: 0,
    acilDurum: false,
    alarmModu: false,
    alarmSuBitti: false,
    alarmTasma: false,
    buzzerUyariAcik: false
  });

  const [logs, setLogs] = useState([]);
  const [chartData, setChartData] = useState({
    suSeviyeleri: [],
    toprakNemSeviyeleri: [],
    vanaCalismaSureleri: [],
    alarmDurumlari: []
  });

  useEffect(() => {
    // Sistem durumu verilerini dinle
    const systemRefs = [
      'vana1Durum', 'vana2Durum', 'hidroforDurum', 'artezyenDurum',
      'suYuzdesi', 'suLitresi', 'toprakNem', 'acilDurum', 'alarmModu',
      'alarmSuBitti', 'alarmTasma', 'buzzerUyariAcik'
    ];

    const unsubscribes = systemRefs.map(refPath => {
      const dataRef = ref(database, refPath);
      return onValue(dataRef, (snapshot) => {
        const value = snapshot.val();
        setSystemData(prev => ({
          ...prev,
          [refPath]: value
        }));
      });
    });

    // Event log verilerini dinle
    const eventLogRef = ref(database, 'eventLog');
    const eventLogUnsubscribe = onValue(eventLogRef, (snapshot) => {
      const eventData = snapshot.val();
      if (eventData) {
        // Event log verilerini grafik için hazırla
        const dates = Object.keys(eventData).sort();
        const chartDataPoints = dates.map(date => ({
          date,
          events: eventData[date] || 0
        }));
        
        setChartData(prev => ({
          ...prev,
          eventData: chartDataPoints
        }));
      }
    });

    // Log verilerini dinle (son 30 gün)
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    const dateStr = today.toISOString().split('T')[0];
    
    const logsRef = ref(database, `loglar/${dateStr}`);
    const logsUnsubscribe = onValue(logsRef, (snapshot) => {
      const logsData = snapshot.val();
      if (logsData) {
        const logsArray = Object.entries(logsData)
          .map(([time, data]) => ({
            date: dateStr,
            time,
            ...data
          }))
          .sort((a, b) => b.time.localeCompare(a.time))
          .slice(0, 20);
        
        setLogs(logsArray);
        
        // Grafik verileri için hazırla
        const suSeviyeleri = logsArray.map(log => ({
          time: log.time,
          value: log.suYuzdesi || 0
        })).reverse();
        
        const toprakNemSeviyeleri = logsArray.map(log => ({
          time: log.time,
          value: log.toprakNem || 0
        })).reverse();
        
        setChartData(prev => ({
          ...prev,
          suSeviyeleri,
          toprakNemSeviyeleri
        }));
      }
    });

    return () => {
      unsubscribes.forEach(unsubscribe => unsubscribe());
      eventLogUnsubscribe();
      logsUnsubscribe();
    };
  }, []);

  const handleDeviceToggle = async (device, currentState) => {
    try {
      await set(ref(database, device), !currentState);
    } catch (error) {
      console.error('Cihaz durumu değiştirilemedi:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Durum Kartları */}
      <StatusCards 
        systemData={systemData} 
        onDeviceToggle={handleDeviceToggle}
      />

      {/* Su Seviyesi ve Toprak Nem Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Su Seviyesi</CardTitle>
            <Droplets className="h-4 w-4 ml-auto text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemData.suYuzdesi}%</div>
            <Progress value={systemData.suYuzdesi} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {systemData.suLitresi} Litre
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toprak Nem</CardTitle>
            <Thermometer className="h-4 w-4 ml-auto text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemData.toprakNem}%</div>
            <Progress value={systemData.toprakNem} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {systemData.toprakNem > 60 ? 'Optimal' : 
               systemData.toprakNem > 30 ? 'Orta' : 'Düşük'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Grafikler Bölümü */}
      <ChartsSection chartData={chartData} systemData={systemData} />

      {/* Loglar Tablosu */}
      <LogsTable logs={logs} />
    </div>
  );
};

export default Dashboard;

